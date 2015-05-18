// create OSC server & client
var osc = require('node-osc');
var oscServer = new osc.Server(3333, 'localhost');
GLOBAL.oscClient = new osc.Client('localhost', 4444);

var newMouthHeightValue = 0;
var newMouthWidthValue = 0;
var newFaceOrientationValue = 0;
var newEyeHeightValue = 0;
var newHeadPitchValue = 0;

var mouthHeightArray = [];
var mouthWidthArray = [];
var faceOrientationArray = [];
var eyeHeightArray = [];
var headPitchArray = [];

var mouthHeightAvg = 0;
var mouthWidthAvg = 0;
var faceOrientationAvg = 0;
var eyeHeightAvg = 0;
var headPitchAvg = 0;

// CONSTANTS
var pitch = 16383;

// FLAGS
var airborne = false;
var readyForAction = true;
var moveLeftSoundActive = false;
var moveRightSoundActive = false;
var forwardSoundActive = false;
var backwardSoundActive = false;
var riseSoundActive = false;
var sinkSoundActive = false;

// CALIBRATION VALUES RICCARDO
// var mouthHeightTriggerValueMax = 7;
// var mouthHeightTriggerValueMin = 1.75;
// var faceOrientationTriggerValueMax = 0.10;
// var faceOrientationTriggerValueMin = -0.10;
// var mouthWidthTriggerValueMax = 12.5;
// var mouthWidthTriggerValueMin = 9;
// var eyeHeightTriggerValueMax = 7.25;
// var eyeHeightTriggerValueMin = 6.25;
// var headPitchTriggerValueMax = 0.2;
// var headPitchTriggerValueMin = -0.2;

// CALIBRATION VALUES JINHEE
var mouthHeightTriggerValueMax = 4;
var mouthHeightTriggerValueMin = 1.25;
var faceOrientationTriggerValueMax = 0.15;
var faceOrientationTriggerValueMin = -0.15;
var mouthWidthTriggerValueMax = 13.25;
var mouthWidthTriggerValueMin = 10.9;
var eyeHeightTriggerValueMax = 8.25;
var eyeHeightTriggerValueMin = 7.9;
var headPitchTriggerValueMax = 0.2;
var headPitchTriggerValueMin = -0.2;

// CALIBRATION VALUES KIM
// var mouthHeightTriggerValueMax = 2.5;
// var mouthHeightTriggerValueMin = 1.75;
// var faceOrientationTriggerValueMax = 0.15;
// var faceOrientationTriggerValueMin = -0.15;
// var mouthWidthTriggerValueMax = 16;
// var mouthWidthTriggerValueMin = 10.9;
// var eyeHeightTriggerValueMax = 8;
// var eyeHeightTriggerValueMin = 6.85;
// var headPitchTriggerValueMax = 0.2;
// var headPitchTriggerValueMin = -0.2;

exports.init = function() {

	log('OSC module init...');

	// RESET ALL OSC MSG
	exports.resetAllOSC();

	// react on osc msg
	oscServer.on('message', function(msg, rinfo) {

		// get values
		newMouthHeightValue = msg[7][1];
		newMouthWidthValue = msg[6][1];
		newFaceOrientationValue = msg[5][2];
		newEyeHeightValue = msg[8][1];
		newHeadPitchValue = msg[5][3];

		// put them into arrays / smoothing
		newValueIntoArray(mouthHeightArray, newMouthHeightValue);
		newValueIntoArray(mouthWidthArray, newMouthWidthValue);
		newValueIntoArray(faceOrientationArray, newFaceOrientationValue);
		newValueIntoArray(eyeHeightArray, newEyeHeightValue);
		newValueIntoArray(headPitchArray, newHeadPitchValue);

		// calc average values out of arrays
		mouthHeightAvg = getArrAvg(mouthHeightArray);
		mouthWidthAvg = getArrAvg(mouthWidthArray);
		faceOrientationAvg = getArrAvg(faceOrientationArray);
		eyeHeightAvg = getArrAvg(eyeHeightArray);
		headPitchAvg = getArrAvg(headPitchArray);

		// process values and do whatever they say
		if (readyForAction) exports.processValues();

		// see whole message output
		// for (var prop in msg) {
		// 	if (msg.hasOwnProperty(prop)) {
		//     	log("prop: " + prop + " value: " + msg[prop]);
		// 	}
		// }

	});

	function newValueIntoArray(array, value) {
		if (array.length < 5) {
			array.push(value);
		} else if (array.length == 5) {
			array.shift();
			array.push(value);
		}
	}

	function getArrAvg(elmt) {
		var avg = 0;
		var sum = 0;
		for (var i = 0; i < elmt.length; i++) {
		    sum += elmt[i];
		}
		avg = sum / elmt.length;
		return avg;
	}

}

exports.processValues = function() {

	// mouth open to takeoff
	if (mouthHeightAvg > mouthHeightTriggerValueMax && airborne == false) {
		exports.oscTakeOff();
		return;
	}

	// mouth close to land
	if (mouthHeightAvg < mouthHeightTriggerValueMin && airborne == true) {
		exports.oscLand();
		return;
	}

	// if not airborne, do ignore commands
	if (airborne == false) return false;

	// check to reset sounds
	checkInBetweenValues();

	// face to the left for move left
	if (faceOrientationAvg < faceOrientationTriggerValueMin) {
		exports.oscMoveLeft();
		return;
	}

	// face to the right for move right
	if (faceOrientationAvg > faceOrientationTriggerValueMax) {
		exports.oscMoveRight();
		return;
	}

	// mouth width wide for moving forward
	if (mouthWidthAvg < mouthWidthTriggerValueMin) {
		exports.oscMoveForward();
		return;
	}

	// mouth width small for moving backward
	if (mouthWidthAvg > mouthWidthTriggerValueMax) {
		exports.oscMoveBackward();
		return;
	}

	// eyebrow height high for rising
	if (eyeHeightAvg > eyeHeightTriggerValueMax) {
		exports.oscRise();
		return;
	}

	// eyebrow height small for sinking
	if (eyeHeightAvg < eyeHeightTriggerValueMin) {
		exports.oscSink();
		return;
	}

	// head pitch left for rotating left
	if (headPitchAvg > headPitchTriggerValueMax) {
		exports.oscRotateLeft();
		return;
	}

	// head pitch right for rotating right
	if (headPitchAvg < headPitchTriggerValueMin) {
		exports.oscRotateRight();
		return;
	}

	function checkInBetweenValues() {

		// face in between
		if (faceOrientationAvg > faceOrientationTriggerValueMin && faceOrientationAvg < faceOrientationTriggerValueMax) {

			if (moveLeftSoundActive == true || moveRightSoundActive == true) {

				moveLeftSoundActive = false;
				moveRightSoundActive = false;

				oscClient.send('/2/push1', 0);
				oscClient.send('/2/push2', 0);

			}

		}

		// mouth width in between
		if (mouthWidthAvg > mouthWidthTriggerValueMin && mouthWidthAvg < mouthWidthTriggerValueMax) {

			if (forwardSoundActive == true || backwardSoundActive == true) {

				forwardSoundActive = false;
				backwardSoundActive = false;

				oscClient.send('/2/push3', 0);
				oscClient.send('/2/push4', 0);

			}

		}

		// eyebrow in between
		if (eyeHeightAvg > eyeHeightTriggerValueMin && eyeHeightAvg < eyeHeightTriggerValueMax) {

			if (riseSoundActive == false || sinkSoundActive == false) {

				riseSoundActive = false;
				sinkSoundActive = false;

				oscClient.send('/2/push5', 0);
				oscClient.send('/2/push6', 0);

			}

		}

	}

}

exports.oscTakeOff = function() {

	airborne = true;
	readyForAction = false;

	log("OSC: takeOff");
	Drone.takeOff();

	oscClient.send('/2/push4', 1);

	setTimeout(function() {
		readyForAction = true;
		oscClient.send('/2/push4', 0);
	}, 5000);

}

exports.oscLand = function() {

	airborne = false;
	readyForAction = false;

	log("OSC: land");
	Drone.land();

	exports.resetAllOSC();

	setTimeout(function() {
		readyForAction = true;
	}, 2500);

}

exports.oscMoveLeft = function() {

	readyForAction = false;

	log("OSC: left");
	Drone.left();

	if (moveLeftSoundActive == false) {

		moveRightSoundActive = false;
		moveLeftSoundActive = true;

		oscClient.send('/2/push1', 1);

	}

	setTimeout(function() {
		readyForAction = true;
	}, 1000);

}

exports.oscMoveRight = function() {

	readyForAction = false;

	log("OSC: right");
	Drone.right();

	if (moveRightSoundActive == false) {

		moveLeftSoundActive = false;
		moveRightSoundActive = true;

		oscClient.send('/2/push2', 1);

	}

	setTimeout(function() {
		readyForAction = true;
	}, 1000);

}

exports.oscMoveForward = function() {

	readyForAction = false;

	log("OSC: forward");
	Drone.forward();

	if (forwardSoundActive == false) {

		backwardSoundActive = false;
		forwardSoundActive = true;

		oscClient.send('/2/push3', 1);

	}

	setTimeout(function() {
		readyForAction = true;
	}, 1000);

}

exports.oscMoveBackward = function() {

	readyForAction = false;

	log("OSC: backward");
	Drone.backward();

	if (backwardSoundActive == false) {

		forwardSoundActive = false;
		backwardSoundActive = true;

		oscClient.send('/2/push4', 1);

	}

	setTimeout(function() {
		readyForAction = true;
	}, 1000);

}

exports.oscRise = function() {

	readyForAction = false;

	log("OSC: rise");
	Drone.rise();

	if (riseSoundActive == false) {

		sinkSoundActive = false;
		riseSoundActive = true;

		oscClient.send('/2/push5', 1);

	}

	setTimeout(function() {
		readyForAction = true;
	}, 500);

}

exports.oscSink = function() {

	readyForAction = false;

	log("OSC: sink");
	Drone.sink();

	if (sinkSoundActive == false) {

		riseSoundActive = false;
		sinkSoundActive = true;

		oscClient.send('/2/push6', 1);

	}

	setTimeout(function() {
		readyForAction = true;
	}, 500);

}

exports.oscRotateLeft = function() {

	readyForAction = false;

	log("OSC: rotateLeft");
	Drone.rotateLeft();

	if (pitch < 16383) {
		pitch = pitch + 200;
		oscClient.send('/1/fader2', pitch);
	}

	setTimeout(function() {
		readyForAction = true;
	}, 375);

}

exports.oscRotateRight = function() {

	readyForAction = false;

	log("OSC: rotateRight");
	Drone.rotateRight();

	if (pitch > 0) {
		pitch = pitch - 200;
		oscClient.send('/1/fader2', pitch);
	}

	setTimeout(function() {
		readyForAction = true;
	}, 375);

}

exports.resetAllOSC = function() {

	oscClient.send('/2/push1', 0);
	oscClient.send('/2/push2', 0);
	oscClient.send('/2/push3', 0);
	oscClient.send('/2/push4', 0);
	oscClient.send('/2/push5', 0);
	oscClient.send('/2/push6', 0);
	oscClient.send('/2/push7', 0);
	oscClient.send('/1/fader1', 127);
	oscClient.send('/1/fader2', pitch);

}