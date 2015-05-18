exports.init = function() {

	log('Show module init...');

}

exports.showOne = function() {

	log('Show: takeOff');

	oscClient.send('/2/push4', 1);

	client.takeoff(function() {
		client.calibrate(0);
		setTimeout(function() {
			log('Show: rise');
			client.up(0.75);
			setTimeout(function() {

			}, 500);
		}, 5000);
	});

}