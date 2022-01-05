import { APIGatewayProxyEvent } from 'aws-lambda';
import { v4 } from 'uuid';
import { S3 } from 'aws-sdk';

const s3Client = new S3();
async function handler(event: APIGatewayProxyEvent, context: any) {
    const buckets = await s3Client.listBuckets().promise();
    console.log(JSON.stringify(buckets.Buckets));
    if (isAuthorized(event)) {
        return {
            statusCode: 200,
            body: "You are authorized"
            //body:JSON.stringify(event)
        }
    } else {
        return {
            statusCode: 401,
            body: "You are NOT authorized"
        }
    }
}

function isAuthorized(event: APIGatewayProxyEvent) {
    const groups = event.requestContext.authorizer?.claims['cognito:groups'];
    if (groups) {
        return (groups as string).includes('Admin');
    } else {
        return false;
    }
}

export { handler }