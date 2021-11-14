import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Controller, GET, Use, Schedule, POST, DELETE, FromPath, SQS } from "lambaa"

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
        return messageManager.sendMessages(body);

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

    @DELETE("/queue/messages/rm/{queueid}/{messageid}")
    public async rmMessage(
        event: APIGatewayProxyEvent,
        @FromPath("queueid") queueid: string,
        @FromPath("messageid") messageid: string
    ): Promise<APIGatewayProxyResult> {


        return {
            statusCode: 200,
            body: "pong"
        }


    }

    @POST("/queue/messages/reinyect/{queueid}")
    public async reInyect(
        event: APIGatewayProxyEvent,
        @FromPath("queueid") queueid: string,
    ): Promise<APIGatewayProxyResult> {
        let queueManager = new queue();
        return queueManager.reinyect(queueid)
    }

}