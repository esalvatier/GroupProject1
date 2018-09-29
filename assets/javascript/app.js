$(document).ready(function () {
  var config = {
    apiKey: "AIzaSyBL_LaPryoNiAeqDaOxA8TtHCGQqQauH6c",
    authDomain: "personal-budget-app-5f7f7.firebaseapp.com",
    databaseURL: "https://personal-budget-app-5f7f7.firebaseio.com",
    projectId: "personal-budget-app-5f7f7",
    storageBucket: "personal-budget-app-5f7f7.appspot.com",
    messagingSenderId: "239802611255"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  var currentUser;

  function drawTable(user) {
    $("#budgetTable > tbody").empty();
    var liabilities;
    var assets;
    var size
    database.ref(user).once("value", function (childSnapShot) {
      assets = JSON.parse(childSnapShot.val().assets);
      liabilities = JSON.parse(childSnapShot.val().liabilities);
    }).then(function (snapShot) {
      console.log(liabilities);
      console.log(assets);
      size = Math.max(liabilities.length, assets.length);
      for (var i = 0; i < size; i++) {
        var newRow = $("<tr>");
        var currAsset = $("<td>");
        var currLiab = $("<td>");
        if (i < assets.length) {
          currAsset.text(assets[i][1]);
        }
        if (i < liabilities.length) {
          currLiab.text(liabilities[i][1]);
        }
        newRow.append(currAsset, currLiab);
        $("#budgetTable").append(newRow);
      }
    });
  }

  $(document.body).on("click", "#userSubmit", function (event) {
    console.log("happening");
    event.preventDefault();
    var temp = $("#userName").val().trim();
    var passed = false;
    database.ref().once("value", function (snapShot) {}).then(function (snapShot) {
      if (snapShot.val() != undefined) {
        snapShot.forEach(function (current) {
          if (current.val().name == temp) {
            console.log("pass");
            currentUser = current.key;
            passed = true;
          }
        });
      }
      if (!passed) {
        console.log("new");
        var newUserRef = database.ref().push();
        newUserRef.update({
          name: temp,
          liabilities: "[]",
          assets: "[]",
          stocks: "[]",
          crypto: "[]"
        });
        currentUser = newUserRef.key;
      }
      $("#userDisp").empty();
      $("button").removeAttr("disabled");
      var userDisp = $("<h1>").text(temp);
      $("#userDisp").append(userDisp);
      drawTable(currentUser);
    });
  });
  $(document.body).on("click", "#liabilityAdd", function (event) {
    event.preventDefault();
    var value = $("#liabilityInput").val().trim();
    database.ref(currentUser + "/liabilities").once("value", function (childSnapShot) {
      var tempArr = JSON.parse(childSnapShot.val());
      if (tempArr.length === 0) {
        tempArr = [];
      }
      tempArr.push(["liability", value]);
      database.ref(currentUser).update({
        liabilities: JSON.stringify(tempArr)
      });
      console.log(tempArr);
    }).then(function() {
      drawTable(currentUser);
    });
  });

  $(document.body).on("click", "#assetAdd", function (event) {
    event.preventDefault();
    var value = $("#assetInput").val().trim();
    database.ref(currentUser + "/assets").once("value", function (childSnapShot) {
      var tempArr = JSON.parse(childSnapShot.val());
      if (tempArr.length === 0) {
        tempArr = [];
      }
      tempArr.push(["asset", value]);
      database.ref(currentUser).update({
        assets: JSON.stringify(tempArr)
      });
      console.log(tempArr);
    }).then(function() {
      drawTable(currentUser);
    });
  });
});