
//this is the javascript file for the playlists page (accessed only by authenticated users)

//for playlist
const addPlaylist = document.getElementById("addPlaylist");
const deleteList = document.getElementById("deleteList");

addPlaylist.addEventListener('click', createPlaylist);
//deleteList.addEventListener('click', deletePlaylist);

document.getElementById("viewList").addEventListener('click', viewAllPublicPlaylists);
document.getElementById("viewAllPlaylist").addEventListener('click', viewAllPlaylists);
document.getElementById("addTrackToPlaylist").addEventListener('click', addTrackToPlaylist);
document.getElementById("viewTracksInPlaylist").addEventListener('click', viewTracks);
document.getElementById("deleteTrack").addEventListener('click', deleteTrackFromPlaylist);
document.getElementById("deletePlaylistBtn").addEventListener('click', deletePlaylist);

var playListTracks = {};
var durations = {};


//create new playlist front end WORKING
function createPlaylist() {

  //verifying the name only has wanted characters
  if (/[`~!@#$%^&*()|+\-=?;:..’“'"<>,€£¥•،٫؟»«\{\}\[\]\\\/]/.test(document.getElementById("playlistName").value) !== false) {
    alert("Please only include Alphanumeric characters!");
    return;
  }

  const playlist = {

    playlistName: document.getElementById("playlistName").value
  }

  //Need to add HTML to tell user that playlist was added
  fetch("/api/auth/playlist", {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(playlist)
  })
    .then(res => res.json()
      .then(data => {
        if (data.status != 400) {
          console.log(data);

        } else {
          return;
        }
      }))

    .catch()

};

//View all playlists of a logged in user
function viewAllPlaylists() {

  var playsL = document.getElementById('playsLAll');
  var viewPlaylist = document.getElementById('allPlaylists');
  var deleteTrackPlaylist = document.getElementById('deleteTrackPlaylist');
  var deletePlaylist = document.getElementById('deletePlaylist');

  emptyDOM(playsL);
  emptyDOM(viewPlaylist);
  emptyDOM(deleteTrackPlaylist);
  emptyDOM(deletePlaylist);

  fetch("/api/auth/playlist", {
    method: 'GET',

  })
    .then(res => res.json()
      .then(data => {
        console.log(data.array);

        for (let i = 0; i < data.array.length; i++) {
          //add the new playlist to drop down list
          var option = document.createElement("option");
          var option2 = document.createElement("option");
          var option3 = document.createElement("option");
          var option4 = document.createElement("option");
          option.text = data.array[i];
          option2.text = data.array[i];
          option3.text = data.array[i];
          option4.text = data.array[i];
          playsL.add(option);
          viewPlaylist.add(option2);
          deleteTrackPlaylist.add(option3);
          deletePlaylist.add(option4);
        }
      }));

}

//Function to add tracks to a playlist
function addTrackToPlaylist() {
  const track = {

    trackID: document.getElementById("trackIDField").value,
    playlistName: document.getElementById("playsLAll").value
  }
  //Need to add HTML to tell user that playlist was added
  fetch("/api/auth/playlist/track", {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(track)
  })
    .then(res => res.json()
      .then(data => {

        console.log(data);

      }))

    .catch()

};

function viewTracks() {
  const tracksList = document.getElementById('listPlaylistTracks');
  const item = document.createElement('li');

  emptyDOM(tracksList)

  const playlist = {

    playlistName: document.getElementById("allPlaylists").value
  }

  fetch("/api/auth/playlist/track", {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(playlist)

  })
    .then(res => res.json()
      .then(data => {

        if (data.array != undefined) {
          for (let i = 0; i < data.array.length; i++) {

            item.appendChild(document.createTextNode(`Track Name: ${data.array[i]}  Album Name: ${data.array2[i]}`));
            item.appendChild(document.createElement('br'));

          }
        } else {
          item.appendChild(document.createTextNode("There are no tracks in this playlist"));
          item.appendChild(document.createElement('br'));

        }

        tracksList.appendChild(item);


        console.log(data.array);
        console.log(data.array2);
      }));

}

function deleteTrackFromPlaylist() {

  const track = {

    playlistName: document.getElementById("deleteTrackPlaylist").value,
    trackID: document.getElementById("trackNameDelete").value
  }


  fetch("/api/auth/playlist/track", {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(track)

  })
    .then(res => res.json()
      .then(data => {
        console.log(data);
      }));
}

//Front end for deleting a playlist
function deletePlaylist() {

  const playlist = {

    playlistName: document.getElementById("deletePlaylist").value,
  }


  fetch("/api/auth/playlist", {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(playlist)

  })
    .then(res => res.json()
      .then(data => {
        console.log(data);
      }));

}

function viewAllPublicPlaylists() {

  var playsL = document.getElementById('playsL');

  emptyDOM(playsL);

  fetch("/api/auth/playlist/public", {
    method: 'GET',

  })
    .then(res => res.json()
      .then(data => {
        console.log(data.array);

        for (let i = 0; i < data.playName.length; i++) {
          //add the new playlist to drop down list
          var option = document.createElement("option");
          option.text = data.playName[i];
          playsL.add(option);
        }

      }));
}












































































































//delete playlist
function deletePlaylistOld() {
  var playListValue = document.getElementById('playsL').value;
  const removeList = {
    playlist_name: document.getElementById("playsL").value
  }
  fetch("/api/playlist/", {
    method: 'DELETE',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(removeList)
  })
    .then(res => {
      if (res.ok) {
        res.json()
          .then(data => {
            console.log(data);
            //add the new playlist to drop down list
            //window.alert("success!");
            var x = document.getElementById('playsL');
            x.remove(x.selectedIndex);
            document.getElementById('status').innerText = `Created playlist ${playlist_name}`;
          })
          .catch(err => console.log('Failed to get json object'))
      }
      else {
        console.log('Error: ', res.status);

      }
    })
    .catch()

};
//THIS WORKS TO SHOW ALL AVAILABLE TRACKS IN A CERTAIN PLAYLIST
function viewlist() {
  var playListValue = document.getElementById('playsL').value;


  if (durations[document.getElementById('playsL').value] == undefined) { durations[document.getElementById('playsL').value] = []; }

  //this part is to clear the search upon consecutive view button clicks
  const l = document.getElementById('listTracks');
  //we loop through the list and while it has a child we remove them
  while (l.firstChild) {
    l.removeChild(l.firstChild);
  }
  fetch("/api/playlist/" + playListValue, {
    method: 'GET',

  })
    .then(res => res.json()
      .then(data => {
        console.log(data);
        const l = document.getElementById('listTracks');
        const texter = document.getElementById("cTrack");


        //works kinda
        if (data.noOfTracks > 0) {
          for (i = 0; i < playListTracks[playListValue].length; i++) {

            const item = document.createElement('li');
            const infoTrack = document.createTextNode(`track_id: ${playListTracks[playListValue][i][0]}, track_name: ${playListTracks[playListValue][i][5]},  artist: ${playListTracks[playListValue][i][1]}, album: ${playListTracks[playListValue][i][2]}, playtime: ${playListTracks[playListValue][i][3]}, album: ${playListTracks[playListValue][i][4]}`)
            item.appendChild(infoTrack);
            l.appendChild(item);

            console.log(infoTrack.wholeText);


            // creating button element
            var youtubeButton = document.createElement("button");

            //setting its id
            youtubeButton.setAttribute('id', "button" + i);

            // creating text to be
            //displayed on button
            var text = document.createTextNode("Play On Youtube™");

            // appending text to button
            youtubeButton.appendChild(text);

            item.appendChild(youtubeButton);

            document.getElementById("button" + i).addEventListener("click", function () {
              //we use a query youtube search, we convert the handle and artistN textNodes into strings and then slice them appropriately to extract our wanted data
              window.open("https://www.youtube.com/results?search_query=" + infoTrack.wholeText.split(",")[1].slice(11) + " by" + infoTrack.wholeText.split(",")[2].slice(7), '_blank');
            });

            //adding the durations to an array with the playlist name
            durations[playListValue].push(playListTracks[playListValue][i][3]);
          }
          var minutes = 0;
          var seconds = 0;
          var totalSeconds = 0;
          totalSeconds = durations[playListValue].map(toSeconds).reduce(sum);
          minutes = Math.floor(totalSeconds / 60);
          seconds = totalSeconds - minutes * 60;
          texter.innerText = "Current Tracks\nNumber of tracks: " + data.noOfTracks + "\nPlaylist Listening Time: " + minutes + ":" + seconds;
        }
        else {
          texter.innerText = "Selected Playlist is empty"
        }
      })
    )
};
//the function to add a track to the db 
function addTrack() {
  let input = document.getElementById("trackName").value

  //testing the input for any unwanted characters, allows all languages

  if (/^\d+$/.test(input) == false) {
    alert("Please enter digits between 0-9 only!");
    return;
  }
  //make sure our json object has an array for the playlist name so we can push later on in the function
  if (playListTracks[document.getElementById('playsLAll').value] == undefined) { playListTracks[document.getElementById('playsL').value] = []; }

  fetch("/api/auth/playlist/track", {
    method: 'GET',

  })
    .then(res => res.json()
      .then(data => {
        console.log(data);

        if (data['success'] == true) {
          const texter = document.getElementById("cTrack");
          const l = document.getElementById('listTracks');
          const item = document.createElement('li');
          console.log(data.data);
          item.appendChild(document.createTextNode(`track_id: ${data.data[0].track_id}, track_name: ${data.data[0].track_title},  artist: ${data.data[0].artist_name}, album: ${data.data[0].album_title}, playtime: ${data.data[0].track_duration}, album: ${data.data[0].album_title}     `));
          l.appendChild(item);

          // creating button element
          var youtubeButton = document.createElement("button");

          //setting its id
          youtubeButton.setAttribute('id', "button");

          // creating text to be
          //displayed on button
          var text = document.createTextNode("Play On Youtube™");

          // appending text to button
          youtubeButton.appendChild(text);

          item.appendChild(youtubeButton);

          youtubeButton.addEventListener("click", function () {
            //we use a query youtube search, we convert the handle and artistN textNodes into strings and then slice them appropriately to extract our wanted data
            window.open("https://www.youtube.com/results?search_query=" + data.data[0].track_title + " by " + data.data[0].artist_name, '_blank');
          });


          playListTracks[document.getElementById('playsL').value].push([data.data[0].track_id, data.data[0].artist_name, data.data[0].album_title, data.data[0].track_duration, data.data[0].album_title, data.data[0].track_title]);
          //playListTracks[document.getElementById('playsL').value].push(["hello"]);
          texter.innerText = "Current Tracks"
        }
        //checking if the track exists in the database
        if (data['success'] == false) {
          alert("This track doesn't exist!");
          return;
        }

      })
    )
  //basically we have to fetch /playlist/:name to get no of tracks and display it 



  //to convert our durations to seconds
  function toSeconds(time) {
    var minutes = Number(time.slice(0, 2));
    var seconds = Number(time.slice(3));
    return seconds + minutes * 60;
  }

  function sum(a, b) {
    return a + b;
  }

  document.getElementById("deleteTrack").addEventListener('click', deleteTrackFromPlaylist);

  //to delete a specific track from a playlist
  function deleteTrackFromPlaylist() {
    var playListValue = document.getElementById('playsL').value;

    if (/^\d+$/.test(playListValue) == false) {
      alert("Please enter digits between 0-9 only!");
      return;
    }

    const removeTrack = {
      track_id: document.getElementById("trackNameDelete").value
    }
    fetch("/api/playlist/" + playListValue, {
      method: 'DELETE',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(removeTrack)
    })
      .then(res => {
        if (res.ok) {
          res.json()
            .then(data => {
              console.log(data);
              //add the new playlist to drop down list
              //window.alert("success!");

              document.getElementById('status').innerText = `Created playlist ${playlist_name}`;
            })
            .catch(err => console.log('Failed to get json object'))
        }
        else {
          console.log('Error: ', res.status);

        }
      })
      .catch()

  };

  //FOR SORTING THE PLAYLIST NOT THE SEARCH RESULTS
  document.getElementById("sortArtistPlaylist").addEventListener('click', sortPlaylistArtist);
  document.getElementById("sortTrackPlaylist").addEventListener('click', sortPlaylistTrack);
  document.getElementById("sortAlbumPlaylist").addEventListener('click', sortPlaylistAlbum);
  document.getElementById("sortLengthPlaylist").addEventListener('click', sortPlaylistlength);


  //for sorting the playlist
  //here will go sorter function :O
  function sortPlaylistArtist() {
    var list, i, switching, b, shouldSwitch;
    list = document.getElementById("listTracks");
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      b = list.getElementsByTagName("LI");
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
  function sortPlaylistTrack() {
    var list, i, switching, b, shouldSwitch;
    list = document.getElementById("listTracks");
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      b = list.getElementsByTagName("LI");
      // Loop through all list items:
      for (i = 0; i < (b.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Check if the next item should
        switch place with the current item: */

        //to get just the track_id
        console.log(b[i].innerText.toLowerCase());
        console.log(parseInt(b[i].innerText.toLowerCase().split("track_id: ")[1].split(",")[0]));
        if (parseInt(b[i].innerText.toLowerCase().split("track_id: ")[1].split(",")[0]) > parseInt(b[i + 1].innerText.toLowerCase().split("track_id: ")[1].split(",")[0])) {
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

  function sortPlaylistAlbum() {
    var list, i, switching, b, shouldSwitch;
    list = document.getElementById("listTracks");
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      b = list.getElementsByTagName("LI");
      // Loop through all list items:
      for (i = 0; i < (b.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Check if the next item should
        switch place with the current item: */

        //to get just the artist
        console.log(b[i].innerText.toLowerCase().split("album: ")[1].split(",")[0]);
        if (b[i].innerText.toLowerCase().split("album: ")[1].split(",")[0] > b[i + 1].innerText.toLowerCase().split("album: ")[1].split(",")[0]) {
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

  function sortPlaylistlength() {
    var list, i, switching, b, shouldSwitch;
    list = document.getElementById("listTracks");
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      b = list.getElementsByTagName("LI");
      // Loop through all list items:
      for (i = 0; i < (b.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Check if the next item should
        switch place with the current item: */

        //to get just the track_id
        console.log(toSeconds(b[i].innerText.toLowerCase().split("playtime: ")[1].split(",")[0]));
        if (toSeconds(b[i].innerText.toLowerCase().split("playtime: ")[1].split(",")[0]) > toSeconds(b[i + 1].innerText.toLowerCase().split("playtime: ")[1].split(",")[0])) {
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

  }
};

//upon window load we update the logged in person's username
window.onload = function () {
  document.getElementById("adminControl").classList.add("hidden");


  fetch("/api/auth/loggedin", {
    method: 'GET',
    headers: {

    },
  })
    .then(res => res.json()
      .then(data => {
        if (data.status != 400) {
          console.log(data);

          if (data.username !== null) { document.getElementById("currentUser").innerText = data.data[0].username; }

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

//Empty the Output box
function emptyDOM(element) {
  while (element.firstElementChild) {
    element.firstElementChild.remove();
  }
}