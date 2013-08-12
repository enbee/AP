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
		
		// Get initial GPS
		//navigator.geolocation.getCurrentPosition(onGpsSuccess, onGpsError);
		
		function onGpsSuccess(position) {
			window.localStorage.setItem("ap_lat", position.coords.latitude);
			window.localStorage.setItem("ap_lng", position.coords.longitude);
			/*
alert('Latitude: '           + position.coords.latitude              + '<br />' +
                            'Longitude: '          + position.coords.longitude             + '<br />' +
                            'Altitude: '           + position.coords.altitude              + '<br />' +
                            'Accuracy: '           + position.coords.accuracy              + '<br />' +
                            'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
                            'Heading: '            + position.coords.heading               + '<br />' +
                            'Speed: '              + position.coords.speed                 + '<br />' +
                            'Timestamp: '          + new Date(position.timestamp)          + '<br />');
*/
		}
		
		
		function onGpsError(error) {
			/*
alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');	
*/		
			if (localStorage.getItem("infiniteScrollEnabled") === null) {
				window.localStorage.setItem("ap_lat", '0');
				window.localStorage.setItem("ap_lng", '0');
  			}
		}
		
		
		
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
		   /*  alert('Next Page: '+e.target.hash); */
		    // Check if reports
		    if(e.target.hash == '#reports'){
			    // Populate Current Report List
			    //alert('call function!');
			    $("#form-list").empty();
			    getActiveReports();
		    }
		    
			page(nextPage);
		});
		
		
		$('a#logout').on('click', function(e){
			e.preventDefault();
			resetbutton(this);
		    logout();
		});
		
		
		// FORM PAGE CONTOLLER
		$('#form-list').on('click', 'a', function(e){
			// CALL FORM PAGE
			alert('Start Load');
			
			e.stopImmediatePropagation();
			e.preventDefault();
			resetbutton(this);
			
			var formLoc = 'http://asgt.mocwebservices.co.uk/ANGELSEC/forms/';
			var formId  = $(this).attr('id');
			var form = formLoc + formId + '.html';
			//var nextPage = $('#form');
			//var nextPage = $(e.target.hash);
			page('#form');
			
			triggerFormLoading();
			
			// LOAD FORM
			$.get(form, function(data) {
				triggerFormLoading();
				$('#form-content').html(data);
			});
			
		});
	}
	
	
	function triggerFormLoading(){
		$('#form-loading').toggle();
	}
	
	
	function getActiveReports(){
		//alert('Get Report List');
		// Call for json response of reports
		 $.post("http://asgt.mocwebservices.co.uk/PG/services/get-report-list.php", {auth:auth, userID:userID}, function(reports) {
        	//navigator.notification.alert(JSON.stringify(response));
        	
        	/* var success = response.response; */
        	
        	// If reports .. display list
			if(reports.length == 0){
				// No results
				alert('No results');
			}else{
				// Append to list
				//alert(JSON.stringify(reports));
				//$('#form-list').listview();
				$.each(reports, function(){
					
					var string = '<a href="#form" id="'+this.name+'" class="report-btn" data-icon="plus" data-role="button">'+this.label+'</a>';
									
					
					$('#form-list').append(string).trigger("create");
					//$('ul#form-list').listview('refresh');
					
					
				});
				//$('#form-list').listview('refresh');
				//$("#form-list ul li a").attr("data-role", "button").attr("data-icon", "plus");
			}
        	
		},"json");
		
		return false;
	}
	
	
	function logout(){
		
		
		window.localStorage.removeItem("ap_lat");
		window.localStorage.removeItem("ap_lng");
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
	
		//alert('Form: '+formPath+'/n Process: '+processPath);
		// Update GPS On page change
		navigator.geolocation.getCurrentPosition(onGpsSuccess, onGpsError);
		var toPage = $(toPage),
		fromPage = $("#pages .current");
				
		if(toPage.hasClass("current") || toPage === fromPage) {
			return;
		}
		fromPage.removeClass("current").toggle('slow', function(){
			toPage.addClass("current").toggle('slow');
		});
		
	}
	
	var resetbutton = function(buttonname) {
		$(buttonname).removeClass("ui-btn-active");
	}

});