import { APIGatewayProxyEvent, APIGatewayProxyResult, SQSHandler } from "aws-lambda"
import { Controller, GET, Use, Schedule, POST,FromPath } from "lambaa"

import queue from "../subcontrollers/queue";

@Controller()
export default class queueController {

    @GET("/queues")
    async getQueues(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>{
        var sqs = new queue();
        var ret = await sqs.listQueues();
        console.log(ret);
        return {  
            statusCode: 200,
            body: JSON.stringify(ret)
        }
    }

    

    @GET("/{queueid}")
    public getQueueInfoByID(event: APIGatewayProxyEvent): APIGatewayProxyResult {
        console.log(event.path);
        console.log(process.env);
        
        return {
            statusCode: 200,
            body: "Ok",
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
            body: "ping",
        }
    }

    @GET("/{src-queueid}/{dst-queueid}")
    public mvQueue(event: APIGatewayProxyEvent): APIGatewayProxyResult {
        return {
            statusCode: 200,
            body: "pong",
        }
    }

    @POST("/purge/{queueid}")
    public async purgeQueue(event: APIGatewayProxyEvent,@FromPath("queueid")queueid:string): Promise<APIGatewayProxyResult>  {
        var sqs = new queue();
        var ret = sqs.purgeQueue(queueid);

        return ret;
    }

    

}