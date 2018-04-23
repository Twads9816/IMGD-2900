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
    const GRID1 = [
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
    const NOTES1 = [];
    const GRID2 = [];

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

    //set starting level
    let cLvl = 0; //current level

    let bgColor = PS.COLOR_GRAY;
    let Gtimer = 0; //code of current game timer

    /*=========================Game specific variables=========================*/
    //drag specific variables
    let drag = false; //is the player dragging the beads?

    //catch specific
    let sprites = []; //array of sprites
    let falling = []; //array of falling sprites
    let timeout = false; //halt falling sprites

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
    [int levelType, string displayText, boolean invertSpecial, levelInfo]
    */
    const LEVELS = [
        [1, "Drag!", false, GRID1],
        [2, "Catch 1!", false, 1],
        [3, "Remember!", false, NOTES1],
        [1, "Drag!", false, GRID2],
        [2, "Don't Catch!", true, 0],
    ];

    const EXPORTS = {

        init: function () {
            /*=========================Consts & Vars=========================*/
            const size = 3; //outer border width

            /*=========================Audio Loading=========================*/
            //load fx
            PS.audioLoad(FAIL);
            PS.audioLoad(SUCCESS);
            PS.audioLoad(TIMEOUT);

            //load music


            /*=========================Initial Appearance=========================*/
            //size [MUST BE FIRST]
            PS.gridSize(16, 16);

            /*=============Initialize hiding plane=============*/
            //use upper plane to hide layers below during level transitions
            PS.gridPlane(3);

            //alpha
            PS.alpha(PS.ALL, PS.ALL, 255);
            PS.color(PS.ALL, PS.ALL, bgColor);

            //move back to correct plane
            PS.gridPlane(0);

            /*==========================================*/

            //grid color
            PS.gridColor(bgColor);

            //set background of beads to grid color
            PS.bgColor(PS.ALL, PS.ALL, bgColor);

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
            PS.gridPlane(3);
            PS.alpha(PS.ALL, PS.ALL, 255);
            PS.gridPlane(0);
        },

        /*=========================Show Board=========================*/
        //make top grid plane transparent
        show : function () {
            PS.gridPlane(3);
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
                    PS.borderColor(PS.ALL, 15, bgColor);
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
            /*============Consts & Vars============*/
            //timer
            const timer = PS.timerStart(30, exec);
            let ticks = 0;

            cLvl++; //make sure next level is loaded

            const level = LEVELS[cLvl]; //array for current level information

            /*============Telemetry============*/
            //level loading send current level at telemetry info
            if ( db && PS.dbValid( db ) ) {
                PS.dbEvent( db, "score", cLvl );
            }
            //if level number is greater than amount of levels, end game and send telemetry
            if (cLvl > LEVELS.length || cLvl === LEVELS.length) {
                if ( db && PS.dbValid( db ) ) {
                    PS.dbEvent( db, "gameover", true );
                    PS.dbSend( db, "bmoriarty", { discard : true } );
                    db = null;
                }
                PS.statusText("Thanks for Playing!");
                return;
            }

            /*============Level Pre-Loading============*/
            //check level type and perform appropriate pre-loading
            //draw on the bottom plane
            //reset everything on plane 2
            G.wipe();

            //hide grid before pre-loading
            G.hide();

            //for coloring the board
            G.color();

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

            /*============Level Playing Code============*/
            function exec() {
                ticks++;
                switch (ticks) {
                    //display level instructions
                    case 1 :
                        PS.statusText(level[1]);
                        break;

                    case 2 :
                        PS.timerStop(timer);
                        //reveal grid
                        G.show();
                        //allow input
                        //set controls based on level type
                        G.control(level[0]);
                        G.startTimer();
                        break;

                }
            }
        },

        /*=========================Pre-loading Functions=========================*/
        /*set up data associations draw path to trace
        LEAVE MOUSE CHECKING FOR PS.ENTER EVENT HANDLER
         */
        drag : function (level) {

            //placeholder for inverting level
            if (level[INVERT]) {

            }
            //associate beads with game relevant data
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
                                //path beads
                                PS.data(x, y, { isPath : true});
                                PS.color(x, y, PS.COLOR_GRAY_LIGHT);
                                break;

                            case 2 :
                                //starting bead
                                PS.data(x, y, {
                                    isPath : true,
                                    isStart : true
                                });
                                PS.color(x, y, PS.COLOR_WHITE);
                                break;

                            case 3 :
                                //end bead
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

            //placeholder
            if (level[INVERT]) {

            }

            //create sprite for player
            sprites.push(PS.spriteSolid(2, 1));

            //set axis to center
            PS.spriteAxis(sprites[0], 1);

            //initial position
            PS.spriteMove(sprites[0], 8, 14);

            //collision behavior for player
            PS.spriteCollide(sprites[0], collide);

            function collide(s1, p1, s2, p2, type) {

            }


        },

        remember : function(level) {

        },

        /*=========================Colorize Level=========================*/

        color : function () {
            //delete any sprites
                for (let s of sprites) {
                    PS.spriteDelete(s);
                }
                sprites = [];
            //clear background color MUST COME FIRST
            PS.color(PS.ALL, PS.ALL, bgColor);
            PS.alpha(PS.ALL, PS.ALL, PS.ALPHA_OPAQUE);

            //reset timer bar
            PS.border(PS.ALL, 15, 0);
            PS.color(PS.ALL, 15, PS.COLOR_WHITE);


        },

        /*=========================Timer Function=========================*/
        //ticks bottom timer bar to show how long player has left
        startTimer: function (time) {

            let width = 1;
            let x = 15;

            //start global timer
            Gtimer = PS.timerStart(1, exec);

            function exec() {
                if (width >= 17) {
                    x--;
                    width = 1;
                }
                if (x < 0) {
                    PS.timerStop(Gtimer);
                    G.timeOut();
                    return;
                }
                PS.border(x, 15, width);
                //PS.debug("Border width: " + PS.border(x, 15) + "\n");
                //PS.debug("Minimum bead size :" +  + "\n");
                width++;
            }
        },

        /*=========================Restore Timer=========================*/
        //fills white timer bar
        restoreTimer: function () {
            PS.border(PS.ALL, 15, 0);
        },

        /*=========================Set Controls=========================*/
        //changes controls based on level type passed in as parameter
        control : function(lvlType) {
            //ASSUME: deactivation beforehand
            switch (lvlType) {
                case DRAG :
                    PS.touch = function(x, y, data) {
                        if (y > 14) {
                            return;
                        }
                        if(!data.isStart) {
                            PS.audioPlay(FAIL);
                        }
                        else if(data.isStart) {
                            drag = true;
                        }
                        //PS.debug("Touched: " + x + " " + y + "\n");
                    };
                    PS.enter = function(x, y, data) {
                        if (drag) {
                            //enter a path bead while dragging changes color as feedback
                            if(data.isPath) {
                                PS.gridPlane(2);
                                PS.alpha(x, y, 255);
                                PS.gridPlane(0);
                                //reach end
                                if(data.isFinish) {
                                    drag = false;
                                    G.success();
                                }
                            }
                            //entering non-path bead while dragging resets color as feedback
                            else {
                                PS.audioPlay(FAIL);
                                drag = false;
                                G.wipe();

                            }
                        }
                        //PS.debug("Entered: " + x + " " + y + "\n");
                    };
                    PS.release = function() {
                        if (drag) {
                            drag = false;
                        }
                        //clear grid of traversed beads
                        G.wipe();
                    };
                    break;

                case CATCH :
                    //make sprite follow mouse
                    PS.enter = function(x, y) {
                        //make sure player doesn't clip past left side
                        if (x) {
                            PS.spriteMove(sprites[0], x);
                        }
                    };
                    //begin dropping beads
                    G.drop();

                    break;
                case REMEMBER :

                    break;
            }
        },

        /*=========================Drop Beads=========================*/
        //
        drop : function() {
            //start timer
            const timer = PS.timerStart(30, exec);
            let ticks = 0;

            function exec() {
                ticks++;
                PS.random(16) - 1
            }
        },

        /*=========================Wipe Grid=========================*/
        //wipes traversed grids during the drag game
        wipe : function() {
            PS.gridPlane(2);
            PS.alpha(PS.ALL, PS.ALL, 0);
            PS.gridPlane(0);
        },

        /*=========================Success=========================*/
        //deactivate controls and stop game timer
        success : function() {
            //set timer
            const timer = PS.timerStart(30, exec);
            let ticks = 0;

            //play success noise
            PS.audioPlay(SUCCESS);

            //deactivate controls
            G.deactivate();

            //stop game timer
            PS.timerStop(Gtimer);

            function exec() {
                ticks++;
                switch (ticks) {
                    case 1:
                        PS.statusText("");
                    case 2 :
                        //next level
                        G.nextLvl();

                        //stop timer
                        PS.timerStop(timer);
                        break;
                }
            }
        },

        /*=========================End Game=========================*/
        //ends game completely
        end : function() {
            //start timer
            const timer = PS.timerStart(30, exec);
            let ticks = 0;

            function exec() {
                ticks++;
                switch (ticks) {
                    case 2 :
                        PS.statusText(PS.DEFAULT);
                        break;

                    case 3 :
                        PS.statusText("Score: " + cLvl);
                        break;

                    case 6 :
                        PS.statusText(PS.DEFAULT);
                        break;

                    case 7 :
                        //stop timer
                        PS.timerStop(timer);

                        PS.statusText("Again?");

                        PS.touch = function(x, y, data, options) {
                            //immediately remove functionality from touch
                            G.deactivate();
                            //set timeout flag
                            timeout = false;

                            //remove text
                            PS.statusText("");

                            //restart game
                            cLvl = -1;
                            G.nextLvl();
                        };
                        break;
                }
            }
        },

        /*=========================Time Out=========================*/
        //dictates what happens when time runs out

        timeOut : function() {
            timeout = true;
            G.deactivate();
            PS.audioPlay(TIMEOUT);
            G.end();
        },

        /*=========================Deactivate Controls=========================*/
        //remove functionality form controls
        deactivate : function() {
            PS.touch = function() {};
            PS.enter = function() {};
            PS.release = function() {};
            PS.exit = function() {};
        },

        /*=========================Shutdown Protocol=========================*/
        //make sure to send telemetry before shutdown
        shutdown : function() {
                if ( db && PS.dbValid( db ) ) {
                    PS.dbEvent( db, "shutdown", true );
                    PS.dbSend( db, "bmoriarty", { discard : true } );
                }
        },
    };

    return EXPORTS;

} () );

/*=========================External Event Handlers=========================*/
PS.init = G.init;

PS.touch = G.touch;

PS.shutdown = G.shutdown;

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
