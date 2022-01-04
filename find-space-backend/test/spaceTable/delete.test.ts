import { handler } from '../../services/space-table/delete';

const event ={
    queryStringParameters: {
        spaceId: '55b6ef4a-e058-4355-a073-2f08284c3683'
    }
}
handler(event as any, {} as any).then(result =>{
    console.log(result);
})