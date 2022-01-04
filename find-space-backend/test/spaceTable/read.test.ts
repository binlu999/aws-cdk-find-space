import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../../services/space-table/read';

const event: APIGatewayProxyEvent = {
    queryStringParameters: {
        //spaceId: '55b6ef4a-e058-4355-a073-2f08284c3683'
        location:'London'
    }
} as any;

handler(event as any, {} as any).then(result => {
    console.log(JSON.stringify(result.body));
})