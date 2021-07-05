

const key = "c0e683fd";
const baseURL = "http://www.omdbapi.com";
var page = 1;
var search = "";
var year = "";
var result = "";
var advanceWord = "";
var advanceSearch = false;
var markItemId = [];


function onSearchButton(advanceSearch) {
    resetSearchValues();
    this.advanceSearch = advanceSearch;
    if (advanceSearch) advanceWord = document.getElementById("advanceInput").value;
    search = document.getElementById("searchBar").value;
    year = document.getElementById("year").value;
    if (search == "") search = "new";

    getAndPrintPageInfo();

}

function markAdvanceSearcgResult() {
    result['Search'].map(obj => {
        if (obj['Title'].toLowerCase().includes(advanceWord.toLowerCase())) markItemId.push(obj['imdbID'])

    });
}


function getAndPrintPageInfo() {
    var url = "";
    if (year == "") url = `${baseURL}/?apikey=${key}&s=${search}&page=${page}`;
    else url = `${baseURL}/?apikey=${key}&s=${search}&y=${year}&page=${page}`;

    $.ajax(
        {
            type: 'GET',
            datatype: 'json',
            url: url,
            success: function (data) {
                printWebPage(data)
            },
            error: function (error) {
                console.log("error : ", error);
            }
        }
    );
}

function printWebPage(result) {
    if (result == null) { console.log("ERROR!"); return; }
    this.result = result;
    var pages = result["totalResults"] / 10;

    if (pages > Math.floor(pages))
        pages = Math.floor(pages) + 1;

    printPageButtons(pages, page);
    printPageMovieCards(result['Search']);
}

function printPageButtons(numOfButtons, chosenButtonIndex) {
    var maxButtonField = 12;
    var firstButton = 1;

    if (numOfButtons > maxButtonField) {
        var privousButtonsCapacity = 5;
        if (chosenButtonIndex - privousButtonsCapacity > firstButton) {
            var nextButtonsCapacity = 6;

            if (chosenButtonIndex + nextButtonsCapacity > numOfButtons)
                firstButton = numOfButtons - maxButtonField;
            else
                firstButton = chosenButtonIndex - privousButtonsCapacity;
        }
    }

    else if (numOfButtons < maxButtonField) maxButtonField = numOfButtons;

    var str = `<div class="row">`;

    for (var i = firstButton; i < maxButtonField + firstButton; i++) {
        str += `
        <div class="col-1">
            <button id="page${i}" type="button" class="btn btn-primary w-100 d-flex justify-content-center" onclick="changePage(${i})">${i}</button>
        </div>
        `;
    }

    str += `</div>`;

    document.getElementById("buttonsArea").innerHTML = str;
    highlightCurrentButton(page);
}
function printPageMovieCards(result) {
    if (advanceSearch && advanceWord != "") markAdvanceSearcgResult();
    var str = "";
    var mark = "";

    for (var i = 0; i < result.length; i++) {
        mark = "";
        markItemId.length > 0 ? markItemId.map(obj => { if (obj == result[i]['imdbID']) mark = "bg-warning"; }) : null;


        str += `                   
            <div class="col-3 mt-2" onclick="gotoMovieDetails('${result[i]['imdbID']}')">
                <img src=${result[i]['Poster']} class="card-img-top" alt="...">
                <div class="card w-100">
                    <div class="card-body ${mark}">
                        <h5 class="card-title text-danger">${result[i]['Title']}</h5>                    
                        <h5 class="card-title">type: ${result[i]['Type']}</h5>
                        <h5 class="card-title">year: ${result[i]['Year']}</h5>
                    </div>
                </div>
            </div>                   
            `;
    }

    document.getElementById("cardsArea").innerHTML = str;

}

function highlightCurrentButton(buttonIndex) {
    var buttonElement = document.getElementById("page" + buttonIndex);
    buttonElement.classList.remove("btn-primary");
    buttonElement.classList.add("btn-danger");
}

function changePage(page) {
    this.page = page;
    getAndPrintPageInfo();
}

function gotoMovieDetails(movieID) {
    var url = `${baseURL}/?apikey=${key}&i=${movieID}`;



    $.ajax(
        {
            type: 'GET',
            datatype: 'json',
            url: url,
            success: function (data) {
                localStorage.movieDetails = JSON.stringify(data);
                window.location.href = 'MoviesApiDetails.html';
            },
            error: function (error) {
                console.log("error : ", error);
            }
        }
    );
}

function resetSearchValues() {
    page = 1;
    search = "";
    year = "";
    result = "";
    advanceWord = "";
    advanceSearch = false;
    markItemId = [];
}

