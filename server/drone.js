var moving = false;

exports.init = function() {

	log('Drone module init...');

}

exports.takeOff = function() {

	if (moving) return;

	moving = true;

	client.takeoff(function() {
		client.calibrate(0);
		setTimeout(function() {
			moving = false;
		}, 5000);
	});

}

exports.land = function() {

	client.land(function() {
		moving = false;
	});

}

exports.rotateLeft = function() {

	if (moving) return;

	moving = true;

	client.counterClockwise(0.25);

	var timer = setTimeout(function() {
		moving = false;
		client.stop();
	}, 250);

}

exports.rotateRight = function() {

	if (moving) return;

	moving = true;

	client.clockwise(0.25);

	var timer = setTimeout(function() {
		moving = false;
		client.stop();
	}, 250);

}

exports.rise = function() {

	if (moving) return;

	moving = true;

	client.up(0.25);

	var timer = setTimeout(function() {
		moving = false;
		client.stop();
	}, 250);

}

exports.sink = function() {

	if (moving) return;

	moving = true;

	client.down(0.25);

	var timer = setTimeout(function() {
		moving = false;
		client.stop();
	}, 250);

}

exports.forward = function() {

	if (moving) return;

	moving = true;

	client.front(0.25);

	var timer = setTimeout(function() {
		moving = false;
		client.stop();
	}, 500);

}

exports.backward = function() {

	if (moving) return;

	moving = true;

	client.back(0.25);

	var timer = setTimeout(function() {
		moving = false;
		client.stop();
	}, 500);

}

exports.left = function() {

	if (moving) return;

	moving = true;

	client.left(0.25);

	var timer = setTimeout(function() {
		moving = false;
		client.stop();
	}, 500);

}

exports.right = function() {

	if (moving) return;

	moving = true;

	client.right(0.25);

	var timer = setTimeout(function() {
		moving = false;
		client.stop();
	}, 500);

}

exports.disableEmergency = function() {

	client.disableEmergency();

}