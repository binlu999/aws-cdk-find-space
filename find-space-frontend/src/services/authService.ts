import { User, UserAttributes } from "../models/model";

export class AuthService {
    public async login(userName: string, password: string): Promise<User | undefined> {
        if (userName === 'user' && password === '12345') {
            return {
                userName: 'user',
                email: 'user@email.com'
            }
        } else {
            return undefined;
        }

    }

    public async getUserAttributes(user:User):Promise<UserAttributes[]>{
        const userAttributes:UserAttributes[]=[];
        userAttributes.push({
            name:'Description',
            value:'Good a user'
        });
        userAttributes.push({
            name:'Job',
            value:'Engineer'
        });
        userAttributes.push({
            name:'Age',
            value:'35'
        });
        userAttributes.push({
            name:'Experience',
            value:'3 Years'
        });

        return userAttributes;
    }
}