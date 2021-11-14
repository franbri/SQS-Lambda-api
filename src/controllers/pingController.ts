import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Controller, GET, Use, Schedule, POST } from "lambaa"


@Controller()
export default class pingController {
    /**
     * Handle `GET` `/ping` requests.
     */
    @GET("/ping")
    public ping(event: APIGatewayProxyEvent): APIGatewayProxyResult {
        console.log(event);
        return {
            statusCode: 200,
            body: "ponggg",
        }
    }


    @POST("/pong")
    public pong(event: APIGatewayProxyEvent): APIGatewayProxyResult {
        let ret =  {
            statusCode: 200,
            body: "hello world",
        }

        
        if(event.headers){
            ret.body = JSON.stringify(event.headers);
        }
        return ret
    }

}
