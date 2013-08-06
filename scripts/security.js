function init() {
	document.addEventListener("deviceready", deviceReady, true);
	delete init;
}

// logged_in = false;

function deviceReady() {
	//alert('Device Ready');
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

// AUTH
function handleAuth() {
	//alert('Handle Login');
	//navigator.notification.alert('Handle Auth!');
	var form = $("#authForm");   
	//disable the button so we can't resubmit while we wait
	$("#authBtn",form).attr("disabled","disabled");
	var ac = $("#auth", form).val();
	//navigator.notification.alert("AC: "+ac);
	if(ac != '') {
		
		//navigator.notification.alert('Go');
        $.post("http://asgt.mocwebservices.co.uk/PG/services/authorise.php", {auth:ac}, function(response) {
        	//navigator.notification.alert(JSON.stringify(response));
        	
        	var success = response.response;
        	
        	//navigator.notification.alert(success);
        	// Set variables
        	
            if(success == 'true') {
            	navigator.notification.alert("Congratulations, authorisation successful. Please login to continue.");
				//store
				window.localStorage.setItem("ap_auth", ac);
				window.localStorage.setItem("ap_authorised", true); 
				
				//alert('Switch Pages');
				//page('#splash');
				/*
$("#pages .current").removeClass("current");
				$("#splash").addClass("current");
*/
				$("#pages .current").removeClass("current").toggle('slow', function(){
					$("#login").addClass("current").toggle('slow');
				});
				
				$("#authBtn").removeAttr("disabled");
				
			} else {
				navigator.notification.alert("Authorisation failed, please try again or contact your employer.", function() {});
			}
			$("#authBtn").removeAttr("disabled");
		},"json");
	} else {
		//Thanks Igor!
		navigator.notification.alert("You must enter a valid authorisation code.", function() {});
		$("#authBtn").removeAttr("disabled");
	}
	$("#authBtn").removeAttr("disabled");
	//alert('false');
	return false;
}


// LOGIN
function handleLogin() {
	//alert('Handle Login');
	var form = $("#loginForm");
	
	//disable the button so we can't resubmit while we wait
	$("#submitBtn",form).removeClass("ui-btn-active").attr("disabled","disabled");
	var u = $("#username", form).val();
	var p = $("#password", form).val();
	//navigator.notification.alert("click");
	if(u != '' && p!= '') {
		//alert(auth);
		//navigator.notification.alert('Go');
        $.post("http://asgt.mocwebservices.co.uk/PG/services/login.php", {username:u,password:p,auth:auth}, function(response) {
        	/* navigator.notification.alert(JSON.stringify(response)); */
        	
        	var success = response.response;
        	var user_id = response.user_id;
        	var user = response.user;
        	var type = response.type;
        	
        	//navigator.notification.alert(success);
        	// Set variables
        	
            if(success == 'true') {
            	//navigator.notification.alert("Login Success");
				//store
				window.localStorage.setItem("ap_username", u);
				window.localStorage.setItem("ap_password", p); 
				window.localStorage.setItem("ap_logged_in", true); 
				
				//alert('Switch Pages');
				//page('#splash');
				/*
$("#pages .current").removeClass("current");
				$("#splash").addClass("current");
*/
				$("#pages .current").removeClass("current").toggle('slow', function(){
					$("#splash").addClass("current").toggle('slow');
				});
				
				
				$('#footer h3').hide();
				$('#tab-bar').show();
				
				$("#submitBtn").removeAttr("disabled");
				
			} else {
				navigator.notification.alert("Your login failed", function() {});
			}
			$("#submitBtn").removeAttr("disabled");
		},"json");
	} else {
		//Thanks Igor!
		navigator.notification.alert("You must enter a username and password", function() {});
		$("#submitBtn").removeAttr("disabled");
	}
	return false;
}

/* function deviceReady() { */
    
	//$("#loginForm").on('submit',handleLogin);

/* } */

