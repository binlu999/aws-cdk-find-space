import {Config} from './config';
import {AuthService} from './authService';
import * as AWS from 'aws-sdk';

async function doTest(){
    const authservice = new AuthService();
    const user= await authservice.login(Config.TEST_USER_NAME,Config.TEST_USER_PASSWORD);
    await authservice.getAWSTemporyCreds(user);
    const tmpCrediential=AWS.config.credentials;
    console.log(tmpCrediential);
}

doTest();