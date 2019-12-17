$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const subGenre = urlParams.get('search');

  if (!subGenre) {
    window.location.assign("404.html")
  }

  verifJazzSubGenre(subGenre).then(function (isJazzSubgenre) {
    if (!isJazzSubgenre) {
      window.location.assign("404.html")
    }
  });

  setName(subGenre);
  setAbstract(subGenre);
  setOrigin(subGenre);
  setDate(subGenre);
  setDerives(subGenre);
  setSubGenre(subGenre);
  setInstrument(subGenre);
  setArtist(subGenre);
});


/* -----------  Set functions  -----------  */

// the following functions allow the page to set the different informations of the subgenre

function verifJazzSubGenre(subGenre) {
  return new Promise(function (resolve) {
    var query = [
      "PREFIX dbo: <http://dbpedia.org/ontology/>",
      "PREFIX dbr: <http://dbpedia.org/resource/>",
      "PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n",

      "select distinct ?relation where {\n",
      "dbr:Jazz ?relation dbr:" + subGenre + "\n.",
      "}",
    ].join(" ");

    let isJazzSubGenre = false;

    sparqlQuery(query).then(function (data) {
        data.results.bindings.forEach(element => {
          if (element.relation.value == "http://dbpedia.org/ontology/musicSubgenre") {
            isJazzSubGenre = true;
            resolve(true);
          }
        })
        resolve(false);

      }
    );
   })
}

function setName(subGenre) {
  var query = [
    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",

    "select distinct ?name where {",
    "dbr:"+subGenre + " foaf:name ?name.",
    "FILTER(langMatches(lang(?name), \"EN\")).\n",
    "}",
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

    "select distinct ?name ?genreDerives ?wikiLink WHERE{\n",
    "dbr:"+subGenre+" dbo:derivative ?genreDerives.",
    "?genreDerives foaf:name ?name.\n",
    "?genreDerives foaf:isPrimaryTopicOf ?wikiLink.\n",
    "FILTER(langMatches(lang(?name), \"EN\")).\n",
    "}",
  ].join(" ");

  sparqlQuery(query).then(function (data) {
      var virgule = false;
      if(data.results.bindings.length==0){
        console.log("pas de derives")
        //document.getElementById("sub-genre-div").innerHTML = "";
        document.getElementById("derives-div").remove();

      }else {
        data.results.bindings.forEach(element => {


            // get the resource in the uri
            let resource = getResourceFromLink(element.genreDerives.value);
            verifJazzSubGenre(resource).then(function (isJazzSubgenre) {
              if (virgule) {
                document.getElementById("derives").innerHTML += ", ";
              }
              virgule = true;
              if (isJazzSubgenre) {
                document.getElementById("derives").innerHTML += "<a href=\"genre.html?search=" + getResourceFromLink(element.genreDerives.value) + "\">" + element.name.value + "</a>"
              } else {
                document.getElementById("derives").innerHTML += "<a href=\"" + element.wikiLink.value + "\">" + element.name.value + "</a>"
              }
            });
          }
        );
      }
    }
  );
}

function setSubGenre(subGenre) {
  var query = [
    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",

    "select distinct ?name ?subGenre ?wikiLink WHERE{\n",
    "dbr:"+subGenre+" dbo:musicSubgenre ?subGenre.",
    "?subGenre foaf:name ?name.\n",
    "?subGenre foaf:isPrimaryTopicOf ?wikiLink.\n",

    "FILTER(langMatches(lang(?name), \"EN\")).\n",
    "}",
  ].join(" ");

  sparqlQuery(query).then(function (data) {
      var virgule = false;
      console.log(data)
      if(data.results.bindings.length==0){
        console.log("pas de subgenre")
        //document.getElementById("sub-genre-div").innerHTML = "";
        document.getElementById("sub-genre-div").remove();

      }else {
        data.results.bindings.forEach(element => {


            // get the resource in the uri
            let resource = getResourceFromLink(element.subGenre.value);
            verifJazzSubGenre(resource).then(function (isJazzSubgenre) {
              if (virgule) {
                document.getElementById("sub-genre").innerHTML += ", ";
              }
              virgule = true;
              if (isJazzSubgenre) {
                document.getElementById("sub-genre").innerHTML += "<a href=\"genre.html?search=" + getResourceFromLink(element.subGenre.value) + "\">" + element.name.value + "</a>"
              } else {
                document.getElementById("sub-genre").innerHTML += "<a href=\"" + element.wikiLink.value + "\">" + element.name.value + "</a>"
              }
            });
          }
        );
      }
    }
  );

}

function setOrigin(subGenre) {
  var query = [

    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",

    "select distinct ?origine ?name ?wikiLink WHERE{",
    "  dbr:" + subGenre + " dbo:stylisticOrigin ?origine.",
    "  ?origine foaf:name ?name.",
    "?origine foaf:isPrimaryTopicOf ?wikiLink.\n",

    "FILTER(langMatches(lang(?name), \"EN\")).\n",
    "}",

  ].join(" ");

  sparqlQuery(query).then(function (data) {
      var virgule = false;
      if(data.results.bindings.length==0){
        console.log("pas d'origine")
        document.getElementById("origine-div").remove();

      }else {
        data.results.bindings.forEach(element => {


            // get the resource in the uri
            let resource = getResourceFromLink(element.origine.value);
            verifJazzSubGenre(resource).then(function (isJazzSubgenre) {
              if (virgule) {
                document.getElementById("origine").innerHTML += ", ";
              }
              virgule = true;
              if (isJazzSubgenre) {
                document.getElementById("origine").innerHTML += "<a href=\"genre.html?search=" + getResourceFromLink(element.origine.value) + "\">" + element.name.value + "</a>"
              } else {
                document.getElementById("origine").innerHTML += "<a href=\"" + element.wikiLink.value + "\">" + element.name.value + "</a>"
              }
            });
          }
        );
      }
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
    if (data.results.bindings.length > 0) {
      $.ajax({
          url: 'http://api.dbpedia-spotlight.org/en/annotate',
          data: {text: data.results.bindings[0].abstract.value, confidence: 0.9},
          success: function (data) {
            let abstractWithLink = data.getElementsByTagName("div")[0];
            for (let item of abstractWithLink.getElementsByTagName("a")) {
              item.href = 'https://en.wikipedia.org/wiki/' + getResourceFromLink(item.href);
            }
            document.getElementById("abstract").innerHTML = abstractWithLink.innerHTML;
          },
        }
      );
    }
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
    if(data.results.bindings.length==0){
      console.log("pas d'instruments")
      //document.getElementById("sub-genre-div").innerHTML = "";
      document.getElementById("instruments-div").remove();

    }else {
      for (var i = 0; i < data.results.bindings.length; i++) {
        var str = "<li> <a href=\"" + data.results.bindings[i].link.value + "\" class=\"list-group-item list-group-item-action\"> " + data.results.bindings[i].name.value + " </a></li>";
        document.getElementById("instruments").innerHTML += str;
      }
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
    //console.log(data);
    if(data.results.bindings.length==0){
      console.log("pas d'artistes'")
      //document.getElementById("sub-genre-div").innerHTML = "";
      document.getElementById("artistes-div").remove();

    }else {
      for (var i = 0; i < data.results.bindings.length; i++) {
        var str = "<li> <a href=\"artist.html?search=" + getResourceFromLink(data.results.bindings[i].link.value) + "\" class=\"list-group-item list-group-item-action\"> " + data.results.bindings[i].name.value + " </a></li>";
        document.getElementById("artists").innerHTML += str;
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



function getResourceFromLink(uri) {
  var a = uri.split("http://dbpedia.org/resource/");
  if(a.length == 2){
    return a[1];
  }
}

