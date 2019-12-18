$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const artistParam = urlParams.get('search');
  const artist = fixParenthesis(artistParam);

  if (!artist) {
    window.location.assign("404.html")
  }
  setPhoto(artist);
  setName(artist);
  setAbstract(artist);
  setDescription(artist);
  setDateNaissance(artist);
  setInstrument(artist);
  setAssociateArtist(artist);
  setAlbum(artist);
  setTitle(artist);
});


/* -----------  Set functions  -----------  */

// the following functions allow the page to set the different informations of the artist

function setPhoto(artist) {
  var query = [
    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "select distinct ?picture where {",
    "dbr:" + artist + " foaf:depiction ?picture",
    "} LIMIT 100000",
  ].join(" ");

  sparqlQuery(query).then(function (data) {
      if (data.results.bindings.length > 0) {
        document.getElementsByClassName("picture-artist")[0].src = data.results.bindings[0].picture.value;
      } else {
        document.getElementsByClassName("picture-artist")[0].remove();
      }
    }
  );
}

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
      if (data.results.bindings.length > 0) {
        var date = data.results.bindings[0].date.value;
        var place = data.results.bindings[0].placeName.value;
        var int2 = new Intl.DateTimeFormat("en-US", {year: "numeric", month: "long", day: "numeric"});
        date = new Date(date);
        date = int2.format(date);
        document.getElementById("date").innerHTML = date + " " + place;
      }
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
      if (data.results.bindings.length > 0) {
        $.ajax({
            url: 'http://api.dbpedia-spotlight.org/en/annotate',
            data: {text: data.results.bindings[0].abstract.value, confidence: 0.9},
            success: function (data) {
              let abstractWithLink = data.getElementsByTagName("div")[0];
              for (let item of abstractWithLink.getElementsByTagName("a")) {
                item.href = 'https://en.wikipedia.org/wiki/' + getRessourceLink(item.href);
              }
              document.getElementById("abstract").innerHTML = abstractWithLink.innerHTML;
            },
          }
        );
      }
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

    "dbr:" + artist + " dbo:instrument ?instrument.",
    "?instrument foaf:isPrimaryTopicOf ?link.",
    "?instrument rdfs:label ?name.",
    "FILTER(langMatches(lang(?name), \"EN\")).",
    "}",
  ].join(" ");

  sparqlQuery(query).then(function (data) {
    if(data.results.bindings.length==0){
      document.getElementById("instruments-container").remove();
    }else {
      for (var i = 0; i < data.results.bindings.length; i++) {
        var str = "<li> <a href=\"" + data.results.bindings[i].link.value + "\" class=\"list-group-item list-group-item-action\"> " + data.results.bindings[i].name.value + " </a></li>";
        document.getElementById("instruments").innerHTML += str;
      }
    }
  });
}

function setAssociateArtist(artist) {
  var query = [
    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/> ",
    "select distinct ?query ?name",
    "where {",
    "{ ",
    "?query dbo:associatedMusicalArtist dbr:" + artist + ".",
    "?query rdfs:label ?name.",
    "}",
    "UNION",
    "{",
    "dbr:" + artist + " dbo:associatedMusicalArtist ?query.",
    "?query rdfs:label ?name.",
    "}",
    "?query dbo:genre ?genre.",
    "FILTER (langMatches(lang(?name),\"en\") && ?genre = dbr:Jazz).",
    "}",
  ].join(" ");

  sparqlQuery(query).then(function (data) {

    if(data.results.bindings.length==0){
      document.getElementById("container-artistes").remove();
    }else {
      for (var i = 0; i < data.results.bindings.length; i++) {
        var str = "<li> <a href=\artist.html?search=" + getRessourceLink(data.results.bindings[i].query.value) + " class=\"list-group-item list-group-item-action\"> " + data.results.bindings[i].name.value + " </a></li>";
        document.getElementById("artistes").innerHTML += str;
      }
    }
  });

}

function setAlbum(artist) {
  var query = [
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>",
    "select ?name ?album  WHERE{",
    "?album a dbo:Album.",
    "?album rdfs:label ?name.",
    "?album dbo:artist dbr:" + artist + ".",
    "FILTER (langMatches(lang(?name),\"en\")).",
    "}",

  ].join(" ");

  sparqlQuery(query).then(function (data) {
    if(data.results.bindings.length==0){
      document.getElementById("container-albums").remove();
    }else {
      for (var i = 0; i < data.results.bindings.length; i++) {
        var str = "<li> <a href=\album.html?search=" + getRessourceLink(data.results.bindings[i].album.value) + " class=\"list-group-item list-group-item-action\"> " + data.results.bindings[i].name.value + " </a></li>";
        document.getElementById("albums").innerHTML += str;
      }
    }
  });
}

function setTitle(artist) {
  var query = [
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "select ?link ?name  WHERE{",
    "?song rdf:type dbo:Song.",
    "?song dbo:artist dbr:" + artist + ".",
    "?song foaf:name ?name.",
    "?song foaf:isPrimaryTopicOf ?link.",
    "FILTER (langMatches(lang(?name),\"en\")).",
    "}",

  ].join(" ");

  sparqlQuery(query).then(function (data) {

    if(data.results.bindings.length==0){
      document.getElementById("container-titles").remove();
    }else {
      for (var i = 0; i < data.results.bindings.length; i++) {
        var str = "<li> <a href=\"" + data.results.bindings[i].link.value + "\" class=\"list-group-item list-group-item-action\"> " + data.results.bindings[i].name.value + " </a></li>";
        document.getElementById("titles").innerHTML += str;
      }
    }
  });
}


/* -----------  Sparql request  -----------  */

// get data from a sql query
function sparqlQuery(query) {
  return new Promise(function (resolve, reject) {

    let url = "http://dbpedia.org/sparql";
    const queryUrl = url + "?query=" + encodeURIComponent(query) + "&format=json";
    $.ajax({
      dataType: "json",
      url: queryUrl,
      success: function (data) {
        resolve(data);
      },
      error: function (err) {
        reject(err)
      }
    });
  });
}


function getRessourceLink(uri) {
  var a = uri.split("http://dbpedia.org/resource/");
  if (a.length === 2) {
    return a[1];
  }
}

function fixParenthesis(strToFix) {

  var fixed = strToFix.replace(/[ !@#$%^&*()+=\-[\]\\';,./{}|":<>?~_]/g, "\\$&");
  fixed = fixed.replace(" ", "+");
  return fixed;
}

