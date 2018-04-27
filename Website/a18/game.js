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
const TEST = true;
//play music?
const MUSIC = false;

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
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
    ];
    const NOTES1 = [1, 2, 3, 4];
    const NOTES2 = [2, 4, 5, 6, 7];
    class Button {
        constructor(xArr, yArr) {
            this.xArr = xArr;
            this.yArr = yArr;
        }
    }
    const B1 = new Button([1, 2, 3, 4], [0, 1, 2, 3]);
    const B2 = new Button([6, 7, 8, 9], [0, 1, 2, 3]);
    const B3 = new Button([11, 12, 13, 14], [0, 1, 2, 3]);
    const B4 = new Button([1, 2, 3, 4], [5, 6, 7, 8]);
    const B5 = new Button([6, 7, 8, 9], [5, 6, 7, 8]);
    const B6 = new Button([11, 12, 13, 14], [5, 6, 7, 8]);
    const B7 = new Button([1, 2, 3, 4], [10, 11, 12, 13]);
    const B8 = new Button([6, 7, 8, 9], [0, 1, 2, 3]);
    const B9 = new Button([11, 12, 13, 14], [0, 1, 2, 3]);

    const BUTTONS = [
        B1, B2, B3, B4, B5, B6, B7, B8, B9
    ];

    const GRID2 = [
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 3 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
    ];

    const GRID3 = [
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
    ];

    //string arrays for audio loading
    //c major pentatonic scale
    const PIANO = [
        "piano_c4",
        "piano_d4",
        "piano_e4",
        "piano_g4",
        "piano_a5",
        "piano_c5",
        "piano_d5",
        "piano_e5",
        "piano_g5"
    ];

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

    //G.show()
    const ALL = 0;
    const BOARD = 1;
    const TIME = 2;

    //variables
    let time = 30; //progressively decreases as player progresses, giving less time to finish levels
    let score = 0;
    let lives = 3;
    let rand = false; //sets level assortment to random

    //set starting level
    //start at -1
    let cLvl = -1; //current level

    const bgColor = 0x7badfc;
    let Gtimer = 0; //code of current game timer

    /*=========================Game specific variables=========================*/
    //drag specific variables
    let drag = false; //is the player dragging the beads?

    //catch specific variables
    //array of sprites
    let player = {
        id : null,
        x : null,
        y : null
    };
    let falling = []; //array of falling sprites
    let timeout = false; //halt falling sprites
    let caught = 0; //remembers amount of caught beads

    //remember specific vars
    let cPos = 0; //current porition in note array

    /*=========================Telemetry=========================*/
    /* The db variable below must be in scope for all game code.
    You can make it global, although that will make Crockford frown.
    Change its value to a string such as "mygame" to activate the database.
    The string should contain only letters, digits or underscores, no spaces.
     */

    let db = null;

    //if testing, set to game name
    if (TEST) {
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
        [1, "Drag!", false, GRID2],
        [3, "Remember!", false, NOTES1],
        [2, "Catch 2!", false, 2],
        [1, "Drag!", false, GRID3],
        [3, "Remember!", false, NOTES2],
        [2, "Don't Catch!", true, 0],
    ];

    const EXPORTS = {

        init: function () {
            /*=========================Consts & Vars=========================*/
            const size = 3; //outer border width

            /*=========================Audio Loading=========================*/
            //load fx
            //sfx
            PS.audioLoad(FAIL);
            PS.audioLoad(SUCCESS);
            PS.audioLoad(TIMEOUT);
            //notes
            for (let s of PIANO) {
                PS.audioLoad(s);
            }
            //load music
            if (MUSIC) {
                PS.audioLoad("Pixelland", {
                    path : "resources/perlenware/"
                });
            }

            /*=========================Initial Appearance=========================*/
            //size [MUST BE FIRST]
            PS.gridSize(16, 16);

            /*=============Initialize hiding plane=============*/
            //use upper plane to hide layers below during level transitions
            PS.gridPlane(4);

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

            //borders
            PS.borderColor(PS.ALL, PS.ALL, bgColor);

            //fade
            PS.borderFade(PS.ALL, PS.ALL, 60);
            PS.fade(PS.ALL, PS.ALL, 60);

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
            PS.gridPlane(4);
            PS.alpha(PS.ALL, PS.ALL, 255);
            PS.gridPlane(0);
        },

        /*=========================Show Board=========================*/
        //make top grid plane transparent
        show : function (what) {
            switch (what) {
                case ALL :
                    PS.gridPlane(4);
                    PS.alpha(PS.ALL, PS.ALL, 0);
                    PS.gridPlane(0);
                    break;
                case BOARD :
                    PS.gridPlane(4);
                    PS.alpha(PS.ALL, PS.ALL, 0);
                    PS.alpha(PS.ALL, 15, 255);
                    PS.gridPlane(0);
                    break;
                case TIME :
                    PS.gridPlane(4);
                    PS.alpha(PS.ALL, 15, 0);
                    PS.gridPlane(0);
                    break;
            }
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
                    if (MUSIC) {
                        PS.audioPlay("Pixelland", {
                            loop : true
                        });
                    }
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

            /*============Telemetry============*/
            //level loading send current level at telemetry info
            //also ends game if cLvl is high enough
            if ( db && PS.dbValid( db ) ) {
                PS.dbEvent( db, "score", score );
            }
            //if level number is greater than amount of levels, end game and send telemetry
            if (cLvl > LEVELS.length || cLvl === LEVELS.length) {
                if ( db && PS.dbValid( db ) ) {
                    PS.dbEvent( db, "gameover", true );
                    PS.dbSend( db, "bmoriarty", { discard : true } );
                    db = null;
                }
                PS.timerStop(timer);
                PS.statusText("Thanks for Playing! Score: " + score);
                return;
            }

            /*============Level Pre-Loading============*/
            //check level type and perform appropriate pre-loading

            const level = LEVELS[cLvl]; //array for current level information

            //draw on the bottom plane
            //reset everything on plane 2
            G.wipe();

            //reset global vars
            G.reset();

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
                //separate control flow for remember game
                if(level[0] === REMEMBER) {
                    switch (ticks) {
                        case 1 :
                            PS.statusText(level[1]);
                            G.show(BOARD);
                            break;

                        case 2 :
                            G.playArray(level[3]);
                            PS.timerStop(timer);
                            break;
                    }
                    return;
                }
                switch (ticks) {
                    //display level instructions
                    case 1 :
                        PS.statusText(level[1]);
                        break;

                    case 3 :

                        PS.timerStop(timer);
                        //reveal grid
                        G.show(ALL);

                        //allow input
                        //set controls based on level type
                        G.control(level[0]);

                        //G.fall();
                        G.startTimer();

                        break;

                    case 4 :

                        break;
                }
            }
        },

        /*=========================Reset Function=========================*/

        reset : function() {
            //delete any sprites
            for (let s of falling) {
                PS.spriteDelete(s.id);
            }
            falling = [];
            //delete player sprite
            if (player.id) {
                PS.spriteDelete(player.id);
                player.id = 0;
            }

            //reset timeout
            timeout = false;

            //reset cPos
            cPos = 0;

            //reset caught
            caught = 0;

            //not dragging
            drag = 0;
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
                        PS.color(x, y, 0x4d78bc);
                        switch (level[GRID][y][x]) {
                            case 1 :
                                //path beads
                                PS.data(x, y, { isPath : true});
                                PS.color(x, y, 0xF97442);
                                break;

                            case 2 :
                                //starting bead
                                PS.data(x, y, {
                                    isPath : true,
                                    isStart : true
                                });
                                PS.color(x, y, 0xF99C79);
                                break;

                            case 3 :
                                //end bead
                                PS.data(x, y, {
                                    isPath : true,
                                    isFinish : true
                                });
                                PS.color(x, y, 0x9A4D26);
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

            PS.color(PS.ALL, PS.ALL, 0x3E9244);
            PS.color(PS.ALL, 15, PS.COLOR_WHITE);
            //create sprite for player
            player.id = PS.spriteSolid(2, 1);
            PS.spriteSolidColor(player.id, 0x651864);
            PS.spritePlane(player.id, 3);

            //set axis to center
            PS.spriteAxis(player.id, 1);

            //initial position
            player.x = 8;
            player.y = 14;
            PS.spriteMove(player.id, player.x, player.y);

        },

        remember : function(level) {
            let but = 0;
            //load grid
            //create button data accociations
            for (let y = 0; y < 14; y++) {
                for (let x = 0; x < 15; x++) {
                    //top left
                    if (x > 0 && x < 5 && y < 4) {
                        PS.data(x, y, {
                            button : 1,
                            note : PIANO[0]
                        });
                    }
                    //top middle
                    else if (x > 5 && x < 10 && y < 4) {
                        PS.data(x, y, {
                            button : 2,
                            note : PIANO[1]
                        });
                    }
                    //top right
                    else if (x > 10 && x < 15 && y < 4) {
                        PS.data(x, y, {
                            button: 3,
                            note : PIANO[2]
                        });
                    }
                    //center left
                    else if (x > 0 && x < 5 && y > 4 && y < 9) {
                        PS.data(x, y, {
                            button: 4,
                            note : PIANO[3]
                        });
                    }
                    //center
                    else if (x > 5 && x < 10 && y > 4 && y < 9) {
                        PS.data(x, y, {
                            button: 5,
                            note : PIANO[4]
                        });
                    }
                    //center right
                    else if (x > 10 && x < 15 && y > 4 && y < 9) {
                        PS.data(x, y, {
                            button: 6,
                            note : PIANO[5]
                        });
                    }
                    //bottom left
                    else if (x > 0 && x < 5 && y > 9 && y < 14) {
                        PS.data(x, y, {
                            button: 7,
                            note : PIANO[6]
                        });
                    }
                    //bottom middle
                    else if (x > 5 && x < 10 && y > 9 && y < 14) {
                        PS.data(x, y, {
                            button: 8,
                            note : PIANO[7]
                        });
                    }
                    //bottom right
                    else if (x > 10 && x < 15 && y > 9 && y < 14) {
                        PS.data(x, y, {
                            button: 9,
                            note : PIANO[8]
                        });
                    }
                    else {
                        PS.data(x, y, {
                            button : 0,
                        })
                    }
                }
            }
            //iterate over data associations
            for (let y = 0; y < 15; y++) {
                for (let x = 0; x < 16; x++) {
                    but = PS.data(x, y).button;
                    if (but) {
                        PS.color(x, y, 0xD2942A);

                    } else {
                        PS.color(x, y, 0x3B0A4E);
                    }
                }
            }
        },

        /*=========================Colorize Level=========================*/

        color : function () {

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
                    G.timeOut();
                    if (!LEVELS[cLvl][2]) {
                        PS.timerStop(Gtimer);
                    }
                    return;
                }
                PS.border(x, 15, width);
                //PS.debug("Border width: " + PS.border(x, 15) + "\n");
                //PS.debug("Minimum bead size :" +  + "\n");
                width++;
            }
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
                                PS.alpha(x, y, 75);
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
                    /*
                    PS.exit = function(x, y, data) {
                        if (drag && data.isPath) {
                            PS.gridPlane(2);
                            PS.alpha(x, y, 0);
                            PS.gridPlane(0);
                        }
                    };
                    */
                    PS.release = function() {
                        if (drag) {
                            drag = false;
                        }
                        //clear grid of traversed beads
                        G.wipe();
                    };
                    break;

                case CATCH :
                    //fall timer & drop time separate
                    const fallTime = time / 3;
                    const dropTime = time;

                    //make sprite follow mouse
                    PS.enter = function(x) {
                        //make sure player doesn't clip past left side
                        if (x) {
                            player.x = x;

                            PS.spriteMove(player.id, player.x);
                        }
                    };

                    //begin dropping beads
                    G.drop(dropTime);
                    G.fall(fallTime);
                    break;

                case REMEMBER :
                    let array = LEVELS[cLvl][3];
                    //attempt note clicked
                    PS.touch = function(x, y, data) {
                        if (data.button === array[cPos]) {
                            G.play(array[cPos]);
                            cPos++;
                        } else if (data.button) {
                            PS.audioPlay(FAIL);
                        }
                        if (cPos === array.length) {
                            G.deactivate();
                            PS.timerStop(Gtimer);
                            Gtimer = 0;
                            const timer = PS.timerStart(30, exec);
                            function exec() {
                                PS.timerStop(timer);
                                G.success();
                            }

                        }
                    };
                    break;
            }
        },

        /*=========================Play Note=========================*/

        playArray : function(array) {
            const pTime = time / 2;
            const timer = PS.timerStart(pTime, exec);
            let ticks = 0;
            let pos =0;

            function exec() {
                ticks++;
                if (pos === array.length) {
                    PS.timerStop(timer);
                    G.wipe();
                    G.show(TIME);
                    G.control(REMEMBER);
                    G.startTimer();
                    return;
                }
                G.play(array[pos]);
                pos++;
            }

        },

        /*=========================Play Note=========================*/
        //play a sound and color a button given a button to play
        play : function(note) {

            G.colorButton(note);
            PS.audioPlay(PIANO[note - 1]);

        },

        /*=========================Button Play=========================*/
        //color effect a given note
        colorButton : function(note) {
            const button = BUTTONS[note - 1];
            //use grid plane 2 for easier reset
            PS.gridPlane(2);
            for (let y of button.yArr) {
                for (let x of button.xArr) {
                    PS.alpha(x, y, 125);
                }
            }
            PS.gridPlane(0);
        },

        /*=========================Drop Beads=========================*/
        //generates and drops sprites from the top of the screen
        drop : function(dTime) {
            //start timer
            const timer = PS.timerStart(dTime, exec);
            let ticks = 0;

            function exec() {
                ticks++;
                if (!LEVELS[cLvl][2]) {
                    if (caught === LEVELS[cLvl][3] || timeout) {
                        PS.timerStop(timer);
                        return;
                    }
                } else if (timeout) {
                    PS.timerStop(timer);
                    return;
                }
                //generate sprite in top row of the grid
                //store new sprite as obj in array of falling sprites
                let newSprite = {
                    id : PS.spriteSolid(1, 1),
                    x : (PS.random(16) - 1),
                    y : 0,
                    fall : false,
                };
                PS.spriteSolidColor(newSprite.id, 0x295F67);
                PS.spritePlane(newSprite.id, 1);
                PS.spriteMove(newSprite.id, newSprite.x, newSprite.y);

                falling.push(newSprite);
            }
        },

        /*=========================Fall=========================*/
        //controls falling beads in catch game
        fall : function(fTime) {
            //custom fall speed based on global game time

            const timer = PS.timerStart(fTime, exec);
            let ticks = 0;

            function exec() {
                ticks++;

                //check if timer is out before falling
                if (timeout) {
                    PS.timerStop(timer);
                    return;
                }
                //check if there are any falling sprites
                if (falling.length) {
                    for (let i = 0; i < falling.length; i++) {
                        if (!falling[i].fall) {
                            falling[i].fall = true;
                            return;
                        }
                        else if (falling[i].y === 13 && (falling[i].x === player.x || falling[i].x === player.x - 1)) {
                            PS.spriteDelete(falling[i].id);
                            //and remove it from the array of falling sprites
                            falling.splice(i, 1);
                            --i;
                            caught++;
                            //check if enough caught
                            if (caught >= LEVELS[cLvl][3]) {
                                PS.timerStop(timer);
                                if (LEVELS[cLvl][2]) {
                                    G.fail();
                                } else {
                                    G.success();
                                }
                            }
                        }
                        //if a sprite is below the bottom row of the grid,
                        else if (falling[i].y >= 14) {
                            //delete it
                            PS.spriteDelete(falling[i].id);
                            //and remove it from the array of falling sprites
                            falling.splice(i, 1);
                            --i;
                        } else {
                            //otherwise move the sprite one bead down
                            PS.spriteMove(falling[i].id, falling[i].x, ++falling[i].y);
                        }
                    }
                }
            }
        },

        /*=========================Wipe Grid=========================*/
        //wipes drag || remember game beads
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

            time--;

            //stop game timer
            if (Gtimer) {
                PS.timerStop(Gtimer);
            }

            //play success noise
            PS.audioPlay(SUCCESS);

            //deactivate controls
            G.deactivate();

            //tick score
            score++;

            function exec() {
                ticks++;
                switch (ticks) {
                    case 1:
                        PS.statusText("");
                    case 2 :
                        //stop timer
                        PS.timerStop(timer);

                        //next level
                        G.nextLvl();

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
                        PS.statusText("Score: " + score);
                        break;

                    case 6 :
                        PS.statusText(PS.DEFAULT);
                        break;

                    case 7 :
                        //stop timer
                        PS.timerStop(timer);

                        PS.statusText("Try Again?");

                        PS.touch = function(x, y, data, options) {
                            //immediately remove functionality from touch
                            G.deactivate();
                            //set timeout flag
                            timeout = false;

                            //reset time
                            time = 30;

                            //reset score
                            score = 0;

                            //reset lives
                            lives = 3;

                            //random level arrangement
                            rand = true;

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
        //fail the falling catch game

        fail : function() {
            timeout = true;
            G.deactivate();
            lives--;
            PS.audioPlay(FAIL);
            PS.timerStop(Gtimer);

            if (lives) {
                const timer = PS.timerStart(30, exec);
                let ticks = 0;

                function exec() {
                    ticks++;
                    switch(ticks) {
                        case 1 :
                            PS.statusText("");
                            break;

                        case 2 :
                            PS.statusText("Lives: " + lives);
                            break;

                        case 4 :
                            PS.statusText("");

                        case 5 :
                            PS.timerStop(timer);
                            cLvl--;
                            G.nextLvl();
                            break;
                    }
                }
            } else {
                G.end();
            }
        },

        /*=========================Time Out=========================*/
        //dictates what happens when time runs out

        timeOut : function() {
            timeout = true;
            G.deactivate();

            //only called if no beads are caught
            if (LEVELS[cLvl][2]) {
                G.success();
                return;
            }
            lives--;
            PS.audioPlay(TIMEOUT);
            if (lives) {
                const timer = PS.timerStart(30, exec);
                let ticks = 0;

                function exec() {
                    ticks++;
                    switch(ticks) {
                        case 1 :
                            PS.statusText("");
                            break;

                        case 2 :
                            PS.statusText("Lives: " + lives);
                            break;

                        case 4 :
                            PS.statusText("");

                        case 5 :
                            PS.timerStop(timer);
                            cLvl--;
                            G.nextLvl();
                            break;
                    }
                }
            } else {
                G.end();
            }
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
