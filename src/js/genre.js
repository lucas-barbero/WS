$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const artist = urlParams.get('search');
  console.log(artist);

  if (!artist) {
    window.location.assign("404.html")
  }

  setName(artist);
  setAbstract(artist);
  setOrigin(artist);
  setDate(artist);
  setDerives(artist);
  setSubGenre(artist);
  setInstrument(artist);
  setArtist(artist);
});


/* -----------  Set functions  -----------  */

// the following functions allow the page to set the different informations of the subgenre

function setName(artist) {
  var query = [
    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",
    "select ?name WHERE{",
    "dbr" + artist + " foaf:name ?name.",
    "}"
  ].join(" ");

  sparqlQuery(query).then(function (data) {
      //console.log(data);
      document.getElementById("name").innerHTML = data.results.bindings[0].name.value;
    }
  );
}

function setDerives(subGenre) {
  var query = [
    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",

    "select distinct ?name ?genreDerives WHERE{\n",
    "dbr:" + subGenre + " dbo:derivative ?genreDerives.",
    "?genreDerives foaf:name ?name\n",
    "FILTER(langMatches(lang(?name), \"EN\")).\n",
    "}",
  ].join(" ");

  sparqlQuery(query).then(function (data) {
      //console.log(data);
      var virgule = false;
      data.results.bindings.forEach(element => {
          if (virgule) {
            document.getElementById("derives").innerHTML += ", ";
          }
          virgule = true;
          document.getElementById("derives").innerHTML += "<a href=\"genre.html?search=" + getRessourceLink(element.genreDerives.value) + "\">" + element.name.value + "</a>"
        }
      );
    }
  );
}

function setSubGenre(subGenre) {
  var query = [
    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",

    "select distinct ?name ?subGenre WHERE{\n",
    "dbr:" + subGenre + " dbo:musicSubgenre ?subGenre.",
    "?subGenre foaf:name ?name\n",
    "FILTER(langMatches(lang(?name), \"EN\")).\n",
    "}",
  ].join(" ");

  sparqlQuery(query).then(function (data) {
      //console.log(data);
      var virgule = false;
      data.results.bindings.forEach(element => {
          if (virgule) {
            document.getElementById("sub-genre").innerHTML += ", ";
          }
          virgule = true;
          document.getElementById("sub-genre").innerHTML += "<a href=\"genre.html?search=" + getRessourceLink(element.subGenre.value) + "\">" + element.name.value + "</a>"
        }
      );
    }
  );
}

function setOrigin(subGenre) {
  var query = [

    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",

    "select distinct ?origine ?name WHERE{",
    "  dbr:" + subGenre + " dbo:stylisticOrigin ?origine.",
    "  ?origine foaf:name ?name.",
    "FILTER(langMatches(lang(?name), \"EN\")).\n",
    "}",

  ].join(" ");

  sparqlQuery(query).then(function (data) {
      //console.log(data);
      var virgule = false;
      data.results.bindings.forEach(element => {
          if (virgule) {
            document.getElementById("origine").innerHTML += ", ";
          }
          virgule = true;
          document.getElementById("origine").innerHTML += "<a href=\"genre.html?search=" + getRessourceLink(element.origine.value) + "\" \>" + element.name.value + "</a>"
        }
      );
    }
  );
}


function setDate(subGenre) {
  var query = [

    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",

    "select distinct ?date  WHERE{",
    "  dbr:" + subGenre + " dbp:culturalOrigins ?date.",
    "}",

  ].join(" ");

  sparqlQuery(query).then(function (data) {
      //console.log(data);
      var date = data.results.bindings[0].date.value;
      date = Math.floor(date);
      if (date < 0) {
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
    "  dbr:" + subGenre + " dbo:abstract ?abstract	.",
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
    "dbr:" + subGenre + " dbo:instrument ?instrument.",
    "?instrument dbp:name ?name.\n",
    "?instrument foaf:isPrimaryTopicOf ?link.\n",
    "}"
  ].join(" ");

  sparqlQuery(query).then(function (data) {
    //console.log(data);
    for (var i = 0; i < data.results.bindings.length; i++) {
      var str = "<li> <a href=\"" + data.results.bindings[i].link.value + "\" class=\"list-group-item list-group-item-action\"> " + data.results.bindings[i].name.value + " </a></li>";
      document.getElementById("instruments").innerHTML += str;
    }
  });
}

function setArtist(subGenre) {
  var query = [
    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",

    "select distinct ?link ?name where {\n",
    "?a dbo:genre dbr:" + subGenre + ".",
    "?a dbo:artist ?link.\n",
    "?link foaf:name ?name\n",
    "}"
  ].join(" ");

  sparqlQuery(query).then(function (data) {
    console.log(data);
    for (var i = 0; i < data.results.bindings.length; i++) {
      var str = "<li> <a href=\"artiste.html?search=" + getRessourceLink(data.results.bindings[i].link.value) + "\" class=\"list-group-item list-group-item-action\"> " + data.results.bindings[i].name.value + " </a></li>";
      document.getElementById("artists").innerHTML += str;
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

