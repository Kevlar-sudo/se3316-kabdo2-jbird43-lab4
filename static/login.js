
//Font end for user login
function login() {

  const user = {
    email: document.getElementById("emailLogin").value,
    password: document.getElementById("passwordLogin").value
  }

  fetch("/api/user/login", {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(user)
  })
    .then(res => {
      if (res.ok) {
        res.json()
          .then(data => {

          });

      }
    });
}
  
  
  
  
  
  
  
  //the function to create a user to our db
  //create new playlist front end WORKING
function register(){

  //verifying the name only has wanted characters
  if(/[`~!@#$%^&*()|+\-=?;:..’“'"<>,€£¥•،٫؟»«\{\}\[\]\\\/]/.test(document.getElementById("username").value) !== false){
    alert("Please only include Alphanumeric characters in the username");
    return;
  }
  const newUser={
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    //currently admin status only 0 CHANGE later
    administrator: 0
}
    console.log(newUser);
    fetch("/api/user/register",{
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(newUser)
    })
    .then(res => {
        if(res.ok){
            res.json()
            .then(data => {
                console.log(data);
                //add the new user
            })
            .catch(err => console.log('Failed to get json object'))
        }
        else{
            console.log('Error: ',res.status);
            alert("Something went wrong!");
        }
    })
    .catch()
    
};


//for password confirmation
var password = document.getElementById("password")
  , confirm_password = document.getElementById("confirm_password");

function validatePassword(){
    //checking if the two password and confirm password have the same values
  if(password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match");
  } else {
    confirm_password.setCustomValidity('');
  }
}

//everytime password or confirm_password fields change we run the validate password script
password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;