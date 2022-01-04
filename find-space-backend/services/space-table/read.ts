import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResult, Context } from 'aws-lambda';

const dbClient = new DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'No operation performed'
    }
    try {
        if (event.queryStringParameters) {
            if(PRIMARY_KEY! in event.queryStringParameters){
               result.body = await queryWithPrimaryPartition(event.queryStringParameters);
            }else{
                result.body = await queryWithSecondaryIndex(event.queryStringParameters); 
            }
        } else {
            result.body = await scanTable();
        }
    } catch (err: any) {
        result.body = err.message
    }

    return result;
}

async function queryWithPrimaryPartition(queryParams:APIGatewayProxyEventQueryStringParameters){
    const keyValue=queryParams[PRIMARY_KEY!];
    const queryResponse=await dbClient.query({
        TableName:TABLE_NAME!,
        KeyConditionExpression:'#Primary_Key_field = :Key_value',
        ExpressionAttributeNames:{
            '#Primary_Key_field':PRIMARY_KEY!
        },
        ExpressionAttributeValues:{
            ':Key_value':keyValue
        }
    }).promise();
    return JSON.stringify(queryResponse.Items);
}

async function queryWithSecondaryIndex(queryParams:APIGatewayProxyEventQueryStringParameters){
    const queryKey = Object.keys(queryParams)[0];
    const keyValue=queryParams[queryKey];
    const queryResponse=await dbClient.query({
        TableName:TABLE_NAME!,
        IndexName:queryKey,
        KeyConditionExpression:'#GSI_Key_field = :Key_value',
        ExpressionAttributeNames:{
            '#GSI_Key_field':queryKey!
        },
        ExpressionAttributeValues:{
            ':Key_value':keyValue
        }
    }).promise();
    return JSON.stringify(queryResponse.Items);
}

async function scanTable(){
    const queryResponse = await dbClient.scan({
        TableName: TABLE_NAME!
    }
    ).promise();
    return JSON.stringify(queryResponse.Items);
}
export { handler }

