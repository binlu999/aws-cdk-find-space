import {Auth} from 'aws-amplify';
import Amplify from 'aws-amplify';
import {Config} from './config';
import {CognitoUser} from '@aws-amplify/auth';
import * as AWS from 'aws-sdk';
import {Credentials} from 'aws-sdk/lib/credentials';


Amplify.configure({
    Auth:{
        mandatorySignIn: false,
        region: Config.REGION,
        userPoolId:Config.USER_POOL_ID,
        identityPoolId:Config.IDENTITY_POOL_ID,
        userPoolWebClientId: Config.APP_CLIENT_ID,
        authenticationFlowType:'USER_PASSWORD_AUTH'
    }
});

export class AuthService{
    public async login(userName:string, password:string){
/*
        const user =await Auth.signIn(userName,password ).then( cognitoUser =>{
            console.log(cognitoUser);
        }) as CognitoUser;
        return user;
  */
        const user =await Auth.signIn(userName,password ) as CognitoUser;
        return user;
    }

    public async getAWSTemporyCreds(user:CognitoUser){
        const cognitorIdentityPool = `cognito-idp.${Config.REGION}.amazonaws.com/${Config.USER_POOL_ID}`;
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId:Config.IDENTITY_POOL_ID,
            Logins:{
                [cognitorIdentityPool]:user.getSignInUserSession()!.getIdToken().getJwtToken()
            },
        },{
            region:Config.REGION
        });
        await this.refreshCredientials();
    }

    private async refreshCredientials():Promise<void>{
        return new Promise((resolve,reject)=>{
            (AWS.config.credentials as Credentials).refresh(err=>{
                if(err){
                    reject(err);
                }else{
                    resolve();
                }
            })
        })
    }
}