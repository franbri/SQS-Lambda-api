import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Controller, GET, Use, Schedule, POST, DELETE, FromPath } from "lambaa"

import * as AWS from 'aws-sdk'  
import { ConfigurationServicePlaceholders } from "aws-sdk/lib/config_service_placeholders";
import { stringify } from "querystring";

AWS.config.update({
    region: 'us-east-2',

    accessKeyId: "",
    secretAccessKey: ""
    
});

var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

@Controller()
export default class messageController {
    /**
     * Handle `GET` `/ping` requests.
     */
    @GET("/queue/messages/{queueid}")
    public async getMessages(
        event: APIGatewayProxyEvent,
        @FromPath("queueid")queueid:string
        ): Promise<APIGatewayProxyResult> {

        var paramsName = {
            QueueName: queueid /* required */
            /*QueueOwnerAWSAccountId: 'STRING_VALUE'*/
        };

        var ret = {
            statusCode: 200,
            body: "pong"
        }
        
        var queueurl = await sqs.getQueueUrl(paramsName).promise();
        console.log(queueurl)
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

        return ret
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