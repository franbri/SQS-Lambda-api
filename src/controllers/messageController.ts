import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Controller, GET, Use, Schedule, POST, DELETE, FromPath, SQS, FromBody } from "lambaa"

import message from "../subcontrollers/message";
import queue from "../subcontrollers/queue";


@Controller()
export default class messageController {
    /**
     * Handle `GET` `/ping` requests.
     */
    // use pages instead of longpolling
    @GET("/queue/messages/{queueid}")
    public async getMessages(
        event: APIGatewayProxyEvent,
        @FromPath("queueid") queueid: string
    ): Promise<APIGatewayProxyResult> {
        var messages = new message();
        return await messages.listMessages(queueid);

    }

    @POST("/queue/messages/add/{queueid}")
    public async addMessage(
        event: APIGatewayProxyEvent,
        @FromPath("queueid") queueid: string
    ): Promise<APIGatewayProxyResult> {
        var messageManager = new message();
        let body = "test";
        return messageManager.sendMessages(queueid);


    }
    /*
    @POST("/queue/messages/mv/{src-queueid}/{dst-queueid}")
    public mvMessage(
        event: APIGatewayProxyEvent
    ): APIGatewayProxyResult {
        return {
            statusCode: 200,
            body: "Retorno mensage",
        }
    }
    */

    @POST("/queue/messages/rm/{queueid}")
    public async rmMessage(
        event: APIGatewayProxyEvent,
        @FromPath("queueid") queueid: string,
    ): Promise<APIGatewayProxyResult> {

        var messages = new message();
        let body = JSON.parse(event.body!);
        return messages.rmMessage(queueid, body.ReceiptHandle);
        
    }

    @POST("/queue/messages/reinject/{queueid}")
    public async reInject(
        event: APIGatewayProxyEvent,
        @FromPath("queueid") queueid: string,
    ): Promise<APIGatewayProxyResult> {
        let queueManager = new queue();
        return queueManager.reinject(queueid)

    }
}