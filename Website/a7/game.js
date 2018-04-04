// game.js for Perlenspiel 3.2

// The "use strict" directive in the following line is important. Don't alter or remove it!
"use strict";

// The following comment lines are for JSLint/JSHint. Don't alter or remove them!

/*jslint nomen: true, white: true */
/*global PS */

var G = ( function () {

    var WHITE = 0xffffff;
    var TITLE = 0xa53c0b;

    var preset = 1; //keeps track of current preset

    /* initially opening the page
    1. Deactivate all keys
     Display title fadein
    2.display numpad controls fade in
    >>> Transition to >>>
    3.Fade to initial piano preset

     */
    var beads = [
        [1, "piano_g3", "fx_squawk", "perc_drum_bass"],
        [2, "piano_a3", "fx_jump4", "perc_drum_snare"],
        [3, "piano_bb3", "fx_powerup1", "perc_drum_tom1"],
        [4, "piano_c4", "fx_powerup6", "perc_drum_tom4"],
        [5, "piano_d4", "fx_coin1", "perc_cymbal_crash1"],
        [6, "piano_eb4", "fx_pop", "perc_hihat_closed"],
        [7, "piano_gb4", "fx_shoot6", "perc_bongo_low"],
        [8, "piano_g4", "fx_blast4", "perc_bongo_high"],
        [9, "piano_a4", "fx_tada", "perc_triangle"]
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


    function disable() {} //disable enter function

    // The 'exports' object is used to define
    // variables and/or functions that need to be
    // accessible outside this function.
    // So far, it contains only one property,
    // an 'init' function with no parameters.

    var exports = {


        // G.init()
        // Initializes the game

        init : function () {
            //////////load audio
            for(var i = 0; i < 9; i++) {
                PS.audioLoad(drums[i]);
                PS.audioLoad(piano[i]);
                PS.audioLoad(synth[i]);
            }
            //////////create grid
            PS.gridShadow(true, PS.COLOR_GRAY_DARK);
            PS.gridSize( 3, 3);
            ////////// set initial colors
            PS.bgAlpha(PS.ALL, PS.ALL, PS.ALPHA_OPAQUE);
            PS.bgColor(PS.ALL, PS.ALL, PS.COLOR_GRAY_LIGHT);
            PS.color(PS.ALL, PS.ALL, PS.COLOR_GRAY_LIGHT);
            PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_GRAY_LIGHT);
            PS.statusColor(WHITE);
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
            var x, y, j;
            j = 0;
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
                    PS.data(x, y, beads[j]); //assign data to beads
                    j++;
                }
            }
            PS.statusText("Perlenpad");
            PS.enter = function(x, y, data, options) {
                PS.statusColor(TITLE);
                PS.enter = disable();
            };


        },

        showNumPad : function() {
            PS.fade(PS.ALL, PS.ALL, PS.CURRENT, { onEnd : G.showPad });
            PS.color(PS.ALL, PS.ALL, PS.COLOR_GRAY_DARK);
            PS.glyphColor(PS.ALL, PS.ALL, PS.COLOR_GRAY_DARK);
            PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_BLACK);
            PS.glyphColor(PS.ALL, PS.ALL, WHITE);

        },

        showPad : function() {
            function loseNum() {
                PS.glyph(PS.ALL, PS.ALL, PS.DEFAULT);
            }
            PS.statusFade( 130, { onEnd : function() {}});
            PS.statusColor(0x0097FF);
            PS.glyphFade(PS.ALL, PS.ALL, PS.CURRENT, { onEnd : loseNum});
            PS.glyphColor(PS.ALL, PS.ALL, PS.COLOR_GRAY_DARK);
            PS.borderFade(PS.ALL, PS.ALL, PS.CURRENT, { onEnd :G.activate });
            PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_GRAY_LIGHT);
            PS.gridColor(0x0097FF);
        },

        play : function(x, y, data) {
            PS.audioPlay(data[preset]);
            PS.borderFade(x, y, 10, { rgb : PS.makeRGB(PS.random(255), PS.random(255), PS.random(255))});
            PS.borderColor(x, y, PS.COLOR_GRAY_LIGHT);
        },

        padPlay : function(x, y) {
            PS.borderFade(x, y, 10, { rgb : PS.makeRGB(PS.random(255), PS.random(255), PS.random(255))});
            PS.borderColor(x, y, PS.COLOR_GRAY_LIGHT);
        },

        activate : function() {
            PS.gridFade(25);
            PS.statusText("");
            PS.exec(PS.ALL, PS.ALL, G.play);
        },

        change : function() {
            if (preset == 3) {
                PS.statusColor(0x0097FF);
                PS.statusText("Piano");
                PS.statusFade(100, { rgb : PS.COLOR_BLACK});
                PS.gridColor(0x0097FF);
                preset = 1;
            }
            else if (preset == 2) {
                PS.statusColor(0xc63023);
                PS.statusText("Drums");
                PS.statusFade(100, { rgb : PS.COLOR_BLACK});
                PS.gridColor(0xc63023);
                preset++;
            }
            else {
                PS.statusColor(PS.COLOR_BLACK);
                PS.statusText("Synth");
                PS.statusFade(100, { rgb : PS.COLOR_BLACK});
                PS.gridColor(0x23c636)
                preset++;
            }
            G.activate();
        },

        keyDown : function(key, shift, ctrl, options) {
            switch (key)
            {
                case PS.KEY_PAD_0 :
                case 48:
                    G.change();
                    break;
                case PS.KEY_PAD_1 :
                case 49:
                    PS.audioPlay(beads[0][preset]);
                    G.padPlay(0, 2);
                    break;
                case PS.KEY_PAD_2 :
                case 50:
                    PS.audioPlay(beads[1][preset]);
                    G.padPlay(1, 2);
                    break;
                case PS.KEY_PAD_3 :
                case 51:
                    PS.audioPlay(beads[2][preset]);
                    G.padPlay(2, 2);
                    break;
                case PS.KEY_PAD_4 :
                case 52:
                    PS.audioPlay(beads[3][preset]);
                    G.padPlay(0, 1);
                    break;
                case PS.KEY_PAD_5 :
                case 53:
                    PS.audioPlay(beads[4][preset]);
                    G.padPlay(1, 1);
                    break;
                case PS.KEY_PAD_6 :
                case 54:
                    PS.audioPlay(beads[5][preset]);
                    G.padPlay(2, 1);
                    break;
                case PS.KEY_PAD_7 :
                case 55:
                    PS.audioPlay(beads[6][preset]);
                    G.padPlay(0, 0);
                    break;
                case PS.KEY_PAD_8 :
                case 56:
                    PS.audioPlay(beads[7][preset]);
                    G.padPlay(1, 0);
                    break;
                case PS.KEY_PAD_9 :
                case 57:
                    PS.audioPlay(beads[8][preset]);
                    G.padPlay(2, 0);
                    break;
            }
            //PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );
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

PS.keyDown = G.keyDown;

//PS.touch = G.touch;

/*
PS.keyDown = function(key, shift, ctrl, options) {
    switch (key) {
        case PS.KEY_PAD_0 :
            G.change();
            break;
        case PS.KEY_PAD_1 :
            PS.touch(0, 2, data, options);
            break;
        case PS.KEY_PAD_2 :
            PS.touch(1, 2, data, options);
            break;
        case PS.KEY_PAD_3 :
            PS.touch(2, 2, data, options);
            break;
        case PS.KEY_PAD_4 :
            PS.touch(0, 1, data, options);
            break;
        case PS.KEY_PAD_5 :
            PS.touch(1, 1, data, options);
            break;
        case PS.KEY_PAD_6 :
            PS.touch(2, 1, data, options);
            break;
        case PS.KEY_PAD_7 :
            PS.touch(0, 0, data, options);
            break;
        case PS.KEY_PAD_8 :
            PS.touch(1, 0, data, options);
            break;
        case PS.KEY_PAD_9 :
            PS.touch(2, 0, data, options);
    }
    PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );
};
//PS.keyDown = G.keyDown;
/*
PS.keyDown = function(key, shift, ctrl, options) {
    if (key == PS.KEY_PAD_0) {
        G.change();
    }
    PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );
};

*/

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
