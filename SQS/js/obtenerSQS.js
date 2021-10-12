"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var AWS = __importStar(require("aws-sdk"));
AWS.config.update({
    region: 'us-east-2',
    accessKeyId: "AKIAWBKIWBSOUSOLS4ON",
    secretAccessKey: "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"
});
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
var queueURL = "https://sqs.us-east-2.amazonaws.com/415153654941/Myqueue";
var params = {
    AttributeNames: [
        "SentTimestamp"
    ],
    MaxNumberOfMessages: 10,
    MessageAttributeNames: [
        "All"
    ],
    QueueUrl: queueURL,
    VisibilityTimeout: 0,
    WaitTimeSeconds: 20
};
sqs.receiveMessage(params, function (err, data) {
    //console.log("data: " + JSON.stringify(data));
    if (err) {
        console.log("Receive Error", err);
    }
    else if (data.Messages) {
        //console.log(data.Messages)
        data.Messages.forEach(function (msg) {
            console.log(msg);
        });
        /*for(i = 0 ; i < data.Messages.length ; i++){
          
          var deleteParams = {
            QueueUrl: queueURL,
            ReceiptHandle: data.Messages[i].ReceiptHandle
          };
          sqs.deleteMessage(deleteParams, function(err, data) {
            if (err) {
              console.log("Delete Error", err);
            } else {
              console.log("Message Deleted", data);
            }
          });
        
      
          console.log("received messages: " + JSON.stringify(data.Messages[i]));
          console.log("messages body: " + data.Messages[i].Body)
          
        }
        */
        console.log("number of messages received: " + (data.Messages.length));
    }
});
