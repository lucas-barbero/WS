$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const artist = urlParams.get('search');

  if (!artist) {
    window.location.assign("404.html")
  }

  setName(artist);
  setAbstract(artist);
  setDescription(artist);
  setDateNaissance(artist);
  setInstrument(artist);
});


/* -----------  Set functions  -----------  */

// the following functions allow the page to set the different informations of the artist

function setName(artist) {
  var query = [
    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",

    "select ?name where {",
    "dbr:" + artist + " foaf:name ?name.",
    "FILTER(langMatches(lang(?name), \"EN\")).\n",
    "}",
  ].join(" ");

  sparqlQuery(query).then(function (data) {
      document.getElementById("name").innerHTML = data.results.bindings[0].name.value;
    }
  );
}


function setDateNaissance(artist) {
  var query = [
    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "select distinct ?date ?placeName where {",
    "dbr:" + artist + " dbo:birthDate ?date.",
    "dbr:Herbie_Hancock dbo:birthPlace ?place.",
    "?place foaf:name ?placeName.",
    "}",
    "LIMIT 1"
  ].join(" ");

  sparqlQuery(query).then(function (data) {
      console.log(data)
      var date = data.results.bindings[0].date.value;
      var place = data.results.bindings[0].placeName.value;
      var int2 = new Intl.DateTimeFormat("en-US", {year: "numeric", month: "long", day: "numeric"});
      date = new Date(date);
      date = int2.format(date);
      document.getElementById("date").innerHTML = date + " " + place;
    }
  );
}

function setAbstract(artist) {
  var query = [

    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",
    "select ?abstract WHERE{",

    "dbr:" + artist + " dbo:abstract ?abstract.",
    "FILTER(langMatches(lang(?abstract),\"en\")).",
    "}"
  ].join(" ");

  sparqlQuery(query).then(function (data) {
      //console.log(data);
      document.getElementById("abstract").innerHTML = data.results.bindings[0].abstract.value;
    }
  );
}

function setDescription(artist) {
  var query = [

    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX dct: <http://purl.org/dc/terms/>",
    "select ?description WHERE{",

    "dbr:" + artist + " dct:description ?description.",
    "FILTER(langMatches(lang(?description), \"EN\")).",
    "}"
  ].join(" ");

  sparqlQuery(query).then(function (data) {
      console.log(data);
      document.getElementById("description").innerText = data.results.bindings[0].description.value;
    }
  );
}

function setInstrument(artist) {
  var query = [
    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>",
    "select ?name ?link WHERE{",

    "dbr:" +artist + " dbo:instrument ?instrument.",
    "?instrument foaf:isPrimaryTopicOf ?link.",
    "?instrument rdfs:label ?name.",
    "FILTER(langMatches(lang(?name), \"EN\")).",
    "}",
  ].join(" ");

  sparqlQuery(query).then(function (data) {
    console.log(data)
    for (var i = 0; i < data.results.bindings.length; i++) {
      var str = "<li> <a href=\"" + data.results.bindings[i].link.value + "\" class=\"list-group-item list-group-item-action\"> " + data.results.bindings[i].name.value + " </a></li>";
      document.getElementById("instruments").innerHTML += str;
    }
  });
}


/* -----------  Sparql request  -----------  */

// get data from a sql query
function sparqlQuery(query) {
  return new Promise(function (resolve, reject) {

    let url = "http://dbpedia.org/sparql";
    const queryUrl = url + "?query=" + encodeURIComponent(query) + "&format=json";
    //console.log(queryUrl);
    $.ajax({
      dataType: "json",
      url: queryUrl,
      success: function (data) {
        console.log("The sparql request was succesfull");
        resolve(data);
      },
      error: function (err) {
        console.log("Error with the sparql request.");
        reject(err)
      }
    });
  });
}


function getRessourceLink(uri) {
  var a = uri.split("http://dbpedia.org/resource/");
  console.log(a);
  if (a.length == 2) {
    return a[1];
  }
}

