var saved = localStorage.getItem("searched");

var named = localStorage.getItem("named");

var symbol = "";

var apiKey = "IDCBFUJ8G1MEMOI4";

console.log(symbol);

function getCurrent(sym) {
    symbol = sym;
    var queryURL = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + symbol + "&apikey=" + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        if (sym === "GOOG") {
            $("#price1").text(response['Global Quote']['05. price'])
        }
        else if (sym === "MSFT") {
            $("#price2").text(response['Global Quote']['05. price'])
        }
        else if (sym === "AMZN") {
            $("#price3").text(response['Global Quote']['05. price'])
        }
        else if (sym === "AAPL") {
            $("#price4").text(response['Global Quote']['05. price'])
        }
    });
}

getCurrent("GOOG");
getCurrent("MSFT");
getCurrent("AMZN");
getCurrent("AAPL");

$("#backToMain").on("click", function () {
    $("#backToMain").attr("href", "index.html");
});

function createBtns() {
    var b1 = $("<a>")
    b1.attr("class", "waves-effect waves-light btn-large");
    b1.attr("value", "GOOG");
    b1.attr("title", "Google");
    b1.text("CONTINUE");
    $("#btnOne").append(b1);
    var b2 = $("<a>")
    b2.attr("class", "waves-effect waves-light btn-large");
    b2.attr("value", "MSFT");
    b2.attr("title", "Microsoft");
    b2.text("CONTINUE");
    $("#btnTwo").append(b2);
    var b3 = $("<a>")
    b3.attr("class", "waves-effect waves-light btn-large");
    b3.attr("value", "AMZN");
    b3.attr("title", "Amazon");
    b3.text("CONTINUE");
    $("#btnThree").append(b3);
    var b4 = $("<a>")
    b4.attr("class", "waves-effect waves-light btn-large");
    b4.attr("value", "AAPL");
    b4.attr("title", "Apple");
    b4.text("CONTINUE");
    $("#btnFour").append(b4);
    $(".btn-large").on("click", function () {
        if ($(this).attr("value").length > 0) {
            contCode = $(this).attr("value");
            contName = $(this).attr("title");
            localStorage.setItem("searched", contCode);
            localStorage.setItem("named", contName);
            $(".btn-large").attr("href", "main.html");
        }
    })
}
createBtns();

function loadSearched() {
    var queryURL = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + saved + "&apikey=" + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        $("#searchedName").html("<b>" + named + "</b>");
        $("#searchedCode").text(response['Global Quote']['01. symbol']);
        $("#priceNow").text(response['Global Quote']['05. price']);
    });
}

$("#first-search").on("click", function () {
    searchWord = $("#stockSearch").val()
    console.log($("#stockSearch").val())
    showResults();
});

$('#stockSearch').keydown(function (e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        searchWord = $("#stockSearch").val()
        showResults();
    }
});;

function showResults() {
    $("#searchResults").empty();
    $("#searchThing").text("Searched Results For: " + searchWord);
    keyWord = searchWord;
    var thirdURL = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" + keyWord + "&apikey=" + apiKey
    $.ajax({
        url: thirdURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var results = response.bestMatches;
        for (var i = 0; i < results.length; i++) {
            var resultDiv = $("<div>");
            resultDiv.attr("class", "card col s6 teal lighten-5");

            var name = results[i]['2. name'];
            var symb = results[i]['1. symbol'];

            var head3 = $("<h3>").text(name).css("margin", "20px");
            var head4 = $("<h4>").text(symb).css("margin", "20px");

            var proceed = $("<a>")
            proceed.attr("class", "waves-effect waves-light btn-large").css("margin", "15px");
            proceed.attr("value", results[i]['1. symbol']);
            proceed.attr("title", results[i]['2. name']);
            proceed.text("CONTINUE");

            resultDiv.append(head3);
            resultDiv.append(head4);
            resultDiv.append(proceed);

            $("#searchResults").append(resultDiv);

        }
        $(".btn-large").on("click", function () {
            contCode = $(this).attr("value");
            contName = $(this).attr("title");
            localStorage.setItem("searched", contCode);
            localStorage.setItem("named", contName);
            $(".btn-large").attr("href", "main.html");
            newCardInfo();
        })

    });
}

loadSearched();

function buildQueryURL() {
    // queryURL is the url we'll use to query the API
    var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";

    // Begin building an object to contain our API call's query parameters
    // Set the API key
    var queryParams = { "api-key": "R1a31F4tBjCUaM2ho8GtIFsrSdtXt30M" };

    // Grab text the user typed into the search input, add to the queryParams object
    queryParams.q = named;

    // If the user provides a startYear, include it in the queryParams object
    var startYear = "2020";

    if (parseInt(startYear)) {
        queryParams.begin_date = startYear + "0101";
    }

    // If the user provides an endYear, include it in the queryParams object
    var endYear = "2021";

    if (parseInt(endYear)) {
        queryParams.end_date = endYear + "0101";
    }

    // Logging the URL so we have access to it for troubleshooting
    console.log("---------------\nURL: " + queryURL + "\n---------------");
    console.log(queryURL + $.param(queryParams));
    return queryURL + $.param(queryParams);
}

/**
 * takes API data (JSON/object) and turns it into elements on the page
 * @param {object} NYTData - object containing NYT API data
 */
function updatePage(NYTData) {
    // Get from the form the number of results to display
    // API doesn't have a "limit" parameter, so we have to do this ourselves
    var numArticles = 5;

    // Log the NYTData to console, where it will show up as an object
    console.log(NYTData);
    console.log("------------------------------------");

    // Loop through and build elements for the defined number of articles
    for (var i = 0; i < numArticles; i++) {
        // Get specific article info for current index
        var article = NYTData.response.docs[i];

        // Create the  list group to contain the articles and add the article content for each
        var $articleList = $("<ul>");
        $articleList.addClass("collection");

        // Add the newly created element to the DOM
        $("#article-section").append($articleList).css("text-align", "center");

        // If the article has a headline, log and append to $articleList
        var headline = article.headline;
        var $articleListItem = $("<li class='collection-item articleHeadline'>");

        if (headline && headline.main) {
            console.log(headline.main);
            $articleListItem.append(
                "<span class='label label-primary'></span>" +
                "<h3 class='article-header'> " +
                headline.main +
                "</h3>"
            );
        }

        // If the article has a byline, log and append to $articleList
        var byline = article.byline;

        if (byline && byline.original) {
            console.log(byline.original);
            $articleListItem.append("<h5 class='article-info'>" + byline.original + "</h5>");
        }

        // Log section, and append to document if exists
        var section = article.section_name;
        console.log(article.section_name);
        if (section) {
            $articleListItem.append("<h5 class='article-info'>Section: " + section + "</h5>");
        }

        // Log published date, and append to document if exists
        var pubDate = article.pub_date;
        console.log(article.pub_date);
        if (pubDate) {
            $articleListItem.append("<h5 class='article-info'>Publish Date: " + article.pub_date.substring(5, 8) + article.pub_date.substring(8, 10) + "-" + article.pub_date.substring(0, 4) + "</h5>");
        }

        // Append and log url
        $articleListItem.append("<a class='link' href='" + article.web_url + "'>" + "Click here to read!" + "</a>");
        console.log(article.web_url);

        // Append the article
        $articleList.append($articleListItem);
    }
}

function goFor() {
    clear();
    var queryURL = buildQueryURL();
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(updatePage);
}

goFor();


// Function to empty out the articles
function clear() {
    $("#article-section").empty();
}

