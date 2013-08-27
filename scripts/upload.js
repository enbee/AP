// JQUERY READY
$().ready(function() {  
	// Wait for PhoneGap to load
	document.addEventListener("deviceready", onDeviceReady, false);

	function onDeviceReady() {
		
		// ------- ON UPLOAD BTN CLICK ---------------------------------------------
		$('#upload_btn').click(function() {
		
		
			navigator.camera.getPicture(uploadPhoto, 
			function(message) { alert('get picture failed'); },
			{ quality: 50, 
				destinationType: navigator.camera.DestinationType.FILE_URI,
				sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY }
			);	        
			});
		}
		
		
		// ------ PHOTO UPLOAD FUNCTION ---------------------------------------------
		function uploadPhoto(imageURI) {
		
			var options = new FileUploadOptions();
			options.fileKey="file";
			options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1)+".jpg";
			options.mimeType="image/jpeg";
			//options.chunkedMode = false;
			
			// - SET UP PARAMETERS
			var params = new Object();
			
			params.userID = userID;
			params.auth = auth;
			params.report = currentReportId;
			
			params.headers={'Connection':'close'};
			
			options.params = params;
			
			
			var ft = new FileTransfer();
			
			$('#upload_btn').fadeToggle('fast', 'linear', function(){
				$('#progress').toggle('slow');
			});
			
			ft.onprogress = function(progressEvent) {
				
				if (progressEvent.lengthComputable) {
					
					// - PERCENTAGE BAR
					var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
					
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
		
		
		// ------- ON FILE TRANSFER SUCCESS ---------------------------------------------
		function win(r) {
		
			var str = r.response;
			
			if (str.substr(0, 5) == 'ERROR') {
				$('#response').append(str);
			}else{
				var imgURL = 'http://asgt.mocwebservices.co.uk/'+str;
				$('#progress span').html("Upload Complete");
				//$('#response').prepend('Success: '+imgURL);
				// Complete
				$('#success').toggle('slow');
				  
				$('<img>').attr({
					'src': imgURL
				}).css({
					'margin': '10px auto',
					'width': '90%',
					'height': 'auto'
				}).prependTo($('#response'));
			}
		}
		
		// ------- ON FILE TRANSFER FAILURE ---------------------------------------------
		function fail(error) {
			$('#response').append('Error Code: '+error.code+'</br>');
			$('#response').append('Error Source: '+error.source+'</br>'); 
			$('#response').append('Error Target: '+error.target+'</br>');
		}
		
		// ------- RESET UPLOAD FORM ----------------------------------------------------
		$('#success').click(function() {
		    $('#response').empty();
		    $('#progress').fadeToggle('fast', 'linear', function(){
			    // Animation complete.
				$('#progress span').css({
					'width': "0%"
				}).empty();
		    });
		    $('#success').fadeToggle('fast', 'linear', function() {
		    	$('#upload_btn').toggle('slow');
				
			});
		});
});