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
  var assetList = [];
  var liabList = [];
  function loginForm() {
    $("#userLogSection").empty();
      var newLoginForm = $("<form>");
      var inputEmailForm = $("<div>").addClass("input-group");
      var emailLabel = $("<label>").addClass("input-group-text").attr("for", "userEmail").text("Email");
      var emailInput = $("<input>").attr({"type": "text","id": "userEmail"});
      inputEmailForm.append(emailLabel, emailInput);
      var inputPassForm = $("<div>").addClass("input-group");
      var passLabel = $("<label>").addClass("input-group-text").attr("for", "userPassword").text("Password");
      var passInput = $("<input>").attr({"type": "password","id": "userPassword"});
      inputPassForm.append(passLabel, passInput);
      var signInBtn = $("<button>").attr({"type": "submit", "id": "signinUser"}).addClass("btn btn-outline-primary").text("Sign-In");
      var newUsrBtn = $("<button>").attr({"type": "submit", "id": "newUserSubmit"}).addClass("btn btn-outline-primary").text("Submit New User");
      newLoginForm.append(inputEmailForm, inputPassForm, signInBtn, newUsrBtn);
      $("#userLogSection").append(newLoginForm);
      $("#budgetTable > tbody").empty();
  }

  function drawTable(user) {
    $("#budgetTable > tbody").empty();
    var liabilities;
    var assets;
    var size;
    var totalLiab = 0;
    var totalAsset = 0;

    database.ref(user).once("value", function (childSnapShot) {
      assets = JSON.parse(childSnapShot.val().assets);
      liabilities = JSON.parse(childSnapShot.val().liabilities);
      assetList = assets
      liabList = liabilities;
    }).then(function () {
      size = Math.max(liabilities.length, assets.length);
      for (var i = 0; i < size; i++) {
        var newRow = $("<tr>");
        var currAsset = $("<td>");
        var currLiab = $("<td>");
        if (i < assets.length) {
          currAsset.text(assets[i][1]);
          totalAsset += parseInt(assets[i][1]);
        }
        if (i < liabilities.length) {
          currLiab.text(liabilities[i][1]);
          totalLiab += parseInt(liabilities[i][1]);
        }
        newRow.append(currAsset, currLiab);
        $("#budgetTable").append(newRow);
      }
      var netRow = $("<tr>");
      var netCell = $("<td>").text(eval(totalAsset - totalLiab));
      netRow.append($("<td>"), $("<td>"), netCell);
      $("#budgetTable").append(netRow);
    });
  }

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("signed in")
      var temp = user.uid;
      var passed = false;
      database.ref().once("value", function () {}).then(function (snapShot) {
        snapShot.forEach(function (current) {
          if (current.val().uid == temp) {
            console.log("pass");
            currentUser = current.key;
            passed = true;
          }
        });
        if (!passed) {
          var newUserRef = database.ref().push();
          newUserRef.update({
            uid: temp,
            liabilities: "[]",
            assets: "[]",
            stocks: "[]",
            crypto: "[]"
          });
          currentUser = newUserRef;
        }
        $("#userLogSection").empty();
        $("button").removeAttr("disabled");
        var userDisp = $("<h3>").text(user.email);
        var signOut = $("<button>").attr({"type":"submit", "id": "signOutBtn"}).addClass("btn btn-outline-danger").text("Sign-Out");
        $("#userLogSection").append(userDisp, signOut);
        drawTable(currentUser);
      });
    } else {
    }
  });

  $(document.body).on("click", "#signinUser", function (event) {
    event.preventDefault();
    var email = $("#userEmail").val().trim();
    var password = $("#userPassword").val().trim();
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
      // ...
    });
  });

  $(document.body).on("click", "#newUserSubmit", function (event) {
    event.preventDefault();
    var email = $("#userEmail").val().trim();
    var password = $("#userPassword").val().trim();
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
      // ...
    });
  });

  $(document.body).on("click", "#liabilityAdd", function (event) {
    event.preventDefault();
    var value = $("#liabilityInput").val().trim();
    var type = $("#liabilityType").val().trim();
    database.ref(currentUser + "/liabilities").once("value", function (childSnapShot) {
      var tempArr = JSON.parse(childSnapShot.val());
      if (tempArr.length === 0) {
        tempArr = [];
      }
      tempArr.push([type, value]);
      database.ref(currentUser).update({
        liabilities: JSON.stringify(tempArr)
      });
      console.log(tempArr);
    }).then(function () {
      $("#liabilityInput").text("");
      drawTable(currentUser);
    });
  });

  $(document.body).on("click", "#assetAdd", function (event) {
    event.preventDefault();
    var value = $("#assetInput").val().trim();
    var type = $("#assetType").val().trim();
    database.ref(currentUser + "/assets").once("value", function (childSnapShot) {
      var tempArr = JSON.parse(childSnapShot.val());
      if (tempArr.length === 0) {
        tempArr = [];
      }
      tempArr.push([type, value]);
      database.ref(currentUser).update({
        assets: JSON.stringify(tempArr)
      });
      console.log(tempArr);
    }).then(function () {
      $("#assetInput").text("");
      drawTable(currentUser);
    });
  });

  $(document.body).on("click", "#signOutBtn", function () {
    firebase.auth().signOut().then(function() {
      currentUser = undefined;
      loginForm();
      console.log(currentUser);
    }).catch(function(error) {
      console.log(error);
    });
  });
});