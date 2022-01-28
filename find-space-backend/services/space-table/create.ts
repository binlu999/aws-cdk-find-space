import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { validateAsSpaceEntry, MissingFieldError } from '../shared/inputValidator';
import { addCorsHeader, generateRandomId, getEventBody} from '../shared/utils';

const dbClient = new DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'DB created'
    }

    addCorsHeader(result);
    try {
        const item = getEventBody(event);
        item[PRIMARY_KEY!] = generateRandomId();
        validateAsSpaceEntry(item);
        await dbClient.put({
            TableName: TABLE_NAME!,
            Item: item
        }
        ).promise();

        result.body = JSON.stringify(
            {
                spaceId:item[PRIMARY_KEY!]
            }
        )
    } catch (err: any) {
        if(err instanceof MissingFieldError){
            result.statusCode=403;
        }else{
            result.statusCode=500
        }
        result.body=err.message;
    }

    return result;
}

export { handler }

