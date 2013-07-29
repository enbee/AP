   //JQUERY READY
      $().ready(function() {  
      // Wait for PhoneGap to load
       document.addEventListener("deviceready", onDeviceReady, false);
	   
		function onDeviceReady() {
		    // Now safe to use device APIs
		    //alert('Device Be Ready');
		    // PhoneGap is ready

        
		//function onDeviceReady() {

            // Retrieve image file location from specified source
			
			// ON BTN CLICK
			$('#upload_btn').click(function() {
				
				
				navigator.camera.getPicture(uploadPhoto,
                                        function(message) { alert('get picture failed'); },
                                        { quality: 50, 
                                        destinationType: navigator.camera.DestinationType.FILE_URI,
                                        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY }
                                        );	        
    });
			
            

        }

        function uploadPhoto(imageURI) {
            var options = new FileUploadOptions();
            options.fileKey="file";
            options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1)+".jpg";
            options.mimeType="image/jpeg";
            //options.chunkedMode = false;

            var params = new Object();
            params.user = "android";
            params.userID = "21";
            params.report = "37";
            params.db = "angelsec";
            //params.value2 = filename.substr(filename.lastIndexOf(".")+1);;
            //params.extension = filename.substr(filename.lastIndexOf(".")+1);
			params.headers={'Connection':'close'};
			
            options.params = params;
			
			//alert(JSON.stringify(imageURI));
			
            var ft = new FileTransfer();
            
            
              ft.onprogress = function(progressEvent) {
				if (progressEvent.lengthComputable) {
					var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
					//statusDom.innerHTML = perc + "% loaded...";
					//$('#response').append(perc + "% loaded...");
					$('#progress span').css({
                        'width': perc + "%"
                    }).html(perc + "%");
				} else {
					if(statusDom.innerHTML == "") {
						statusDom.innerHTML = "Loading";
					} else {
						statusDom.innerHTML += ".";
					}
				}
			};  
			
			ft.upload(imageURI, encodeURI("http://asgt.mocwebservices.co.uk/PG/services/upload.php"), win, fail, options);            
        }

        function win(r) {
            //console.log("Code = " + r.responseCode);
            //console.log("Response = " + r.response);
           // console.log("Sent = " + r.bytesSent);
            //alert(JSON.stringify(r));
            // alert('Image Upload Success \n'+r.file);
            
           /*
 xhr.upload.addEventListener("progress", function(e) {
                    if (e.lengthComputable) {
                        var loaded = Math.ceil((e.loaded / e.total) * 100);
                        $('#area p span').css({
                            'width': loaded + "%"
                        }).html(loaded + "%");
                    }
                }, false);
*/
            
            var str = r.response;
           // delete ft;
            if (str.substr(0, 5) == 'ERROR') {
                  $('#response').append(str); 
                  // alert('fail');
                  //ft.abort();  
             }else{
             	var imgURL = 'http://asgt.mocwebservices.co.uk/'+str;
             	/*
$('#upload_btn').toggle('slow', function() {
				    // Animation complete.
				    $('#success').toggle('slow');
				  });
*/
	             $('#response').append('Success: '+imgURL);
	             // Complete
                        $('<img>').attr({
                            'src': imgURL
                        }).css({
                        'margin': '10px auto',
                        'width': '90%',
                        'height': 'auto'
                    }).appendTo($('#response'));
                 //ft.abort();
                 /*
$('#success').click(function() {
					    location.reload();
					});
*/
                 
             }
            
        }

        function fail(error) {
        	$('#response').append('Error Code: '+error.code+'</br>');
        	$('#response').append('Error Source: '+error.source+'</br>'); 
        	$('#response').append('Error Target: '+error.target+'</br>'); 
            /*
alert("An error has occurred: Code = " = error.code);
            console.log("upload error source " + error.source);
            console.log("upload error target " + error.target);
*/
        }
});