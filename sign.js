function initApp() {
    // Login with Email/Password
    var txtEmail = document.getElementById('inputEmail');
    var txtPassword = document.getElementById('inputPassword');
    var btnLogin = document.getElementById('btnLogin');
    var btnGoogle = document.getElementById('btngoogle');
    var btnSignUp = document.getElementById('btnSignUp');
    var btnFaceBook = document.getElementById('btnFacebook');
    var btnSendPasswordResetEmail = document.getElementById('ForgotPassword');
    btnLogin.addEventListener('click', function () {
        /// TODO 2: Add email login button event
        ///         1. Get user input email and password to login
        ///         2. Back to index.html when login success
        ///         3. Show error message by "create_alert" and clean input field
        var email = txtEmail.value;
        var password = txtPassword.value;
        var user = firebase.auth().currentUser;
        firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
            window.location.replace('game.html');
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            if (errorCode === 'auth/wrong-password') {
                alert('error', 'wrong password');
            } else {
                alert(errorMessage);
            }
        });
    });

    btnGoogle.addEventListener('click', function () {
        /// TODO 3: Add google login button event
        ///         1. Use popup function to login google
        ///         2. Back to index.html when login success
        ///         3. Show error message by "create_alert"
        var provider = new firebase.auth.GoogleAuthProvider();
        var btnLoginGooglePop = document.getElementById('btnLoginGooglePop');
        var btnLoginGoogleRedi = document.getElementById('btnLoginGoogleRedi');
        console.log('signInWithPopup');
        firebase.auth().signInWithPopup(provider).then(function (result) {
            var token = result.credential.accessToken;
            var user = result.user;
            window.location.replace('game.html');
        }).catch(function (error) {
            console.log('error: ' + error.message);
        });
        btnLoginGoogleRedi.addEventListener('click', e => {
            console.log('signInWithPopup');
            firebase.auth().signInWithRedirect(provider);
        });

        firebase.auth().getRedirectResult().then(function (result) {
            if (result.credential)
                var token = result.credential.accessToken;
            var user = result.user;
        }).catch(function (error) {
            console.log('error: ' + error.message);
        });



    });

    btnFaceBook.addEventListener('click', function () {
        var btnLoginFBPop = document.getElementById('btnLoginFBPop');
        var btnLoginFBRedi = document.getElementById('btnLoginFBRedi');
        var facebook_provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(facebook_provider).then(function (result) {
            console.log('signInWithPopup');
            var token = result.credential.accessToken;
            var user = result.user;
            window.location.replace('game.html');
        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
        });
    });

    btnSignUp.addEventListener('click', function () {
        /// TODO 4: Add signup button event
        ///         1. Get user input email and password to signup
        ///         2. Show success message by "create_alert" and clean input field
        ///         3. Show error message by "create_alert" and clean input field
        var email = txtEmail.value;
        var password = txtPassword.value;
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
            alert('Sign Up Successfully!!!')
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode == 'auth/weak-password') {
                alert('Failed!!!')
            } else {
                alert(errorMessage);
            }
            console.log(error);
            // [END_EXCLUDE]
        });


    });

    btnSendPasswordResetEmail.addEventListener('click', function () {
        var email = document.getElementById('inputEmail').value;
        // [START sendpasswordemail]
        firebase.auth().sendPasswordResetEmail(email).then(function () {
            // Password Reset Email Sent!
            // [START_EXCLUDE]
            alert('Password Reset Email Sent!');
            // [END_EXCLUDE]
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode == 'auth/invalid-email') {
                alert(errorMessage);
            } else if (errorCode == 'auth/user-not-found') {
                alert(errorMessage);
            }
            console.log(error);
            // [END_EXCLUDE]
        });
        // [END sendpasswordemail];
    });

}
window.onload = function () {
    initApp();
};

