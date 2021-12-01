import AWS from "aws-sdk";
import { AquaStatus } from "aws-sdk/clients/redshift";
import 'dotenv/config';
import queue from "./queue";

export default class message{
    sqs: AWS.SQS;
    ret = {
        statusCode: 500,
        body: "Undefined Message Error"
    };


    constructor() {
        AWS.config.update({
            region: 'us-east-2',
            accessKeyId: process.env.AWS_ID,
            secretAccessKey: process.env.AWS_KEY
        });
        this.sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
    }

    mvMessage(QueueUrl: string) {
        throw new Error("Method not implemented.");
    }

    async listMessages(Queueid: string) {
        this.ret.body="Undefined listMessage error"

        let queueManager = new queue();
        let queueurl = await queueManager.getQueueURL(Queueid);
        
        if (queueurl) {
            let params:AWS.SQS.ReceiveMessageRequest = { QueueUrl: queueurl };
            params.AttributeNames = ["SentTimestamp"];
            params.MaxNumberOfMessages = 10;
            params.MessageAttributeNames = ["All"];
            params.VisibilityTimeout = 3;
            params.WaitTimeSeconds = 20;

            let messageList = await this.sqs.receiveMessage(params).promise();

            if(messageList.Messages){
                let messages = JSON.stringify(messageList.Messages);
                this.ret.body = messages;
                this.ret.statusCode = 200;
            }

        }
        return this.ret
    }

    async sendMessages(Queueid: string, message:string|undefined) {
        this.ret.body = "Undefined sendMessage error"
        let queueManager = new queue();
        let queueurl = await queueManager.getQueueURL(Queueid);

        let date = new Date();
        if (!message){
            message = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        }
        console.log(queueurl)
        if (queueurl) {
            let params = {
                MessageBody: message, /* required */
                QueueUrl: queueurl, /* required */
              };

            try{
                let sendConfirm = await this.sqs.sendMessage(params).promise()
                this.ret.statusCode = 200
                this.ret.body = sendConfirm.MessageId!
            }catch(err:any){
                this.ret.body = err.message
            }
            
        }
        return this.ret

    }

    async rmMessage(Queueid:string, ReceiptHandle:string){
        let queueManager = new queue();
        let queueurl = await queueManager.getQueueURL(Queueid);

        let params:AWS.SQS.DeleteMessageRequest ={
            QueueUrl: queueurl,
            ReceiptHandle: ReceiptHandle
        }
        console.log(ReceiptHandle)
        try{
            let status =await this.sqs.deleteMessage(params).promise()
            status.$response
            this.ret.body = "ok"
            this.ret.statusCode = 200
        }catch{
            this.ret.body = "general delete error"
        }



        return this.ret
    }

    setMessages(QueueUrl: string){
        throw new Error("Method not implemented.");
    }       


}