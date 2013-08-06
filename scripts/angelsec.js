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
		if(authorised != 'true'|| authorised == undefined){
			page('#authorise');
		}else{	
			if(logged_in != 'true'|| logged_in == undefined){
				// Not Logged -> Display Login
				page('#login');
			}else{
				// Logged In Display Splash Page
				loggedCheck();
				page('#splash');
			}
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
		
		
		$('a#logout').on('click', function(e){
			e.preventDefault();
		    logout();
		});
		
		
		// FORM PAGE CONTOLLER
		$('#form-list a').on('click', function(e){
			// CALL FORM PAGE
			alert('Start Load');
			e.preventDefault();
			var formLoc = 'http://asgt.mocwebservices.co.uk/ANGELSEC/forms/';
			var formId  = e.target.id;
			var form = formLoc + formId + '.html';
			
			var nextPage = $('#form');
			page(nextPage);
			
			triggerFormLoading();
			
			// LOAD FORM
			$.get(form, function(data) {
				triggerFormLoading();
				$('#form-content').html(data);
				alert('Load was performed.');
			});
			
		});
		

	}
	
	function triggerFormLoading(){
		$('#form-loading').toggle();
	}
	
	function logout(){
		
		window.localStorage.removeItem("ap_username");
		window.localStorage.removeItem("ap_password");
		window.localStorage.setItem("ap_logged_in", false); 
		
		// Reset form
		$('#loginForm').find("input[type=password], input[type=text], textarea").val("");
		
		page('#login');
		
		$('#tab-bar').hide();
		$('#footer h3').show();
		
	}
	
	
	function page(toPage) {
	
		var toPage = $(toPage),
		fromPage = $("#pages .current");
				
		if(toPage.hasClass("current") || toPage === fromPage) {
			return;
		}
		fromPage.removeClass("current").toggle('slow', function(){
			toPage.addClass("current").toggle('slow');
		});
		
		//alert('Go To: '+JSON.stringify(toPage));
		
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