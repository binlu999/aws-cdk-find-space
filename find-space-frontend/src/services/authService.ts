import { CognitoUser } from '@aws-amplify/auth'
import Amplify, { Auth } from 'aws-amplify';
import { User, UserAttributes } from "../models/model";
import { Config } from "./config";

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
}