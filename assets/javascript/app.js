var currentUser;
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

$(document.body).on("click", "#userSubmit", function (event) {
  event.preventDefault();
  var temp = $("#userName").val().trim();
  var passed = false;
  database.ref().once("value", function (snapShot) {
    if (snapShot.val() != undefined) {
      snapShot.forEach(function (current) {
        if (current.val().name == temp) {
          console.log("pass");
          currentUser = current.key;
          passed = true;
        }
      });
    }
  }).then(function () {
    if (!passed) {
      console.log("new");
      var newUserRef = database.ref().push();
      newUserRef.update({
        name: temp
      });
      currentUser = newUserRef.key;
    }
  });
  console.log(currentUser);
});
//$("#userDisp").empty();
//console.log(database.ref(currentUser));
//var userDisp = $("<h1>").text(database.ref(currentUser).val().name);
// $("#userDisp").append(userDisp);
});