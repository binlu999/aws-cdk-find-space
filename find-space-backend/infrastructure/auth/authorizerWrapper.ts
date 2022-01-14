import { CfnOutput } from 'aws-cdk-lib';
import { CognitoUserPoolsAuthorizer, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { UserPool, UserPoolClient,CfnUserPoolGroup } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';
import {IdentityPoolWrapper} from './identityPoolWrapper';

export class AuthorizerWrapper{
    private scope: Construct;
    private api: RestApi

    private identityPoolWrapper: IdentityPoolWrapper;
    private userPool:UserPool;
    private userPoolClient:UserPoolClient;
    private photoBucketArn:string;

    public authorizer:CognitoUserPoolsAuthorizer;

    constructor(scope:Construct,api:RestApi,photoBucketArn:string){
        this.scope=scope;
        this.api=api;
        this.photoBucketArn=photoBucketArn;
        
        this.initialize();
    }

    private initialize(){
        this.createUserPool();
        this.addUserPoolClient();
        this.createAuthorizer();
        this.initializeIdentityPoolWrapper();
        this.createUserGroup('admins');
    }

    private createUserPool(){
        this.userPool= new UserPool(this.scope,'findSpaceUserPool',{
            userPoolName:'find-space-user-pool',
            selfSignUpEnabled:true,
            signInAliases:{
                username:true,
                email:true
            }
        });

        new CfnOutput(this.scope,'FindSpaceUserPoolId',{
            value:this.userPool.userPoolId
        })

    }

    private addUserPoolClient(){
        this.userPoolClient = this.userPool.addClient('SpaceUserPool-Client',{
            userPoolClientName:'FindSpaceUserPool-Client',
            authFlows:{
                adminUserPassword:true,
                custom:true,
                userPassword:true,
                userSrp:true

            },
            generateSecret:false
        })

        new CfnOutput(this.scope,'SpaceUserPoolClientId',{
            value:this.userPoolClient.userPoolClientId
        })
    }

    private createAuthorizer(){
        this.authorizer = new CognitoUserPoolsAuthorizer(this.scope,'SpaceUserAuthorizer',{
            cognitoUserPools:[this.userPool],
            authorizerName:'SpaceUserAuthorizer',
            identitySource:'method.request.header.Authorization'
        });

        this.authorizer._attachToApi(this.api);
    }

    private initializeIdentityPoolWrapper(){
        this.identityPoolWrapper=new IdentityPoolWrapper(
            this.scope,
            this.userPool,
            this.userPoolClient,
            this.photoBucketArn
            );
    }
    private createUserGroup(name:string){
        new CfnUserPoolGroup(this.scope,name,{
            groupName:name,
            userPoolId:this.userPool.userPoolId,
            roleArn:this.identityPoolWrapper.adminRole.roleArn
        })
    }
}