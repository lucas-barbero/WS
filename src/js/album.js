$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const album = urlParams.get('search');
  console.log(album);

  if (!subGenre) {
    window.location.assign("404.html")
  }

  setName(album);
  setAbstract(album);
  setDate(album);
  setGenre(album);
  setArtist(subGenre);
});


/* -----------  Set functions  -----------  */
// the following functions allow the page to set the different informations of the subgenre

function setName(album) {
  var query = [
    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",


    "select distinct ?query ?name where {",
      "?query rdf:type dbo:Album.",
      "?query foaf:name ?name",
      "{",
      "?query dbo:genre ?sub.",
      "dbr:Jazz dbo:musicSubgenre ?sub.",
      "}",
      "UNION",
      "{",
      "?query dbo:genre dbr:Jazz.",
      "}",
      "} LIMIT 10000000",
  ].join(" ");

  sparqlQuery(query).then(function (data) {
      //console.log(data);
      document.getElementById("name").innerHTML = data.results.bindings[0].name.value;
    }
  );
}

function setGenre(album) {
  var query = [
    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",

    "select distinct ?name ?subGenre WHERE{\n",
    "dbr:"+album+" dbo:musicSubgenre ?subGenre.",
    "?subGenre foaf:name ?name\n",
    "FILTER(langMatches(lang(?name), \"EN\")).\n",
    "}",
  ].join(" ");

  sparqlQuery(query).then(function (data) {
      //console.log(data);
      document.getElementById("sub-genre").innerHTML = "<ul>";
      data.results.bindings.forEach(element =>
        document.getElementById("sub-genre").innerHTML += "<li>"+element.name.value+"</li>"
      );
      document.getElementById("sub-genre").innerHTML +="</ul>";
    }
  );
}

function setDate(subGenre) {
  var query = [

    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",

    "select distinct ?date  WHERE{",
    "  dbr:"+subGenre+" dbp:culturalOrigins ?date.",
    "}",

  ].join(" ");

  sparqlQuery(query).then(function (data) {
      //console.log(data);
      var date = data.results.bindings[0].date.value;
      date = Math.floor(date);
      if(date < 0){
        date = -date;
      }
      document.getElementById("date").innerHTML = date;
    }
  );
}

function setAbstract(subGenre) {
  var query = [
    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",

    "select distinct ?abstract WHERE{",
    "  dbr:"+subGenre+" dbo:abstract ?abstract	.",
    "  FILTER(langMatches(lang(?abstract), \"EN\")).",
    "}"
  ].join(" ");

  sparqlQuery(query).then(function (data) {
      //console.log(data);
      document.getElementById("abstract").innerHTML = data.results.bindings[0].abstract.value;
    }
  );
}

function setInstrument(subGenre) {
  var query = [
    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",

    "select distinct ?name ?link WHERE{\n",
    "dbr:"+subGenre+" dbo:instrument ?instrument.",
    "?instrument dbp:name ?name.\n",
    "?instrument foaf:isPrimaryTopicOf ?link.\n",
    "}"
  ].join(" ");

  sparqlQuery(query).then(function (data) {
    //console.log(data);
    for (var i = 0; i < data.results.bindings.length ; i++) {
      var str = "<li> <a href=\""+ data.results.bindings[i].link.value +"\" class=\"list-group-item list-group-item-action\"> " + data.results.bindings[i].name.value + " </a></li>";
      document.getElementById("instruments").innerHTML +=str;
    }
  });
}

function setArtist(subGenre) {
  var query = [
    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",

    "select distinct ?link ?name where {\n",
    "?a dbo:genre dbr:"+subGenre+".",
    "?a dbo:artist ?link.\n",
    "?link foaf:name ?name\n",
    "}"
  ].join(" ");

  sparqlQuery(query).then(function (data) {
    console.log(data);
    for (var i = 0; i < data.results.bindings.length ; i++) {
      var str = "<li> <a href=\"artiste.html?search="+ getRessourceLink(data.results.bindings[i].link.value) +"\" class=\"list-group-item list-group-item-action\"> " + data.results.bindings[i].name.value + " </a></li>";
      document.getElementById("artists").innerHTML +=str;
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
  if(a.length == 2){
    return a[1];
  }
}

