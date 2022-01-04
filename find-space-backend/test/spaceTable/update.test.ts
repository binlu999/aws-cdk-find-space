import { handler } from '../../services/space-table/update';

const event ={
    queryStringParameters: {
        spaceId: '55b6ef4a-e058-4355-a073-2f08284c3683'
    },
    body:{
        'class':'AA',
        'name':'the best 12',
        location:'Paris southeast',
    }
}
handler(event as any, {} as any).then(result =>{
    console.log(result);
})