$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const albumParam = urlParams.get('search');
  const album = fixParenthesis(albumParam);
  console.log(album);

  if (!album) {
    window.location.assign("404.html")
  }

  setName(album);
  setArtist(album);
  setYear(album);
  setAbstract(album);
  setCover(album);
  setLabel(album);
  setPreviousWork(album);
  setSubsequentWork(album);
  setGenre(album);
});


/* -----------  Set functions  -----------  */

// the following functions allow the page to set the different informations of the subgenre

function setName(album) {
  var query = [
    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",

    "select distinct ?name where {",
    "dbr:" + album + " foaf:name ?name.",
    "FILTER(langMatches(lang(?name), \"EN\")).\n",
    "}",
  ].join(" ");

  sparqlQuery(query).then(function (data) {
      var artistLink = data.results.bindings[0].name.value;
      var parsedLink = artistLink.split('resource/');
      var artistName = parsedLink[parsedLink.length - 1];

      document.getElementById("name").innerHTML = artistName;
    }
  );
}

function setGenre(album) {
  var query = [
    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",

    "select distinct ?name ?genre WHERE{\n",
    "dbr:" + album + " dbo:genre ?genre.",
    "?genre foaf:name ?name\n",
    "FILTER(langMatches(lang(?name), \"EN\")).\n",
    "}",
  ].join(" ");

  sparqlQuery(query).then(function (data) {
      //console.log(data);
      document.getElementById("genre").innerHTML = "<ul>";
      data.results.bindings.forEach(element =>
        document.getElementById("genre").innerHTML += "<li><a href=\"genre.html?search=" + getRessourceLink(element.genre.value) + "\" >" + element.name.value + "</a></li>"
      );
      document.getElementById("genre").innerHTML += "</ul>";
    }
  );
}

function setYear(album) {
  var query = [

    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",


    "select distinct (year(xsd:date(?year)) as ?year) where {",
    "{ dbr:" + album + " dbo:recordDate ?year. }",
    "UNION",
    "{ dbr:Jazz_Goes_to_College dbo:releaseDate ?year. }",
    "}",

  ].join(" ");

  sparqlQuery(query).then(function (data) {
      //console.log(data);
      document.getElementById("year").innerHTML = data.results.bindings[0].year.value;
    }
  );
}

function setAbstract(album) {
  var query = [
    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",

    "select distinct ?abstract WHERE{",
    "  dbr:" + album + " dbo:abstract ?abstract	.",
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
                item.href = 'https://en.wikipedia.org/wiki/' + getRessourceLink(item.href);
              }
              document.getElementById("abstract").innerHTML = abstractWithLink.innerHTML;
            },
          }
        );
      }
    }
  );
}

function setCover(album) {
  var query = [
    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",

    "select distinct ?cover where {",
    "dbr:" + album + " dbp:cover ?cover.",
    "}"
  ].join(" ");

  sparqlQuery(query).then(function (data) {

    if (data.results.bindings.length > 0) {
      var str = data.results.bindings[0].cover.value;
      // get the cover image link from wikipedia
      $.ajax({
        url: `https://en.wikipedia.org/w/api.php?action=query&titles=File:${str}&prop=imageinfo&iiprop=url&format=json`,
        method: "GET",
        dataType: "jsonp",
        success: function (data) {

          let pages = data.query.pages;
          let imageLink;
          for (const key in pages) {
            if (key != -1)
              imageLink = pages[key].imageinfo[0].url;
          }
          const image = new Image();
          image.src = imageLink;
          document.getElementById("cover").appendChild(image);
        }
      });
    }
  });
}

function setArtist(album) {
  var query = [
    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",

    "select distinct ?artistLink ?artistName where {",
    "dbr:" + album + " dbo:artist ?artistLink.",
    "?artistLink foaf:name ?artistName",
    "}"
  ].join(" ");

  sparqlQuery(query).then(function (data) {
    var artistLink = "artist.html?search=" + getRessourceLink(data.results.bindings[0].artistLink.value);
    var artistName = data.results.bindings[0].artistName.value;
    document.getElementById("artist").innerHTML = artistName;
    document.getElementById("artist").setAttribute("href", artistLink);
  });
}

function setLabel(album) {
  var query = [
    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",

    "select distinct ?labelLink ?labelName where {",
    "dbr:" + album + " dbo:recordLabel ?labelLink.",
    "?labelLink foaf:name ?labelName",
    "}"
  ].join(" ");

  sparqlQuery(query).then(function (data) {
    document.getElementById("label").innerHTML = "<ul>";
    data.results.bindings.forEach(element =>
      document.getElementById("label").innerHTML += "<li>" + element.labelName.value + "</li>"
    );
    document.getElementById("label").innerHTML += "</ul>";
  });
}

function setPreviousWork(album) {
  var query = [
    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",

    "select distinct ?previousWorkLink ?previousWorkName where {",
    "dbr:" + album + " dbo:previousWork ?previousWorkLink.",
    "?previousWorkLink foaf:name ?previousWorkName",
    "}"
  ].join(" ");

  sparqlQuery(query).then(function (data) {
    if (data.results.bindings.length == 0) {
      document.getElementById("previous-container").remove();
    } else {
      var previousWorkLink = "album.html?search=" + getRessourceLink(data.results.bindings[0].previousWorkLink.value);
      var previousWorkName = data.results.bindings[0].previousWorkName.value;
      console.log(previousWorkName);
      console.log(previousWorkLink);
      document.getElementById("previousWork").innerHTML = previousWorkName;
      document.getElementById("previousWork").setAttribute("href", previousWorkLink);
    }
  });

}

function setSubsequentWork(album) {
  var query = [
    "PREFIX dbo: <http://dbpedia.org/ontology/>",
    "PREFIX dbr: <http://dbpedia.org/resource/>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",

    "select distinct ?subWorkLink ?subWorkName where {",
    "dbr:" + album + " dbo:subsequentWork ?subWorkLink.",
    "?subWorkLink foaf:name ?subWorkName",
    "}"
  ].join(" ");

  sparqlQuery(query).then(function (data) {
    if (data.results.bindings.length == 0) {
      document.getElementById("subsequent-container").remove();
    } else {
      var subWorkLink = "album.html?search=" + getRessourceLink(data.results.bindings[0].subWorkLink.value);
      var subWorkName = data.results.bindings[0].subWorkName.value;
      document.getElementById("subsequentWork").innerHTML = subWorkName;
      document.getElementById("subsequentWork").setAttribute("href", subWorkLink);
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


function getRessourceLink(uri) {
  var a = uri.split("http://dbpedia.org/resource/");
  console.log(a);
  if (a.length == 2) {
    return a[1];
  }
}

function fixParenthesis(strToFix) {

  var fixed = strToFix.replace(/[ !@#$%^&*()+=\-[\]\\';,./{}|"<>?~_]/g, "\\$&");
  fixed = fixed.replace(" ", "+");
  return fixed;
}


