import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Controller, GET, Use, Schedule, POST } from "lambaa"


@Controller()
export default class pingController {
    /**
     * Handle `GET` `/ping` requests.
     */
    @GET("/ping")
    public ping(_event: APIGatewayProxyEvent): APIGatewayProxyResult {
        return {
            statusCode: 200,
            body: "ponggg",
        }
    }


    @GET("/pong")
    public pong(_event: APIGatewayProxyEvent): APIGatewayProxyResult {
        return {
            statusCode: 200,
            body: "hello world",
        }
    }

}
