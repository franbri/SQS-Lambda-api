import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Controller, GET, Use, Schedule, POST, DELETE } from "lambaa"


@Controller()
export default class messageController {
    /**
     * Handle `GET` `/ping` requests.
     */
    @GET("/queue/messages/{queueid}")
    public getMessages(event: APIGatewayProxyEvent): APIGatewayProxyResult {
        return {
            statusCode: 200,
            body: "pong",
        }
    }

    @POST("/queue/messages/add/{queueid}")
    public addMessage(event: APIGatewayProxyEvent): APIGatewayProxyResult {
        return {
            statusCode: 200,
            body: "Retorno mensage",
        }
    }

    @POST("/queue/messages/mv/{src-queueid}/{dst-queueid}")
    public mvMessage(event: APIGatewayProxyEvent): APIGatewayProxyResult {
        return {
            statusCode: 200,
            body: "Retorno mensage",
        }
    }

    @DELETE("/queue/messages/rm/{queueid}/{messageid}")
    public rmMessage(event: APIGatewayProxyEvent): APIGatewayProxyResult {
        return {
            statusCode: 200,
            body: "OK"
        }

    }

    @POST("/queue/messages/reinyect/{queueid}")
    public reInyect(event: APIGatewayProxyEvent): APIGatewayProxyResult {
        return {
            statusCode: 200,
            body: "okn't"
        }
    }

}