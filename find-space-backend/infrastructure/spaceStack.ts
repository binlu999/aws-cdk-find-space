import {Stack, StackProps} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { GenericTable,TableProps } from './genericTable';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'

export class SpaceStack extends Stack {

    private api =new RestApi(this,'SapceAPI');

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

        const helloLambda = new LambdaFunction(this,'helloLambdaFun',
        {
            runtime:Runtime.NODEJS_14_X,
            code:Code.fromAsset(join(__dirname,'..','services','hello')),
            handler:'hello.main'
        });

        const helloLambdaNodejs = new NodejsFunction(this, 'helloLambdaNodejs',
        {
            entry:(join(__dirname,'..','services','node-lambda', 'hello.ts')),
            handler:'handler'
        })
        
        //hello API lambda integration
        const helloLambdaIntegration=new LambdaIntegration(helloLambda);
        const helloLambdaResource=this.api.root.addResource('hello');
        helloLambdaResource.addMethod('GET',helloLambdaIntegration);

        //space api resource
        const spaceResource = this.api.root.addResource('spaces');
        spaceResource.addMethod('POST',this.spaceTable.createLambdaIngegration);
        spaceResource.addMethod("GET",this.spaceTable.readLambdaIngegration);
        spaceResource.addMethod('PUT',this.spaceTable.updateLambdaIngegration);
        spaceResource.addMethod('DELETE',this.spaceTable.deleteLambdaIngegration);

    }
}