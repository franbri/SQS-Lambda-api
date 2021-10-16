import * as AWS from 'aws-sdk'
AWS.config.update({
    region: 'us-east-2',
    accessKeyId: "",
    secretAccessKey: ""
    
});

var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

var queueURL = "https://sqs.us-east-2.amazonaws.com/415153654941/Myqueue"
var params = {
    QueueUrl: queueURL, /* required */
    ReceiptHandle: "AQEBRWHXE4woQ7GvjzNN7v+1Yp8CDZJtoBoRrRVbJlLQga0ylxG9ljk3iDczMWzzncg5ZUb+FdQEkby/hRlNsIEZrY/khDGGGcrElPVvyXISH7s44+9GQsuRWB3VdSCExFOqOSyGKZrjCMyLBo/q47LZu55tjyv8kLhO1QUrqipjI7ukA/U6yRMqUt3j+MptBIhSd7WWICUCckgIbVq7dlCC7HIaTCHjSpqaWIJUhKQpWBkQcisTDglvs/8wVQEsp/4vrZCEaISB4Yaj38m6a8B7DTtwdyHYnqifZTaXbaMMp7vb1/8ZYsgDIWZkxHGUOWz+s0Idt7R9xAgmI1rVxn/Vw7zAb6OF//+nAGVNQo72knjhLpXxGLry2k5OsVzTQJpF" /* required */
};

sqs.deleteMessage(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});