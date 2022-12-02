const userList = document.getElementById("userList");


//upon window load we update the logged in person's username
window.onload = function() {
    
  
    //for getting the current user logged in
    fetch("/api/auth/loggedin", {
      method: 'GET',
      headers: {
        
      },
    })
      .then(res => res.json()
        .then(data => {
          if (data.status != 400) {
            console.log(data.data[0].username);
            console.log(data.data[0].administrator);
            if(data.username !== null)
            {document.getElementById("currentUser").innerText = data.data[0].username;
          
            document.getElementById("playlistControl").classList.add("visible");}
  
            //if the user is an admin, we indicate on logged in account corner
            if(data.data[0].administrator == 1)
            {document.getElementById("currentUser").innerText = document.getElementById("currentUser").innerText + " (ADMIN)"
  
            document.getElementById("adminControl").classList.add("visible");

            getUsers();
            getPlaylists();
          
            }
  
          } else {
            return;
          }
        }))
  
      .catch()


      //for getting all users in our database, will be used by the admin to grant admin priv
      function getUsers()
      {fetch("/api/user/", {
        method: 'GET',
        headers: {
          
        },
      })
        .then(res => res.json()
          .then(data => {
            if (data.status != 400) {
              for(j =0; j<data.data.length;j++)
              {console.log(data.data[j]);
              var userOption = document.createElement("option");
              userOption.text = data.data[j].username;
              userList.add(userOption);
              
              }
    
            } else {
              return;
            }
          }))
    
        .catch()}
  
  
};

  document.getElementById("grantAdmin").addEventListener('click',grantPriviledge);

  function grantPriviledge(){
    const grantUser = {
      username: document.getElementById("userList").value
    }
    console.log(grantUser);

    fetch("/api/auth/grant", {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(grantUser),
    })
      .then(res => res.json()
        .then(data => {
          if (data.status != 400) {
            console.log(data);
            console.log("successfully granted the user admin priviledges");
            //do something
  
          } else {
            return;
          }
        }))
  
      .catch()
    };

    //for deactivating the account by the admin
    document.getElementById("deactivateAcc").addEventListener('click',deactivateAccount);

    function deactivateAccount(){
      const deactUser = {
        username: document.getElementById("userList").value
      }
      console.log(deactUser);
  
      fetch("/api/auth/deactivate", {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(deactUser),
      })
        .then(res => res.json()
          .then(data => {
            if (data.status != 400) {
              console.log(data);
              console.log("successfully deactivated the account");
              //do something
    
            } else {
              return;
            }
          }))
    
        .catch()
      };

      //for activating the account by the admin 

      document.getElementById("activateAcc").addEventListener('click',activateAccount);

      function activateAccount(){
        

        const actUser = {
          username: document.getElementById("userList").value
        }
        console.log(actUser);
    
        fetch("/api/auth/activate", {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(actUser),
        })
          .then(res => res.json()
            .then(data => {
              if (data.status != 400) {
                console.log(data);
                console.log("successfully activated the account");
                //do something
      
              } else {
                return;
              }
            }))
      
          .catch()
        };



//for dmca policy editing
document.getElementById("writeDMCA").addEventListener('click',newDmca);

function newDmca(){
  const new_text = {

    new_text: document.getElementById("dmcaContent").value
  }

  //Need to add HTML to tell user that playlist was added
  fetch("/api/text/dmca", {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(new_text)
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

}


//for loading the current dmca policy
document.getElementById("loadDMCA").addEventListener('click',currentDmca);

function currentDmca(){
  

  //Need to add HTML to tell user that playlist was added
  fetch("/api/text/dmca", {
    method: 'GET'
  })
    .then(res => res.json()
      .then(data => {
        if (data.status != 400) {
          console.log(data.text);
          document.getElementById("dmcaContent").textContent = data.text;

        } else {
          return;
        }
      }))

    .catch()

}


//for acceptable user policy
document.getElementById("writeAUP").addEventListener('click',newAup);

function newAup(){
  const new_text = {

    new_text: document.getElementById("aupContent").value
  }

  //Need to add HTML to tell user that playlist was added
  fetch("/api/text/aup", {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(new_text)
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

}


//for loading the current aup policy
document.getElementById("loadAUP").addEventListener('click',currentAup);

function currentAup(){
  

  //Need to add HTML to tell user that playlist was added
  fetch("/api/text/aup", {
    method: 'GET'
  })
    .then(res => res.json()
      .then(data => {
        if (data.status != 400) {
          console.log(data.text);
          document.getElementById("aupContent").textContent = data.text;

        } else {
          return;
        }
      }))

    .catch()

}
  

//for security and privacy policy
document.getElementById("writePrivacy").addEventListener('click',newSp);

function newSp(){
  const new_text = {

    new_text: document.getElementById("privacyContent").value
  }

  //Need to add HTML to tell user that playlist was added
  fetch("/api/text/sp", {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(new_text)
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

}


//for loading the current sp policy
document.getElementById("loadSP").addEventListener('click',currentSp);

function currentSp(){
  

  //Need to add HTML to tell user that playlist was added
  fetch("/api/text/sp", {
    method: 'GET'
  })
    .then(res => res.json()
      .then(data => {
        if (data.status != 400) {
          console.log(data.text);
          document.getElementById("privacyContent").textContent = data.text;

        } else {
          return;
        }
      }))

    .catch()

}

const playList = document.getElementById("playsL");
const playlistsClaims = document.getElementById("playlistsClaims");

//to get all the playlists
function getPlaylists() {
  
  fetch("/api/auth/playlist/public", {
    method: 'GET',

  })
    .then(res => res.json()
      .then(data => {
        console.log(data.array);

        for (let i = 0; i < data.playName.length; i++) {
          //add the new playlist to drop down list
          var option1 = document.createElement("option");
          option1.text = data.playName[i];
          playList.add(option1);

          //for the second playlist select (in claims)
          var option2 = document.createElement("option");
          option2.text = data.playName[i];
          playlistsClaims.add(option2);
        }

      }));
      };

//to get all the reviews for that specific playlist
document.getElementById("showReviews").addEventListener('click',getReviews);


const reviewList = document.getElementById("reviewsL");

function getReviews(){
  
  fetch(`/api/auth/reviews/${document.getElementById("playsL").value}`, {
    method: 'GET',
    
  })
    .then(res => res.json()
      .then(data => {
        if (data.status != 400) {
          console.log(data);
          console.log(data.data.length);
          for(x =0; x<data.data.length;x++){
            //do something
            console.log(data.data[x].username+" ON "+data.data[x].reviewDate+" RATED "+data.data[x].rating);
            var revOption = document.createElement("option");
            revOption.text = data.data[x].reviewId;
            reviewList.add(revOption);

          }
          

        } else {
          return;
        }
      }))

    .catch()
}

//for hiding and showing reviews 

    //for hiding reviews
    document.getElementById("hideReview").addEventListener('click',hideRev);

    function hideRev(){
      const reviewId = {
        reviewId: document.getElementById("reviewsL").value
      }
      console.log(reviewId);
  
      fetch("/api/auth/reviews/hide", {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(reviewId),
      })
        .then(res => res.json()
          .then(data => {
            if (data.status != 400) {
              console.log(data);
              console.log("successfully hidden the review");
              //do something
    
            } else {
              return;
            }
          }))
    
        .catch()
      };

      
      //for making reviews visible
      document.getElementById("visibleReview").addEventListener('click',visibleRev);

      function visibleRev(){
        

        const reviewId = {
          reviewId: document.getElementById("reviewsL").value
        }
        console.log(reviewId);
    
        fetch("/api/auth/reviews/show", {
          method: 'PUT',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(reviewId),
        })
          .then(res => res.json()
            .then(data => {
              if (data.status != 400) {
                console.log(data);
                console.log("successfully made the review visible");
                //do something
      
              } else {
                return;
              }
            }))
      
          .catch()
        };


//front end for creating claims

function createClaim(){
        

  const reviewId = {
    reviewId: document.getElementById("reviewsL").value
  }
  console.log(reviewId);

  fetch("/api/auth/reviews/show", {
    method: 'PUT',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(reviewId),
  })
    .then(res => res.json()
      .then(data => {
        if (data.status != 400) {
          console.log(data);
          console.log("successfully made the review visible");
          //do something

        } else {
          return;
        }
      }))

    .catch()
  };


  //getting reviews for this specific playlist selection in claims

  document.getElementById("showReviewsClaims").addEventListener('click',getReviewsClaims);

const reviewsClaims = document.getElementById("reviewsClaims");

function getReviewsClaims(){
  
  fetch(`/api/auth/reviews/${document.getElementById("playlistsClaims").value}`, {
    method: 'GET',
    
  })
    .then(res => res.json()
      .then(data => {
        if (data.status != 400) {
          console.log(data);
          console.log(data.data.length);
          for(x =0; x<data.data.length;x++){
            //do something
            console.log(data.data[x].username+" ON "+data.data[x].reviewDate+" RATED "+data.data[x].rating);
            var revOption = document.createElement("option");
            revOption.text = data.data[x].reviewId;
            reviewsClaims.add(revOption);

          }
          

        } else {
          return;
        }
      }))

    .catch()
}

//the function for submitting claims by the admin
document.getElementById("writeClaim").addEventListener('click',submitClaim);


function submitClaim(){

  //checking which type of claim we are making 
  var typeSelected;


  if (document.getElementById("takedownReq").checked == true) {
    typeSelected = "Takedown Request";
  } else if (document.getElementById("infringeNotice").checked == true) {
    typeSelected = "Infringement Notice";
  } else if (document.getElementById("counterClaim").checked == true) {
    typeSelected = "Counter Claim";
  } else {
    typeSelected = "Unspecified Claim";
  }




  const claimInfo = {
    type: typeSelected,
    playlistName: document.getElementById("playlistsClaims").value,
    reviewId: document.getElementById("reviewsClaims").value
  }
  console.log(claimInfo);

  fetch("/api/auth/claim", {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(claimInfo),
  })
    .then(res => res.json()
      .then(data => {
        if (data.status != 400) {
          console.log(data);
          console.log("successfully submitted the claim");
          //do something

        } else {
          return;
        }
      }))

    .catch()
  };