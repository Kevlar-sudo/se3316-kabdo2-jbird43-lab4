//upon window load we update the logged in person's username
window.onload = function() {
    document.getElementById("adminControl").classList.add("hidden");
  
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
          
            }
  
          } else {
            return;
          }
        }))
  
      .catch()
  
  
  };