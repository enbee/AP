function init() {
	document.addEventListener("deviceready", deviceReady, true);
	delete init;
}

function deviceReady() {
	// HANDLE LOGINS
	$("#authForm").on('submit',handleAuth);
	$("#loginForm").on('submit',handleLogin);
}

function checkPreAuth() {
	var form = $("#loginForm");
	if(window.localStorage["ap_username"] != undefined && window.localStorage["ap_password"] != undefined) {
		$("#username", form).val(window.localStorage["ap_username"]);
		$("#password", form).val(window.localStorage["ap_password"]);
		handleLogin();
	}
}

// -------- HANDLE AUTHORISATION -------------------------------------------------------------------------
function handleAuth() {
	
	var form = $("#authForm");
	
	//- Disable the button so we can't resubmit while we wait
	$("#authBtn",form).attr("disabled","disabled");
	var ac = $("#auth", form).val();
	if(ac != '') {
		
		var authorisePHP = server_loc + file_path + 'authorise.php';
        $.post(authorisePHP, {auth:ac}, function(response) {
        	        	
        	var success = response.response;
        	var userID = response.user_id;
        	
        	
        	
        	// CHECK SUCCESS STATUS
            if(success == 'true') {
            alert('success');
            	navigator.notification.alert("Congratulations, authorisation successful. Please login to continue.");
				
				// - STORE DATA
				window.localStorage.setItem("ap_auth", ac);
				window.localStorage.setItem("ap_authorised", true);
				auth = ac;
				
				$("#pages .current").removeClass("current").fadeToggle('fast', 'linear', function(){
					$("#login").addClass("current").toggle('slow');
				});
				
				$("#authBtn").removeAttr("disabled");
				
			} else {
			alert('fail');
				navigator.notification.alert("Authorisation failed, please try again or contact your employer.", function() {});
			}
			$("#authBtn").removeAttr("disabled");
		},"json");
	} else {
		
		navigator.notification.alert("You must enter a valid authorisation code.", function() {});
		$("#authBtn").removeAttr("disabled");
	}
	
	$("#authBtn").removeAttr("disabled");
	
	return false;
}


// -------- HANDLE LOGIN -------------------------------------------------------------------------
function handleLogin() {
	
	var form = $("#loginForm");
	
	// - Disable the button so we can't resubmit while we wait
	$("#submitBtn",form).attr("disabled","disabled");
	var u = $("#username", form).val();
	var p = $("#password", form).val();
	
	if(u != '' && p!= '') {
		
		// SEND LOGIN FORM
		var loginPHP = server_loc + file_path + 'login.php';
        $.post(loginPHP, {username:u,password:p,auth:auth}, function(response) {
        	
        	// SET VARS AND UPDATE THE GLOBALS
        	var success = response.response;
        	var user_id = response.user_id;
        	var user = response.user;
        	var type = response.type;
        	formPath = response.formPath;
        	processPath = response.processPath;
        	userID = response.user_id;
        	
        	if(response.report == null){
	        	currentReportId = '';
	        	currentReportAddress = '';
	        	currentReportTS = '';
        	}else{
	        	currentReportId = response.report.report_id;
	        	currentReportAddress = response.report.address + ', ' + response.report.postcode;
	        	currentReportTS = response.report.timestamp;
        	}
        	
        	
            if(success == 'true') {
            	
            	// STORE LOGIN INFO INTO LOCALSTORAGE FOR REUSE
				window.localStorage.setItem("ap_username", u);
				window.localStorage.setItem("ap_password", p);
				window.localStorage.setItem("ap_user_id", user_id);
				window.localStorage.setItem("ap_logged_in", true); 
				window.localStorage.setItem("ap_formPath", formPath);
				window.localStorage.setItem("ap_processPath", processPath);
				window.localStorage.setItem("ap_reportID", currentReportId);
				window.localStorage.setItem("ap_reportAddress", currentReportAddress);
				window.localStorage.setItem("ap_reportAddress", currentReportTS);
				
				// - PAGING
				$("#pages .current").removeClass("current").fadeToggle('fast', 'linear', function(){
					$("#splash").addClass("current").toggle('slow');
				});
				
				$('#footer').hide();
				$('#tab-bar').show();
				
				// - REENABLE SUBMIT
				$("#submitBtn").removeAttr("disabled");
				
			} else {
				navigator.notification.alert("Your login failed", function() {});
			}
			$("#submitBtn").removeAttr("disabled");
		},"json");
	} else {
		// - LOGIN ERROR HANDLING
		navigator.notification.alert("You must enter a username and password", function() {});
		$("#submitBtn").removeAttr("disabled");
	}
	return false;
}