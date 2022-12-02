document.getElementById("changePassword").addEventListener('click', changePassword);
//the function to create a user to our db
function register() {

  //let's hash the email

  var opened = window.open("");
  opened.document.write(`<html><head><title>Email Confirmation Code</title></head><body><br>Dear ${document.getElementById("email").value}</br>Your email confirmation code is: <b>${document.getElementById("email").value.hashCode()}</b></body></html>`);


  //checking if the user confirmed the email, only create the account when the email has been confirmed


  //verifying the name only has wanted characters
  if (/[`~!@#$%^&*()|+\-=?;:..’“'"<>,€£¥•،٫؟»«\{\}\[\]\\\/]/.test(document.getElementById("username").value) !== false) {
    alert("Please only include Alphanumeric characters in the username");
    return;
  }
  const newUser = {
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    //currently admin status only 1 CHANGE later
    administrator: 0,
    deactivated: 1
  }
  console.log(newUser);
  fetch("/api/user/register", {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(newUser)
  })
    .then(res => {
      if (res.ok) {
        res.json()
          .then(data => {
            console.log(data);
            //add the new user


          })
          .catch(err => console.log('Failed to get json object'))
      }
      else {
        console.log('Error: ', res.status);
        alert("Something went wrong!");
      }
    })
    .catch()
};

//Login user and output jwt key
function login() {


  const newUser = {
    email: document.getElementById("emailLogin").value,
    password: document.getElementById("passwordLogin").value,

  }
  console.log(newUser);
  fetch("/api/user/login", {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(newUser)
  })
    .then(res => {
      if (res.ok) {
        res.json()
          .then(data => {


            //if the account has been deactivated by admin
            if (data.status == 500) {
              alert("This account has been deactivated, please contact admin@se3316.com");
              return;
            }

            //if the user hasn't verified their email
            if (data.status == 501) {
              alert("Please verify your email before logging in for the first time");
              var opened = window.open("");
              opened.document.write(`<html><head><title>Email Confirmation Code</title></head><body><br>Dear ${document.getElementById("emailLogin").value}</br>Your email confirmation code is: <b>${document.getElementById("emailLogin").value.hashCode()}</b></body></html>`);
              return;
            }
            console.log("hello");
            console.log(data);
            //add the new user
          })
          .catch(err => console.log('Failed to login!'))
      }
      else {
        console.log('Error: ', res.status);
        alert("Something went wrong!");
      }
    })
    .catch()
};


//for password confirmation
var password = document.getElementById("password")
  , confirm_password = document.getElementById("confirm_password");

function validatePassword() {
  //checking if the two password and confirm password have the same values
  if (password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match");
  } else {
    confirm_password.setCustomValidity('');
  }
}

//everytime password or confirm_password fields change we run the validate password script
password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;




function confirmEmail() {
  console.log(document.getElementById("emailConfirm").value.hashCode());
  console.log(document.getElementById("confirmCode").value);

  if (document.getElementById("emailConfirm").value.hashCode() == document.getElementById("confirmCode").value) {
    const confirmationM = {
      email: document.getElementById("emailConfirm").value,

    }

    fetch("/api/user/confirm", {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(confirmationM)
    })
      .then(res => {
        if (res.ok) {
          res.json()
            .then(data => {
              console.log(data);
              //add the new user
            })
            .catch(err => console.log('Failed to confirm email'))
        }
        else {
          console.log('Error: ', res.status);
          alert("Something went wrong!");
        }
      })
      .catch()
  }
  else {
    alert('Wrong email or wrong confirmation code!')

  }

}

//for hashing (verifaction code for email)
String.prototype.hashCode = function () {
  var hash = 0;
  for (var i = 0; i < this.length; i++) {
    var char = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

function changePassword() {

  console.log("hi");
  const change = {
    email: document.getElementById("emailChange").value,
    password: document.getElementById("passwordChange").value
  }

  fetch("/api/user/change/password", {
    method: 'PUT',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(change)
  })
    .then(res => {
      if (res.ok) {
        res.json()
          .then(data => {
            console.log(data);
          })
          .catch(err => console.log('Failed to get json object'))
      }
      else {
        console.log('Error: ', res.status);
        alert("Something went wrong!");
      }
    }).catch()


}


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
          console.log(data.data[0].username);
          console.log(data.data[0].administrator);
          if (data.username !== null) { document.getElementById("currentUser").innerText = data.data[0].username; 
          document.getElementById("playlistControl").classList.add("visible");}

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
