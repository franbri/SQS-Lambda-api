import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Controller, GET, Use, Schedule, POST, DELETE, FromPath, SQS } from "lambaa"

import * as AWS from 'aws-sdk'  
import { ConfigurationServicePlaceholders } from "aws-sdk/lib/config_service_placeholders";

import 'dotenv/config'
import { nextTick } from "process";

AWS.config.update({
    region: 'us-east-2',

    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_KEY
    
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
    public async addMessage(event: APIGatewayProxyEvent,@FromPath("queueid")queueid:string): Promise<APIGatewayProxyResult>{

        
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

        return ret
        
    }

    @POST("/queue/messages/mv/{src-queueid}/{dst-queueid}")
    public mvMessage(event: APIGatewayProxyEvent): APIGatewayProxyResult {
        return {
            statusCode: 200,
            body: "Retorno mensage",
        }
    }

    @DELETE("/queue/messages/rm/{queueid}/{messageid}")
    public async rmMessage(event: APIGatewayProxyEvent,@FromPath("queueid")queueid:string,@FromPath("messageid")messageid:string): Promise<APIGatewayProxyResult> {

        var paramsName = {
            QueueName: queueid /* required */
            /*QueueOwnerAWSAccountId: 'STRING_VALUE'*/
        };

        return {
            statusCode: 200,
            body: "pong"
        }


    }

    @POST("/queue/messages/reinyect/{queueid}")
    public async reInyect(event: APIGatewayProxyEvent,@FromPath("queueid")queueid:string): Promise<APIGatewayProxyResult>{
        


        var paramsName = {
            QueueName: queueid /* required */
            /*QueueOwnerAWSAccountId: 'STRING_VALUE'*/
        };

        

        var queueurl = await sqs.getQueueUrl(paramsName).promise();
        if (queueurl.QueueUrl)
        {
            var params = {
                QueueUrl: queueurl.QueueUrl
            };    
            
            const dl = await sqs.listDeadLetterSourceQueues(params).promise();
            //console.log(dl.queueUrls);
    
            for(let i = 0 ; i < dl.queueUrls.length ; i++)
            {
                if(dl.queueUrls[i])
                {
                    
        
                    var newparams = {
                        AttributeNames: [
                            "SentTimestamp"
                        ],
                        MaxNumberOfMessages: 10,
                        MessageAttributeNames: [
                            "All"
                        ],
                        QueueUrl: dl.queueUrls[i],
                        VisibilityTimeout: 0,
                        WaitTimeSeconds: 20
                    };
            
                    const receive = await sqs.receiveMessage(newparams).promise();
            
                    if(typeof receive.Messages !== 'undefined')
                    {
                
                        for(let j = 0 ; j < receive.Messages.length ;j++)
                        {
                            if(receive.Messages[i].Body)
                            {
                                var parametros = {
                
                                    DelaySeconds: 10,
                                    MessageBody: JSON.stringify(receive.Messages[j].Body),
                                    QueueUrl: queueurl.QueueUrl
                                };
                                const send = await sqs.sendMessage(parametros).promise();
                                
                                var deleteparams = {
                                    QueueUrl: dl.queueUrls[i],
                                    ReceiptHandle: JSON.stringify(receive.Messages[j].ReceiptHandle)
                                }
                                const deletemessageDl = await sqs.deleteMessage(deleteparams).promise()
                            }
                    
                        }
                        console.log("bien se reinyecto cola");
                    }
                    else
                    {
                        console.log("ups la cola no tiene mensajes");
                    }
                }
            }
            
            
            //console.log(receive.Messages);
        }

        return {
            statusCode: 200,
            body: "okn't"
        }
    }

}