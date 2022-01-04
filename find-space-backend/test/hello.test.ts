import { handler} from '../services/node-lambda/hello'

handler({},{}).then(output=>{
    console.log("lambda output");
    console.log(output);
})

