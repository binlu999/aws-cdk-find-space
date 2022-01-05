import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { getEventBody } from '../shared/utils';

const dbClient = new DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY as string;

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'No operation performend'
    }

    try {
        const requestBody = getEventBody(event);
        const spaceId = event.queryStringParameters?.[PRIMARY_KEY];

        if (requestBody && spaceId) {
            const requestBodyKey = Object.keys(requestBody)[0];
            const requestBodyValue = requestBody[requestBodyKey];

            const updateResult = await dbClient.update({
                TableName: TABLE_NAME!,
                Key: {
                    [PRIMARY_KEY]: spaceId
                },
                UpdateExpression: 'set #UPDATE_KEY = :UPDATE_VALUE',
                ExpressionAttributeNames: {
                    '#UPDATE_KEY': requestBodyKey
                },
                ExpressionAttributeValues: {
                    ':UPDATE_VALUE': requestBodyValue
                },
                ReturnValues: 'UPDATED_NEW'
            }).promise();
            result.body = JSON.stringify(updateResult);
        }
    } catch (err: any) {
        result.body = err.message;
    }
    return result;
}

export { handler }

