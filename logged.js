$(function () {
    var user_email = '';
    var database = firebase.database();
    var user = firebase.auth().currentUser;
    var Today = new Date();
    firebase.auth().onAuthStateChanged(function (user) {
        // Check user login
        if (user) {
            var logoutbtn = document.getElementById('logout-btn');
            logoutbtn.addEventListener('click', function () {
                firebase.auth().signOut().then(function () {
                    alert('Log Out Successfully!!!');
                    window.location.replace('index.html');
                }).catch(function (error) {
                    alert('Something wrong happened.....');
                });
            });
        }

    });

});


