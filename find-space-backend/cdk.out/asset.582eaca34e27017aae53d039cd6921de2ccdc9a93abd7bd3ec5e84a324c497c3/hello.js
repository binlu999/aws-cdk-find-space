import {APIGatewayProxyEvent} from 'aws-lambda';

exports.main = async function(event:import("aws-lambda").APIGatewayProxyEvent,context){
    console.log(event);
    return {
        statusCode: 200,
        body:JSON.stringify(event)
    }
}

