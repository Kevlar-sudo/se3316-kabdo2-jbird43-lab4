//this is the client side script that will hendle displaying the data
//for the tracks search bars + buttons
const searchBarTracks = document.getElementById("searchBarTracks");
const searchButtonTracks = document.getElementById("searchButtonTracks");

//for the artist search bars + buttons
const searchBarArtist = document.getElementById("searchBarArtist");
const searchButtonArtist = document.getElementById("searchButtonArtist");



//for the search results that appear only after search
const dynamicResults = document.getElementById("intro");


//for the about section
const aboutSection = document.getElementById("about");

dynamicResults.classList.add("close-search");


document.getElementById("sortArtist").addEventListener('click', sortListArtist);
document.getElementById("sortTrack").addEventListener('click', sortListTrack);
document.getElementById("sortAlbum").addEventListener('click', sortListAlbum);
document.getElementById("sortLength").addEventListener('click', sortListlength);

//here will go sorter function :O
function sortListArtist() {
  var list, i, switching, b, shouldSwitch;
  list = document.getElementById("inventory");
  switching = true;
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    b = list.getElementsByClassName("searchResult");
    // Loop through all list items:
    for (i = 0; i < (b.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Check if the next item should
      switch place with the current item: */

      //to get just the artist

      console.log(b[i].innerText.toLowerCase().split("artist: ")[1].split(",")[0]);
      if (b[i].innerText.toLowerCase().split("artist: ")[1].split(",")[0] > b[i + 1].innerText.toLowerCase().split("artist: ")[1].split(",")[0]) {
        /* If next item is alphabetically lower than current item,
        mark as a switch and break the loop: */
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark the switch as done: */
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
    }
  }
};

//to sort by track
function sortListTrack() {
  var list, i, switching, b, shouldSwitch;
  list = document.getElementById("inventory");
  switching = true;
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    b = list.getElementsByClassName("searchResult");
    // Loop through all list items:
    for (i = 0; i < (b.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Check if the next item should
      switch place with the current item: */

      //to get just the track_id
      console.log(b[i].innerText.toLowerCase());
      console.log(b[i].innerText.toLowerCase().split("name: ")[1].split("\n")[0]);
      if (b[i].innerText.toLowerCase().split("name: ")[1].split("\n")[0] > b[i + 1].innerText.toLowerCase().split("name: ")[1].split("\n")[0]) {
        /* If next item is alphabetically lower than current item,
        mark as a switch and break the loop: */
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark the switch as done: */
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
    }
  }
};

function sortListAlbum() {
  var list, i, switching, b, shouldSwitch;
  list = document.getElementById("inventory");
  switching = true;
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    b = list.getElementsByClassName("searchResult");
    // Loop through all list items:
    for (i = 0; i < (b.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Check if the next item should
      switch place with the current item: */

      //to get just the artist
      console.log(b[i].innerText.toLowerCase().split("album name: ")[1].split("\n")[0]);
      if (b[i].innerText.toLowerCase().split("album name: ")[1].split("\n")[0] > b[i + 1].innerText.toLowerCase().split("album name: ")[1].split("\n")[0]) {
        /* If next item is alphabetically lower than current item,
        mark as a switch and break the loop: */
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark the switch as done: */
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
    }
  }
};

function sortListlength() {
  var list, i, switching, b, shouldSwitch;
  list = document.getElementById("inventory");
  switching = true;
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    b = list.getElementsByClassName("searchResult");
    // Loop through all list items:
    for (i = 0; i < (b.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Check if the next item should
      switch place with the current item: */

      //to get just the track_id
      console.log(toSeconds(b[i].innerText.toLowerCase().split("duration: ")[1].split("\n")[0]));
      if (toSeconds(b[i].innerText.toLowerCase().split("duration: ")[1].split("\n")[0]) > toSeconds(b[i + 1].innerText.toLowerCase().split("duration: ")[1].split("\n")[0])) {
        /* If next item is alphabetically lower than current item,
        mark as a switch and break the loop: */
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark the switch as done: */
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
    }
  }
};

searchButtonArtist.addEventListener('click', searchArtistName);

//the front end for query searches
function searchArtistName() {
  let input = searchBarArtist.value;
  if (/[`~!@#$%^&*()|+\-=?;:..’“'"<>,€£¥•،٫؟»«\{\}\[\]\\\/]/.test(input) !== false) {
    alert("Please only include Alphanumeric characters!");
    return;
  }

  //making the search results section visible
  if (dynamicResults.classList.contains("close-search")) {
    dynamicResults.classList.replace("close-search", "open-search");
  }


  const l = document.getElementById('inventory');
  while (l.firstChild) {
    l.removeChild(l.firstChild);
  }
  console.log(input);
  fetch("/api/artists?name=" + input, {
    method: 'GET',

  })
    .then(res => res.json()
      .then(data => {
        console.log(data);
        console.log(data.data.length);

        //we will only show the first 5 results thats why i =5
        for (i = 0; i < 5; i++) {
          const l = document.getElementById('inventory');



          //Creating the info that we will populate
          const id = document.createTextNode("id: " + data.data[i].artist_id);
          bold = document.createElement('strong'),
            bold.appendChild(id);
          l.appendChild(bold);
          l.appendChild(document.createElement("br"));

          const handle = document.createTextNode("handle: " + data.data[i].artist_handle);
          l.appendChild(handle);
          l.appendChild(document.createElement("br"));
          l.appendChild(document.createElement("br"));


          //for the collapsible

          var collapseButton = document.createElement("button");

          var textButt = document.createTextNode("View more info");

          collapseButton.appendChild(textButt);

          collapseButton.setAttribute('class', "collapsible");
          l.appendChild(collapseButton);

          var content = document.createElement("div");
          content.setAttribute('class', "content");

          //populating the drop collapsible with the required info
          var paragraph = document.createElement("p");
          paragraph.innerText =
            `Artist Date Created: ${data.data[i].artist_date_created}\n
        Artist Contact: ${data.data[i].artist_contact}\n
        Associated Labels: ${data.data[i].artist_associated_labels}\n
        Active Year Begin: ${data.data[i].artist_active_year_begin}\n
        Active Year End: ${data.data[i].artist_active_year_end}`;

          content.appendChild(paragraph);


          //finally append the collapsible box into our resultant div
          l.appendChild(content);
          l.appendChild(document.createElement("br"));
          l.appendChild(document.createElement("br"));

          //the collapsible function
          //for the collapsibles (view more info on search result)


          collapseButton.addEventListener("click", function () {
            this.classList.toggle("active");

            var content = this.nextElementSibling;
            if (content.style.display === "block") {
              content.style.display = "none";
            } else {
              content.style.display = "block";
            }
          });

        }
      })
    )
};

//for track query searching
searchButtonTracks.addEventListener('click', searchTrackName);

//the front end for query searches
function searchTrackName() {
  let input = searchBarTracks.value;

  //making the search results section visible
  if (dynamicResults.classList.contains("close-search")) {
    dynamicResults.classList.replace("close-search", "open-search");
  }

  if (/[`~!@#$%^&*()|+\-=?;:..’“'"<>,€£¥•،٫؟»«\{\}\[\]\\\/]/.test(input) !== false) {
    alert("Please only include Alphanumeric characters!");
    return;
  }

  const l = document.getElementById('inventory');
  while (l.firstChild) {
    l.removeChild(l.firstChild);
  }
  console.log(input);
  fetch("/api/tracks?name=" + input, {
    method: 'GET',

  })
    .then(res => res.json()
      .then(data => {
        console.log(data);
        console.log(data.data.length);

        //we will only show the first 5 results thats why i =5
        for (i = 0; i < 5; i++) {
          const l = document.getElementById('inventory');


          //Creating the info that we will populate
          div = document.createElement("div");
          div.classList.add("searchResult");
          const id = document.createTextNode("id: " + data.data[i].track_id);
          bold = document.createElement('strong'),
            bold.appendChild(id);
          div.appendChild(bold);
          div.appendChild(document.createElement("br"));

          const handle = document.createTextNode("Track Name: " + data.data[i].track_title);
          div.appendChild(handle);
          div.appendChild(document.createElement("br"));

          const artistN = document.createTextNode("Recording Artist: " + data.data[i].artist_name);
          div.appendChild(artistN);
          div.appendChild(document.createElement("br"));
          div.appendChild(document.createElement("br"));


          //for the collapsible

          var collapseButton = document.createElement("button");

          var textButt = document.createTextNode("View more info");

          collapseButton.appendChild(textButt);

          collapseButton.setAttribute('class', "collapsible");
          div.appendChild(collapseButton);

          var content = document.createElement("div");
          content.setAttribute('class', "content");

          //populating the drop collapsible with the required info
          var paragraph = document.createElement("p");
          paragraph.innerText =
            `Duration: ${data.data[i].track_duration}\n
          Date Recorded: ${data.data[i].track_date_recorded}\n
          Date Created: ${data.data[i].track_date_created}\n
          Album Name: ${data.data[i].album_title}\n
          Track Number In Album: ${data.data[i].track_number}`;

          content.appendChild(paragraph);


          //finally append the collapsible box into our resultant div
          div.appendChild(content);
          div.appendChild(document.createElement("br"));
          div.appendChild(document.createElement("br"));

          //the collapsible function
          //for the collapsibles (view more info on search result)


          collapseButton.addEventListener("click", function () {
            this.classList.toggle("active");

            var content = this.nextElementSibling;
            if (content.style.display === "block") {
              content.style.display = "none";
            } else {
              content.style.display = "block";
            }
          });



          //for the "Play on Youtube Button" for each individual track

          console.log(data.data[i]);

          // creating button element
          var youtubeButton = document.createElement("button");

          //setting its id
          youtubeButton.setAttribute('id', "button" + i);

          // creating text to be
          //displayed on button
          var text = document.createTextNode("Play On Youtube™");

          // appending text to button
          youtubeButton.appendChild(text);

          // appending button to div
          div.appendChild(youtubeButton);

          div.appendChild(document.createElement("br"));
          div.appendChild(document.createElement("br"));

          l.appendChild(div);

          //add a function to the newly created button that searches youtube based on the song name and artist
          document.getElementById("button" + i).addEventListener("click", function () {
            //we use a query youtube search, we convert the handle and artistN textNodes into strings and then slice them appropriately to extract our wanted data
            window.open("https://www.youtube.com/results?search_query=" + handle.wholeText.slice(12) + " by " + artistN.wholeText.slice(18), '_blank');
          });


        }
      })
    )
};



document.getElementById("closeBtn").addEventListener('click', closeResults);

function closeResults() {
  const l = document.getElementById('inventory');
  while (l.firstChild) {
    l.removeChild(l.firstChild);
  }
  dynamicResults.classList.replace("open-search", "close-search");
};

//upon window load we update the logged in person's username
window.onload = function () {


  fetch("/api/auth/loggedin", {
    method: 'GET',
    headers: {

    },
  })
    .then(res => res.json()
      .then(data => {
        if (data.status != 400) {
          console.log(data);
          if (data.username !== null) {
            document.getElementById("currentUser").innerText = data.data[0].username;
            document.getElementById("playlistControl").classList.add("visible");
          }

          //if the user is an admin, we indicate on logged in account corner
          if (data.data[0].administrator == 1) {
            document.getElementById("currentUser").innerText = document.getElementById("currentUser").innerText + " (ADMIN)"
            document.getElementById("adminControl").classList.add("visible");
          }



        } else {
          return;
        }
      }))

    .catch()


};

//Loading public playlists
window.onload = function () {

  const playlistList = document.getElementById('listPublicPlaylists');
  const item = document.createElement('li');

  let avgRatingsData = [];

  let k = 0;

  //for getting the current user logged in
  fetch("/api/playlists/public/list", {
    method: 'GET',
    headers: {

    },
  })
    .then(res => res.json()
      .then(data => {

        for (let i = 0; i < data.playName.length; i++) {
          let reviews = {
            playlistName: data.playName[i],
            playlistCreater: data.playlistOwner[i]
          }

          fetch('api/playlists/public/list', {
            method: 'POST',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify(reviews)
          })
            .then(res => res.json()
              .then(data2 => {
                console.log(data2.ratings);
                avgRatingsData[i] = data2.ratings;

                if (k < 10) {
                  item.appendChild(document.createTextNode(`Created By: ${data.username[i]},    Playlist Name: ${data.playName[i]},    Average Rating: ${avgRatingsData[i]}      Number of Tracks: ${data.noOfTracks[i]},            Total Playlist duration: ${data.playT[i]}`));
                  item.appendChild(document.createElement('br'));
                  item.appendChild(document.createElement('br'));
                  k++;
                }else{
                  return;
                }
              }));
        }
      }));

  playlistList.appendChild(item);

}






//Empty the Output box
function emptyDOM(element) {
  while (element.firstElementChild) {
    element.firstElementChild.remove();
  }
}

