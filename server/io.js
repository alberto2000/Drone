exports.init = function() {

	log('IO module init...');

	var sound = false;

	io.on('connection', function(socket) {

		socket.on('action', function(msg) {
	    
		  	switch(msg) {

		  		case 'takeOff':
		  			log("webInterface: takeOff");
		  			Drone.takeOff();
		  			if (sound) {
		  				oscClient.send('/2/push4', 1);
		  				setTimeout(function() {
		  					oscClient.send('/2/push4', 0);
		  				}, 5000);
		  			}
		  		break;

		  		case 'land':
		  			log("webInterface: land");
		  			Drone.land();
		  			if (sound) {
		  				OSC.resetAllOSC();
		  			}
		  		break;

		  		case 'rotateLeft':
		  			log("webInterface: rotateLeft");
		  			Drone.rotateLeft();
		  		break;

		  		case 'rotateRight':
		  			log("webInterface: rotateRight");
		  			Drone.rotateRight();
		  		break;

		  		case 'rise':
		  			log("webInterface: rise");
		  			Drone.rise();
		  			if (sound) {
		  				oscClient.send('/2/push5', 1);
		  				setTimeout(function() {
		  					oscClient.send('/2/push5', 0);
		  				}, 1000);
		  			}
		  		break;

		  		case 'sink':
		  			log("webInterface: sink");
		  			Drone.sink();
		  			if (sound) {
		  				oscClient.send('/2/push6', 1);
		  				setTimeout(function() {
		  					oscClient.send('/2/push6', 0);
		  				}, 1000);
		  			}
		  		break;

		  		case 'forward':
		  			log("webInterface: forward");
		  			Drone.forward();
		  			if (sound) {
		  				oscClient.send('/2/push3', 1);
		  				setTimeout(function() {
		  					oscClient.send('/2/push3', 0);
		  				}, 1000);
		  			}
		  		break;

		  		case 'backward':
		  			log("webInterface: backward");
		  			Drone.backward();
		  			if (sound) {
		  				oscClient.send('/2/push4', 1);
		  				setTimeout(function() {
		  					oscClient.send('/2/push4', 0);
		  				}, 1000);
		  			}
		  		break;

		  		case 'left':
		  			log("webInterface: left");
		  			Drone.left();
		  			if (sound) {
		  				oscClient.send('/2/push1', 1);
		  				setTimeout(function() {
		  					oscClient.send('/2/push1', 0);
		  				}, 1000);
		  			}
		  		break;

		  		case 'right':
		  			log("webInterface: right");
		  			Drone.right();
		  			if (sound) {
		  				oscClient.send('/2/push2', 1);
		  				setTimeout(function() {
		  					oscClient.send('/2/push2', 0);
		  				}, 1000);
		  			}
		  		break;

		  		case 'disableEmergency':
		  			log("webInterface: disableEmergency");
		  			Drone.disableEmergency();
		  		break;

		  	}

		});

	});

}