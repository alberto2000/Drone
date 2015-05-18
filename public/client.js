$(document).ready(function() {

	var socket = io();

	if ($('#controls').attr('data-show') == 'no') {
		$('.control-button').hide();
	}

	socket.on('message', function(msg) {
		console.log(msg);
	});

	$('#button-takeoff').click(function() {
		socket.emit('action', 'takeOff');
	});

	$('#button-land').click(function() {
		socket.emit('action', 'land');
	});

	$('#button-rotate-left').click(function() {
		socket.emit('action', 'rotateLeft');
	});

	$('#button-rotate-right').click(function() {
		socket.emit('action', 'rotateRight');
	});

	$('#button-rise').click(function() {
		socket.emit('action', 'rise');
	});

	$('#button-sink').click(function() {
		socket.emit('action', 'sink');
	});

	$('#button-forward').click(function() {
		socket.emit('action', 'forward');
	});

	$('#button-backward').click(function() {
		socket.emit('action', 'backward');
	});

	$('#button-left').click(function() {
		socket.emit('action', 'left');
	});

	$('#button-right').click(function() {
		socket.emit('action', 'right');
	});

	$('#button-disable-emergency').click(function() {
		socket.emit('action', 'disableEmergency');
	});

	$(document).keydown(function(event) {

		if (event.keyCode == 13) {
			socket.emit('action', 'takeOff');
		} else if (event.keyCode == 32) {
			socket.emit('action', 'land');
		} else if (event.keyCode == 37) {
			socket.emit('action', 'left');
		} else if (event.keyCode == 38) {
			socket.emit('action', 'forward');
		} else if (event.keyCode == 39) {
			socket.emit('action', 'right');
		} else if (event.keyCode == 40) {
			socket.emit('action', 'backward');
		} else if (event.keyCode == 81) {
			socket.emit('action', 'rise');
		} else if (event.keyCode == 65) {
			socket.emit('action', 'sink');
		} else if (event.keyCode == 89) {
			socket.emit('action', 'rotateLeft');
		} else if (event.keyCode == 88) {
			socket.emit('action', 'rotateRight');
		} else if (event.keyCode == 69) {
			socket.emit('action', 'disableEmergency');
		}

	});

});