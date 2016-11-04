var pictureSource;
// picture source
var destinationType;
// sets the format of returned value
// Wait for device API libraries to load
//
document.addEventListener("deviceready", onDeviceReady, false);
// device APIs are available
//

function onDeviceReady() {
    
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
}

/**
 * Flag : True to run app in desktop and false for mobile appls(with cordova)
 */
var adminSso = 502365512;
var desktopVersion = true;
var isAndroid = false;
var appVer = 'Test -  TrueSense Issue Tracker - 1.0.21'
//var baseURL = 'https://gecoepaasdev.service-now.com/';  	// Dev
var baseURL = 'https://gecoepaastest.service-now.com/';	// Test
//var baseURL = 'https://gepaassb.service-now.com/';		// Sandbox

//var baseURL = 'https://gecoepaas.service-now.com/';		// Prod


var app = {
    initialize : function() {
        //For run and test the application in desktop (~ without cordova)
        if (desktopVersion || desktopVersion == true || desktopVersion == 'true') {
            this.startApp();
        } else {
            this.bindEvents();
        }
    },
    
    bindEvents : function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    onDeviceReady : function() {
        angular.element(document).ready(function() {
                                        angular.bootstrap(document, ['TrueSense']);
                                        });
    },
    
    startApp : function() {
        angular.element(document).ready(function() {
                                        angular.bootstrap(document, ['TrueSense']);
                                        });
    }
};





function onPhotoURISuccess(imageURI) {
    
    // Uncomment to view the image file URI
    // console.log(imageURI);
    // Get image handle
    //
    var galleryImage = document.getElementById('image');
    // Unhide image elements
    //
    galleryImage.style.display = 'block';
    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //
    galleryImage.src = imageURI;
    
}
// A button will call this function
//


function getPhoto(source) {
    // Retrieve image file location from specified source
    
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {
                                quality: 80,
                                targetWidth: 600,
                                targetHeight: 600,
                                destinationType: destinationType.FILE_URI,
                                sourceType: source
                                });
}
// Called if something bad happens.
//

function onFail(message) {
    //alert('Failed because: ' + message);
}

function win(r) {
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
}

function fail(error) {
    // alert("An error has occurred: Code = " + error.code);
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
}


