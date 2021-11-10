import AWS from "aws-sdk";
import 'dotenv/config';
import queue from "./queue";

export default class message{
    sqs: AWS.SQS;
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
        var ret = {
            statusCode: 400,
            body: "pong"
        }

        var Qman = new queue();
        var queueurl = await Qman.getQueueURL(Queueid);

        console.log(queueurl)
        if (queueurl.QueueUrl) {
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

            const run = await this.sqs.receiveMessage(params).promise();
            ret.body = JSON.stringify(run.Messages)
        }
        
        return ret
    }

    setMessages(QueueUrl: string){
        throw new Error("Method not implemented.");
    }

}