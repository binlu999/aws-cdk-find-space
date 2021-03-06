import { CfnOutput } from 'aws-cdk-lib';
import { UserPool, UserPoolClient, CfnIdentityPool, CfnIdentityPoolRoleAttachment } from 'aws-cdk-lib/aws-cognito';
import { Effect, FederatedPrincipal, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class IdentityPoolWrapper{
    private scope: Construct;
    private userPool:UserPool;
    private userPoolClient:UserPoolClient;
    private identityPool:CfnIdentityPool;
    private authencatedRole:Role;
    private unAuthencatedRole:Role;
    private photoBucketArn:string;
    
    public adminRole:Role;

    constructor(scope:Construct, userpool:UserPool,userPoolClient:UserPoolClient,photoBucketArn:string){
        this.scope=scope;
        this.userPool=userpool;
        this.userPoolClient=userPoolClient;
        this.photoBucketArn=photoBucketArn;
        this.initialize();
    }

    private initialize(){
        this.initializeIdentityPool();
        this.initializeRoles();
        this.attachRoles();
    }

    private initializeIdentityPool(){
        this.identityPool=new CfnIdentityPool(this.scope,'find-space-identity-pool',{
            allowUnauthenticatedIdentities:true,
            cognitoIdentityProviders:[{
                clientId:this.userPoolClient.userPoolClientId,
                providerName:this.userPool.userPoolProviderName
            }]
        });

        new CfnOutput(this.scope,'space-find-identity-pool-Id',{
            value: this.identityPool.ref
        })
    }

    private initializeRoles(){
        this.authencatedRole=new Role(this.scope,'find-space-authencated-role',{
            assumedBy:new FederatedPrincipal('cognito-identity.amazonaws.com',
            {
                StringEquals:{
                    'cognito-identity.amazonaws.com:aud':this.identityPool.ref
                },
                'ForAnyValue:StringLike':{
                    'cognito-identity.amazonaws.com:amr':'authenticated'
                }
            },
            'sts:AssumeRoleWithWebIdentity',
            )
        });

        this.unAuthencatedRole=new Role(this.scope,'find-space-unauthencated-role',{
            assumedBy:new FederatedPrincipal('cognito-identity.amazonaws.com',
            {
                StringEquals:{
                    'cognito-identity.amazonaws.com:aud':this.identityPool.ref
                },
                'ForAnyValue:StringLike':{
                    'cognito-identity.amazonaws.com:amr':'unauthenticated'
                }
            },
            'sts:AssumeRoleWithWebIdentity',
            )
        });

        this.adminRole=new Role(this.scope,'find-space-admin-role',{
            assumedBy:new FederatedPrincipal('cognito-identity.amazonaws.com',
            {
                StringEquals:{
                    'cognito-identity.amazonaws.com:aud':this.identityPool.ref
                },
                'ForAnyValue:StringLike':{
                    'cognito-identity.amazonaws.com:amr':'authenticated'
                }
            },
            'sts:AssumeRoleWithWebIdentity',
            )
        });

        this.adminRole.addToPolicy(new PolicyStatement({
            effect:Effect.ALLOW,
            actions:[
                's3:PutObject',
                'S3:PutObjectAcl'
            ],
            resources:[this.photoBucketArn+'/*']
        }));
    }
    private attachRoles(){
        new CfnIdentityPoolRoleAttachment(this.scope,'find-space-role-attachment',{
            identityPoolId:this.identityPool.ref,
            roles:{
                'authenticated':this.authencatedRole.roleArn,
                'unauthenticated':this.unAuthencatedRole.roleArn
            },
            roleMappings:{
                adminsMapping:{
                    type:'Token',
                    ambiguousRoleResolution:'AuthenticatedRole',
                    identityProvider:`${this.userPool.userPoolProviderName}:${this.userPoolClient.userPoolClientId}`
                }
            }
        })
    }
}