import { Fn, Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { AuthorizationType, LambdaIntegration, MethodOptions, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { GenericTable,TableProps } from './genericTable';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import {AuthorizerWrapper} from './auth/authorizerWrapper';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Bucket, HttpMethods } from 'aws-cdk-lib/aws-s3';

export class SpaceStack extends Stack {

    private api =new RestApi(this,'SapceAPI');
    private authorizer:AuthorizerWrapper;
    private bucketSuffix :string;
    private spacePhotoBucket:Bucket;

    private spaceTableProps : TableProps={
        tableName:'space-table',
        primaryKey:'spaceId',
        createLambdaPath:'create',
        readLambdaPath:'read',
        updateLambdaPath:'update',
        deleteLambdaPath:'delete',
        secondaryIndexes:[
            'location'
        ]
    }
    private spaceTable = new GenericTable(this,this.spaceTableProps);

    constructor(scope:Construct,id:string,props:StackProps){
        super(scope,id,props);

        this.initializeSuffix();
        this.initializePhotoBucket();

        this.authorizer=new AuthorizerWrapper(this,this.api,this.spacePhotoBucket.bucketArn);

        const optionWithAuthorizer:MethodOptions={
            authorizationType:AuthorizationType.COGNITO,
            authorizer:{
                authorizerId:this.authorizer.authorizer.authorizerId
            }
            
        };
        const helloLambda = new LambdaFunction(this,'helloLambdaFun',
        {
            runtime:Runtime.NODEJS_14_X,
            code:Code.fromAsset(join(__dirname,'..','services','hello')),
            handler:'hello.main'
        });

        const helloLambdaNodejs = new NodejsFunction(this, 'helloLambdaNodejs',
        {
            runtime:Runtime.NODEJS_14_X,
            entry:(join(__dirname,'..','services','node-lambda', 'hello.ts')),
            handler:'handler'
        })

        const s3ListPolicy = new PolicyStatement();
        s3ListPolicy.addActions('s3:ListAllMyBuckets');
        s3ListPolicy.addResources('*');
        helloLambdaNodejs.addToRolePolicy(s3ListPolicy);
        
        //hello API lambda integration
        const helloLambdaIntegration=new LambdaIntegration(helloLambdaNodejs);
        const helloLambdaResource=this.api.root.addResource('hello');
        helloLambdaResource.addMethod('GET',helloLambdaIntegration,optionWithAuthorizer);

        //space api resource
        const spaceResource = this.api.root.addResource('spaces');
        spaceResource.addMethod('POST',this.spaceTable.createLambdaIngegration);
        spaceResource.addMethod("GET",this.spaceTable.readLambdaIngegration);
        spaceResource.addMethod('PUT',this.spaceTable.updateLambdaIngegration);
        spaceResource.addMethod('DELETE',this.spaceTable.deleteLambdaIngegration);

    }

    private initializeSuffix(){
        const shortStackId = Fn.select(2,Fn.split('/',this.stackId));
        const suffix = Fn.select(4,Fn.split('-',shortStackId));
        this.bucketSuffix = suffix;
    }

    private initializePhotoBucket(){
        this.spacePhotoBucket = new Bucket(this, 'space-photo-bucket',{
            bucketName:'space-photos-'+this.bucketSuffix,
            cors:[{
                allowedMethods:[
                    HttpMethods.HEAD,
                    HttpMethods.GET,
                    HttpMethods.PUT
                ],
                allowedOrigins:['*'],
                allowedHeaders:['*']

            }]
        });
        new CfnOutput(this,'find-space-photo-bucket-name',{
            value:this.spacePhotoBucket.bucketName
        })
    }
}