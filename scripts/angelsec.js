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
		var watchId = navigator.geolocation.watchPosition(onGpsSuccess, onGpsError, { enableHighAccuracy: true });
		
		// --- CHECK USER LOGGED IN	-----
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
			//alert('Start Load');
			
			e.stopImmediatePropagation();
			e.preventDefault();
			resetbutton(this);
			
			//var formLoc = 'http://asgt.mocwebservices.co.uk/ANGELSEC/forms/';
			var formId  = $(this).attr('id');
			var form = formPath + formId + '.html';
			/* var form = formLoc + formId + '.html'; */
			//var nextPage = $('#form');
			//var nextPage = $(e.target.hash);
			//var nextPage = e.target.hash;
			//alert(nextPage);
			//page(nextPage);
			page('#form');
			
			//triggerFormLoading();
			
			// LOAD FORM
			$.get(form, function(data) {
				//triggerFormLoading();
				$('#form-content').html(data).trigger("create");
			});
			
		});
		
		
		// Listen for onSubmit report
		/* $("#reportForm").on('submit',handleReport); */
		//$("#form-content").on('click', '#reportSubmitBtn', handleReport());
		
		/*
$( "#reportForm" ).on( "submit", function( event ) {
		  event.preventDefault();
		  console.log( $(this).serialize() );
		  return false;
		});
*/
		
		$("#form-content").on('click', '#reportSubmitBtn', function(e){
			
			e.preventDefault();
			
			handleReport();
			
			//alert('Report Report');
			
			return false;
		});
	}
	
	
	function triggerFormLoading(){
		//alert('Toggle Form Load');
		$('#form-loading').toggle();
	}
	
	// Check Whether Logged As To Display Nav
	function loggedCheck(){
		if(logged_in == 'true'){
			$('#footer h3').hide();
			$('#tab-bar').show();
		}
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
	
	// --- PAGE SWITCHER ----
	
	function page(toPage) {
	
		//alert('P. Form: '+formPath+'/n Process: '+processPath);
		// Update GPS On page change
		
		//alert('Lat: '+lat+' // Lng: '+lng);
		
		//navigator.geolocation.getCurrentPosition(onGpsSuccess, onGpsError);
		
		var toPage = $(toPage),
		fromPage = $("#pages .current");
				
		if(toPage.hasClass("current") || toPage === fromPage) {
			return;
		}
		fromPage.removeClass("current").toggle('slow', function(){
			toPage.addClass("current").toggle('slow');
		});
		
	}
	
	
	// ON FORM SUBMIT FUNCTION
	function handleReport() {
		var form = "#reportForm"
		$("#reportSubmitBtn",form).attr("disabled","disabled");
		// GET FORM DATA AND CONVER TO JSON
		var formJSON = JSON.stringify($(form).serializeObject());
		//var formJSON = JSON.stringify($("#reportForm").serializeObject());
		//console.log('Form Submitted: '+ JSON.stringify($(form).serializeObject()));
		
		var reportArray = JSON.stringify($(form).serializeArray());
		
		console.log('Form Name: '+reportArray[0]);
		
		/* var formName = reportArray[0].formName; */
		//alert(reportArray.array[0].formName);
		//alert(reportArray.myArray.formName);
		// SUBMIT FORM DATA
		var formId  = $(this).attr('id');
		var fileName = formName + '.php'
		var processURL = processPath + fileName ;
		
		//alert(processURL);
		
		return false;
	}
	
	// WONDERFUL FUNCTION TO SERIALIZE OBJECT TO JSON
	$.fn.serializeObject = function(){
	    var o = {};
	    var a = this.serializeArray();
	    $.each(a, function() {
	        if (o[this.name] !== undefined) {
	            if (!o[this.name].push) {
	                o[this.name] = [o[this.name]];
	            }
	            o[this.name].push(this.value || '');
	        } else {
	            o[this.name] = this.value || '';
	        }
	    });
	    return o;
	};
	
	
	// --- GPS RESPONSE FUNCTIONS ---
	
	function onGpsSuccess(position) {
		
		// UPDATE LOCAL STORAGE
		window.localStorage.setItem("ap_lat", position.coords.latitude);
		window.localStorage.setItem("ap_lng", position.coords.longitude);
		
		// UPDATE VARS
		lat = window.localStorage.getItem("ap_lat");
		lng = window.localStorage.getItem("ap_lng");
		
		//alert('Lat: '+lat+' // Lng: '+lng);
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
		
		window.localStorage.setItem("ap_lat", '0');
		window.localStorage.setItem("ap_lng", '0');
	}
	
	
	// --- RESET BUTTONS
	
	var resetbutton = function(buttonname) {
		$(buttonname).removeClass("ui-btn-active");
	}

});