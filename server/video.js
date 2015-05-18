exports.init = function() {

	log('Video module init...');

	require('ar-drone-png-stream')(client, {
		port: 9999
	});

}