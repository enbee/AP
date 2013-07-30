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
		

	}
	
	
	function page(toPage) {
	
		var toPage = $(toPage),
		fromPage = $("#pages .current");
		if(toPage.hasClass("current") || toPage === fromPage) {
			return;
		};
		toPage.addClass("current").toggle('slow'), function(){
			fromPage.removeClass("current").toggle('slow');
		});
	}

});