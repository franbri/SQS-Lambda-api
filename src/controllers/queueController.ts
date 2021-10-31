import { APIGatewayProxyEvent, APIGatewayProxyResult, SQSHandler } from "aws-lambda"
import { Controller, GET, Use, Schedule, POST,FromPath } from "lambaa"

import * as AWS from 'aws-sdk'  
import { ConfigurationServicePlaceholders } from "aws-sdk/lib/config_service_placeholders";

import 'dotenv/config'
AWS.config.update({
    region: 'us-east-2',
    // 
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_KEY
    
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
                    messageCount: "ok",
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
    
        

        return ret;

    }

    

}