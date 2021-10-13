import { APIGatewayProxyEvent, APIGatewayProxyResult, SQSHandler } from "aws-lambda"
import { Controller, GET, Use, Schedule, POST } from "lambaa"


@Controller()
export default class queueController {
    /**
     * Handle `GET` `/ping` requests.
     */
    @GET("/{queueid}")
    public getQueueInfo(event: APIGatewayProxyEvent): APIGatewayProxyResult {
        return {
            statusCode: 200,
            body: "pong",
        }
    }

    @GET("/group/{GroupName}")
    public getQueueGroup(event: APIGatewayProxyEvent): APIGatewayProxyResult {
        return {
            statusCode: 200,
            body: "pong",
        }
    }

    @GET("/errors")
    public getFailedQueue(event: APIGatewayProxyEvent): APIGatewayProxyResult {
        return {
            statusCode: 200,
            body: "pong",
        }
    }

    @GET("/{src-queueid}/{dst-queueid}")
    public mvQueue(event: APIGatewayProxyEvent): APIGatewayProxyResult {
        return {
            statusCode: 200,
            body: "pong",
        }
    }

}