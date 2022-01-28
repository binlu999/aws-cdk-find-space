import { CognitoUser } from '@aws-amplify/auth'
import Amplify, { Auth } from 'aws-amplify';
import { User, UserAttributes } from "../models/model";
import { Config } from "./config";
import  * as AWS from 'aws-sdk';
import {Credentials} from 'aws-sdk/lib/credentials';

Amplify.configure({
    Auth: {
        mandatorySignIn: false,
        region: Config.REGION,
        userPoolId: Config.USER_POOL_ID,
        identityPoolId: Config.IDENTITY_POOL_ID,
        userPoolWebClientId: Config.APP_CLIENT_ID,
        authenticationFlowType: 'USER_PASSWORD_AUTH'
    }
});

export class AuthService {
    public async login(userName: string, password: string): Promise<User | undefined> {
        try {
            const user = await Auth.signIn(userName, password) as CognitoUser;
            return {
                userName: user.getUsername(),
                cognitoUser: user
            };

        } catch (error) {
            return undefined;
        }

    }

    public async getUserAttributes(user: User): Promise<UserAttributes[]> {
        const userAttributes: UserAttributes[] = [];
        const attributes=await Auth.userAttributes(user.cognitoUser);
        console.log(JSON.stringify(attributes));
        
        userAttributes.push(...attributes);
        return userAttributes;
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