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
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
    ];
    const NOTES1 = [];
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
    const ALL = 0;
    const BOARD = 1;
    const TIME = 2;

    //variables
    let time = 30; //progressively decreases as player progresses, giving less time to finish levels
    let score = 0;

    //set starting level
    let cLvl = -1; //current level

    let bgColor = PS.COLOR_GRAY;
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
    let collision = false; //collision flag for player and falling bead
    let caught = 0; //remembers amount of caught beads

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
        [1, "Drag!", false, GRID2],
        [3, "Remember!", false, NOTES1],
        [2, "Don't Catch!", true, 0]
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
        show : function (what) {
            switch (what) {
                case ALL :
                    PS.gridPlane(3);
                    PS.alpha(PS.ALL, PS.ALL, 0);
                    PS.gridPlane(0);
                    break;
                case BOARD :
                    PS.gridPlane(3);
                    PS.alpha(PS.ALL, PS.ALL, 0);
                    PS.alpha(PS.ALL, 15, 255);
                    PS.gridPlane(0);
                    break;
                case TIME :
                    PS.gridPlane(3);
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
                PS.statusText("Thanks for Playing!");
                return;
            }

            /*============Level Pre-Loading============*/
            //check level type and perform appropriate pre-loading

            const level = LEVELS[cLvl]; //array for current level information

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

                    case 3 :
                        if(level[0] === REMEMBER) {
                            G.show(BOARD);
                            return;
                        }
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
                                    isFinish : true
                                });
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
            player = PS.spriteSolid(2, 1);

            //set axis to center
            PS.spriteAxis(player, 1);

            //initial position
            PS.spriteMove(player, 8, 14);

            //collision behavior for player
            PS.spriteCollide(player, collide);

            function collide(s1, p1, s2, p2, type) {
                if (type === PS.SPRITE_OVERLAP) {
                    collision = true;
                }
            }
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
                            button : 1
                        });
                    }
                    //top middle
                    else if (x > 5 && x < 10 && y < 4) {
                        PS.data(x, y, {
                            button : 2
                        });
                    }
                    //top right
                    else if (x > 10 && x < 15 && y < 4) {
                        PS.data(x, y, {
                            button: 3
                        });
                    }
                    //center left
                    else if (x > 0 && x < 5 && y > 4 && y < 9) {
                        PS.data(x, y, {
                            button: 4
                        });
                    }
                    //center
                    else if (x > 5 && x < 10 && y > 4 && y < 9) {
                        PS.data(x, y, {
                            button: 5
                        });
                    }
                    //center right
                    else if (x > 10 && x < 15 && y > 4 && y < 9) {
                        PS.data(x, y, {
                            button: 6
                        });
                    }
                    //bottom left
                    else if (x > 0 && x < 5 && y > 9 && y < 14) {
                        PS.data(x, y, {
                            button: 7
                        });
                    }
                    //bottom middle
                    else if (x > 5 && x < 10 && y > 9 && y < 14) {
                        PS.data(x, y, {
                            button: 8
                        });
                    }
                    //bottom right
                    else if (x > 10 && x < 15 && y > 9 && y < 14) {
                        PS.data(x, y, {
                            button: 9
                        });
                    }
                    else {
                        PS.data(x, y, {
                            button : 0
                        })
                    }
                }
            }
            //iterate over data associations
            for (let y = 0; y < 14; y++) {
                for (let x = 0; x < 15; x++) {
                    but = PS.data(x, y).button;
                    if (but) {
                        PS.color(x, y, PS.COLOR_BLACK);
                        switch (PS.data) {

                        }
                    }
                }
            }
        },

        /*=========================Colorize Level=========================*/

        color : function () {
            //delete any sprites
            for (let s of falling) {
                PS.spriteDelete(s.id);
            }
            falling = [];
            //delete player sprite
            if (player) {
                PS.spriteDelete(player);
                player = 0;
            }
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
                    PS.enter = function(x) {
                        //make sure player doesn't clip past left side
                        if (x) {
                            player.x = x;

                            PS.spriteMove(player.id, player.x);
                        }
                    };

                    //begin dropping beads
                    G.drop();
                    G.fall();
                    break;

                case REMEMBER :

                    break;
            }
        },

        /*=========================Drop Beads=========================*/
        //generates and drops sprites from the top of the screen
        drop : function() {
            //start timer
            const timer = PS.timerStart(30, exec);
            let ticks = 0;

            function exec() {
                if (caught === LEVELS[cLvl][3]) {
                    PS.timerStop(timer);
                    return;
                }
                if (timeout) {
                    PS.timerStop(timer);
                    return;
                }
                ticks++;
                //generate sprite in top row of the grid
                let newFall = PS.spriteSolid(1, 1);
                PS.spritePlane(newFall);
                let xPos = (PS.random(16) - 1);
                PS.spriteMove(newFall, xPos, 0);

                //store new sprite as obj in array of falling sprites
                let newSprite = {
                    id : newFall,
                    x : xPos,
                    y : 0,
                    fall : false,
                    collide : false
                };
                falling.push(newSprite);
            }
        },

        /*=========================Fall=========================*/
        //controls falling beads in catch game
        fall : function() {
            //custom fall speed based on global game time
            const fallTime = time / 3;

            const Ftimer = PS.timerStart(fallTime, exec);
            let ticks = 0;

            function exec() {
                //check if enough caught
                if (caught === LEVELS[cLvl][3]) {
                    PS.timerStop(Ftimer);
                    G.success();
                }
                //check if timer is out before falling
                if (timeout) {
                    PS.timerStop(Ftimer);
                    return;
                }
                ticks++;
                //check if there are any falling sprites
                if (falling.length) {
                    for (let i = 0; i < falling.length; i++) {
                        if (!falling[i].fall) {
                            falling[i].fall = true;
                            return;
                        }
                        if (collision) {
                            //caught 1
                            caught++;
                            //delete it
                            PS.spriteDelete(falling[0].id);
                            //and remove it from the array of falling sprites
                            falling.splice(0, 1);
                            collision = false;
                            --i;
                        }
                        //if a sprite is below the bottom row of the grid,
                        if (falling[i].y >= 14) {

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
        //wipes traversed grids during the drag game
        wipe : function() {
            PS.gridPlane(2);
            PS.alpha(PS.ALL, PS.ALL, 0);
            PS.gridPlane(0);

            //reset timeout
            timeout = false;

            //reset caught
            caught = 0;
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

            //tick score
            score++;

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
                        PS.statusText("Score: " + score);
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

                            //reset score
                            score = 0;

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
