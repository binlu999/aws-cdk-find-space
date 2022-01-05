import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../../services/space-table/read';

const event: APIGatewayProxyEvent = {
    queryStringParameters: {
        spaceId: 'odysm57te7a',
        location:'London'
    }
} as any;

handler(event as any, {} as any).then(result => {
    console.log(JSON.stringify(result.body));
})