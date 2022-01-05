import { handler } from '../../services/space-table/update';

const event ={
    queryStringParameters: {
        spaceId: 'odysm57te7a'
    },
    body:{
        'class':'AAB',
        'name':'the best 999',
        location:'Paris southeast',
    }
}
handler(event as any, {} as any).then(result =>{
    console.log(result);
})