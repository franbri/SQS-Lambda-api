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
var params = {
    DelaySeconds: 10,
    MessageBody: "Information about current NY Times fiction bestseller for week of 12/11/2020.",
    QueueUrl: "https://sqs.us-east-2.amazonaws.com/415153654941/Myqueue"
};
sqs.sendMessage(params, function (err, data) {
    if (err) {
        console.log("Error", err);
    }
    else {
        console.log("Success", data.MessageId);
    }
});
