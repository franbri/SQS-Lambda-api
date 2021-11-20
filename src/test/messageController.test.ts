import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda"
import { Controller, GET, Use, Schedule, POST } from "lambaa"

import {
  createAPIGatewayEvent,
  createAPIGatewayProxyEvent,
  createLambdaContext as createLambdaContext,
  createScheduledEvent,
  createSQSEvent,
} from "./testUtil"


//jest.mock("aws-sdk");
const getQueueUrl = jest.fn((paramsName) => ({
    QueueUrl: "https://queue.amazonaws.com/80398EXAMPLE/MyQueue"
  }))
jest.mock("aws-sdk",() => ({
    SQS: jest.fn(() => ({ getQueueUrl })),
}));

import * as AWS from 'aws-sdk' 
import { Router } from "lambaa"


//import { handler } from "../index"
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
@Controller()
class TestQueueController {
  @GET("/test2")
  public async mtest(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        
        const queueid = "Value"
        var paramsName = {
            QueueName: queueid /* required */
            /*QueueOwnerAWSAccountId: 'STRING_VALUE'*/
        };
        sqs.getQueueUrl()
        var ret = {
            statusCode: 200,
            body: "pong"
        }
        var queueurl = await sqs.getQueueUrl(paramsName).promise();
        if (queueurl.QueueUrl){
            var params = {
                AttributeNames: [
                    "SentTimestamp"
                ],
                MaxNumberOfMessages: 10,
                MessageAttributeNames: [
                    "All"
                ],
                QueueUrl: queueurl.QueueUrl,
                VisibilityTimeout: 0,
                WaitTimeSeconds: 20
            };
            
            const run = await sqs.receiveMessage(params).promise();
            ret.body = JSON.stringify(run.Messages)
        }
        return new Promise((res) =>
            res(ret)
        )
    }
    @POST("/test3")
    public async addtest(event: APIGatewayProxyEvent,queueid:string): Promise<APIGatewayProxyResult>{
        var paramsName = {
            QueueName: queueid /* required */
            /*QueueOwnerAWSAccountId: 'STRING_VALUE'*/
        };

        var ret = {
            statusCode: 200,
            body: "pong",
        }

        var queueurl = await sqs.getQueueUrl(paramsName).promise();

        if (queueurl.QueueUrl){
            var params = {
            
                DelaySeconds: 10,
                MessageBody: "",
                QueueUrl: queueurl.QueueUrl
            };    
            const run = await sqs.sendMessage(params).promise();
            ret.body = JSON.stringify(run.MD5OfMessageBody);
        }

        return new Promise((res) =>
            res(ret))
        
    }

}
const router = new Router().registerControllers([
    new TestQueueController()])

const handler = router.getHandler<APIGatewayProxyEvent, APIGatewayProxyResult>()

const context = createLambdaContext()

describe("test messages", () => {

    it("gets response for list messages", async () => {
        const event = createAPIGatewayEvent({
            resource: "/test2",
            method: "GET",
        })

        const response = await handler(event, context)

        expect(response.statusCode).toBe(200)
        expect(response.body).toBe({status: 200,
        body :{
            "QueueUrl": "https://queue.amazonaws.com/80398EXAMPLE/MyQueue"
          }})
    })

    it("adds nessage", async () => {
        const event = createAPIGatewayEvent({
            resource: "/test3",
            method: "POST",
        })

        const response = await handler(event, context)

        expect(response.statusCode).toBe(200)
        expect(response.body).toBe({status: 200,
        body :{
            "QueueUrl": "https://queue.amazonaws.com/80398EXAMPLE/MyQueue"
          }})
    })
})
