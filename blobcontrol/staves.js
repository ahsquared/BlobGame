/*global Vex, io, gyro */

var IS_IOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent),
	staveCanvasWrapper = document.getElementById('stave-wrapper'),
	partHeader = document.getElementById('part-header'),
	socket,
	game,
	inCParts;

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
inCParts.forEach(function (el, i) {
	var html = '<h2 id="header-' + i + '"></h2><div class="stave" id="stave-' + i + '"></div>';
	$('#stave-wrapper').append(html);
	var stave = $('#stave-' + i);
	drawStaff(stave[0], i, stave.width(), inCParts[i]);
	$('#header-' + i).text((i + 1) + '.');
});
//drawStaff(staveCanvasWrapper, staveCanvasWrapper.offsetWidth, inCParts[8]);
//partHeader.innerHTML = 1 + ".";