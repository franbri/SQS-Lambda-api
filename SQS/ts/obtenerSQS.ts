import * as AWS from 'aws-sdk'
AWS.config.update({
    region: 'us-east-2',
    accessKeyId: "AKIAWBKIWBSOUSOLS4ON",
    secretAccessKey: "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"
    
});

var sqs = new AWS.SQS({apiVersion: '2012-11-05'});



var queueURL = "https://sqs.us-east-2.amazonaws.com/415153654941/Myqueue"
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
           
           
            sqs.receiveMessage(params, function(err, data) {
            //console.log("data: " + JSON.stringify(data));
            if (err) {
                console.log("Receive Error", err);
            } else if (data.Messages) {
                 //console.log(data.Messages)
                data.Messages.forEach(msg => {
                console.log(msg)
                })
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
               
                 console.log("number of messages received: " + (data.Messages.length))
               } 
            });