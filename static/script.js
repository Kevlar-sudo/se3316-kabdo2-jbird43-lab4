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


document.getElementById("sortArtist").addEventListener('click',sortListArtist);
document.getElementById("sortTrack").addEventListener('click',sortListTrack);
document.getElementById("sortAlbum").addEventListener('click',sortListAlbum);
document.getElementById("sortLength").addEventListener('click',sortListlength);

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

  searchButtonArtist.addEventListener('click',searchArtistName);

  //the front end for query searches
  function searchArtistName(){
    let input = searchBarArtist.value;
    if(/[`~!@#$%^&*()|+\-=?;:..’“'"<>,€£¥•،٫؟»«\{\}\[\]\\\/]/.test(input) !== false){
      alert("Please only include Alphanumeric characters!");
      return;
    }

    //making the search results section visible
    if(dynamicResults.classList.contains("close-search")){
      dynamicResults.classList.replace("close-search","open-search");}


    const l = document.getElementById('inventory');
    while(l.firstChild){
      l.removeChild(l.firstChild);
  }
    console.log(input);
    fetch("/api/artists?name="+input,{
        method: 'GET',
        
    })
    .then(res =>res.json()
    .then(data => {
        console.log(data);
        console.log(data.data.length);

        //we will only show the first 5 results thats why i =5
        for(i = 0;i<5;i++){
        const l = document.getElementById('inventory');
        
        
        
        //Creating the info that we will populate
        const id = document.createTextNode("id: "+data.data[i].artist_id);
        bold = document.createElement('strong'),
        bold.appendChild(id);
        l.appendChild(bold);
        l.appendChild(document.createElement("br"));

        const handle = document.createTextNode("handle: "+data.data[i].artist_handle);
        l.appendChild(handle);
        l.appendChild(document.createElement("br"));

        const dateCreated = document.createTextNode("Date Created: "+data.data[i].artist_date_created);
        l.appendChild(dateCreated);
        l.appendChild(document.createElement("br"));

        const contact = document.createTextNode("Contact: "+ data.data[i].artist_contact);
        l.appendChild(contact);
        l.appendChild(document.createElement("br"));

        const assLabel = document.createTextNode("Associated Label: "+data.data[i].artist_associated_labels);
        l.appendChild(assLabel);
        l.appendChild(document.createElement("br"));

        const activeE = document.createTextNode("Active Year End: "+data.data[i].artist_active_year_end);
        l.appendChild(activeE);
        l.appendChild(document.createElement("br"));

        const activeB = document.createTextNode("Active Year Begin: "+data.data[i].artist_active_year_begin);
        l.appendChild(activeB);
        l.appendChild(document.createElement("br"));
        l.appendChild(document.createElement("br"));
        }
    })
    )
};

//for track query searching
searchButtonTracks.addEventListener('click',searchTrackName);

  //the front end for query searches
  function searchTrackName(){
    let input = searchBarTracks.value;

    //making the search results section visible
    if(dynamicResults.classList.contains("close-search")){
      dynamicResults.classList.replace("close-search","open-search");}

    if(/[`~!@#$%^&*()|+\-=?;:..’“'"<>,€£¥•،٫؟»«\{\}\[\]\\\/]/.test(input) !== false){
      alert("Please only include Alphanumeric characters!");
      return;
    }

    const l = document.getElementById('inventory');
    while(l.firstChild){
      l.removeChild(l.firstChild);
  }
    console.log(input);
    fetch("/api/tracks?name="+input,{
        method: 'GET',
        
    })
    .then(res =>res.json()
    .then(data => {
        console.log(data);
        console.log(data.data.length);

        //we will only show the first 5 results thats why i =5
        for(i = 0;i<5;i++){
        const l = document.getElementById('inventory');
        
        
        //Creating the info that we will populate
        div = document.createElement("div");
        div.classList.add("searchResult");
        const id = document.createTextNode("id: "+data.data[i].track_id);
        bold = document.createElement('strong'),
        bold.appendChild(id);
        div.appendChild(bold);
        div.appendChild(document.createElement("br"));

        const handle = document.createTextNode("Track Name: "+data.data[i].track_title);
        div.appendChild(handle);
        div.appendChild(document.createElement("br"));

        const dateCreated = document.createTextNode("Duration: "+data.data[i].track_duration);
        div.appendChild(dateCreated);
        div.appendChild(document.createElement("br"));

        const contact = document.createTextNode("Date Recorded: "+ data.data[i].track_date_recorded);
        div.appendChild(contact);
        div.appendChild(document.createElement("br"));

        const assLabel = document.createTextNode("Date Created: "+data.data[i].track_date_created);
        div.appendChild(assLabel);
        div.appendChild(document.createElement("br"));

        const activeE = document.createTextNode("Album Name: "+data.data[i].album_title);
        div.appendChild(activeE);
        div.appendChild(document.createElement("br"));

        const activeB = document.createTextNode("Track Number In Album: "+data.data[i].track_number);
        div.appendChild(activeB);
        div.appendChild(document.createElement("br"));

        const artistN = document.createTextNode("Recording Artist: "+data.data[i].artist_name);
        div.appendChild(artistN);
        div.appendChild(document.createElement("br"));
        div.appendChild(document.createElement("br"));

        //for the "Play on Youtube Button" for each individual track

        // creating button element
        var youtubeButton = document.createElement("button");

        //setting its id
        youtubeButton.setAttribute('id',"button"+i);
       
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
        document.getElementById("button"+i).addEventListener("click", function (){
          //we use a query youtube search, we convert the handle and artistN textNodes into strings and then slice them appropriately to extract our wanted data
          window.open("https://www.youtube.com/results?search_query="+handle.wholeText.slice(12)+" by "+artistN.wholeText.slice(18), '_blank');
      });

        
        }
    })
    )
};



document.getElementById("closeBtn").addEventListener('click',closeResults);

function closeResults(){
  const l = document.getElementById('inventory');
    while(l.firstChild){
      l.removeChild(l.firstChild);
  }
  dynamicResults.classList.replace("open-search","close-search");
};

