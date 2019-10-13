let video;
let poseNet;
let poses = [];

getPose = (callback) => {

	console.log(Math.atan(Math.PI / 2))
	poseNet.on("pose", function (results) {
		poses = results;
		console.log(poses);
		if (poses.length) {
			if (!callback(poses[0].pose.keypoints))
				console.log('wrong pose');
			else {
				console.warn('Correct Pose');
			}
		}
		// if (flag) {
		// 	console.log(poses);
		// 	flag = false;
		// }

		// return poses;
	});
}

findSlope = (x1, y1, x2, y2) => {
	let slope = (x1 - x2) / (y1 - y2)
	return slope;
}

checkColinear = (x1, y1, x2, y2, x3, y3) => {
	let slope1 = findSlope(x1, y1, x2, y2);
	let slope2 = findSlope(x2, y2, x3, y3);
	return (Math.atan(slope1) - 5 <= Math.atan(slope2) && Math.atan(slope1) + 5 >= Math.atan(slope2));
}

checkRightAngle = (x1, y1, x2, y2, x3, y3) => {
	let slope1 = findSlope(x1, y1, x2, y2);
	let slope2 = findSlope(x2, y2, x3, y3);
	return (Math.abs(Math.atan(slope1) - Math.atan(slope2)) >= 85 && Math.abs(Math.atan(slope1) - Math.atan(slope2)) <= 95);
}

checkPose = keypointsArr => {
	//let x15, y15, x13, y13, x11, y11;
	let x = [], y = [];
	// x15 = keypointsArr[15].position.x;
	for (var i = 0; i < 17; i++) {
		x[i] = keypointsArr[i].position.x;
	}
	for (var i = 0; i < 17; i++) {
		y[i] = keypointsArr[i].position.y;
	}

	// for Right side

	if (checkColinear(x[12], y[12], x[14], y[14], x[16], y[16]) && checkRightAngle(x[6], y[6], x[8], y[8], x[10], y[10])) {
		console.log('mayan chutiya');
		return true;
	}
	else {
		console.log('chutiya')
		return false;
	}

};

function setup() {
	let cnv = createCanvas(640, 480);
	cnv.style("border-radius", "2rem");
	video = createCapture(VIDEO);
	video.size(width, height);
	let flag = true;
	// Create a new poseNet method with a single detection
	poseNet = ml5.poseNet(video, modelReady);
	// This sets up an event that fills the global variable "poses"
	// with an array every time new poses are detected
	getPose(checkPose);
	// poseNet.on("pose", function (results) {
	// 	poses = results;
	// 	// if (flag) {
	// 	console.log(poses);
	// 	// 	flag = false;
	// 	// }
	// });
	// Hide the video element, and just show the canvas
	video.hide();
}

function modelReady() {
	select("#status").html("Model Loaded");
}

function draw() {
	image(video, 0, 0, width, height);

	// We can call both functions to draw all keypoints and the skeletons
	drawKeypoints();
	drawSkeleton();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
	// Loop through all the poses detected
	for (let i = 0; i < poses.length; i++) {
		// For each pose detected, loop through all the keypoints
		let pose = poses[i].pose;
		for (let j = 0; j < pose.keypoints.length; j++) {
			// A keypoint is an object describing a body part (like rightArm or leftShoulder)
			let keypoint = pose.keypoints[j];
			// Only draw an ellipse is the pose probability is bigger than 0.2
			if (keypoint.score > 0.2) {
				fill(255, 0, 0);
				noStroke();
				ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
			}
		}
	}
}

// A function to draw the skeletons
function drawSkeleton() {
	// Loop through all the skeletons detected
	for (let i = 0; i < poses.length; i++) {
		let skeleton = poses[i].skeleton;
		// For every skeleton, loop through all body connections
		for (let j = 0; j < skeleton.length; j++) {
			let partA = skeleton[j][0];
			let partB = skeleton[j][1];
			stroke(255, 0, 0);
			line(
				partA.position.x,
				partA.position.y,
				partB.position.x,
				partB.position.y
			);
		}
	}
}
