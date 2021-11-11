import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Controller, GET, Use, Schedule, POST, DELETE, FromPath, SQS } from "lambaa"

import * as AWS from 'aws-sdk'
import { ConfigurationServicePlaceholders } from "aws-sdk/lib/config_service_placeholders";

import 'dotenv/config'
import { nextTick } from "process";
import message from "../subcontrollers/message";
import queue from "../subcontrollers/queue";
import { getDefaultSettings } from "http2";

AWS.config.update({
    region: 'us-east-2',

    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_KEY

});

var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

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
        var paramsName = {
            QueueName: queueid /* required */
            /*QueueOwnerAWSAccountId: 'STRING_VALUE'*/
        };

        var ret = {
            statusCode: 200,
            body: "pong",
        }

        var queueurl = await sqs.getQueueUrl(paramsName).promise();

        if (queueurl.QueueUrl) {
            var params = {

                DelaySeconds: 10,
                MessageBody: "",
                QueueUrl: queueurl.QueueUrl
            };
            const run = await sqs.sendMessage(params).promise();
            ret.body = JSON.stringify(run.MD5OfMessageBody);
        }

        return ret

    }

    @POST("/queue/messages/mv/{src-queueid}/{dst-queueid}")
    public mvMessage(
        event: APIGatewayProxyEvent
    ): APIGatewayProxyResult {
        return {
            statusCode: 200,
            body: "Retorno mensage",
        }
    }

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

        var messages = new message();
        var queues = new queue();

        var dl = await queues.getDL(queueid);
        var queueurl = await queues.getQueueURL(queueid);

        var newparams = {
            AttributeNames: [
                "SentTimestamp"
            ],
            MaxNumberOfMessages: 10,
            MessageAttributeNames: [
                "All"
            ],
            QueueUrl: dl,
            VisibilityTimeout: 0,
            WaitTimeSeconds: 20
        };
        
        var receive = await sqs.receiveMessage(newparams).promise()
        
        if(typeof receive.Messages !== 'undefined' && queueurl)
        {
            for(let i = 0 ; i < receive.Messages.length ;i++)
            {
                if(receive.Messages[i].Body)
                {
                    var params = {
                
                        DelaySeconds: 10,
                        MessageBody: JSON.stringify(receive.Messages[i].Body),
                        QueueUrl: queueurl
                    };
                    const send = await sqs.sendMessage(params).promise();
                    var deleteparams = {
                        QueueUrl: dl,
                        ReceiptHandle: JSON.stringify(receive.Messages[i].ReceiptHandle)
                    }
                    const deletemessageDl = await sqs.deleteMessage(deleteparams).promise()
                }
            }
            console.log("bien se reinyecto cola");
        }
        else{
            console.log("ups la cola no tiene mensajes");
        }



        return {
            statusCode: 200,
            body: "ok"
        }
    }

}