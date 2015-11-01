// replace this by your own
var AMAZON_AWS_REGION = "us-west-2";


(function (global) {
  var DemoViewModel,
      app = global.app = global.app || {};

  DemoViewModel = kendo.data.ObservableObject.extend({

    listS3Bucket: function () {
      if (!this.checkSimulator()) {
        var bucket = new AWS.S3({params: {Bucket: 'telerikdemoapp'}});
        bucket.listObjects(function (err, data) {
          if (err) {
            alert(JSON.stringify(err));
          } else {
              var result = 'Loaded ' + data.Contents.length + ' items from S3:\n\n';
              for (var i = 0; i < data.Contents.length; i++) {
                  result += ' - ' + data.Contents[i].Key + '\n';
              }
              alert(result);
          }
        });
      }
    },

    listDynamoDBTables: function () {
      if (!this.checkSimulator()) {
        var db = new AWS.DynamoDB();
        db.listTables(function (err, data) {
          if (err) {
              alert(JSON.stringify(err));
              document.getElementById('status').innerHTML = 'Could not load objects from S3';
          } else {
              alert(data.TableNames);
          }
        });
      }
    },

    updateDynamoDBRecord: function () {
      if (!this.checkSimulator()) {
          var table = new AWS.DynamoDB({params: {TableName: 'html5frameworks'}});
          var keyval = "Kendo UI";
          var itemParams = {Item: {'Framework ID': {S: keyval}, data: {S: "Last update: " + new Date().toString()}}};
          table.putItem(itemParams, function(err, data) {
              if (err) {
                  alert(err);
              } else {
                  alert("Record updated");
              }
          });
      }
    },

    readDynamoDBRecord: function () {
      if (!this.checkSimulator()) {
          var table = new AWS.DynamoDB({params: {TableName: 'html5frameworks'}});
          var keyval = "Kendo UI";
          table.getItem({Key: {'Framework ID': {S: keyval}}}, function(err, data) {
              if (err) {
                  alert(err);
              } else {
                  alert(JSON.stringify(data));
              }
          });
      }
    },

    addToSQSQueue: function () {
      if (!this.checkSimulator()) {
          var sqs = new AWS.SQS();
          // create a queue if necessary
          sqs.createQueue({QueueName: 'Telerik_Amazon_AWS_Demo_Queue'}, function (err, data) {
              if (err) {
                  alert(err);
              } else {
                  sqsQueue = data.QueueUrl;
                  // add a message to the queue
		          var queue = new AWS.SQS({params: {QueueUrl: sqsQueue}});
                  queue.sendMessage({MessageBody: 'Hey there @ ' + new Date().toString()}, function (err, data) {
                      if (err) {
                          alert(err);
                      } else {
		                  alert("Added message to the queue");
                      }
                  });
              }
          });
      }
    },

    readFromSQSQueue: function () {
      if (!this.checkSimulator()) {
          if (sqsQueue == null) {
              alert("This demo app expects you to add something to the queue first, sorry");
              return false;
          }
          var queue = new AWS.SQS({params: {QueueUrl: sqsQueue}});
          queue.receiveMessage(function (err, data) {
              if (err) {
                  alert(err);
              } else {
                  alert(JSON.stringify(data.Messages));
              }
          });
      }
    },

    checkSimulator: function() {
      if (window.navigator.simulator === true) {
        alert('This plugin is not available in the simulator.');
        return true;
      } else if (window.AWS === undefined) {
        alert('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
        return true;
      } else {
        return false;
      }
    }

  });

  app.demoService = {
    viewModel: new DemoViewModel()
  };
})(window);

var sqsQueue = null;

document.addEventListener("deviceready", function () {
  if (window.AWS !== undefined) {
    AWS.config.region = AMAZON_AWS_REGION;
  }
});