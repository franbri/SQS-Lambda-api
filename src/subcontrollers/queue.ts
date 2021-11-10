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
            messageCount: string,
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
                if (false/*queueInfo.RedrivePolicy*/) {
                    let temp = JSON.parse(queueInfo.RedrivePolicy);
                    let DLqueueInfoTemp = await this.getQueueInfoByURL((await this.getQueueURL(temp.deadLetterTargetArn)).QueueUrl);
                    var DLqueueInfo = JSON.parse(DLqueueInfoTemp);
                } else {
                    var DLqueueInfo = JSON.parse('{"approximateNumberOfMessages": 0}');
                }

                ret.push({
                    name: request.QueueUrls[queue].split("/").slice(-1)[0],
                    url: request.QueueUrls[queue],
                    messageCount: queueInfo.ApproximateNumberOfMessages,
                    DLurl: "",
                    DLmessageCount: DLqueueInfo.ApproximateNumberOfMessages,
                })
            }
        }
        return ret;
    }

    async getQueueURL(id: string) {
        var paramsName = {
            QueueName: id /* required */
        };
        var name = this.sqs.getQueueUrl(paramsName).promise();

        return name;

    }

    async getQueueInfoByURL(url: string|undefined) {
        if (!url){
            return "";
        }
        var params = {
            QueueUrl: url, /* required */
            AttributeNames: ["All"/*"deadLetterTargetArn"*/]
        }

        const attrib = await this.sqs.getQueueAttributes(params).promise();
        return JSON.stringify(attrib.Attributes);
    }

    async getDL(queueURL:string){
        var attributes = JSON.parse(await this.getQueueInfoByURL(queueURL));
        var DLURL;
        if(attributes.queueInfo.RedrivePolicy){
            DLURL = this.getURLbyARN(attributes.queueInfo.RedrivePolicy.deadLetterTargetArn)
        }
        return DLURL;
    }

    async getURLbyARN(arn:string){
        var name = arn.split(':')[-1]
        return this.getQueueURL(name);
    }

    async purgeQueue(queueName: string) {
        var ret = {
            statusCode: 200,
            body: "error"
        }

        var queueURL = await this.getQueueURL(queueName);

        if (queueURL.QueueUrl) {
            var params = {
                QueueUrl: queueURL.QueueUrl
            }
            const purge = await this.sqs.purgeQueue(params).promise();
            ret.body = "ok"
            console.log("bien se purgo cola");
        }
        return ret;
    }

    public async reinyect(queueName: string){
        var ret = {
            statusCode: 200,
            body: "error"
        }

        var queueURL = await this.getQueueURL(queueName);

        if (queueURL.QueueUrl) {
            var DLURL = await this.getDL(queueURL.QueueUrl);
            var mess = new message();
            if (DLURL){
                mess.mvMessage(queueURL.QueueUrl)
                ret.body = "ok"
                console.log("bien se reinyecto cola");
            }
        }
        return ret;
    }
}
