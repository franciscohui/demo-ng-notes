var app = angular.module("notes-app", ["firebase"]);

// create a re-usable factory that generates the $firebaseAuth instance
app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://ng-notes-demo.firebaseio.com");
    return $firebaseAuth(ref);
  }
]);

app.factory("messages", ["$firebaseArray",
  function($firebaseArray) {
    var ref = new Firebase("https://ng-notes-demo.firebaseio.com");
    return $firebaseArray(ref);
  }
]);

// and use it in our controller

app.controller("MainCtrl", ["$scope", "Auth", "messages",
  function($scope, Auth, messages) {

    $scope.auth = Auth;
    // console.log(Auth);
    
    $scope.messages = messages;
    // console.log(messages);

    // any time auth status updates, add the user data to scope
    $scope.auth.$onAuth(function(authData) {
      $scope.authData = authData;
    });

    // add new items to the array
    // the message is automatically added to our Firebase database!
    function addMessage(newMessageText){
      $scope.messages.$add({
        text: $scope.newMessageText
      });
      resetForm();
    }
    $scope.addMessage = addMessage;

    function resetForm(){
      $scope.newMessageText = '';
    }

    $scope.createUser = function() {
      $scope.message = null;
      $scope.error = null; //https://www.firebase.com/docs/web/libraries/angular/guide/extending-services.html
      Auth.$createUser({email: $scope.email, password: $scope.password})      
      .then(function(userData) {
        $scope.message = "User created with uid: " + userData.uid;
        console.log("user created for " + userData);
      }).catch(function(error) {
        $scope.error = error;
        console.log("user error for " + userData);
      });
    }; // $scope.createUser

    $scope.signInUser = function(){
      Auth.$authWithPassword({email: $scope.email, password: $scope.password})      
      .then(function(authData) {
        console.log("Signed in as:", authData);
        console.log("Signed in as:", authData.password.email);
      })
      .catch(function(error) {
        console.error("Authentication failed:", error);
      });
    }; // $scope.logInUser

  } // function($scope, Auth)
]); // app.controller
