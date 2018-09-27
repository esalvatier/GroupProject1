// $(document).ready(function () {
//   var config = {
//     apiKey: "AIzaSyBL_LaPryoNiAeqDaOxA8TtHCGQqQauH6c",
//     authDomain: "personal-budget-app-5f7f7.firebaseapp.com",
//     databaseURL: "https://personal-budget-app-5f7f7.firebaseio.com",
//     projectId: "personal-budget-app-5f7f7",
//     storageBucket: "personal-budget-app-5f7f7.appspot.com",
//     messagingSenderId: "239802611255"
//   };
//   firebase.initializeApp(config);

// });
$(document).ready(function () {

  var stock = ["AAPL", "AMZN", "TSLA", null];
  // API Key for Alpha Vantage FNPWI5GFVP98Q8ZL
  // API key for World Trading zCxY4p4XRUfscbHnY2eRflSMKBIccU0PnSTFOrpP6397VQuzMayCp4JpNqUf

  function worldStock() {

    var queryURL = "https://www.worldtradingdata.com/api/v1/stock?symbol=" + stock + ".L&api_token=zCxY4p4XRUfscbHnY2eRflSMKBIccU0PnSTFOrpP6397VQuzMayCp4JpNqUf"

    $.ajax({
        url: queryURL,
        method: "GET"
      })

      .then(function (response) {
        console.log(response);

        for (var i = 0; i < stock.length; i++) {
          var stockDiv = $("<div class='stock'>")

          var stockName = response.data[i].name;
          var stockPrice = response.data[i].price;

          var pOne = $("<p>").text(stockName + " USD: $" + stockPrice);
          stockDiv.append(pOne);

          $("#stocks-view").prepend(stockDiv);

          console.log(stockDiv);
        }
      });
  }

  $("#add-stock").on("click", function(event) {
    $("#stocks-view").empty();

    event.preventDefault();

    var stocks = $("#stock-input").val().trim();

    stock.push(stocks);

    worldStock();
  })
  worldStock();
});