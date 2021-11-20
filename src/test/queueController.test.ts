import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda"
import { Controller, GET, Use, Schedule, POST } from "lambaa"

import {
  createAPIGatewayEvent,
  createAPIGatewayProxyEvent,
  createLambdaContext as createLambdaContext,
  createScheduledEvent,
  createSQSEvent,
} from "./testUtil"

const listQueues = jest.fn()
const getQueueAttributes = jest.fn()
const getQueueUrl = jest.fn()
const purgeQueue = jest.fn()
jest.mock("aws-sdk",() => ({
    SQS: jest.fn(() => ({ listQueues,getQueueAttributes,getQueueUrl,purgeQueue})),
}));

import * as AWS from 'aws-sdk' 
import { Router } from "lambaa"


//import { handler } from "../index"
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
@Controller()
class TestQueueController {
  @GET("/test1")
  public async qtest(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    var params = {
        /*MaxResults: '',
        NextToken: '',
        QueueNamePrefix: ''*/
      };
      var ret:{}[] = [];
      const request = await sqs.listQueues(params).promise()

      if(request.QueueUrls){
        /*for(var queue in request.QueueUrls){
            console.log(queue)
            var test = await this.getQueueInfoByURL(queue);
            console.log(test)
        }*/

            request.QueueUrls.forEach((val,ind,arr) => {
                ret.push({
                    name: val.split("/").slice(-1)[0],
                    url: val,
                    messageCount: "ok",
                })
                
            })
        }
      return new Promise((res) =>
          res({
              statusCode: 200,
              body: "event.body"
          })
      )
    }
    public async testlpa(url:string) {
        var params = {
            QueueUrl: url, /* required */
            AttributeNames: ["All"/*"deadLetterTargetArn"*/ ]
        }
        
        const attrib = await sqs.getQueueAttributes(params).promise();
        return new Promise((res) =>
            res(JSON.stringify(attrib)));
        }
    @POST("/test/{queueid}")
    public async testPurge(event: APIGatewayProxyEvent,queueid:string): Promise<APIGatewayProxyResult>  {
        var paramsName = {
            QueueName: queueid /* required */
        };

        var ret = {
            statusCode: 200,
            body: "pong"
        }

        var queueurl = await sqs.getQueueUrl(paramsName).promise();
        if (queueurl.QueueUrl){
            var params = {
                QueueUrl: queueurl.QueueUrl
            }
            const purge = await sqs.purgeQueue(params).promise();
            console.log("bien se purgo cola");
        }
    
        

        return new Promise((res) =>
            res(ret)
        );

    }
}

    
const router = new Router().registerControllers([
    new TestQueueController()])

const handler = router.getHandler<APIGatewayProxyEvent, APIGatewayProxyResult>()

const context = createLambdaContext()

describe("test queue", () => {

    it("gets response for list queues", async () => {
        const event = createAPIGatewayEvent({
            resource: "/test1",
            method: "GET",
            body: "eventurl",
        })

        const response = await handler(event, context)

        expect(response.statusCode).toBe(200)
        expect(response.body).toBe("eventurl")
    })
    it("gets response for list queues", async () => {
        const event = createAPIGatewayEvent({
            resource: "/test?",
            method: "GET",
        })

        const response = await handler(event, context)

        expect(response.statusCode).toBe(200)
        expect(response.body).toBe({
            url: "https://queue.amazonaws.com/80398EXAMPLE/MyQueue",
        })
    })
    it("purges queue", async () => {
        const event = createAPIGatewayEvent({
            resource: "/test/{queueid}",
            method: "POST",
        })

        const response = await handler(event, context)

        expect(response.statusCode).toBe(200)
        expect(response.body).toBe({
            url: "https://queue.amazonaws.com/80398EXAMPLE/MyQueue",
        })
    })
})
