let autoCompleteResult;

const querySubGenre = [
  "PREFIX dbo: <http://dbpedia.org/ontology/>",
  "PREFIX dbr: <http://dbpedia.org/resource/>",
  "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",

  "select distinct ?name ?query where {",
  "dbr:Jazz dbo:musicSubgenre ?query.",
  "?query foaf:name ?name.",
  "}",
].join(" ");

const queryArtists = [
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

const queryAlbums = [
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

let autocompleteData = [];

initAutoComplete();


let subGenre = sparqlQuery(querySubGenre).then(function (data) {
    subGenre = data.results.bindings.map(x => {
      return {name: x.name.value, value: x.query.value, type: "genre"}
    });

    autocompleteData = autocompleteData.concat(subGenre);
    refreshAutocomplete(autocompleteData);
  }
);

let artists;
sparqlQuery(queryArtists).then(function (data) {
    artists = data.results.bindings.map(x => {
      return {name: x.name.value, value: x.query.value, type: "artist"}
    });
    autocompleteData = autocompleteData.concat(artists);
    refreshAutocomplete(autocompleteData);


  }
);

let albums;
sparqlQuery(queryAlbums).then(function (data) {
    albums = data.results.bindings.map(x => {
      return {name: x.name.value, value: x.query.value, type: "album"}
    });
    autocompleteData = autocompleteData.concat(albums);
    refreshAutocomplete(autocompleteData);


  }
);


$(document).ready(function () {

  $("#submit").click(doSearch);
  $(document).keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
      doSearch();
    }
  });
  $(function () {
    $(".dropdown-menu a").click(function () {
      $(".dropdown-toggle").text($(this).text());
      $(".dropdown-toggle").val($(this).text());
      var toChose;
      switch ($(this).text()) {
        case "All":
          toChose = autocompleteData;
          break;
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

  autoCompleteResult = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: autocompleteData
  });
  autoCompleteResult.initialize();

  $('input').typeahead({

    source: autoCompleteResult.ttAdapter(),


    // how many items to display
    items: 5,

    // equalize the dropdown width
    alignWidth: true,

    // typeahead dropdown template
    menu: '<ul class="typeahead dropdown-menu"></ul>',
    item: '<li class="dropdown-item"><a class="dropdown-item" href="#" role="option"></a></li>',

    // auto select
    autoSelect: true,

  });
}

function refreshAutocomplete(data) {
  autoCompleteResult.clear();
  autoCompleteResult.local = data;
  autoCompleteResult.initialize(true);
}

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

function doSearch() {
  const searchbar = $('input');
  let request;
  let search;
  if (searchbar.typeahead("getActive").name.toLowerCase() === searchbar.val().toLowerCase()) {
    request = searchbar.typeahead("getActive");
    let searchType = request.type;
    const uri = request.value;
    search = uri.substring(uri.lastIndexOf("/") + 1);
    const queryString = "?search=" + encodeURIComponent(search);
    window.location.href = searchType.toLowerCase() + ".html" + queryString;
  } else {
    //window.location.assign("404.html")
    $('#noResults').modal('show');
  }


}
