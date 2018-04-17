// game.js for Perlenspiel 3.2

// The "use strict" directive in the following line is important. Don't alter or remove it!
"use strict";

// The following comment lines are for JSLint/JSHint. Don't alter or remove them!

/*jslint nomen: true, white: true */
/*global PS */

/*=========================Process=========================*/
/*
  1. Initiate game
    a. Associate beads with data for all games
        i. isPath for drag game. Set through array. Checked by game during play.
        ii. music files for remember game
  2. Show menu
  3. Launch game
  4. For each level check level type variable in levels array
  5. Use level type to dictate what data gets checked and used
    a. Use data level types to dictate how mouse input is used
*/

/*=========================Testing?=========================*/
//set to true for user testing
const test = false;

/*=========================Global Namespace=========================*/
const G = (function() {
    //if level is of correct type, load appropriate data for each bead
    //level progression is predefined

    /*=========================Consts & Vars=========================*/
    const WIDTH = 16, HEIGHT = 15; /*width and height of grid arrays for level loading
    16 x 15 to leave room for time bar
     */
    const grid1 = [
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    ];
    const notes1 = [];
    const grid2 = [];

    //Named Constants
    const DRAG = 1;
    const CATCH = 2;
    const REMEMBER = 3;
    const INVERT = 2;
    const GRID = 3;
    const NOTES = 3;
    const FAIL = "fx_rip";
    const SUCCESS = "fx_ding";
    const TIMEOUT = "fx_whistle";

    //variables
    let time = 30; //progressively decreases as player progresses, giving less time to finish levels
    let score = 0; //levels completed
    let cLvl = 0; //current level
    let active = false; //flag for allowing input

    /*=========================Telemetry=========================*/
    /* The db variable below must be in scope for all game code.
    You can make it global, although that will make Crockford frown.
    Change its value to a string such as "mygame" to activate the database.
    The string should contain only letters, digits or underscores, no spaces.
     */

    let db = null;

    //if testing, set to game name
    if (test) {
        db = "PerlenWare"
    }

    //start game after user input
    let finalize = function() {
        G.start();
    };

    /*=========================LEVEL FLOW=========================*/
    /*edit to change level progression
    each entry contains:
    [int levelType, string displayText, boolean invertSpecial, array forDrag&Remember
    */
    const levels = [
        [1, "Drag!", false, grid1],
        [2, "Catch 1!", false],
        [3, "Remember!", false, notes1],
        [1, "Drag!", false, grid2],
        [2, "Don't Catch!", true],
    ];

    const exports = {

        init: function () {
            /*=========================Consts & Vars=========================*/
            const size = 3; //outer border width

            /*=========================Audio Loading=========================*/
            PS.audioLoad(FAIL);
            PS.audioLoad(SUCCESS);
            PS.audioLoad(TIMEOUT);

            /*=========================Initial Appearance=========================*/
            //size [MUST BE FIRST]
            PS.gridSize(16, 16);

            /*=============Hide Plane Below=============*/
            PS.gridPlane(1);

            //alpha
            PS.alpha(PS.ALL, PS.ALL, 255);

            PS.color(PS.ALL, PS.ALL, PS.COLOR_GRAY);

            //move back to correct plane
            PS.gridPlane(0);

            /*==========================================*/

            //grid color
            PS.gridColor(PS.COLOR_GRAY);

            //minimum bead size to 0
            PS.minimum(PS.ALL, 15, 0);

            //text
            PS.statusText("");

            //fade
            PS.borderFade(PS.ALL, PS.ALL, 60);
            PS.fade(PS.ALL, PS.ALL, 60);

            //borders
            //get rid of borders
            PS.border(PS.ALL, PS.ALL, 0);
            //create outer borders
            for (let y = 0; y < HEIGHT; y++) {
                for (let x = 0; x < WIDTH; x++) {
                    //check for corner cases
                    if ( (!x || x === 15) && (!y || y === 14)) {
                        //top left corner
                        if (!x && !y) {
                            PS.border(x, y, {
                                top: size,
                                left: size
                            });
                        }
                        //top right
                        if (x === 15 && !y) {
                            PS.border(x, y, {
                                top: size,
                                right: size
                            });
                        }
                        //bottom left
                        if (!x && y === 14) {
                            PS.border(x, y, {
                                bottom: size,
                                left: size
                            });
                        }
                        //bottom right
                        if (x === 15 && y === 14) {
                            PS.border(x, y, {
                                bottom: size,
                                right: size
                            });
                        }
                    }
                    //lines
                    else {
                        //top
                        if (!y) {
                            PS.border(x, y, { top : size});
                        }
                        //bottom
                        if (y === 14) {
                            PS.border(x, y, { bottom : size});
                        }
                        //left
                        if (!x) {
                            PS.border(x, y, { left : size});
                        }
                        //right
                        if (x === 15) {
                            PS.border(x, y, { right : size});
                        }
                    }
                }
            }

            //reset fading
            PS.fade(PS.ALL, PS.ALL, PS.DEFAULT);

            //telemetry initialization
            if ( db ) {
                db = PS.dbInit( db, { login : finalize } );
                if ( db === PS.ERROR ) {
                    db = null;
                }
            }
            else {
                finalize();
            }
        },

        /*=========================Hide Board=========================*/
        //make grid plane 1 opaque
        hide : function () {
            PS.gridPlane(1);
            PS.alpha(PS.ALL, PS.ALL, 255);
            PS.gridPlane(0);
        },

        /*=========================Show Board=========================*/
        //make grid plane 1 transparent
        show : function () {
            PS.gridPlane(1);
            PS.alpha(PS.ALL, PS.ALL, 0);
            PS.gridPlane(0);
        },

        /*=========================Start Screen=========================*/

        start: function () {
            //timer
            const timer = PS.timerStart(30, exec);
            let ticks = 0;

            function exec() {
                ticks++;
                // "Ready...Or...Not"
                if (ticks === 4) {
                    PS.statusText("Ready");
                }

                if (ticks === 6) {
                    PS.statusText("Or");
                }

                if (ticks === 8) {
                    PS.statusText("Not");
                }

                //reveal border
                if (ticks === 10) {
                    PS.statusText("");
                    PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_BLACK);
                    PS.borderColor(PS.ALL, 15, PS.COLOR_GRAY);
                }

                //start game
                if (ticks === 12) {
                    PS.timerStop(timer);
                    G.nextLvl();
                }
            }
        },

        /*=========================Load Next Level=========================*/

        nextLvl : function () {
            /*=========================Consts & Vars=========================*/
            //timer
            const timer = PS.timerStart(30, exec);
            let ticks = 0;

            const level = levels[cLvl]; //array for current level information

            /*=========================Telemetry=========================*/
            if ( db && PS.dbValid( db ) ) {
                PS.dbEvent( db, "score", cLvl );
            }
            if (cLvl > levels.length || cLvl === levels.length) {
                if ( db && PS.dbValid( db ) ) {
                    PS.dbEvent( db, "gameover", true );
                    PS.dbSend( db, "bmoriarty", { discard : true } );
                    db = null;
                }
                PS.statusText("Thanks for Playing!");
                return;
            }

            /*=========================Level Pre-Loading=========================*/
            //check level type and perform appropriate pre-loading
            //draw on the bottom plane
            PS.gridPlane(0);

            switch (level[0]) {

                case DRAG :
                    G.drag(level);
                    break;
                case CATCH :
                    G.pCatch(level);
                    break;
                case REMEMBER :
                    G.remember(level);
                    break;
            }

            /*=========================Level Playing Code=========================*/
            function exec() {
                ticks++;
                switch (ticks) {
                    //display level instructions
                    case 1 :
                        PS.statusText(level[1]);
                        break;

                    case 2 :
                        //reveal grid
                        G.show();
                        //allow input
                        active = true;
                        G.startTimer();
                        break;

                }
            }

            G.color(); //placeholder for coloring the board
            cLvl++; //make sure next level is loaded
        },

        /*=========================Pre-loading Functions=========================*/
        /*set up data associations draw path to trace
        LEAVE MOUSE CHECKING FOR PS.ENTER EVENT HANDLER
         */
        drag : function (level) {
            //set controls
            G.control(DRAG);

            //placeholder for inverting level
            if (level[INVERT]) {

            }
            else {
                for (let y = 0; y < HEIGHT; y++) {
                    for (let x = 0; x < WIDTH; x++) {
                        //defaults
                        PS.data(x, y, {
                            isPath : false,
                            isStart : false,
                            isFinish : false
                        });
                        PS.color(x, y, PS.COLOR_BLACK);
                        switch (level[GRID][y][x]) {
                            case 1 :
                                PS.data(x, y, { isPath : true});
                                PS.color(x, y, PS.COLOR_GRAY_LIGHT);
                                break;

                            case 2 :
                                PS.data(x, y, {
                                    isPath : true,
                                    isStart : true
                                });
                                PS.color(x, y, PS.COLOR_WHITE);
                                break;

                            case 3 :
                                PS.data(x, y, {
                                    isPath : true,
                                    isFinish : true});
                                PS.color(x, y, PS.COLOR_GRAY_DARK);
                                break;
                        }
                    }
                }
            }
        },

        pCatch : function(level) {

        },

        remember : function(level) {

        },

        /*=========================PLACEHOLDER: Colorize Level=========================*/

        color : function () {
        },

        /*=========================Timer Function=========================*/
        //ticks bottom timer bar to show how long player has left
        startTimer: function (time) {

            let width = 1;
            let x = 15;

            const timer = PS.timerStart(1, exec);

            function exec() {
                if (width >= 17) {
                    x--;
                    width = 1;
                }
                if (x < 0) {
                    PS.timerStop(timer);
                    G.timeOut();
                    return;
                }
                PS.debug("Border width: " + PS.border(x, 15, width) + "\n");
                PS.debug("Minimum bead size :" + PS.minimum(x, 15) + "\n");
                width++;
            }
        },

        /*=========================Set Controls=========================*/
        //changes controls based on level type passed in as parameter
        control : function(lvlType) {
            //first reset all controls
            if (lvlType === DRAG) {
                PS.touch = function(x, y, data) {
                    if(!data.isPath) {
                        PS.audioPlay(FAIL);
                    }
                };
                PS.enter = function(x, y, data) {
                    if(data.isPath) {

                    }
                    //PS.debug("Entered " + x + " " + y + "\n");
                };
            }
            if (lvlType === CATCH) {

            }
            if (lvlType === REMEMBER) {

            }
        },

        /*=========================Time Out=========================*/
        //dictates what happens when time runs out

        timeOut : function() {
            active = false;
            PS.audioPlay(TIMEOUT);
        },

        /*=========================Shutdown Protocol=========================*/
        //make sure to send telemetry before shutdown
        shutdown : function() {
                if ( db && PS.dbValid( db ) ) {
                    PS.dbEvent( db, "shutdown", true );
                    PS.dbSend( db, "bmoriarty", { discard : true } );
                }
        },

        /*=========================Touch Function=========================*/
        touch : function() {
            if (active) {

            }
            else {
                PS.debug("INACTIVE");
            }
        }
    };

    return exports;

} () );

/*=========================External Event Handlers=========================*/
PS.init = G.init;

PS.touch = G.touch;

PS.shutdown = G.shutdown;

	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.init() called\n" );

	// This function should normally begin with a call to PS.gridSize( x, y )
	// where x and y are the desired initial dimensions of the grid.
	// Call PS.gridSize() FIRST to avoid problems!
	// The sample call below sets the grid to the default dimensions (8 x 8).
	// Uncomment the following code line and change the x and y parameters as needed.

	// This is also a good place to display your game title or a welcome message
	// in the status line above the grid.
	// Uncomment the following code line and change the string parameter as needed.

	//PS.statusText( "Game" );

	// Add any other initialization code you need here.



/*
PS.touch ( x, y, data, options )
Called when the mouse button is clicked on a bead, or when a bead is touched.
It doesn't have to do anything.
[x] = zero-based x-position of the bead on the grid.
[y] = zero-based y-position of the bead on the grid.
[data] = the data value assigned to this bead by a call to PS.data(); default = 0.
[options] = an object with optional parameters; see API documentation for details.


// Uncomment the following BLOCK to expose PS.touch() event handler:

*/

PS.touch = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	//PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );
	PS.debug( "x = " + x + ", y =" + y + "\n" );

	// Add code here for mouse clicks/touches over a bead.
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

/*

PS.keyDown = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

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
