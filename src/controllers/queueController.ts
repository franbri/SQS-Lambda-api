import { APIGatewayProxyEvent, APIGatewayProxyResult, SQSHandler } from "aws-lambda"
import { Controller, GET, Use, Schedule, POST } from "lambaa"


import * as AWS from 'aws-sdk'  
import { ConfigurationServicePlaceholders } from "aws-sdk/lib/config_service_placeholders";

AWS.config.update({
    region: 'us-east-2',
    
    accessKeyId: "",
    secretAccessKey: ""
    
});

var sqs = new AWS.SQS({apiVersion: '2012-11-05'});



@Controller()
export default class queueController {
    /**
     * Handle `GET` `/ping` requests.
     */
    @GET("/queues")
    async getQueues(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>{
        var params = {
          /*MaxResults: '',
          NextToken: '',
          QueueNamePrefix: ''*/
        };
        var ret:{}[] = [];

        const request = await sqs.listQueues(params).promise();


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
                    messageCount: "ok"
                })
            })
        }

        
        return {
            statusCode: 200,
            body: JSON.stringify(ret)
        }
    }

    async getQueueInfoByURL(url:string) {
        var params = {
            QueueUrl: url, /* required */
            AttributeNames: ["All"/*"deadLetterTargetArn"*/ ]
        }
        
        const attrib = await sqs.getQueueAttributes(params).promise();
        return JSON.stringify(attrib);
    }

    @GET("/{queueid}")
    public getQueueInfoByID(event: APIGatewayProxyEvent): APIGatewayProxyResult {
        console.log(event.path);
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