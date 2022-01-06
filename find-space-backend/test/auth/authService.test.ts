import {Config} from './config';
import {AuthService} from './authService';
import * as AWS from 'aws-sdk';

AWS.config.region=Config.REGION;

async function getBuckets() {
    let buckets;
    try {
        buckets = await new AWS.S3().listBuckets().promise();
    } catch (error) {
        buckets=undefined;
    }

    return buckets;
    
}
async function doTest(){
    const authservice = new AuthService();
    const user= await authservice.login(Config.TEST_USER_NAME,Config.TEST_USER_PASSWORD);
    await authservice.getAWSTemporyCreds(user);
    const tmpCrediential=AWS.config.credentials;
    const buckets=await getBuckets();
    console.log(tmpCrediential);
}

doTest();