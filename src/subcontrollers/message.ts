import AWS from "aws-sdk";
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

        var queueManager = new queue();
        var queueurl = await queueManager.getQueueURL(Queueid);
        
        if (queueurl) {
            var params:AWS.SQS.ReceiveMessageRequest = { QueueUrl: queueurl };
            params.AttributeNames = ["SentTimestamp"];
            params.MaxNumberOfMessages = 10;
            params.MessageAttributeNames = ["All"];
            params.VisibilityTimeout = 10;
            params.WaitTimeSeconds = 20;

            var messageList = await this.sqs.receiveMessage(params).promise();

            if(messageList.Messages){
                let messages = JSON.stringify(messageList.Messages);
                this.ret.body = messages;
                this.ret.statusCode = 200;
            }

        }
        return this.ret
    }

    async sendMessages(Queueid: string) {
        this.ret.body = "Undefined sendMessage error"
        var queueManager = new queue();
        var queueurl = await queueManager.getQueueURL(Queueid);

        var date = new Date();
        var message = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        console.log(queueurl)
        if (queueurl) {
            var params = {
                MessageBody: message, /* required */
                QueueUrl: queueurl, /* required */
              };
            this.sqs.sendMessage(params,(err,data) =>{
                if(!err){
                    this.ret.body = "ok",
                    this.ret.statusCode = 200
                }
            });
        }
        return this.ret
    }

    setMessages(QueueUrl: string){
        throw new Error("Method not implemented.");
    }       

}