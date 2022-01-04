import { handler } from '../../services/space-table/create';

const event ={
    body:{
        location:'Paris',
        'name':'the best 2'
    }
}
handler(event as any, {} as any).then(result =>{
    console.log(result);
})