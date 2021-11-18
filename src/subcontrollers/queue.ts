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

                let info = {
                    name: request.QueueUrls[queue].split("/").slice(-1)[0],
                    url: request.QueueUrls[queue],
                    messageCount: queueInfo.ApproximateNumberOfMessages,
                    DLurl: "",
                    DLmessageCount: "0",
                }

                /*get dead letter info */

                if (queueInfo.RedrivePolicy) {
                    try {
                        let temp = JSON.parse(queueInfo.RedrivePolicy);
                        console.log(temp)
                        console.log(temp.deadLetterTargetArn)
                        console.log(this.getURLbyARN(temp.deadLetterTargetArn));
                        var DLqueueInfoTemp = this.getQueueInfoByURL(await this.getURLbyARN(temp.deadLetterTargetArn));
                        var DLqueueInfo = JSON.parse(await DLqueueInfoTemp);
                        info.DLurl = (await this.getURLbyARN(temp.deadLetterTargetArn));
                        info.DLmessageCount = DLqueueInfo.ApproximateNumberOfMessages;
                    } catch {
                        console.log("bruh error");
                        console.log("end erorr");
                    }
                } else {
                    continue;
                }
                ret.push(info);
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

    public async reinyect(queueName: string) {
        var ret = {
            statusCode: 500,
            body: "unkown error"
        }
        console.log("f1")
        console.log("f3")
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

        if (receive.Messages && queueurl && dl) {
            for (let mess in receive.Messages) {
                console.log(receive.Messages[mess].Body)
                if (receive.Messages[mess].Body && receive.Messages[mess].ReceiptHandle) {

                    let inparams = {
                        DelaySeconds: 10,
                        MessageBody: JSON.stringify(receive.Messages[mess].Body),
                        QueueUrl: queueurl
                    }

                    let deleteparams = {
                        QueueUrl: dl,
                        ReceiptHandle: JSON.stringify(receive.Messages[mess].ReceiptHandle)
                    }
                    try{
                        this.sqs.sendMessage(inparams, (err, data) => {
                            if (err) {
                                console.log("error al reinyectar");
                            }
                        }).send();
                        this.sqs.deleteMessage(deleteparams, (err, data) =>{
                            console.log(data)
                        }).send();
                    }catch{
                        console.log("error reading")
                    }
                }
            }

            ret.body = "ok";
            ret.statusCode = 200;
        } if (!receive.Messages) {
            ret.body = "no messages to reinyect";
        }
        if (!queueurl) {
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
