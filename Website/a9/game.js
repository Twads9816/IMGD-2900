// game.js for Perlenspiel 3.2

// The "use strict" directive in the following line is important. Don't alter or remove it!
"use strict";

// The following comment lines are for JSLint/JSHint. Don't alter or remove them!

/*jslint nomen: true, white: true */
/*global PS */

var G = ( function () {

//Constants
    var DELAY = 30; //1/2 second key delay and delay for array playback
    var TITLE_COLOR = 0xa53c0b; //title color
    var PIANO_COLOR = 0x0097FF; //piano blue
    var SYNTH_COLOR = 0x23c636; //synth green
    var DRUM_COLOR = 0xc63023; //drum red
    const FLASH = 0x8607b5; //background flash color
    var cArray; //stores current array
    var wrong; //stores number of wrong key presses
    var cLevel; //stores current level
    var cPos = 0; //current array position
    var X = 4; //x coordinate within array
    var Y = 5; //y coordinate within array

    var preset = 1; //keeps track of current preset

    /* initially opening the page
    1. Deactivate all keys
     Display title fadein
    2.display numpad controls fade in
    >>> Transition to >>>
    3.Fade to initial piano preset
     */

    //level colors
    const lvlColors = [0xf4e842, 0xf4e842, 0xf4c741, 0xf4a941, 0xf49441, 0xf47641, 0xf46141, 0xf45241, 0xf44141, 0xf4417f
    ]

    //preset data
    var presets = [
        [1, "P I A N O", PIANO_COLOR],
        [2, "S Y N T H", SYNTH_COLOR],
        [3, "D R U M S", DRUM_COLOR]
    ]

    //array containng all data association for beads
    var beads = [
        [1, "piano_g3", "fx_squawk", "perc_drum_bass", 0, 2],
        [2, "piano_a3", "fx_jump4", "perc_drum_snare", 1, 2],
        [3, "piano_bb3", "fx_powerup1", "perc_drum_tom1", 2, 2],
        [4, "piano_c4", "fx_powerup6", "perc_drum_tom4", 0, 1],
        [5, "piano_d4", "fx_coin1", "perc_cymbal_crash1", 1, 1],
        [6, "piano_eb4", "fx_pop", "perc_hihat_closed", 2, 1],
        [7, "piano_gb4", "fx_shoot6", "perc_bongo_low", 0, 0],
        [8, "piano_g4", "fx_blast4", "perc_bongo_high", 1, 0],
        [9, "piano_a4", "fx_tada", "perc_triangle", 2, 0]
    ];

    //string arrays for audio loading
    var drums = [
        "perc_drum_bass",
        "perc_drum_snare",
        "perc_drum_tom1",
        "perc_drum_tom4",
        "perc_cymbal_crash1",
        "perc_hihat_closed",
        "perc_bongo_low",
        "perc_bongo_high",
        "perc_triangle"
    ];

    var synth = [
        "fx_squawk",
        "fx_jump4",
        "fx_powerup1",
        "fx_powerup6",
        "fx_coin1",
        "fx_pop",
        "fx_shoot6",
        "fx_blast4",
        "fx_tada"
    ];

    var piano = [
        "piano_g3",
        "piano_a3",
        "piano_bb3",
        "piano_c4",
        "piano_d4",
        "piano_eb4",
        "piano_gb4",
        "piano_g4",
        "piano_a4"
    ];

    // The 'exports' object is used to define
    // variables and/or functions that need to be
    // accessible outside this function.
    // So far, it contains only one property,
    // an 'init' function with no parameters.

    var exports = {


        // G.init()
        // Initializes the game

        init : function () {
            PS.keyRepeat(true, PS.DEFAULT, 30);
            //////////load audio
            for(var i = 0; i < 9; i++) {
                PS.audioLoad(drums[i]);
                PS.audioLoad(piano[i]);
                PS.audioLoad(synth[i]);
            }
            PS.audioLoad("fx_rip");
            PS.audioLoad("fx_bloink");
            //////////create grid
            PS.gridShadow(true, PS.COLOR_GRAY_DARK);
            PS.gridSize( 3, 3);
            ////////// set initial colors
            PS.bgAlpha(PS.ALL, PS.ALL, PS.ALPHA_OPAQUE);
            PS.bgColor(PS.ALL, PS.ALL, PS.COLOR_GRAY_LIGHT);
            PS.color(PS.ALL, PS.ALL, PS.COLOR_GRAY_LIGHT);
            PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_GRAY_LIGHT);
            PS.statusColor(PS.COLOR_WHITE);
            PS.glyphColor(PS.ALL, PS.ALL, PS.COLOR_GRAY_LIGHT);
            ///////// SCALING
            PS.radius(PS.ALL, PS.ALL, 6);
            PS.border(PS.ALL, PS.ALL, 17);
            PS.scale(PS.ALL, PS.ALL, 97);
            ///////// FADING
            PS.glyphFade(PS.ALL, PS.ALL, 130);
            PS.fade(PS.ALL, PS.ALL, 130);
            PS.borderFade(PS.ALL, PS.ALL, 130);
            PS.statusFade(130, { onEnd: G.showNumPad });
            PS.gridFade(130);
            ///////// CREATE GLYPHS, CREATE DATA ASSOCIATIONS
            var x, y, j = 0;
            for (y = 2; y > -1; y--) {
                for (x = 0; x < 3; x++) {
                    var row;
                    switch(y) {
                        case 2 :
                            row = 0;
                            break;
                        case 1 :
                            row = 3;
                            break;
                        case 0 :
                            row = 6;
                            break;
                    }
                    var num = x + 1 + row;
                    var n = num.toString();
                    PS.glyph(x, y, n);
                    j++;
                }
            }
            PS.statusText("P E R L E N P A D 2");
            PS.enter = function(x, y, data, options) {
                PS.statusColor(TITLE_COLOR);
                PS.enter = function() {};
            };
        },

        //function to show the number pad before activating game

        showNumPad : function() {
            function wait() {
                PS.fade(PS.ALL, PS.ALL, PS.CURRENT, { onEnd : PS.DEFAULT });
                PS.keyDown = G.showPad;
                PS.touch = G.showPad;
            }
            PS.statusFade(130, { onEnd: PS.DEFAULT });
            PS.fade(PS.ALL, PS.ALL, PS.CURRENT, { onEnd : wait });
            PS.color(PS.ALL, PS.ALL, PS.COLOR_GRAY_DARK);
            PS.glyphColor(PS.ALL, PS.ALL, PS.COLOR_GRAY_DARK);
            PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_BLACK);
            PS.glyphColor(PS.ALL, PS.ALL, PS.COLOR_WHITE);

        },

        //shows the actual perlenpad before activating it

        showPad : function() {
            G.deactivate();
            function loseNum() {
                PS.glyph(PS.ALL, PS.ALL, PS.DEFAULT);

            }
            function loseText() {
                PS.statusText("");
                setTimeout(G.start, 1000);
            }
            PS.statusFade( 130, { onEnd : loseText});
            PS.statusColor(presets[preset-1][2]);
            PS.glyphFade(PS.ALL, PS.ALL, PS.CURRENT);
            PS.glyphColor(PS.ALL, PS.ALL, PS.COLOR_GRAY_DARK);
            PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_GRAY_LIGHT);
            PS.gridColor(presets[preset-1][2]);
            setTimeout(loseNum, 5000);
        },

        //deactivate input

        deactivate : function() {
            PS.touch = function(x, y, data, option) {};
            PS.exec = (PS.ALL, PS.ALL, PS.DEFAULT);
            PS.keyDown = function() {};
        },

        //activate input

        activate : function() {
            PS.exec = (PS.ALL, PS.ALL, G.mousePlay);
            PS.keyDown = G.keyDown;
        },

        reset : function() {
            wrong = 0;
            cPos = 0;
            cLevel = 1;
        },

        //start the game

        start : function() {
            G.reset();
            setTimeout(PS.gridFade(PS.CURRENT, { onEnd : PS.DEFAULT}), 1000);
            PS.borderFade(PS.ALL, PS.ALL, 20, { rgb : FLASH});
            PS.statusFade(750, { onEnd : PS.DEFAULT});
            PS.gridFade(25);
            G.playLevel(cLevel);
        },

        //function to play any bead given its number

        play : function(num) {
            PS.audioPlay(beads[num-1][preset]); //plays audio for given bead
            G.flash(num);
        },

        //flashes a random color around given bead
        flash : function (num) {
            //generate better random colors
            PS.borderColor(beads[num-1][X], beads[num-1][Y], PS.COLOR_GRAY_LIGHT);
        },

        mousePlay : function(x, y, data) {
            const n = x + 1;
            switch (y) {
                case 2 :
                    G.play(n);
                    break;
                case 1 :
                    G.play(n+3);
                    break;
                case 0 :
                    G.play(n+6);
                    break;
            }
        },

        //switch preset based on preset global value
        change : function() {
            if (preset === 3) {
                preset = 1;
            }
            else preset ++;
            PS.statusFade(120, { rgb : PS.COLOR_BLACK});
            PS.statusText(presets[preset - 1][1]);
            PS.statusColor(presets[preset - 1][2]);
            PS.gridColor(presets[preset - 1][2]);
        },

        keyDown : function(key, shift, ctrl, options) {
            PS.gridFade(PS.CURRENT, {rgb : PS.DEFAULT});
            var num = 0;
            //PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );
            switch (key)
            {
                /* case PS.KEY_PAD_0 :
                 case 48:
                     G.change();
                     break; */
                case PS.KEY_PAD_1 :
                case 49:
                    num = 1;
                    break;
                case PS.KEY_PAD_2 :
                case 50:
                    num = 2;
                    break;
                case PS.KEY_PAD_3 :
                case 51 :
                    num = 3;
                    break;
                case PS.KEY_PAD_4 :
                case 52:
                    num = 4;
                    break;
                case PS.KEY_PAD_5 :
                case 53:
                    num = 5;
                    break;
                case PS.KEY_PAD_6 :
                case 54:
                    num = 6;
                    break;
                case PS.KEY_PAD_7 :
                case 55:
                    num = 7;
                    break;
                case PS.KEY_PAD_8 :
                case 56:
                    num = 8;
                    break;
                case PS.KEY_PAD_9 :
                case 57:
                    num = 9;
                    break;
            }
            if (num === cArray[cPos]) {
                cPos++;
                G.play(num);
                if (cPos === cArray.length) {
                    G.deactivate();
                    G.playLevel(++cLevel);
                }
                return true;
            }
            else if ( (key > 48 && key < 58) || (key > (PS.KEY_PAD_1 - 1) && key < (PS.KEY_PAD_9 + 1)) ){
                G.wrong();
                return false;
            }
        },

        wrong : function() {
            wrong++;
            PS.gridFade(PS.CURRENT, {rgb : PS.COLOR_RED});
            PS.gridColor(lvlColors[cLevel - 1]);
            if (wrong === 3 || wrong > 3) {
                PS.audioPlay("fx_bloink");
                G.deactivate();
                G.start();
            }
            else
            PS.audioPlay("fx_rip");

        },

        //play any level

        playLevel : function(lvlnum) {
            PS.gridColor(lvlColors[lvlnum - 1]);
            wrong = 0;
            cPos = 0;
            if(lvlnum) {
                switch (lvlnum) {
                    case 1 :
                        DELAY = 30;
                        cArray = [4, 2, 1];
                        G.plyFromArray();
                        break;
                    case 2 :
                        cArray = [1, 3, 8];
                        G.plyFromArray2();
                        break;
                    case 3 :
                        cArray = [6,4,8,9,7];
                        G.plyFromArray2();
                        break;
                    case 4 :
                        cArray = [1,9,5,7,8];
                        G.plyFromArray2();
                        break;
                    case 5 :
                        cArray = [1,4,7,8,9,5,4,2,1];
                        G.plyFromArray2();
                        break;
                    case 6 :
                        DELAY = 15;
                        cArray = G.randArray(5);
                        G.plyFromArray2();
                        break;
                    case 7 :
                        cArray = G.randArray(6);
                        G.plyFromArray2();
                        break;
                    case 8 :
                        cArray = G.randArray(7);
                        G.plyFromArray2();
                        break;
                    case 9 :
                        cArray = G.randArray(8);
                        G.plyFromArray2();
                        break;
                    case 10 :
                        cArray = G.randArray(9);
                        G.plyFromArray2();
                        break;
                    case 11 :
                        PS.statusFade(60);
                        PS.statusColor(PS.COLOR_BLACK);
                        PS.statusText("Nice Notes Kid");
                        PS.audioPlay("fx_tada");
                        PS.color(PS.ALL, PS.ALL, 0xb29501 );
                        PS.bgColor(PS.ALL, PS.ALL, 0xefc804);
                        G.deactivate();
                }
            }
        },

        plyFromArray : function() {
            var i = 0;
            const code = PS.timerStart(120, step);
            function step() {
                i++;
                switch(i) {
                    case 1 :
                        G.disTxt("L E V E L " + cLevel);
                        PS.bgColor(PS.ALL, PS.ALL, PS.COLOR_GRAY_DARK);
                        break;
                    case 2 :
                        PS.statusText("R E M E M B E R :");
                        break;
                    case 3 :
                        G.playArray(cArray);
                        break;
                    case 4 :
                        PS.timerStop(code);
                        PS.statusText("R E P E A T");
                        PS.bgColor(PS.ALL, PS.ALL, PS.COLOR_GRAY_LIGHT);
                        G.activate();
                        break;
                }
            }
        },

        plyFromArray2 : function() {
            var i = 0;
            const code = PS.timerStart(100, step);
            function step() {
                i++;
                switch(i) {
                    case 1 :
                        G.disTxt("L E V E L " + cLevel);
                        PS.bgColor(PS.ALL, PS.ALL, PS.COLOR_GRAY_DARK);
                        break;
                    case 3 :
                        G.playArray(cArray);
                        break;
                    case 4 :
                        PS.timerStop(code);
                        PS.bgColor(PS.ALL, PS.ALL, PS.COLOR_GRAY_LIGHT);
                        G.activate();
                        break;
                }
            }
        },

        randArray : function(size) {
            var result = [];
            for(var i = 0; i < size; i++) {
                result[i] = PS.random(9);
            }
            return result;
        },

        //play an array of button using the global delay
        playArray : function(array) {
            var i = 0;
            function execute() {
                G.play(array[i]);
                i++;
                if (i === num || i > num) {
                    PS.timerStop(code);
                }
            }
            const num = array.length;
            var code = PS.timerStart(DELAY, execute);
        },

        checkPlayer : function(array) {
            while (i < array.length) {
                var key = G.keyDown;
                if (key != array[i]) {

                }
            }
        },

        //display text

        disTxt (string) {
            PS.statusFade(120, { rgb : lvlColors[cLevel - 1]});
            PS.statusColor(PS.COLOR_BLACK);
            PS.statusText(string);
        }
    };

    // Return the 'exports' object as the value
    // of this function, thereby assigning it
    // to the global G variable. This makes
    // its properties visible to Perlenspiel.

    return exports;
} () );

// Tell Perlenspiel to use our G.init() function
// to initialize the game

PS.init = G.init;

/*
This is a template for creating new Perlenspiel games.
All event-handling functions are commented out by default.
Uncomment and add code to the event handlers required by your project.
*/

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
[system] = an object containing engine and platform information; see API documentation for details.
[options] = an object with optional parameters; see API documentation for details.
*/

// Uncomment the following BLOCK to expose PS.init() event handler:

/*

PS.init = function( system, options ) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.init() called\n" );

	// This function should normally begin with a call to PS.gridSize( x, y )
	// where x and y are the desired initial dimensions of the grid.
	// Call PS.gridSize() FIRST to avoid problems!
	// The sample call below sets the grid to the default dimensions (8 x 8).
	// Uncomment the following code line and change the x and y parameters as needed.

	// PS.gridSize( 8, 8 );

	// This is also a good place to display your game title or a welcome message
	// in the status line above the grid.
	// Uncomment the following code line and change the string parameter as needed.

	// PS.statusText( "Game" );

	// Add any other initialization code you need here.
};

*/

/*
PS.touch ( x, y, data, options )
Called when the mouse button is clicked on a bead, or when a bead is touched.
It doesn't have to do anything.
[x] = zero-based x-position of the bead on the grid.
[y] = zero-based y-position of the bead on the grid.
[data] = the data value assigned to this bead by a call to PS.data(); default = 0.
[options] = an object with optional parameters; see API documentation for details.
*/

// Uncomment the following BLOCK to expose PS.touch() event handler:


/*

PS.touch = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

};

*/


/*
PS.release ( x, y, data, options )
Called when the mouse button is released over a bead, or when a touch is lifted off a bead
It doesn't have to do anything
[x] = zero-based x-position of the bead on the grid
[y] = zero-based y-position of the bead on the grid
[data] = the data value assigned to this bead by a call to PS.data(); default = 0.
[options] = an object with optional parameters; see API documentation for details.
*/

// Uncomment the following BLOCK to expose PS.release() event handler:

/*

PS.release = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead.
};

*/

/*
PS.enter ( x, y, button, data, options )
Called when the mouse/touch enters a bead.
It doesn't have to do anything.
[x] = zero-based x-position of the bead on the grid.
[y] = zero-based y-position of the bead on the grid.
[data] = the data value assigned to this bead by a call to PS.data(); default = 0.
[options] = an object with optional parameters; see API documentation for details.
*/

// Uncomment the following BLOCK to expose PS.enter() event handler:

/*

PS.enter = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead.
};

*/

/*
PS.exit ( x, y, data, options )
Called when the mouse cursor/touch exits a bead.
It doesn't have to do anything.
[x] = zero-based x-position of the bead on the grid.
[y] = zero-based y-position of the bead on the grid.
[data] = the data value associated with this bead, 0 if none has been set.
[options] = an object with optional parameters; see API documentation for details.
*/

// Uncomment the following BLOCK to expose PS.exit() event handler:

/*

PS.exit = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
};

*/

/*
PS.exitGrid ( options )
Called when the mouse cursor/touch exits the grid perimeter.
It doesn't have to do anything.
[options] = an object with optional parameters; see API documentation for details.
*/

// Uncomment the following BLOCK to expose PS.exitGrid() event handler:

/*

PS.exitGrid = function( options ) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid.
};

*/

/*
PS.keyDown ( key, shift, ctrl, options )
Called when a key on the keyboard is pressed.
It doesn't have to do anything.
[key] = ASCII code of the pressed key, or one of the PS.KEY constants documented at:
http://users.wpi.edu/~bmoriarty/ps/constants.html
[shift] = true if shift key is held down, else false.
[ctrl] = true if control key is held down, else false.
[options] = an object with optional parameters; see API documentation for details.
*/

// Uncomment the following BLOCK to expose PS.keyDown() event handler:


/*
PS.keyDown = function( key, shift, ctrl, options ) {


	// Add code here for when a key is pressed.
};
*/


/*
PS.keyUp ( key, shift, ctrl, options )
Called when a key on the keyboard is released.
It doesn't have to do anything.
[key] = ASCII code of the pressed key, or one of the PS.KEY constants documented at:
http://users.wpi.edu/~bmoriarty/ps/constants.html
[shift] = true if shift key is held down, else false.
[ctrl] = true if control key is held down, else false.
[options] = an object with optional parameters; see API documentation for details.
*/

// Uncomment the following BLOCK to expose PS.keyUp() event handler:


/*
PS.keyUp = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is released.
};

*/

/*
PS.input ( sensors, options )
Called when an input device event (other than mouse/touch/keyboard) is detected.
It doesn't have to do anything.
[sensors] = an object with sensor information; see API documentation for details.
[options] = an object with optional parameters; see API documentation for details.
NOTE: Mouse wheel events occur ONLY when the cursor is positioned over the grid.
*/

// Uncomment the following BLOCK to expose PS.input() event handler:

/*

PS.input = function( sensors, options ) {
	// Uncomment the following code lines to inspect first parameter:

//	 var device = sensors.wheel; // check for scroll wheel
//
//	 if ( device ) {
//	   PS.debug( "PS.input(): " + device + "\n" );
//	 }

	// Add code here for when an input event is detected.
};

*/

/*
PS.shutdown ( options )
Called when the browser window running Perlenspiel is about to close.
It doesn't have to do anything.
[options] = an object with optional parameters; see API documentation for details.
NOTE: This event is only used for applications utilizing server communication.
*/

// Uncomment the following BLOCK to expose PS.shutdown() event handler:

/*

PS.shutdown = function( options ) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "Daisy, Daisy ...\n" );

	// Add code here for when Perlenspiel is about to close.
};

*/

/*
Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
Perlenspiel is Copyright © 2009-17 Worcester Polytechnic Institute.
This file is part of Perlenspiel.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with Perlenspiel. If not, see <http://www.gnu.org/licenses/>.
*/
