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
  return new Promise(function (resolve, reject) {
    var query = [
      "PREFIX dbo: <http://dbpedia.org/ontology/>",
      "PREFIX dbr: <http://dbpedia.org/resource/>",
      "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",

      "select distinct ?name where {",
      "dbr:"+subGenre+" foaf:name ?name.",
      "FILTER(langMatches(lang(?name), \"EN\")).\n",
      "}",
    ].join(" ");
    var url = "http://dbpedia.org/sparql";
    const queryUrl = url + "?query=" + encodeURIComponent(query) + "&format=json";
    $.ajax({
      dataType: "json",
      url: queryUrl,
      success: function (data) {
        //console.log(data);
        console.log(data.results);
        console.log(data.results.bindings[0].name.value);
        showName(data.results.bindings[0].name.value);
      },
      error: function (err) {
        reject(err)
      }
    });
  });
}

function showName(name){
  document.getElementById("name").innerHTML = name;

}
