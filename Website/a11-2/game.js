// game.js for Perlenspiel 3.2

// The "use strict" directive in the following line is important. Don't alter or remove it!
"use strict";

// The following comment lines are for JSLint/JSHint. Don't alter or remove them!

/*jslint nomen: true, white: true */
/*global PS */

const G = ( function () {

    //set the game to either fully random (true) or as a random stacking each level (false
    let cRand = true;

//constants
    const TITLE_COLOR = 0xa53c0b; //title color
    const PIANO_COLOR = 0x0097FF; //piano blue
    const SYNTH_COLOR = 0x23c636; //synth green
    const DRUM_COLOR = 0xc63023; //drum red
    const FLASH_COLOR = 0x8607b5; //background flash color
    const X = 4; //x coordinate within array
    const Y = 5; //y coordinate within array

    //////////////////////////////////////////////////////////////////
    //variables for export functions
    let delay = 30; //1/2 second key delay and delay for array playback
    let cArray = [4, 3, 1]; //stores current array of notes
    let nWrong = 0; //stores number of wrong key presses
    let cLvl = 0; //stores current level
    let cPos = 0; //current position in array of notes
    let pPos = 0; //player position in array
    let preset = 1; //keeps track of current preset
    let ticks = 0; //remembers ticks of global function
    let complete = false; //flag signaling movement to next level
    let active = false; //flags whether game is ready to accept input
    let cBGC = PS.COLOR_WHITE; //stores the current background color
    let lvlTries = 0; //tries before game resets to level 1
    let tutorial = true; //tutorial flag

    //////////////////////////////////////////////////////////////////
    ////ARRAYS

    const BG_COLORS = [
        PS.COLOR_WHITE,
        0x42b6f4,
        0x4189f4,
        0x416af4,
        0x414cf4,
        0x5541f4,
        0x7341f4,
        0x8e41f4,
        0xa941f4,
        0xc441f4,
        0xdf41f4,
        0xedc92d
    ];

    //preset data
    const PRESETS = [
        [1, "P I A N O", PIANO_COLOR],
        [2, "S Y N T H", SYNTH_COLOR],
        [3, "D R U M S", DRUM_COLOR]
    ];

    //array containing all data association for beads
    const BEADS = [
        ["1", "piano_c4", "fx_squawk", "perc_drum_bass", 0, 2],
        ["2", "piano_d4", "fx_jump4", "perc_drum_snare", 1, 2],
        ["3", "piano_e4", "fx_powerup1", "perc_drum_tom1", 2, 2],
        ["4", "piano_f4", "fx_powerup6", "perc_drum_tom4", 0, 1],
        ["5", "piano_g4", "fx_coin1", "perc_cymbal_crash1", 1, 1],
        ["6", "piano_ab4", "fx_pop", "perc_hihat_closed", 2, 1],
        ["7", "piano_b4", "fx_shoot6", "perc_bongo_low", 0, 0],
        ["8", "piano_c5", "fx_blast4", "perc_bongo_high", 1, 0],
        ["9", "piano_d5", "fx_tada", "perc_triangle", 2, 0]
    ];

    //string arrays for audio loading
    const DRUMS = [
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
    const SYNTH = [
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
    const PIANO = [
        "piano_c4",
        "piano_d4",
        "piano_e4",
        "piano_f4",
        "piano_g4",
        "piano_ab4",
        "piano_b4",
        "piano_c5",
        "piano_d5"
    ];

    //////////////////////////////////////////////////////////////////
    //functions to export out of global scope

    var exports = {

        // G.init()
        // Initializes the game

        init : function () {
            //////////////////////////////////////////////////////////////////
            //set key delay
            PS.keyRepeat(true, PS.DEFAULT, 30);

            //////////////////////////////////////////////////////////////////
            //load audio
            for(var i = 0; i < 9; i++) {
                PS.audioLoad(DRUMS[i]);
                PS.audioLoad(PIANO[i]);
                PS.audioLoad(SYNTH[i]);
            }
            PS.audioLoad("fx_rip");
            PS.audioLoad("fx_bloink");

            //////////////////////////////////////////////////////////////////
            //create grid
            PS.gridSize( 3, 3);

            //////////////////////////////////////////////////////////////////
            ////INITIALIZE APPEARANCE

            //shadow
            PS.gridShadow(true, PS.COLOR_GRAY_DARK);

            //alpha
            PS.bgAlpha(PS.ALL, PS.ALL, PS.ALPHA_OPAQUE);

            //color
            PS.bgColor(PS.ALL, PS.ALL, PS.COLOR_GRAY_LIGHT);
            PS.color(PS.ALL, PS.ALL, PS.COLOR_GRAY_LIGHT);
            PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_GRAY_LIGHT);
            PS.statusColor(PS.COLOR_WHITE);
            PS.glyphColor(PS.ALL, PS.ALL, PS.COLOR_GRAY_LIGHT);

            //scaling
            PS.radius(PS.ALL, PS.ALL, 6);
            PS.border(PS.ALL, PS.ALL, 20);
            PS.scale(PS.ALL, PS.ALL, 95);

            //fading
            PS.glyphFade(PS.ALL, PS.ALL, 120);
            PS.fade(PS.ALL, PS.ALL, 120);
            PS.borderFade(PS.ALL, PS.ALL, 120);
            PS.statusFade(120);
            PS.gridFade(120);

            //create data associations & glyphs
            let n = 0;
            for (let y = 2; y > -1; y--) {
                for (let x = 0; x < 3; x++) {
                    PS.data(x, y, BEADS[n]);

                    PS.glyph(x, y, BEADS[n][0]);

                    n++;
                }
            }

            //text
            PS.statusText("Perlenpad 2:");

            //////////////////////////////////////////////////////////////////
            //display initial splash
            G.splash();

        },

        //////////////////////////////////////////////////////////////////
        //display splash screen at beginning of game and controls, start tutorial
        splash : function() {
            const sTimer = PS.timerStart(60, start);
            let sTicks = 0;
            function start() {

                //reveal title after 1 sec
                if(sTicks === 0) {
                    PS.statusColor(TITLE_COLOR);
                }

                //reveal substitle
                if(sTicks === 2) {
                    PS.statusText("The Paddening");
                }

                //reveal numpad
                if (sTicks === 4) {
                    PS.statusColor(PS.COLOR_WHITE);
                    PS.color(PS.ALL, PS.ALL, PS.COLOR_GRAY_DARK);
                    PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_BLACK);
                    PS.glyphColor(PS.ALL, PS.ALL, PS.COLOR_WHITE);
                }

                //fade to play board
                if (sTicks === 7) {
                    PS.glyphColor(PS.ALL, PS.ALL, PS.COLOR_GRAY_DARK);
                    PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_GRAY_LIGHT);
                }

                //start tutorial, remove glyphs, remove status text
                if (sTicks === 9) {
                    PS.timerStop(sTimer);

                    PS.statusText("");
                    PS.glyph(PS.ALL, PS.ALL, "");

                    //set borders to fade from purple
                    PS.borderFade(PS.ALL, PS.ALL, 25, { rgb : FLASH_COLOR});

                    //start tutorial
                    G.tutorial();
                }
                sTicks++;
            }
        },

        //////////////////////////////////////////////////////////////////
        //play tutorial
        tutorial : function() {
            const tTimer = PS.timerStart(60, exec);
            let tTicks = 0;
            function exec() {

                //display remember
                if (tTicks === 0) {
                    PS.statusText("Remember");
                    PS.statusColor(PS.COLOR_BLACK);
                }

                //play notes
                if (tTicks === 2) {
                    G.dNotes();
                }

                //activate
                if (tTicks === 4) {
                    PS.statusText("Repeat");
                }

                //check if tutorial complete
                if (pPos === cArray.length) {
                    PS.timerStop(tTimer);
                    PS.statusFade(60);
                    PS.statusColor(cBGC);
                    setTimeout(PS.timerStart(60, G.tick), 2000);
                    active = false;
                    tutorial = false;
                }

                tTicks++;
            }
        },

        //////////////////////////////////////////////////////////////////
        //debugging function
        works : function() {
            PS.debug("works");
        },

        //////////////////////////////////////////////////////////////////
        //tick function allows for timed control of level loading
        tick : function() {
            //PS.debug( "ticks: " + ticks + "\n");

            //if current position is length of note array, all notes have been played successfully
            if (pPos === cArray.length) {
                active = false;
                complete = true;
            }

            if (complete) {
                G.loadNext();
                complete = false;
            }

            if (cLvl === 11) {
                PS.borderColor(PS.random(3) - 1, PS.random(3) - 1, PS.COLOR_GRAY_LIGHT);
            }
            ticks++;
        },

        //////////////////////////////////////////////////////////////////
        //assume game is ready to load next level
        loadNext : function() {
            cLvl++;
            cPos = 0;
            pPos = 0;
            nWrong = 0;
            G.newNotes();
            G.display();
        },

        //////////////////////////////////////////////////////////////////
        //generates a new array of notes for current level

        newNotes : function() {
            if (cLvl < 3 || cLvl === 3) {
                delay--;
                cArray = [PS.random(9), PS.random(9), PS.random(9)];
            }
            else if (cLvl === 11) {
                return;
            }
            else {
                delay -= 2;
                if (cRand) {
                    let array = [];
                    for (var i = 0; i < cLvl; i++) {
                        array.push(PS.random(9));
                    }
                    cArray = array;
                }
                else cArray.push(PS.random(9));
            }
        },


        //////////////////////////////////////////////////////////////////
        //display level and puzzle info
        display : function() {
            cBGC = BG_COLORS[cLvl];
            PS.gridFade(60, {rgb : PS.DEFAULT});


            const dTimer = PS.timerStart(60, exec);
            let dTicks = 0;

            function exec() {
                if (dTicks === 0) {
                    PS.bgColor(PS.ALL, PS.ALL, PS.COLOR_GRAY_LIGHT);
                }

                if (dTicks === 1) {
                    PS.statusColor(cBGC);
                    PS.gridColor(cBGC);
                }

                if (dTicks === 2) {
                    if (cLvl != 11) {
                        PS.statusText("Level " + cLvl);
                        PS.statusColor(PS.COLOR_BLACK);
                    }
                    else {
                        PS.statusText("Nice Notes!");
                        PS.statusColor(PS.COLOR_BLACK);
                        PS.audioPlay("fx_tada");
                        PS.timerStop(dTimer);
                    }
                }

                if (dTicks === 3) {
                    G.dNotes();
                    PS.timerStop(dTimer);
                }

                dTicks++;
            }


        },

        //////////////////////////////////////////////////////////////////
        //gradually shift the background color
        /* No time to implement, use array instead
        newBGC : function() {

        },
        */

        //////////////////////////////////////////////////////////////////
        //display the notes in the current array for memorization
        dNotes : function() {
            const dTimer = PS.timerStart(delay, exec);
            let dTicks = 0;
            function exec() {
                if (dTicks < cArray.length) {
                    G.play();
                    dTicks++;
                }
                else {
                    G.activate();
                    PS.timerStop(dTimer);
                }
            }
        },

        //////////////////////////////////////////////////////////////////
        //plays a given note ASSUME: THE NOTE SHOULD IN FACT BE PLAYING
        play : function() {
                PS.audioPlay(BEADS[cArray[cPos] - 1][1]);
                PS.borderColor(BEADS[cArray[cPos] - 1][X], BEADS[cArray[cPos] - 1][Y], PS.COLOR_GRAY_LIGHT);
                cPos++;
                if (active) {
                    pPos++;
                }
        },

        //////////////////////////////////////////////////////////////////
        //activate input to play puzzle
        activate : function() {
            //make sure starting position is 0
            cPos = 0;
            pPos = 0;

            //darken border as a signifier
            PS.bgColor(PS.ALL, PS.ALL, PS.COLOR_GRAY_DARK);

            //allow input
            active =  true;
        },

        //////////////////////////////////////////////////////////////////
        //takes valid input for playing and checks if game/level is ready to accept input
        attempt : function(key) {
            if (active) {
                if (key === cArray[cPos]) {
                    G.play();
                }
                else G.wrong();
            }
        },

        //////////////////////////////////////////////////////////////////
        //process a wrong answer
        wrong : function() {

            PS.gridFade(20, { rgb : PS.COLOR_RED});
            PS.gridColor(cBGC);

            //flags
            pPos = 0;
            cPos = 0;
            nWrong++;
            active = false;

            if (nWrong === 3 && !tutorial) {
                PS.audioPlay("fx_bloink");
                cLvl = 0;
                delay = 30;
                G.loadNext();
                return;
            }

            //a/v
            PS.audioPlay("fx_rip");
            G.dNotes();
        }
    };

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

	PS.debug( "PS.init() called\n" );

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




PS.touch = function( x, y, data, options ) {
	//PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );
	G.attempt(parseInt(data[0]));

};




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



PS.keyDown = function( key, shift, ctrl, options ) {
    if ((key > 48 && key < 58) || (key > 96 && key < 106)) {
        //PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );
        if ((key > 48) && (key < 58)) {
            G.attempt((key - 48));
        }
        else if ((key > 96) && (key < 106)) {
            G.attempt((key - 96));
        }
    }
    //check for correct input
	// Add code here for when a key is pressed.
};



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
