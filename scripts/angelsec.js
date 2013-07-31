// --- INIT iSCROLL LITE
/*
	var theScroll;
	function scroll(){
		theScroll = new iScroll('wrapper');
	}
*/
/* document.addEventListener('DOMContentLoaded', scroll, false); */

// --- JQUERY READY
$().ready(function() { 	
	// --- CORDOVA READY
	document.addEventListener("deviceready", onDeviceReady, false);   
	function onDeviceReady() {
	
		// CHECK USER LOGGED IN			
		if(logged_in != 'true'|| logged_in == undefined){
			// Not Logged -> Display Login
			page('#login');
		}else{
			// Logged In Display Splash Page
			loggedCheck();
			page('#splash');
		}
		
		// Check Whether Logged As To Display Nav
		function loggedCheck(){
			if(logged_in == 'true'){
				$('#footer h3').hide();
				$('#tab-bar').show();
			}
		}
		
		// TAB-BAR PAGE CONTOLLER
		$('#tab-bar a').on('click', function(e){
			e.preventDefault();
		    var nextPage = $(e.target.hash);
			page(nextPage);
		});
		
		
		// FORM PAGE CONTOLLER
		$('#form-list a').on('click', function(e){
			// CALL FORM PAGE
			e.preventDefault();
		    var nextPage = $(e.target.hash);
			page(nextPage);
			
			// LOAD FORM
			var formLoc = 'http://asgt.mocwebservices.co.uk/ANGELSEC/forms/';
			var formId  = $(this).attr('id');
			
			alert('Form ID: '+formID);
			
		});
		

	}
	
	
	function page(newPage) {
		
		alert('Go To: '+newPage);
		
		var toPage = $(newPage),
		fromPage = $("#pages .current");
				
		if(toPage.hasClass("current") || toPage === fromPage) {
			return;
		}
		fromPage.removeClass("current").toggle('slow', function(){
			toPage.addClass("current").toggle('slow');
		});
		
		/*
toPage.addClass("current fade in").one("webkitAnimationEnd", function(){
			fromPage.removeClass("current fade out");
			toPage.removeClass("fade in")
		});
		fromPage.addClass("fade out");
*/
		
		/*
var toPage = $(toPage),
		fromPage = $("#pages .current");
		if(toPage.hasClass("current") || toPage === fromPage) {
			return;
		};
		toPage.addClass("current").toggle('slow'), function(){
			fromPage.removeClass("current").toggle('slow');
		});
*/
		
	}

});