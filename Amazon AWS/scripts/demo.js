// TODO replace these by your own
var AMAZON_AWS_ACCESSKEYID = "AKIAIDUJXUYFHF6G6S7Q";
var AMAZON_AWS_SECRETACCESSKEY = "R605uH6CPCdjFILA6nvRd+6IY6oX9ldvGOmBsDt4";
var AMAZON_AWS_REGION = "us-west-2";

window.onerror = function(a,b,c) {
  alert(a);
  alert(c);
};

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
            document.getElementById('status').innerHTML = 'Could not load objects from S3';
          } else {
            document.getElementById('status').innerHTML = 'Loaded ' + data.Contents.length + ' items from S3';
            for (var i = 0; i < data.Contents.length; i++) {
              document.getElementById('objects').innerHTML += '<li>' + data.Contents[i].Key + '</li>';
            }
          }
        });
      }
    },

    trackButtonClickedWithPayload: function () {
      if (!this.checkSimulator()) {
        Leanplum.track(
            function(msg) {alert(msg)},
            function(msg) {alert("ERROR, not tracked: " + msg)},
            "Button",
            {"amount": 10}
        );
      }
    },

    registerPush: function () {
      if (!this.checkSimulator()) {
        Leanplum.registerPush({
          "badge": "true",
          "sound": "true",
          "alert": "true",
          "callback": "onPushNotificationReceived"
        });
      }
    },

    unregisterPush: function () {
      if (!this.checkSimulator()) {
        Leanplum.unregisterPush();
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

document.addEventListener("deviceready", function () {
  if (window.AWS !== undefined) {
    AWS.config.update({
      accessKeyId: AMAZON_AWS_ACCESSKEYID,
      secretAccessKey: AMAZON_AWS_SECRETACCESSKEY
    });
    AWS.config.region = AMAZON_AWS_REGION;
  }
});