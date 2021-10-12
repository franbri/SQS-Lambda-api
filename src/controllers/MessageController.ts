import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Controller, GET, Use, Schedule, POST, DELETE } from "lambaa"


@Controller()
export default class pingController {
    /**
     * Handle `GET` `/ping` requests.
     */
    @GET("/queue/messages/{queueid}")
    public getMessages(_event: APIGatewayProxyEvent): APIGatewayProxyResult {

      
        return {
            statusCode: 200,
            body: "pong",
        }
    }

    @POST("/queue/messages/mv/{queueid}")
    public mvMessage(_event: APIGatewayProxyEvent): APIGatewayProxyResult {

        return {
            statusCode: 200,
            body: "Retorno mensage",
        }
    }

    @DELETE("/queue/messages/rm/{queueid}")
    public rmMessage(_event: APIGatewayProxyEvent): APIGatewayProxyResult {



        return {
            statusCode: 200,
            body: "OK"
        }

    }

    @POST("/queue/messages/reinyect/{queueid1}")
    public reInyect(_event: APIGatewayProxyEvent): APIGatewayProxyResult {
        
        return {
            statusCode: 200,
            body: "okn't"
        }
    }

}