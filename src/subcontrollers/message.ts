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
        //this.sendMessages(Queueid);
        var ret = {
            statusCode: 500,
            body: "pong"
        }
        console.log(Queueid);

        var queueManager = new queue();
        var queueurl = await queueManager.getQueueURL(Queueid);

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
                WaitTimeSeconds: 10
            };

            const messageList = await this.sqs.receiveMessage(params).promise();
            if(messageList.Messages){
                let messages = JSON.stringify(messageList.Messages);
                ret.body = messages;
                ret.statusCode = 200;
            }
        }
        return ret
    }

    async sendMessages(Queueid: string) {
        var ret = {
            statusCode: 500,
            body: "pong"
        }

        console.log(Queueid);

        var queueManager = new queue();
        var queueurl = await queueManager.getQueueURL(Queueid);

        console.log(queueurl)
        if (queueurl.QueueUrl) {
            var params = {
                MessageBody: 'testing', /* required */
                QueueUrl: queueurl.QueueUrl, /* required */
                //DelaySeconds: 'NUMBER_VALUE',
                // MessageAttributes: {
                //   '<String>': {
                //     DataType: 'STRING_VALUE', /* required */
                //     BinaryListValues: [
                //       Buffer.from('...') || 'STRING_VALUE' /* Strings will be Base-64 encoded on your behalf */,
                //       /* more items */
                //     ],
                //     BinaryValue: Buffer.from('...') || 'STRING_VALUE' /* Strings will be Base-64 encoded on your behalf */,
                //     StringListValues: [
                //       'STRING_VALUE',
                //       /* more items */
                //     ],
                //     StringValue: 'STRING_VALUE'
                //   },
                //   /* '<String>': ... */
                // },
                // MessageDeduplicationId: 'STRING_VALUE',
                // MessageGroupId: 'STRING_VALUE',
                // MessageSystemAttributes: {
                //   '<MessageSystemAttributeNameForSends>': {
                //     DataType: 'STRING_VALUE', /* required */
                //     BinaryListValues: [
                //       Buffer.from('...') || 'STRING_VALUE' /* Strings will be Base-64 encoded on your behalf */,
                //       /* more items */
                //     ],
                //     BinaryValue: Buffer.from('...') || 'STRING_VALUE' /* Strings will be Base-64 encoded on your behalf */,
                //     StringListValues: [
                //       'STRING_VALUE',
                //       /* more items */
                //     ],
                //     StringValue: 'STRING_VALUE'
                //   },
                //   /* '<MessageSystemAttributeNameForSends>': ... */
                // }
              };
            this.sqs.sendMessage(params,(err,data)=>{
                console.log(err)
            }).send();

            /*const messageList = await this.sqs.receiveMessage(params);
            
            if(messageList.Messages){
                ret.body = JSON.stringify(messageList.Messages);
                ret.statusCode = 200;
            }*/
        }
        return ret
    }

    setMessages(QueueUrl: string){
        throw new Error("Method not implemented.");
    }       

}