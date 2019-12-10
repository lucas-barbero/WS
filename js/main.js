$(document).ready(function () {
  $(function () {
    $(".dropdown-menu a").click(function () {
      console.log('oooo')
      $(".dropdown-toggle").text($(this).text());
      $(".dropdown-toggle").val($(this).text());
    });

  });

  let subGenre;
  var query = [
    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",

    "select distinct ?name where {",

    "dbr:Jazz dbo:musicSubgenre ?query.",
    "?query foaf:name ?name.",


    "} LIMIT 100000",
  ].join(" ");

  sparqlQuery(query).then(function (data) {
      subGenre = data.results.bindings.map(x => x.name.value); // TODO a voir si on get pas directement uri + nom pour pas avoir a faire deux requetes aiu moment du search + keylistener + genre l'autocompletion en fonction du type de recherche
      console.log(subGenre);
      initAutoComplete(subGenre)
    }
  );
});


function sparqlQuery(query) {
  return new Promise(function (resolve, reject) {

    var url = "http://dbpedia.org/sparql";
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

function initAutoComplete(data) {
  $('input').typeahead({

    source: data,
    // how many items to display
    items: 5,

    // equalize the dropdown width
    alignWidth: true,

    // typeahead dropdown template
    menu: '<ul class="typeahead dropdown-menu"></ul>',
    item: '<li><a href="#"></a></li>',
    // auto select
    autoSelect: true,

    // callback
    onSelect: function () {
      console.log("coucou")
    },

  });
}
