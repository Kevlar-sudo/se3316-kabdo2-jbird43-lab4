const userList = document.getElementById("userList");


//upon window load we update the logged in person's username
window.onload = function() {
    document.getElementById("adminControl").classList.add("hidden");
  
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
            {document.getElementById("currentUser").innerText = data.data[0].username;}
  
            //if the user is an admin, we indicate on logged in account corner
            if(data.data[0].administrator == 1)
            {document.getElementById("currentUser").innerText = document.getElementById("currentUser").innerText + " (ADMIN)"
  
            document.getElementById("adminControl").classList.add("visible");

            getUsers();
          
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

  