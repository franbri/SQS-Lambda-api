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
    QueueUrl: queueURL,
    ReceiptHandle: "AQEBRWHXE4woQ7GvjzNN7v+1Yp8CDZJtoBoRrRVbJlLQga0ylxG9ljk3iDczMWzzncg5ZUb+FdQEkby/hRlNsIEZrY/khDGGGcrElPVvyXISH7s44+9GQsuRWB3VdSCExFOqOSyGKZrjCMyLBo/q47LZu55tjyv8kLhO1QUrqipjI7ukA/U6yRMqUt3j+MptBIhSd7WWICUCckgIbVq7dlCC7HIaTCHjSpqaWIJUhKQpWBkQcisTDglvs/8wVQEsp/4vrZCEaISB4Yaj38m6a8B7DTtwdyHYnqifZTaXbaMMp7vb1/8ZYsgDIWZkxHGUOWz+s0Idt7R9xAgmI1rVxn/Vw7zAb6OF//+nAGVNQo72knjhLpXxGLry2k5OsVzTQJpF" /* required */
};
sqs.deleteMessage(params, function (err, data) {
    if (err)
        console.log(err, err.stack); // an error occurred
    else
        console.log(data); // successful response
});
