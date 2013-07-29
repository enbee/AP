// --- INIT iSCROLL LITE
var theScroll;
function scroll(){
	theScroll = new iScroll('wrapper');
}
document.addEventListener('DOMContentLoaded', scroll, false);

// --- JQUERY READY
$().ready(function() { 
	
	// --- CORDOVA READY
	/*
document.addEventListener("deviceready", onDeviceReady, false);   
	function onDeviceReady() {
*/

		// CHECK IF LOGGED IN TO DISPLAY TAB-BAR
		logge_in == true;
		if(logged_in == true){
			$('#footer h3').hide();
			$('#tab-bar').show();
		}
		
		
		// TAB-BAR PAGE CONTOLLER
		$('#tab-bar a').on('click', function(e){
			e.preventDefault();
		    var nextPage = $(e.target.hash);
			$("#pages .current").removeClass("current");
			nextPage.addClass("current");
		});
		

/* 	} */
	
	
	function page(toPage) {
		alert('Change');
		var toPage = $(toPage),
		fromPage = $("#pages .current");
		if(toPage.hasClass("current") || toPage === fromPage) {
			return;
		};
		toPage.addClass("current fade in").one("webkitAnimationEnd", function(){
			fromPage.removeClass("current fade out");
			toPage.removeClass("fade in")
		});
		fromPage.addClass("fade out");
	}

});