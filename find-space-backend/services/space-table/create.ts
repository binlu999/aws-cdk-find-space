import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { v4 } from 'uuid';

const dbClient = new DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'DB created'
    }

    const item = typeof event.body == 'object'? event.body:JSON.parse(event.body);
    item[PRIMARY_KEY!]=v4();

    try {
        await dbClient.put({
            TableName: TABLE_NAME!,
            Item: item
        }
        ).promise();

        result.body=JSON.stringify(`Created item with id : ${item.spaceId}`)
    } catch (err:any) {
        result.body=err.message
    }

    return result;
}

export { handler }

