var autoCompleteResult;

var querySubGenre = [
  "PREFIX dbo: <http://dbpedia.org/ontology/>",
  "PREFIX dbr: <http://dbpedia.org/resource/>",
  "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",

  "select distinct ?name ?query where {",
  "dbr:Jazz dbo:musicSubgenre ?query.",
  "?query foaf:name ?name.",
  "}",
].join(" ");

var queryArtists = [
  "PREFIX dbo: <http://dbpedia.org/ontology/>",
  "PREFIX dbr: <http://dbpedia.org/resource/>",

  "select distinct ?name ?query where {",
  "{",
  "?query dbo:genre dbr:Jazz.",
  "}",
  "UNION",
  "{",
  "?query dbo:genre ?sub.",
  "dbr:Jazz dbo:musicSubgenre ?sub.",
  "}",
  "?a dbo:artist ?query.",
  "?query foaf:name ?name.",

  "}"


].join(" ");

var queryAlbums = [
  "PREFIX dbo: <http://dbpedia.org/ontology/>",
  "PREFIX dbr: <http://dbpedia.org/resource/>",
  "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",

  "select distinct ?query ?name where {",
  "?query rdf:type dbo:Album.",
  "?query rdfs:label ?name",
  "{",
  "?query dbo:genre ?sub.",
  "dbr:Jazz dbo:musicSubgenre ?sub.",
  "}",
  "UNION",
  "{",
  "?query dbo:genre dbr:Jazz.",
  "}",
  "FILTER(langMatches(lang(?name), \"EN\")).",
  "}",

].join(" ");

var subGenre = sparqlQuery(querySubGenre).then(function (data) {
    subGenre = data.results.bindings.map(x => x.name.value
    );
    autoCompleteResult = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: subGenre
    });
    autoCompleteResult.initialize();
    initAutoComplete();
  }
);

var artists;
sparqlQuery(queryArtists).then(function (data) {
    artists = data.results.bindings.map(x => x.name.value);
  }
);

var albums;
sparqlQuery(queryAlbums).then(function (data) {
    albums = data.results.bindings.map(x => x.name.value);
  }
);


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
      $(".dropdown-toggle").text($(this).text());
      $(".dropdown-toggle").val($(this).text());
      var toChose;
      switch($(this).text()){
        case "Artist":
          toChose = artists;
          break;

        case "Album":
          toChose = albums;
          break;

        case "Genre":
          toChose = subGenre;
          break;
      }
      autoCompleteResult.clear();
      autoCompleteResult.local = toChose;
      autoCompleteResult.initialize(true);
    });

  });

});

function initAutoComplete() {
  $('input').typeahead({

    source: autoCompleteResult.ttAdapter(),

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
