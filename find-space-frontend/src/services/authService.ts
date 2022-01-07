import { User } from "../models/model";

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
}