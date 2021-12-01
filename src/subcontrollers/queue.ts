import AWS from "aws-sdk";
import 'dotenv/config';
import message from "./message";


export default class queue {

    sqs: AWS.SQS;
    constructor() {
        AWS.config.update({
            region: 'us-east-2',
            accessKeyId: process.env.AWS_ID,
            secretAccessKey: process.env.AWS_KEY
        });
        this.sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
    }


    public async listQueues() {
        var params = {
            /*MaxResults: '',
            NextToken: '',
            QueueNamePrefix: ''*/
        };
        var ret: {
            name: string,
            url: string,
            messageCount: number,
            DLurl: string,
            DLmessageCount: string
        }[] = [];

        const request = await this.sqs.listQueues(params).promise();

        if (request.QueueUrls) {
            console.log(request.QueueUrls);
            for (let queue in request.QueueUrls) {
                let queueInfoTemp = await this.getQueueInfoByURL(request.QueueUrls[queue]);
                let queueInfo = JSON.parse(queueInfoTemp);
                
                /*get dead letter info */
                if (queueInfo.RedrivePolicy) {
                    let temp = JSON.parse(queueInfo.RedrivePolicy);
                    var deadLetterURL = await this.getQueueURL((temp.deadLetterTargetArn).split(":").slice(-1)[0])

                    let DLqueueInfoTemp = await this.getQueueInfoByURL(deadLetterURL);
                    var DLqueueInfo = JSON.parse(DLqueueInfoTemp);

                    ret.push({
                        name: request.QueueUrls[queue].split("/").slice(-1)[0],
                        url: request.QueueUrls[queue],
                        messageCount: queueInfo.ApproximateNumberOfMessages,
                        DLurl: deadLetterURL,
                        DLmessageCount: DLqueueInfo.ApproximateNumberOfMessages,
                    })
                } /*else {
                    var DLqueueInfo = JSON.parse('{"approximateNumberOfMessages": 0}');
                }*/

            }
        }
        return ret;
    }

    async getQueueURL(id: string) {
        var name = "";
        var paramsName = {
            QueueName: id /* required */
        };
        var QueueURL = await this.sqs.getQueueUrl(paramsName).promise();
        if (QueueURL.QueueUrl) {
            name = QueueURL.QueueUrl;
        }

        return name;

    }

    async getQueueInfoByURL(url: string | undefined) {
        if (!url) {
            return "";
        }
        var params = {
            QueueUrl: url, /* required */
            AttributeNames: ["All"/*"deadLetterTargetArn"*/]
        }

        const attrib = await this.sqs.getQueueAttributes(params).promise();
        return JSON.stringify(attrib.Attributes);
    }

    async getDL(queueURL: string) {
        var attributes = await this.getQueueInfoByURL(queueURL);
        var DLURL = JSON.parse(attributes);
        console.log(JSON.parse(DLURL.RedrivePolicy))
        if (JSON.parse(DLURL.RedrivePolicy)) {
            DLURL = await this.getURLbyARN(JSON.parse(DLURL.RedrivePolicy).deadLetterTargetArn)
        }
        return DLURL;
    }

    getURLbyARN(arn: string) {
        var name = arn.split(':');
        return this.getQueueURL(name[name.length - 1]);
    }

    async purgeQueue(queueName: string) {
        var ret = {
            statusCode: 200,
            body: "error"
        }

        var queueURL = await this.getQueueURL(queueName);

        if (queueURL) {
            var params = {
                QueueUrl: queueURL
            }
            const purge = await this.sqs.purgeQueue(params).promise();
            ret.body = "ok"
            console.log("bien se purgo cola");
        }
        return ret;
    }

    public async reinject(queueName: string) {
        var ret = {
            statusCode: 500,
            body: "unkown error"
        }

        var queueurl = await this.getQueueURL(queueName);
        var dl = await this.getDL(queueurl);

        console.log("f2")
        var newparams = {
            AttributeNames: [
                "SentTimestamp"
            ],
            MaxNumberOfMessages: 10,
            MessageAttributeNames: [
                "All"
            ],
            QueueUrl: dl,
            VisibilityTimeout: 10,
            WaitTimeSeconds: 10
        };

        var receive = await this.sqs.receiveMessage(newparams).promise();
        if (receive.Messages) {
            ret.body = "ok";
            ret.statusCode = 200;
            try {
                receive.Messages.forEach((val, ind) => {
                    console.log(val.Body)
                    var sendParams: AWS.SQS.SendMessageRequest = {
                        QueueUrl: queueurl,
                        MessageBody: val.Body + "",
                    }
                    var delParams: AWS.SQS.DeleteMessageRequest = {
                        QueueUrl: dl,
                        ReceiptHandle: val.ReceiptHandle + ""
                    }
                    this.sqs.sendMessage(sendParams, (err, data) => {
                        if (err) {
                            console.log("sending error:" + err)
                            return
                        }
                        console.log(data)
                    });
                    this.sqs.deleteMessage(delParams, (err, data) => {
                        if (err) {
                            console.log("sending error:" + err);
                            return 
                        }
                        console.log(data)
                    });
                })
            } catch (error) {
                console.log(error);
            }

        }

        if (!receive.Messages) {
            ret.body = "no messages to reinyect";
        }
        if (!queueurl || !dl) {
            ret.body = "queue not found";
        }

        return ret;
    }

    async purgeDlQueue(queueName: string) {
        var ret = {
            statusCode: 200,
            body: "error"
        }

        var queueURL = await this.getQueueURL(queueName);
        var dl = await this.getDL(queueURL);

        if (queueURL && dl) {
            var params = {
                QueueUrl: dl
            }
            const purge = await this.sqs.purgeQueue(params).promise();
            ret.body = "ok"
            console.log("bien se purgo cola");
        }
        return ret;
    }

}
