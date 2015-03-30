/*global Vex, io, gyro */

var IS_IOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent),
	staveCanvasWrapper = document.getElementById('stave-wrapper'),
	partHeader = document.getElementById('part-header'),
	socket,
	game,
	gameObjectId,
	inCParts;

function setupGame() {
	var VideoPlayer = document.getElementById('VideoPlayer'),
		AudioPlayer = document.getElementById('AudioPlayer'),
		BeginTheParty = document.getElementById('BeginTheParty'),
		BeginThePartyBtn = document.getElementById('BeginThePartyBtn');
	BeginThePartyBtn.addEventListener('touchstart', touchHandler);
	BeginThePartyBtn.addEventListener('click', touchHandler);
	function touchHandler(e) {
		e.preventDefault();
		if (IS_IOS) {
			AudioPlayer.play();
			AudioPlayer.volume = 0;
		} else {
			VideoPlayer.play();
			VideoPlayer.volume = 0;
		}
		BeginTheParty.className = 'hide';
		BeginThePartyBtn.removeEventListener('touchstart', touchHandler);
		BeginThePartyBtn.removeEventListener('click', touchHandler);
		connectToGame();
	}
}


function connectToGame() {
	var id, partNumber, playerNumber;
	socket = io.connect("http://" + location.hostname, {port: 8081, rememberTransport: false});
	socket.on('connect', function () {
		// sends to socket.io server the host/port of oscServer
		// and oscClient
		socket.emit('config',
			{
				server: {
					port: 3333,
					host: location.hostname
				},
				client: {
					port: 3334,
					host: location.hostname
				}
			}
		);
		gameObjectId = socket.socket.sessionid;
		//console.log(socket.socket.sessionid);
		game.init();

	});
	socket.on('message', function (obj) {
		//var log = document.getElementById('log');
		//log.innerHTML = obj;
		var even = false;
		if (obj[0] === "bounce") {
			id = obj[1];
			console.log(id, gameObjectId);
			if (id !== gameObjectId) {
				return;
			}
			window.navigator.vibrate(200);

		}
		if (obj[0] === "partNumber") {
			id = obj[1].split('|')[1];
			if (id !== gameObjectId) {
				return;
			}
			partNumber = parseInt(obj[1].split("|")[0]);
			drawStaff(staveCanvasWrapper, partNumber, staveCanvasWrapper.offsetWidth, inCParts[partNumber]);
			partHeader.innerHTML = (partNumber + 1) + ".";
		}
		if (obj[0] === "playerNumber") {
			num = obj[1];
			id = obj[1].split('|')[1];
			//console.log(obj[1], id, gameObjectId);
			if (id !== gameObjectId) {
				return;
			}
			playerNumber = parseInt(obj[1].split("|")[0]);
			if ((playerNumber + 1) % 2 === 0) {
				even = true;
			}
			var h = ((360 / 16) * (even ? (playerNumber + 1) : ((16 - playerNumber)))) / 360; //(360 / data.length) * i
			console.log(obj[1].split("|")[0], playerNumber, h);
			var rgb = game.hslToRgb(h, 0.8, 0.65);
			var rgbStr = rgb[0] + "," + rgb[1] + "," + rgb[2];
			console.log(rgbStr);
			wrapper.style.backgroundColor = "rgb(" + rgbStr + ")";
			socket.emit('message', '/color ' + rgbStr + '|' + socket.socket.sessionid);
		}
	});
}

game = {
	shapeNumber: 0,
	init: function () {
		gyro.frequency = 40;
		var wrapper = document.getElementById('wrapper'),
			shape = document.getElementById('shape'),
			info = document.getElementById('info'),
			content = document.getElementById('content'),
			init = false,
			numShapes = 6;
		//shapeNumber = this.randomIntFromInterval(1, numShapes);


		//drawStaff(staffCanvas, staffCanvas.offsetWidth, inCParts[0]);
		gyro.startTracking(function (o) {
			// o.x, o.y, o.z for accelerometer
			// o.alpha, o.beta, o.gamma for gyro
			if (o.alpha != null && !init) {
				game.initOrientation.alpha = o.alpha;
				game.initOrientation.beta = Math.abs(o.beta);
				game.initOrientation.gamma = Math.abs(o.gamma);
				init = true;
				game.shapeNumber = game.randomIntFromInterval(1, 6);
				//shape.src = "/img/Shape-" + polydanceparty.shapeNumber + ".png";
				info.className = "shape" + game.shapeNumber;
//				var h = game.randomIntFromInterval(1, 360) / 360;
//				var hsl = h + ",0.8,0.65";
//				var rgb = game.hslToRgb(h, 0.8, 0.65);
//				var rgbStr = rgb[0] + "," + rgb[1] + "," + rgb[2];
//				wrapper.style.backgroundColor = "rgb(" + rgbStr + ")";
//				console.log(rgbStr);
				socket.emit('message', '/create ' + (game.shapeNumber - 1) + "|" + "" + '|' + socket.socket.sessionid);
			}

			if (!init) {
				return;
			}

			var adjustedRotation = {
				alpha: o.alpha - game.initOrientation.alpha,
				beta: o.beta - game.initOrientation.beta,
				gamma: o.gamma - game.initOrientation.gamma
			};

			var netAcceleration = game.getAccelerationWithoutGravity(o);
			//socket.emit('message', '/rot ' + o.alpha + "|" + o.beta + "|" + o.gamma + "|" + socket.socket.sessionid);
			socket.emit('message', '/rot ' + adjustedRotation.alpha + "|" +
				adjustedRotation.beta + "|" + adjustedRotation.gamma + "|" +
				socket.socket.sessionid);
			socket.emit('message', '/acc ' + netAcceleration.x + "|" +
				netAcceleration.y + "|" + netAcceleration.z + "|" +
				socket.socket.sessionid);

			var smoothRotation = game.getSmoothRotation(adjustedRotation.alpha, adjustedRotation.beta, adjustedRotation.gamma);


			//polydanceparty.rotateShape(smoothRotation, accel);
			//polydanceparty.rotateShape(smoothRotation, shape);

//			wrapper.style.backgroundColor = "hsl(" +
//				Math.abs(o.alpha).toFixed(0) + ", " +
//				"80%, " +
//				"65%)";

		});
	},
	/**
	 * Converts an HSL color value to RGB. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	 * Assumes h, s, and l are contained in the set [0, 1] and
	 * returns r, g, and b in the set [0, 255].
	 *
	 * @param   Number  h       The hue
	 * @param   Number  s       The saturation
	 * @param   Number  l       The lightness
	 * @return  Array           The RGB representation
	 */
	hslToRgb: function (h, s, l) {
		var r, g, b;

		if (s === 0) {
			r = g = b = l; // achromatic
		} else {
			function hue2rgb(p, q, t) {
				if (t < 0) {
					t += 1;
				}
				if (t > 1) {
					t -= 1;
				}
				if (t < 1 / 6) {
					return p + (q - p) * 6 * t;
				}
				if (t < 1 / 2) {
					return q;
				}
				if (t < 2 / 3) {
					return p + (q - p) * (2 / 3 - t) * 6;
				}
				return p;
			}

			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;
			r = hue2rgb(p, q, h + 1 / 3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1 / 3);
		}

		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	},
	userAgent: navigator.userAgent.toLowerCase(),
	isFirefox: function () {
		if (this.userAgent.indexOf("firefox") > 0) {
			return true;
		}
		return false;
	},
	randomIntFromInterval: function (min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	},
	initOrientation: {
		alpha: 0,
		beta: 0,
		gamma: 0
	},
	accFilteringFactor: 0.1,
	rotFilteringFactor: 0.1,
	setStyle: (function () {
		var cachedStyles = {};
		return function (styleName, styleValue, elem) {
			if (styleName in elem.style) {
				elem.style[styleName] = styleValue;
				return;
			}
			if (styleName in cachedStyles) {
				elem.style[cachedStyles[styleName]] = styleValue;
				return;
			}
			var vendors = ['Moz', 'webkit', 'ms'];
			var styleNameUpper = styleName.replace(styleName[0], styleName[0].toUpperCase());
			vendors.forEach(function (vendor) {
				var _styleName = vendor + styleNameUpper;
				if (_styleName in elem.style) {
					cachedStyles[styleName] = _styleName;
					elem.style[_styleName] = styleValue;
				}
			});
		};
	}()),
	rotateShape: function (rotation, div) {
		var styleValue = "perspective(500) " +
			"rotateZ(" + rotation.alpha + "deg) " +
			"rotateX(" + rotation.beta + "deg) " +
			"rotateY(" + rotation.gamma + "deg)";
		this.setStyle('transform', styleValue, div);
	},
	currentRotation: {
		alpha: 0,
		beta: 0,
		gamma: 0
	},
	getSmoothRotation: function (alpha, beta, gamma) {
		this.currentRotation.alpha = ((alpha * this.rotFilteringFactor) +
			(this.currentRotation.alpha * (1.0 - this.rotFilteringFactor))).toFixed(1);
		this.currentRotation.beta = ((beta * this.rotFilteringFactor) +
			(this.currentRotation.beta * (1.0 - this.rotFilteringFactor))).toFixed(1);
		this.currentRotation.gamma = ((gamma * this.rotFilteringFactor) +
			(this.currentRotation.gamma * (1.0 - this.rotFilteringFactor))).toFixed(1);
		return this.currentRotation;
	},
	currentAccel: {
		x: 0,
		y: 0,
		z: 0
	},
	getAccelerationWithoutGravity: function (acceleration) {
		var netAcceleration = {};
		// Use a basic low-pass filter to keep only the gravity component of each axis.
		this.currentAccel.x = (acceleration.x * this.accFilteringFactor) + (this.currentAccel.x * (1.0 - this.accFilteringFactor));
		this.currentAccel.y = (acceleration.y * this.accFilteringFactor) + (this.currentAccel.y * (1.0 - this.accFilteringFactor));
		this.currentAccel.z = (acceleration.z * this.accFilteringFactor) + (this.currentAccel.z * (1.0 - this.accFilteringFactor));
		netAcceleration.x = (acceleration.x - this.currentAccel.x).toFixed(1);
		netAcceleration.y = (acceleration.y - this.currentAccel.y).toFixed(1);
		netAcceleration.z = (acceleration.z - this.currentAccel.z).toFixed(1);
		return netAcceleration;
	}
};

inCParts = [
	// #1
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "q"})
				.addModifier(0, new Vex.Flow.GraceNoteGroup([
					new Vex.Flow.GraceNote({keys: ['c/4'], duration: '16', slash: false})], true).beamNotes()),
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "q"})
				.addModifier(0, new Vex.Flow.GraceNoteGroup([
					new Vex.Flow.GraceNote({keys: ['c/4'], duration: '16', slash: false})], true).beamNotes()),
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "q"})
				.addModifier(0, new Vex.Flow.GraceNoteGroup([
					new Vex.Flow.GraceNote({keys: ['c/4'], duration: '16', slash: false})], true).beamNotes())
		],
		voice: {
			num_beats: 3,
			beat_value: 4
		}
	},
	// #2
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "8"})
				.addModifier(0, new Vex.Flow.GraceNoteGroup([
					new Vex.Flow.GraceNote({keys: ['c/4'], duration: '16', slash: false})], true).beamNotes()),
			new Vex.Flow.StaveNote({keys: ["f/4"], duration: "8"}),
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "q"})
		],
		beams: [
			[0, 1]
		],
		voice: {
			num_beats: 2,
			beat_value: 4
		}
	},
	// #3
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "8r"}),
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "8"}),
			new Vex.Flow.StaveNote({keys: ["f/4"], duration: "8"}),
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "8"})
		],
		beams: [
			[2, 3]
		],
		voice: {
			num_beats: 2,
			beat_value: 4
		}
	},
	// #4
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "8r"}),
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "8"}),
			new Vex.Flow.StaveNote({keys: ["f/4"], duration: "8"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "8"})
		],
		beams: [
			[2, 3]
		],
		voice: {
			num_beats: 2,
			beat_value: 4
		}
	},
	// #5
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "8"}),
			new Vex.Flow.StaveNote({keys: ["f/4"], duration: "8"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "8"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "8r"})
		],
		beams: [
			[0, 1]
		],
		voice: {
			num_beats: 2,
			beat_value: 4
		}
	},
	// #6
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["c/5"], duration: "w"}),
			new Vex.Flow.StaveNote({keys: ["c/5"], duration: "w"})
		],
		ties: [
			[0, 1]
		],
		voice: {
			num_beats: 8,
			beat_value: 4
		}
	},
	// #7
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "qr"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "qr"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "qr"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "8r"}),
			new Vex.Flow.StaveNote({keys: ["c/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["c/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["c/4"], duration: "8"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "8r"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "qr"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "qr"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "qr"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "qr"})
		],
		beams: [
			[4, 5]
		],
		voice: {
			num_beats: 9,
			beat_value: 4
		}
	},
	// #8
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "wd"}).addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["f/4"], duration: "w"}),
			new Vex.Flow.StaveNote({keys: ["f/4"], duration: "w"})
		],
		ties: [
			[1, 2]
		],
		voice: {
			num_beats: 14,
			beat_value: 4
		}
	},
	// #9
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "8r"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "qr"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "qr"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "qr"})
		],
		beams: [
			[0, 1]
		],
		voice: {
			num_beats: 4,
			beat_value: 4
		}
	},
	// #10
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"})
		],
		beams: [
			[0, 1]
		],
		voice: {
			num_beats: 1,
			beat_value: 8
		}
	},
	// #11
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["f/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"})
		],
		beams: [
			[0, 1, 2, 3, 4, 5]
		],
		voice: {
			num_beats: 3,
			beat_value: 8
		}
	},
	// #12
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["f/4"], duration: "8"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "8"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "w"}),
			new Vex.Flow.StaveNote({keys: ["c/5"], duration: "q"})
		],
		beams: [
			[0, 1]
		],
		voice: {
			num_beats: 6,
			beat_value: 4
		}
	},
	// #13
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "8d"}).addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["f/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "8"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "8rd"}).addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "hd"}).addDotToAll()
		],
		beams: [
			[0, 1],
			[2, 3, 4]
		],
		ties: [
			[6, 7]
		],
		voice: {
			num_beats: 23,
			beat_value: 16
		}
	},
	// #14
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["c/5"], duration: "w"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "w"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "w"}),
			new Vex.Flow.StaveNote({keys: ["f#/4"], duration: "w"})
				.addAccidental(0, new Vex.Flow.Accidental("#"))
		],
		voice: {
			num_beats: 16,
			beat_value: 4
		}
	},
	// #15
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "8dr"}).addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "qr"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "qr"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "qr"})
		],
		voice: {
			num_beats: 4,
			beat_value: 4
		}
	},
	// #16
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["c/5"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "16"})
		],
		beams: [
			[0, 1, 2, 3]
		],
		voice: {
			num_beats: 1,
			beat_value: 4
		}
	},
	// #17
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "16",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["c/5"], duration: "16",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "16",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["c/5"], duration: "16",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "16",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "16r"})
		],
		beams: [
			[0, 1, 2, 3, 4]
		],
		voice: {
			num_beats: 3,
			beat_value: 8
		}
	},
	// #18
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["f#/4"], duration: "16"})
				.addAccidental(0, new Vex.Flow.Accidental("#")),
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["f#/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "8d"})
				.addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "16"})
		],
		beams: [
			[0, 1, 2, 3],
			[4, 5]
		],
		voice: {
			num_beats: 2,
			beat_value: 4
		}
	},
	// #19
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "qdr"}).addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["g/5"], 
				duration: "qd",
				stem_direction: -1}).addDotToAll()
		],
		voice: {
			num_beats: 3,
			beat_value: 4
		}
	},
	// #20
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["f#/4"], duration: "16"})
				.addAccidental(0, new Vex.Flow.Accidental('#')),
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["f#/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/3"], duration: "8d"}).addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["f#/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["f#/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "16"})
		],
		beams: [
			[0, 1, 2, 3],
			[4, 5],
			[6, 7, 8, 9]
		],
		voice: {
			num_beats: 3,
			beat_value: 4
		}
	},
	// #21
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["f#/4"], duration: "hd"})
				.addDotToAll()
				.addAccidental(0, new Vex.Flow.Accidental('#')),
		],
		voice: {
			num_beats: 3,
			beat_value: 4
		}
	},
	// #22
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "qd"})
				.addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "qd"})
				.addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "qd"})
				.addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "qd"})
				.addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "qd"})
				.addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["f#/4"], duration: "qd"})
				.addDotToAll()
				.addAccidental(0, new Vex.Flow.Accidental('#')),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "qd"})
				.addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["a/4"], duration: "qd"})
				.addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["b/4"], 
				duration: "8",
				stem_direction: -1})
		],
		voice: {
			num_beats: 25,
			beat_value: 8
		}
	},
	// #23
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "8"}),
			new Vex.Flow.StaveNote({keys: ["f#/4"], duration: "qd"})
				.addDotToAll()
				.addAccidental(0, new Vex.Flow.Accidental('#')),
			new Vex.Flow.StaveNote({keys: ["f#/4"], duration: "qd"})
				.addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["f#/4"], duration: "qd"})
				.addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["f#/4"], duration: "qd"})
				.addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["f#/4"], duration: "qd"})
				.addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "qd"})
				.addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["a/4"], duration: "qd"})
				.addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["b/4"], 
				duration: "q",
				stem_direction: -1})
		],
		voice: {
			num_beats: 12,
			beat_value: 4
		}
	},
	// #24
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "8"}),
			new Vex.Flow.StaveNote({keys: ["f#/4"], duration: "8"})
				.addAccidental(0, new Vex.Flow.Accidental('#')),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "qd"})
				.addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "qd"})
				.addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "qd"})
				.addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "qd"})
				.addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "qd"})
				.addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["a/4"], duration: "qd"})
				.addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["b/4"], 
				duration: "8",
				stem_direction: -1})
		],
		beams: [
			[0, 1]
		],
		voice: {
			num_beats: 21,
			beat_value: 8
		}
	},
	// #25
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "8"}),
			new Vex.Flow.StaveNote({keys: ["f#/4"], duration: "8"})
				.addAccidental(0, new Vex.Flow.Accidental('#')),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "8"})
				.addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["a/4"], duration: "qd"})
				.addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["a/4"], duration: "qd"})
				.addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["a/4"], duration: "qd"})
				.addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["a/4"], duration: "qd"})
				.addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["a/4"], duration: "qd"})
				.addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["b/4"], 
				duration: "qd",
				stem_direction: -1}).addDotToAll()
		],
		beams: [
			[0, 1, 2]
		],
		voice: {
			num_beats: 21,
			beat_value: 8
		}
	},
	// #26
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "8"}),
			new Vex.Flow.StaveNote({keys: ["f#/4"], duration: "8"})
				.addAccidental(0, new Vex.Flow.Accidental('#')),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "8"}),
			new Vex.Flow.StaveNote({keys: ["a/4"], duration: "8"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "qd",
				stem_direction: -1})
				.addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "qd",
				stem_direction: -1})
				.addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "qd",
				stem_direction: -1})
				.addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "qd",
				stem_direction: -1})
				.addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "qd",
				stem_direction: -1}).addDotToAll()
		],
		beams: [
			[0, 1],
			[2, 3]
		],
		voice: {
			num_beats: 19,
			beat_value: 8
		}
	},
	// #27
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["f#/4"], duration: "16"})
				.addAccidental(0, new Vex.Flow.Accidental('#')),
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["f#/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "8"}),
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["f#/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["f#/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "16"})
		],
		beams: [
			[0, 1, 2, 3],
			[4, 5, 6],
			[7, 8, 9, 10]
		],
		voice: {
			num_beats: 3,
			beat_value: 4
		}
	},
	// #28
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["f#/4"], duration: "16"})
				.addAccidental(0, new Vex.Flow.Accidental('#')),
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["f#/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "8d"}).addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "16"})
		],
		beams: [
			[0, 1, 2, 3],
			[4, 5]
		],
		voice: {
			num_beats: 2,
			beat_value: 4
		}
	},
	// #29
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["e/4"], duration: "hd"}).addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "hd"}).addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["c/5"], duration: "hd"}).addDotToAll()
		],
		voice: {
			num_beats: 9,
			beat_value: 4
		}
	},
	// #30
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["c/5"], duration: "wd"}).addDotToAll()
		],
		voice: {
			num_beats: 6,
			beat_value: 4
		}
	},
	// #31
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["f/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "16"})
		],
		beams: [
			[0, 1, 2],
			[3, 4, 5]
		],
		voice: {
			num_beats: 6,
			beat_value: 16
		}
	},
	// #32
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["f/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["f/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["f/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["f/4"], duration: "hd"}).addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "qd"}).addDotToAll()
		],
		ties: [
			[5, 6]
		],
		beams: [
			[0, 1, 2],
			[3, 4, 5]
		],
		voice: {
			num_beats: 12,
			beat_value: 8
		}
	},
	// #33
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["f/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "8r"}),
		],
		beams: [
			[0, 1]
		],
		voice: {
			num_beats: 2,
			beat_value: 8
		}
	},
	// #34
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["f/4"], duration: "16"})
		],
		beams: [
			[0, 1]
		],
		voice: {
			num_beats: 2,
			beat_value: 16
		}
	},
	// #35
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["f/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "8r"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "qr"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "qr"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "qr"})
		],
		beams: [
			[0, 1, 2, 3],
			[4, 5, 6, 7],
			[8, 9]
		],
		voice: {
			num_beats: 12,
			beat_value: 8
		},
		notes2: [
			new Vex.Flow.StaveNote({keys: ["bb/4"], duration: "q"})
				.addAccidental(0, new Vex.Flow.Accidental('b')),
			new Vex.Flow.StaveNote({keys: ["g/5"], duration: "hd",
				stem_direction: -1}).addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["a/5"], duration: "8",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["g/5"], duration: "8",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["g/5"], duration: "8",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["bn/5"], duration: "8",
				stem_direction: -1})
				.addAccidental(0, new Vex.Flow.Accidental('n')),
			new Vex.Flow.StaveNote({keys: ["a/5"], duration: "q",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["g/5"], duration: "8",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["e/5"], duration: "hd",
				stem_direction: -1}).addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["g/5"], duration: "8",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["f#/5"], duration: "8",
				stem_direction: -1})
				.addAccidental(0, new Vex.Flow.Accidental('#')),
			new Vex.Flow.StaveNote({keys: ["f#/5"], duration: "hd",
				stem_direction: -1}).addDotToAll()
		],
		voice2: {
			num_beats: 29,
			beat_value: 8
		},
		beams2: [
			[2, 3],
			[4, 5],
			[9, 10]
		],
		ties2: [
			[3, 4],
			[10, 11]
		],
		notes3: [
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "qr"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "qr"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "8r"}),
			new Vex.Flow.StaveNote({keys: ["e/5"], duration: "8",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["e/5"], duration: "h",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["fn/5"], duration: "wd"})
				.addDotToAll()
				.addAccidental(0, new Vex.Flow.Accidental('n')),
			
		],
		voice3: {
			num_beats: 11,
			beat_value: 4
		},
		ties3: [
			[3, 4],
		],
	},
	// #36
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["f/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"})
		],
		beams: [
			[0, 1, 2, 3, 4, 5]
		],
		voice: {
			num_beats: 6,
			beat_value: 16
		}
	},
	// #37
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["f/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"})
		],
		beams: [
			[0, 1]
		],
		voice: {
			num_beats: 2,
			beat_value: 16
		}
	},
	// #38
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["f/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "16"})
		],
		beams: [
			[0, 1, 2]
		],
		voice: {
			num_beats: 3,
			beat_value: 16
		}
	},
	// #39
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["f/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["c/5"], duration: "16"})
		],
		beams: [
			[0, 1, 2],
			[3, 4, 5]
		],
		voice: {
			num_beats: 6,
			beat_value: 16
		}
	},
	// #40
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["f/4"], duration: "16"})
		],
		beams: [
			[0, 1]
		],
		voice: {
			num_beats: 2,
			beat_value: 16
		}
	},
	// #41
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"})
		],
		beams: [
			[0, 1]
		],
		voice: {
			num_beats: 2,
			beat_value: 16
		}
	},
	// #42
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["c/5"], duration: "w"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "w"}),
			new Vex.Flow.StaveNote({keys: ["a/4"], duration: "w"}),
			new Vex.Flow.StaveNote({keys: ["c/5"], duration: "w"})
		],
		voice: {
			num_beats: 16,
			beat_value: 4
		}
	},
	// #43
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["f/5"], duration: "16",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["e/5"], duration: "16",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["f/5"], duration: "16",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["e/5"], duration: "16",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["e/5"], duration: "8",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["e/5"], duration: "8",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["e/5"], duration: "8",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["f/5"], duration: "16",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["e/5"], duration: "16",
				stem_direction: -1})
		],
		beams: [
			[0, 1, 2, 3],
			[4, 5],
			[6, 7, 8]
		],
		voice: {
			num_beats: 3,
			beat_value: 4
		}
	},
	// #44
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["f/5"], duration: "8",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["e/5"], duration: "8",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["e/5"], duration: "8",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["e/5"], duration: "8",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["c/5"], duration: "q",
				stem_direction: -1})
		],
		beams: [
			[0, 1],
			[2, 3]
		],
		ties: [
			[1, 2]
		],
		voice: {
			num_beats: 3,
			beat_value: 4
		}
	},
	// #45
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["d/5"], duration: "q",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["d/5"], duration: "q",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "q"})
		],
		voice: {
			num_beats: 3,
			beat_value: 4
		}
	},
	// #46
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["d/5"], duration: "16",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["e/5"], duration: "16",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["d/5"], duration: "16",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "8r"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "8"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "8r"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "8"}),
			new Vex.Flow.StaveNote({keys: ["b/4"], duration: "8r"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "8"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["d/5"], duration: "16",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["e/5"], duration: "16",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["d/5"], duration: "16",
				stem_direction: -1})
		],
		beams: [
			[0, 1, 2, 3],
			[10, 11, 12, 13]
		],
		voice: {
			num_beats: 5,
			beat_value: 4
		}
	},
	// #47
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["d/5"], duration: "16",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["e/5"], duration: "16",
				stem_direction: -1}),
			new Vex.Flow.StaveNote({keys: ["d/5"], duration: "8",
				stem_direction: -1})
		],
		beams: [
			[0, 1, 2]
		],
		voice: {
			num_beats: 2,
			beat_value: 8
		}
	},
	// #48
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "wd"}).addDotToAll(),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "w"}),
			new Vex.Flow.StaveNote({keys: ["f/4"], duration: "w"}),
			new Vex.Flow.StaveNote({keys: ["f/4"], duration: "q"})
		],
		ties: [
			[2, 3]
		],
		voice: {
			num_beats: 15,
			beat_value: 4
		}
	},
	// #49
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["f/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["bb/4"], duration: "16"})
				.addAccidental(0, new Vex.Flow.Accidental('b')),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["bb/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"})
		],
		beams: [
			[0, 1, 2, 3, 4, 5]
		],
		voice: {
			num_beats: 6,
			beat_value: 16
		}
	},
	// #50
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["f/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"})
		],
		beams: [
			[0, 1]
		],
		voice: {
			num_beats: 2,
			beat_value: 16
		}
	},
	// #51
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["f/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["bb/4"], duration: "16"})
				.addAccidental(0, new Vex.Flow.Accidental('b'))
		],
		beams: [
			[0, 1, 2]
		],
		voice: {
			num_beats: 3,
			beat_value: 16
		}
	},
	// #52
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"}),
			new Vex.Flow.StaveNote({keys: ["bb/4"], duration: "16"})
				.addAccidental(0, new Vex.Flow.Accidental('b'))
		],
		beams: [
			[0, 1]
		],
		voice: {
			num_beats: 2,
			beat_value: 16
		}
	},
	// #53
	{
		notes: [
			new Vex.Flow.StaveNote({keys: ["bb/4"], duration: "16"})
				.addAccidental(0, new Vex.Flow.Accidental('b')),
			new Vex.Flow.StaveNote({keys: ["g/4"], duration: "16"})
		],
		beams: [
			[0, 1]
		],
		voice: {
			num_beats: 2,
			beat_value: 16
		}
	}
];

// draw staff
function drawStaff(staveCanvasWrapper, index, width, part) {
	var height = part.notes2 ? 240 : 120;
	staveCanvasWrapper.innerHTML = '<canvas width="' + 
		width + '" height="' + 
		height + '" id="stave-canvas-' + index + '"></canvas>';
	var canvas = document.getElementById('stave-canvas-' + index),
		renderer = new Vex.Flow.Renderer(canvas,
			Vex.Flow.Renderer.Backends.CANVAS),
		staveWidth = width - 40;
	var ctx = renderer.getContext();
	var repeat_begin = true;
	var repeat_end = part.notes2 ? false : true;
	generateStave(index, ctx, staveWidth, 0, part.notes, part.voice, part.beams, part.ties, repeat_begin, repeat_end);
	if (part.notes2) {
		generateStave(index, ctx, staveWidth, 70, part.notes2, part.voice2, part.beams2, part.ties2, false, false);
	}
	if (part.notes3) {
		generateStave(index, ctx, staveWidth, 140, part.notes3, part.voice3, part.beams3, part.ties3, false, true);
	}
}

function generateStave(index, ctx, width, vOffset, partNotes, partVoice, partBeams, partTies, repeat_begin, repeat_end) {
	var stave = new Vex.Flow.Stave(10, vOffset, width);
	if (index === 0) {
		stave.addClef("treble");
	}
	if (repeat_begin) {
		stave.setBegBarType(Vex.Flow.Barline.type.REPEAT_BEGIN);
	}
	if (repeat_end) {
		stave.setEndBarType(Vex.Flow.Barline.type.REPEAT_END);
	}
	stave.setContext(ctx)
		.draw();

	var voice = new Vex.Flow.Voice({
		num_beats: partVoice.num_beats,
		beat_value: partVoice.beat_value,
		resolution: Vex.Flow.RESOLUTION
	});

	var beams, beamNotes;
	if (partBeams && partBeams.length > 0) {
		beams = partBeams.map(function (beam) {
			beamNotes = beam.map(function (b) {
				return partNotes[b];
			});
			return new Vex.Flow.Beam(beamNotes);
		});
	}
	
	var ties;
	if (partTies && partTies.length > 0) {
		ties = partTies.map(function (tie) {
			return new Vex.Flow.StaveTie({
			first_note: partNotes[tie[0]],
			last_note: partNotes[tie[1]],
			first_indices: [0],
			last_indices: [0]
		  });
	  });
	}
	// Add notes to voice
	voice.addTickables(partNotes);
	
	// Format and justify the notes to canvas width
	var formatter = new Vex.Flow.Formatter().
		joinVoices([voice]).format([voice], width - 30);

	// Render voice
	voice.draw(ctx, stave);
	if (partBeams && partBeams.length > 0) {
		beams.forEach(function (beam) {
			beam.setContext(ctx).draw();
		});
	}
	if (partTies && partTies.length > 0) {
		ties.forEach(function (tie) {
			tie.setContext(ctx).draw();
		});
	}
}
//drawStaff(staveCanvasWrapper, staveCanvasWrapper.offsetWidth, inCParts[8]);
//partHeader.innerHTML = 1 + ".";
setupGame();