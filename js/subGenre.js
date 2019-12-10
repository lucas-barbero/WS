$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const subGenre = urlParams.get('search');
  console.log(subGenre);

  if(!subGenre){
    // TODO PAGE INVALIDE signaler une erreur et faire un lien pour rediriger vers la page principale

  }
  getName(subGenre);



});

function getName(subGenre) {
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
    var data = sparqlQuery(query);

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

