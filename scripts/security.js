function init() {
	document.addEventListener("deviceready", deviceReady, true);
	delete init;
}

logged_in = false;

function deviceReady() {
	//alert('Device Ready');
	$("#loginForm").on('submit',handleLogin);
}

function checkPreAuth() {
	var form = $("#loginForm");
	if(window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {
		$("#username", form).val(window.localStorage["username"]);
		$("#password", form).val(window.localStorage["password"]);
		handleLogin();
	}
}

function handleLogin() {
	alert('Handle Login');
	/*
var form = $("#loginForm");    
	//disable the button so we can't resubmit while we wait
	$("#submitButton",form).attr("disabled","disabled");
	var u = $("#username", form).val();
	var p = $("#password", form).val();
	console.log("click");
	if(u != '' && p!= '') {
        $.post("http://asgt.mocwebservices.co.uk/pg/service.php?method=login&returnformat=json", {username:u,password:p}, function(res) {
            if(res == true) {
				//store
				window.localStorage["username"] = u;
				window.localStorage["password"] = p;             
				alert('Change Page');
			} else {
				navigator.notification.alert("Your login failed", function() {});
			}
			$("#submitButton").removeAttr("disabled");
		},"json");
	} else {
		//Thanks Igor!
		navigator.notification.alert("You must enter a username and password", function() {});
		$("#submitButton").removeAttr("disabled");
	}
	return false;
*/
}

/* function deviceReady() { */
    
	//$("#loginForm").on('submit',handleLogin);

/* } */

