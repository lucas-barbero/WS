$(document).ready(function () {
  const lookup = {"Genre": "MusicGenre", "Artist": "MusicalArtist", "Title": "Song", "Album": "Album"};

  $("#submit").click(function () {
    let searchType = $(".dropdown-toggle").val();
    let request = $('input').val();
    if (request) {
      $.ajax({
        url: "http://lookup.dbpedia.org/api/search/KeywordSearch",
        dataType: "json",
        data: {
          QueryClass: lookup[searchType],
          MaxHits: 1,
          QueryString: request
        },
        headers: {
          Accept: "application/json"
        },
        method: "get",
        success: function (data) {
          if (data.results.length > 0) {
            const uri = data.results[0].uri;
            const search = uri.substring(uri.lastIndexOf("/") + 1);
            const queryString = "?search=" + encodeURIComponent(search); // TODO parse fin de l'uri
            window.location.href = searchType.toLowerCase() + ".html" + queryString;
          } else {
            alert("aucune ressource trouvée dsl");
          }
        }
      });
    }
  });


  $(function () {
    $(".dropdown-menu a").click(function () {
      let dropdown = $(".dropdown-toggle");
      dropdown.text($(this).text());
      dropdown.val($(this).text());
    });

  });

  let subGenre;
  let query = [
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

function searchButton() {

}
