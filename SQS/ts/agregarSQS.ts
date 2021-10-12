import * as AWS from 'aws-sdk'
AWS.config.update({
    region: 'us-east-2',
    accessKeyId: "AKIAWBKIWBSOUSOLS4ON",
    secretAccessKey: "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"
    
});

var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

var params = {
            
    DelaySeconds: 10,
    MessageBody: "Information about current NY Times fiction bestseller for week of 12/11/2020.",
    QueueUrl: "https://sqs.us-east-2.amazonaws.com/415153654941/Myqueue"
  };

 sqs.sendMessage(params, function(err, data) {
     if (err) {
       console.log("Error", err);
     } else {
       console.log("Success", data.MessageId);
     }
 });