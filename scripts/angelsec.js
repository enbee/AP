// --- JQUERY READY
$().ready(function() { 
		
	// --- CORDOVA READY
	document.addEventListener("deviceready", onDeviceReady, false);
	function onDeviceReady() {
	
		// --------- GET INITIAL GPS ----------------------------------------------------------------------
		navigator.geolocation.getCurrentPosition(onGpsSuccess, onGpsError, { enableHighAccuracy: true });
		//var watchId = navigator.geolocation.watchPosition(onGpsSuccess, onGpsError, { enableHighAccuracy: true });
		
		// --------- UPDATE GLOBAL VARS! ----------------------------------------------------------------
		authorised = window.localStorage.getItem("ap_authorised");
		auth = window.localStorage.getItem("ap_auth");
		userID = window.localStorage.getItem("ap_user_id");
		logged_in = window.localStorage.getItem("ap_logged_in");
		
		// GPS
		lat = window.localStorage.getItem("ap_lat");
		lng = window.localStorage.getItem("ap_lng");
		
		// PATHS AND IDS
		formPath = window.localStorage.getItem("ap_formPath");
		processPath = window.localStorage.getItem("ap_processPath");
		currentReportId = window.localStorage.getItem("ap_reportID");
		
		// --------- CHECK USER LOGGED IN	-----------------------------------------------------------------
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
		
		// ---------- TAB-BAR PAGE CONTOLLER --------------------------------------------------------	
		$('#tab-bar a').on('click', function(e){
			
			e.preventDefault();
		    var nextPage = $(this).attr( "href" );
		    
		    if(nextPage == '#reports'){
			    // Populate Current Report List
			    $("#form-list").empty();
			    getActiveReports();
		    }else if(nextPage == '#photo'){
			    // Reset Photo Page
			    if(currentReportId == ''){
				    $("#photo-buttons").css("display", "none");
					$("#photo-warning").css("display", "block");					
			    }else{
			    	$("#insertFormID").empty().append(currentReportAddress);
					$("#insertFormTS").empty().append(currentReportTS);
				    $("#photo-warning").css("display", "none");
					$("#photo-buttons").css("display", "block");
			    }
		    }
		    
			page(nextPage);
		});
		
		// ----------- LOGOUT HANDLER ----------------------------------------------------------------
		$('a#logout').on('click', function(e){
			e.preventDefault();
			resetbutton(this);
		    logout();
		});
		
		
		// ----------- FORM PAGE CONTOLLER ----------------------------------------------------------
		$('#form-list').on('click', 'a', function(e){
			
			// CALL FORM PAGE
			e.stopImmediatePropagation();
			e.preventDefault();
			resetbutton(this);
			
			var formId  = $(this).attr('id');
			var form = formPath + formId + '.html';
			
			page('#form');
			
			// LOAD FORM
			$.get(form, function(data) {
				
				$('#form-content').html(data).trigger("create");
				
				// UPDATE HIDDED FIELDS
				$("input[name='userID']").val(userID); 
				$("input[name='lat']").val(lat); 
				$("input[name='lng']").val(lng);
			});
			
		});
		
		// ------------ REPORT SUBMIT HANDLING -----------------------------------------------------
		$("#form-content").on('click', '#reportSubmitBtn', function(e){
			
			e.preventDefault();
			navigator.geolocation.getCurrentPosition(onGpsSuccess, onGpsError, { enableHighAccuracy: true });
			
			handleReport();
			
			return false;
		});
	}

	
	// -------- FUNCTIONS -------------------------------------------------------------------------	
	
	function triggerFormLoading(){
		$('#form-loading').toggle();
	}
	
	// Check Whether Logged As To Display Nav
	function loggedCheck(){
		if(logged_in == 'true'){
			$('#footer h3').hide();
			$('#tab-bar').show();
		}
	}
	
	
	// -------- GET ACTIVE REPORTS -------------------------------------------------------------------------
	function getActiveReports(){
		
		// Call for json response of reports
		var reportlistPHP = server_loc + file_path + 'get-report-list.php';
		 $.post(reportlistPHP, {auth:auth, userID:userID}, function(reports) {
        	        	
        	// If reports .. display list
			if(reports.length == 0){
				// No results
				alert('No results');
			}else{
				// Append to list
				$.each(reports, function(){
					
					var string = '<a href="#form" id="'+this.name+'" class="report-btn" data-icon="plus" data-role="button">'+this.label+'</a>';
					$('#form-list').append(string).trigger("create");
				});
			}
        	
		},"json");
		
		return false;
	}
	
	// -------- LOGOUT FUNCTION -------------------------------------------------------------------------
	function logout(){
		
		// REMOVE VARIABLES
		window.localStorage.removeItem("ap_lat");
		window.localStorage.removeItem("ap_lng");
		window.localStorage.removeItem("ap_username");
		window.localStorage.removeItem("ap_password");
		window.localStorage.setItem("ap_logged_in", false); 
		
		// RESET FORM
		$('#loginForm').find("input[type=password], input[type=text], textarea").val("");
		
		// GO TO LOGIN PAGE
		page('#login');
		
		$('#tab-bar').hide();
		$('#footer').show();
		
	}
	
	// -------- PAGE SWITCHER -------------------------------------------------------------------------
	function page(toPage) {
		
		// Update GPS On page change
		navigator.geolocation.getCurrentPosition(onGpsSuccess, onGpsError, { enableHighAccuracy: true });
		
		var toPage = $(toPage);
		fromPage = $("#pages .current");
				
		if(toPage.hasClass("current") || toPage === fromPage) {
			return;
		}
		fromPage.removeClass("current").fadeToggle('fast', 'linear', function(){
			toPage.addClass("current").toggle('slow');
		});
		
	}
	
	
	// -------- ON FORM SUBMIT FUNCTION -----------------------------------------------------------------
	function handleReport() {
		
		// UPDATE HIDDED FIELDS
		$("input[name='userID']").val(userID); 
		$("input[name='lat']").val(lat); 
		$("input[name='lng']").val(lng); 
		
		var form = "#reportForm";
		$("#reportSubmitBtn",form).attr("disabled","disabled");
		
		// GET FORM DATA AND CONVER TO JSON
		var formPre = $(form).serializeObject();		
		var formJSON = JSON.stringify($(form).serializeObject());
		
		// Get Form Name
		var reportArray = JSON.parse(formJSON);
		var formName = reportArray.formName;
		
		// SUBMIT FORM DATA
		var formId  = $(this).attr('id');
		var fileName = formName + '.php'
		var processURL = processPath + fileName;
		
		// POST DATA AND HANDLE RESPONSE
		 $.post(processURL, formPre, function(response) {
        	
        	var success = response.response;
        	currentReportId = response.reportID;
	        currentReportAddress = response.address + ', ' + response.postcode;
	        currentReportTS = response.timestamp;
        	
        	window.localStorage.setItem("ap_reportID", currentReportId);
        	window.localStorage.setItem("ap_reportAddress", currentReportAddress);
			window.localStorage.setItem("ap_reportAddress", currentReportTS);
        	
        	// Set variables
            if(success == 'true') {
            	
            	alert("Congratulations, report submitted successfully. Now add your images.");
            	
				$("#pages .current").removeClass("current").toggle('slow', function(){
					// Update Current Report
					// Reset Photo Page
				    if(currentReportId == ''){
					    $("#photo-buttons").css("display", "none");
						$("#photo-warning").css("display", "block");					
				    }else{
				    	$("#insertFormID").empty().append(currentReportAddress);
						$("#insertFormTS").empty().append(currentReportTS);
					    $("#photo-warning").css("display", "none");
						$("#photo-buttons").css("display", "block");
				    }
					// Go To Photo Uploader
					$("#photo").addClass("current").toggle('slow');
				});
				
				$("#reportSubmitBtn").removeAttr("disabled");
				
			} else {
				alert("Report submission failed. Check your internet connection and try again.", function() {});
			}
			$("#reportSubmitBtn").removeAttr("reportSubmitBtn");
		},"json");
		
		
		return false;
	}
	
	// ------ WONDERFUL FUNCTION TO SERIALIZE OBJECT TO JSON -----------------------------------------------------------
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
	
	// ---------- RESET PHOTO FORM -------------------------------------------------------------------------------
	/*
function resetPhotoForm(){
		// EMPTY RESPONSE
		$('#response').empty();
		
		// RESET PROGRESS BAR
		$('#progress span').css({
			'width': "0%"
		}).empty();
		
		$('#progress').css("display", "none");
		$('#success').css("display", "block");
		
		// DISPLAY CORRECT PAGE AND / OR SET ADDRESS
	    if(currentReportId == ''){
		    $("#photo-buttons").css("display", "none");
			$("#photo-warning").css("display", "block");					
	    }else{
	    	$("#insertFormID").empty().append(currentReportAddress);
			$("#insertFormTS").empty().append(currentReportTS);
		    $("#photo-warning").css("display", "none");
			$("#photo-buttons").css("display", "block");
	    }
		
	}
*/
	
	// -------- GPS RESPONSE FUNCTIONS ----------------------------------------------------------------------------
	function onGpsSuccess(position) {
		
		// UPDATE LOCAL STORAGE
		window.localStorage.setItem("ap_lat", position.coords.latitude);
		window.localStorage.setItem("ap_lng", position.coords.longitude);
		
		// UPDATE VARS
		lat = window.localStorage.getItem("ap_lat");
		lng = window.localStorage.getItem("ap_lng");
	}
	
	
	function onGpsError(error) {	
		window.localStorage.setItem("ap_lat", '0');
		window.localStorage.setItem("ap_lng", '0');
	}
	
	
	// --- RESET BUTTONS --------------------------------------------------------------------------------------------
	var resetbutton = function(buttonname) {
		$(buttonname).removeClass("ui-btn-active");
	}

});