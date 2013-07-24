// --- INIT iSCROLL LITE
var theScroll;
function scroll(){
	alert('Scroll');
	theScroll = new iScroll('wrapper');
}
document.addEventListener('DOMContentLoaded', scroll, false);

// --- JQUERY READY
$().ready(function() { 
	alert('jQuery');
	
	// --- CORDOVA READY
	document.addEventListener("deviceready", onDeviceReady, false);   
	function onDeviceReady() {
		alert('ready');
		$('#tab-bar a').on('click', function(e){
			e.preventDefault();
		    var nextPage = $(e.target.hash);
			$("#pages .current").removeClass("current");
			nextPage.addClass("current");
		});
		

	}
	
	
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