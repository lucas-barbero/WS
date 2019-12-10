$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const subGenre = urlParams.get('search');
  console.log(subGenre);

  if(!subGenre){
    window.location.assign("404.html")
  }
  setName(subGenre);
  setOrigine(subGenre);


});

function setName(subGenre) {
  var query = [
    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",

    "select distinct ?name where {",
    "dbr:"+subGenre+" foaf:name ?name.",
    "FILTER(langMatches(lang(?name), \"EN\")).\n",
    "}",
  ].join(" ");

  sparqlQuery(query).then(function (data) {
      console.log(data);
      document.getElementById("name").innerHTML = data.results.bindings[0].name.value;
    }
  );
}

function setOrigine(subGenre) {
  var query = [

    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",

    "select distinct ?origine ?name WHERE{",
    "  dbr:"+subGenre+" dbo:stylisticOrigin ?origine.",
    "  ?origine foaf:name ?name.",
    "FILTER(langMatches(lang(?name), \"EN\")).\n",
    "}",

  ].join(" ");

  sparqlQuery(query).then(function (data) {
      console.log(data);
      data.results.bindings.forEach(element =>
        document.getElementById("origine").append(element.name.value)
      );

    }
  );
}

function sparqlQuery(query) {
  return new Promise(function (resolve, reject) {

    let url = "http://dbpedia.org/sparql";
    const queryUrl = url + "?query=" + encodeURIComponent(query) + "&format=json";
    console.log(queryUrl);
    $.ajax({
      dataType: "json",
      url: queryUrl,
      success: function (data) {
        console.log("success");
        resolve(data);
      },
      error: function (err) {
        reject(err)
      }
    });
  });
}

