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

    "select distinct ?name ?query where {",
    "dbr:Jazz dbo:musicSubgenre ?query.",
    "?query foaf:name ?name.",
    "} LIMIT 100000",
  ].join(" ");

  sparqlQuery(query).then(function (data) {
      console.log(data);

      subGenre = data.results.bindings.map(x => {
        return {name: x.name.value, value: x.query.value};
      });
      console.log(subGenre);
      initAutoComplete(subGenre)
    }
  );
});

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

  });
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
