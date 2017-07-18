
//draw the progress arc and activate timer controls when the page loads
$(document).ready(function() {
  draw();
  timerControls();
  $("#time-remaining").html("25:00");
});

//function to draw the progress arr
function draw() {
  var canvas = document.getElementById("timer-outline");
  var ctx = canvas.getContext("2d");
  ctx.lineWidth  = 3;

  //draw a 300 degree arc
  ctx.beginPath();
  ctx.arc(152, 152, 150, (4 * Math.PI) / 3, (5 * Math.PI) / 3, true);
  ctx.strokeStyle = "#DD0048";
  ctx.stroke();
}

function timerControls() {
  var timer, startTime, endTime, timePaused;

  //define what happens when the user clicks the mode button
  $("#button_mode").click(function() {

    //if currently in Pomodoro mode
    if(mode === "pom") {

      //if the timer has progressed (but not finished), ask user for confirmation before switching
      if($("#time-remaining").html() !== "0:00" && $("#time-remaining").html() !== $("#length-pom").html() + ":00") {
        if(confirm("Warning: Clicking OK will remove all progress on your Pomodoro.")) {

          //if user confirms wish to switch, then pause timer and update the play-pause button
          clearInterval(timer);
          $("#play_pause").html("<i class = 'fa fa-play'></i>");
          running = false;

          //remove animation from the progress dot
          $("#dot-wrapper").css("-webkit-animation", "none");

          //switch modes
          mode = "break";

          //update displayed time remaining and update mode button display to reflect that you are timing a break
          $("#time-remaining").html($("#length-break").html() + ":00");
          $("#button_mode").html("BRK");
        }
      }

      //if automatically switching at end of timer or if timer hasn't started, no need to confirm
      else {
        $("#play_pause").html("<i class = 'fa fa-play'></i>");
          $("#dot-wrapper").css("-webkit-animation", "none");
          mode = "break";
          clearInterval(timer);
          running = false;
          $("#time-remaining").html($("#length-break").html() + ":00");
          $("#button_mode").html("BRK");
      }
    }

    //if currently in break mode
    else {

      //if the timer has progressed (but not finished), ask user for confirmation before switching
      if($("#time-remaining").html() !== "0:00" && $("#time-remaining").html() !== $("#length-break").html() + ":00") {
        if(confirm("Warning: Clicking OK will remove all progress on your break.")) {

          //if user confirms wish to switch, then pause the timer and update the play-pause button
          clearInterval(timer);
          $("#play_pause").html("<i class = 'fa fa-play'></i>");
          running = false;

          //remove animation from the progress dot
          $("#dot-wrapper").css("-webkit-animation", "none");

          //switch modes
          mode = "pom";

          //update displayed time remaining and update mode button display to reflect that you are timing a break
          $("#time-remaining").html($("#length-pom").html() + ":00");
          $("#button_mode").html("POM");
        }
      }

      //if automatically switching at end of timer or if timer hasn't started, no need to confirm
      else {
        $("#play_pause").html("<i class = 'fa fa-play'></i>");
          $("#dot-wrapper").css("-webkit-animation", "none");
          mode = "pom";
          clearInterval(timer);
          running = false;
          $("#time-remaining").html($("#length-pom").html() + ":00");
          $("#button_mode").html("POM");
      }
    }
  });

  //define what happens when the user clicks the reset button
  $("#reset").click(function() {

    //pause the timer and update the play-pause button
    clearInterval(timer);
    running = false;
    $("#play_pause").html("<i class = 'fa fa-play'></i>");
    $("#dot-wrapper").css("-webkit-animation", "none");

    //return displayed time remaining to full time based on which mode the user is in
    $("#time-remaining").html(mode === "pom" ? $("#length-pom").html() + ":00" : $("#length-break").html() + ":00");
  });

  //define what happens when user clicks play-pause button
  $("#play_pause").click(function() {

    //if the timer isn't running
    if(!running) {

      //indicate the timer is not running and update the button display
      running = true;
      $("#play_pause").html("<i class = 'fa fa-pause'></i>")

      //if in pomodoro mode
      if(mode === "pom") {

        //if the timer hasn't yet started
        if($("#time-remaining").html() === $("#length-pom").html() + ":00") {

          //create start and end times; end time needs to be (sec * 60) ms after start time
          startTime = new Date().getTime();
          endTime = startTime + (secPom * 1000);

          //animate the progress dot
          $("#dot-wrapper").css("-webkit-animation", "orbit " + secPom + "s linear");
        }

        //if timer already has started (ie user has paused the timer), then extend the end time to reflect how long the user paused
        else {
          var timeResumed = new Date().getTime();
          endTime += (timeResumed - timePaused);
        }

          //create a timer using setInterval; check time every 200 ms for improved accuracy
          timer = setInterval(function() {

            //create variable to store current time
            var now = new Date().getTime();

            //if endTime hasn't been reached
            if((endTime - now) >= 0) {

              //store time remaining into two variables
              var m = Math.floor((endTime - now) / 60000);
              var s = Math.floor(((endTime - now) / 1000) % 60);

              //if seconds less than 10, then put a zero in front of the number of seconds
              s = (s < 10 ? "0" : "") + s;

              //update displayed time remaining
              $("#time-remaining").html(m + ":" + s);
            }

            //if end time has been reached, then show all zeros on timer and switch modes
            else {
              $("#time-remaining").html("0:00");
              $("#button_mode").trigger("click");
            }
          }, 200);
      }

      //if in break mode
      else {
        //if timer hasn't started yet
        if($("#time-remaining").html() === $("#length-break").html() + ":00") {

          //create variables for starting time and ending time
          startTime = new Date().getTime();
          endTime = startTime + (secBreak * 1000);

          //animate the progress dot
          $("#dot-wrapper").css("-webkit-animation", "orbit " + secBreak + "s linear");
        }

        //if timer already has started (ie user has paused the timer), then extend the end time to reflect how long the user paused
        else {
          var timeResumed = new Date().getTime();
          endTime += (timeResumed - timePaused);
        }

        //create a timer using setInterval; check time every 200 ms for improved accuracy
        timer = setInterval(function() {

            //create variable to reflect current time
            var now = new Date().getTime();

            //if end time hasn't been reached
            if((endTime - now) >= 0) {

              //store time remaining into two variables
              var m = Math.floor((endTime - now) / 60000);
              var s = Math.floor(((endTime - now) / 1000) % 60);

              //if less than ten seconds, put a zero in front of number of seconds
              s = (s < 10 ? "0" : "") + s;

              //display updated time remaining
              $("#time-remaining").html(m + ":" + s);
            }

            //if end time has been reached, display all zeros on timer and switch modes
            else {
              $("#time-remaining").html("0:00");
              $("#button_mode").trigger("click");
            }
          }, 200);
      }

      //start animation
      $("#dot-wrapper").css("-webkit-animation-play-state", "running");
    }

    //if timer is currently running
    else {
      //update status to indicate that timer is not running anymore, and update the play-pause button
      running = false;
      $("#play_pause").html("<i class = 'fa fa-play'></i>");

      //pause timer and record the time the button was pressed
      clearInterval(timer);
      timePaused = new Date().getTime();

      //pause the animation of the progress dot
      $("#dot-wrapper").css("-webkit-animation-play-state", "paused");
    }
  });
}

var mode = "pom"; //mode defaults to pomodoro
var running = false; //state defaults to paused
var secPom = 1500; //default time: 25 min
var secBreak = 300; //default time: 5 min

//define what happens when user clicks button to increase Pomodoro length
$("#add-min-pom").click(function() {
  //variable for updated length
  var newTime = String(Number($("#length-pom").html()) + 1);

  //if the mode is pomodoro and the timer hasn't started, update it; otherwise do nothing with the timer
  if(mode === "pom" && $("#time-remaining").html() === $("#length-pom").html() + ":00") {
    $("#time-remaining").html(newTime + ":00");
  }

  //update the length of a pomodoro
  secPom += 60;

  //update the displayed length
  $("#length-pom").html(newTime);
});

//define what happens when user clicks button to decrease Pomodoro length
$("#sub-min-pom").click(function() {

  //only decrease length if it's currently longer than a minute
  if(secPom > 60) {
    //variable for new length
    var newTime = String(Number($("#length-pom").html()) - 1);

    //if mode is pomodoro and timer hasn't started, update it; otherwise, don't do anything to the timer
    if(mode === "pom" && $("#time-remaining").html() === $("#length-pom").html() + ":00") {
      $("#time-remaining").html(newTime + ":00");
    }

    //update the length of a pomodoro
    secPom -= 60;

    //update the displayed length
    $("#length-pom").html(newTime);
  }
});

//define what happens when user clicks button to increase break time
$("#add-min-break").click(function() {

  //variable for new break length
  var newTime = String(Number($("#length-break").html()) + 1);

  //if mode is break and timer hasn't started, update it; otherwise, do nothing with the timer
  if(mode === "break" && $("#time-remaining").html() === $("#length-break").html() + ":00") {
    $("#time-remaining").html(newTime + ":00");
  }

  //update break length
  secBreak += 60;

  //update displayed length
  $("#length-break").html(newTime);
});

//define what happens when user clicks button to decrease break length
$("#sub-min-break").click(function() {

  //only decrease length if it's currently longer than a minute
  if(secBreak > 60) {
    //variable for new length
    var newTime = String(Number($("#length-break").html()) - 1);

    //if mode is break and timer hasn't started, update it; otherwise, do nothing with the timer
    if(mode === "break" && $("#time-remaining").html() === $("#length-break").html() + ":00") {
      $("#time-remaining").html(newTime + ":00");
    }

    //update break length
    secBreak -= 60;

    //update displayed length
    $("#length-break").html(newTime);
  }
});
