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

var stock = ["AAPL"];

$(document).ready(function () {

  // API Key for Alpha Vantage FNPWI5GFVP98Q8ZL
  // API key for World Trading zCxY4p4XRUfscbHnY2eRflSMKBIccU0PnSTFOrpP6397VQuzMayCp4JpNqUf

  function queryfunct(arrayTerms, stringTerm) {
    for (var i = 0; i < arrayTerms.length; i++) {
      var queryURL = "https://www.worldtradingdata.com/api/v1/stock_search?search_term=" + arrayTerms[i] + "&search_by=symbol,name&limit=20&stock_exchange=NASDAQ,NYSE&page=1&api_token=zCxY4p4XRUfscbHnY2eRflSMKBIccU0PnSTFOrpP6397VQuzMayCp4JpNqUf"
      $.ajax({
          url: queryURL,
          method: "GET"
        })

        .then(function (response) {
          console.log(response);
          var stockDiv = $("<div class='stock'>")

          var stockName = response.data[0].name;
          var stockPrice = response.data[0].price;

          var pOne = $("<p>").text(stockName + " USD: $" + stockPrice);
          stockDiv.append(pOne);

          $(stringTerm).append(stockDiv);

          console.log(stockDiv);
        });

    }


  }

  $("#add-stock").on("click", function (event) {

    $("#stocks-view").empty();

    event.preventDefault();

    var stocks = $("#stock-input").val().trim();

    stock.push(stocks);

    queryfunct(stock, "#stocks-view");
  })

  $("#search-stock").on("click", function (event) {
    $("#search-view").empty();

    event.preventDefault();

    var stocks = [$("#search-input").val().trim()];

    console.log(stock);

    queryfunct(stocks, "#search-view");
  })


  function displayCryptoInfo(crypto) {

    var queryURL = "https://api.coinmarketcap.com/v2/ticker/?limit=3"


    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {

      console.log(response);

      var dataobj = response.data;
      console.log(dataobj);

      for (var tickers in dataobj) {
        var cryptoDiv = $("#crypto-view");

        var bitName = dataobj[tickers].name;
        console.log(bitName);
        var bitPrice = dataobj[tickers].quotes.USD.price;
        bitPrice = Number(Math.round(bitPrice + 'e2') + 'e-2');

        var cryptOne = $("<p>").text(bitName + " USD: $" + bitPrice);
        cryptoDiv.append(cryptOne);

        $(crypto).append(cryptoDiv);

        console.log(cryptoDiv);
      }

    })
  };

  displayCryptoInfo();

  queryfunct(stock, "#stocks-view");
})