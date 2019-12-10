$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const subGenre = urlParams.get('search');
  console.log(subGenre);

  if(!subGenre){
    // TODO PAGE INVALIDE signaler une erreur et faire un lien pour rediriger vers la page principale

  }

  var query = [
    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",

    "select distinct ?name where {",

    "dbr:Jazz dbo:musicSubgenre ?query.",
    "dbr:"+subGenre+" foaf:name ?name.",


    "} LIMIT 100000",
  ].join(" ");


});
