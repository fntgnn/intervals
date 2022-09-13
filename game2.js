
$(document).ready(function() {
    if (navigator && navigator.serviceWorker) {
        navigator.serviceWorker.register('sw.js');
    }
    $.ajax({
        type: "GET",
        url: "intervals.csv",
        dataType: "text",
        success: function(data) {processData(data);}
     });
});

tunes = [];
var mainKey = {};
var intervalsNatTxt = '1 2 3 4 5 6 7';
var intervalsAltTxt = '1 2b 2 2# 3b 3 3# 4b 4 4# 5b 5 5# 6b 6 6# 7b 7 7# 9b 9 9# 11b 11 11# 13b 13 13#';
var intervals = [];
var interval;
intervals['nat'] = intervalsNatTxt.split(" ");
intervals['alt'] = intervalsAltTxt.split(" ");
var diff = 'nat';
var finish = false;
var posInterval = 0;
var total = 0;
var right = 0;
var wrong = 0;
var howMany = 0;
var guessNote;

var startTime = 0;
var endTime = 0;

function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            var tune = {};
            tune.key = data[0];
            tune['1'] = data[0];
            for (var j=1; j<headers.length; j++) {
                tune[headers[j]] = data[j];
            }
            tunes.push(tune);
        }
    }
}

function start(){
    $('#interval').css('visibility','hidden');
    $('#game').css('visibility','hidden');
    play();
}


function chooseLength(){
    if($('#howMany5').prop('checked') == true)
        howMany = 5;
    else if($('#howMany10').prop('checked') == true)
        howMany = 10;
    else if($('#howMany20').prop('checked') == true)
        howMany = 20;
    else if($('#howManyInf').prop('checked') == true)
        howMany = -1;
     

}

function chooseDiff(difficulty){
    diff = difficulty;
    console.log(diff);
    console.log(intervals);
    chooseLength();
    start();
}

function play(){
    $('.setup').remove();
    $('#game').css('visibility','visible');
    $('#setKey').css('visibility','hidden');
    $('#interval').css('visibility','visible');
    $('#interval').text(intervals[diff][posInterval]);
    $('#currentAnswer').css('visibility','visible');
    $('#key').text(mainKey.key);
    selectNote();
    startTime = new Date().getTime();
}
function selectNote(getIt){
    if(getIt != false){
        var note_index = Math.floor(Math.random()*tunes.length);
        var key = tunes[note_index];
        console.log(key);
        var interval_index = Math.floor(Math.random()*intervals[diff].length);
        var interval_index_def = intervals[diff][interval_index];
        console.log("Interval position: "+interval_index_def);
        console.log(key[interval_index_def]);
        $('#note').text(key[interval_index_def]);
        $('#interval').text(interval_index_def);
        guessNote = key['key'];
        console.log("devi indovinare " + guessNote);
    }
    /*if(getIt != false){
        newInterval = Math.floor(Math.random()*intervals[diff].length);
        while(newInterval == interval)
            newInterval = Math.floor(Math.random()*intervals[diff].length);
        interval = newInterval;
        $('#interval').text(intervals[diff][interval]);
    }*/
}

function getNote(note){
    total++;
    var getIt = false;
    if(guessNote == note){
        right++;
        $('.right').text(right);
        $('#thright').css("background-color", "#00FF00")
        setTimeout(
            function() {
        $('#thright').css("background-color", "#FFFFFF")
               //do something special
        }, 200);
        getIt = true;
    }
    else{
        wrong++;
        $('.wrong').text(wrong);
        $('#thwrong').css("background-color", "#FF0000")
        setTimeout(
            function() {
        $('#thwrong').css("background-color", "#FFFFFF")
               //do something special
        }, 200);
        getIt = false;
    }
    $('.total').text(total);
    if(howMany != -1 &&  total < howMany)
        selectNote(getIt);
    else if(howMany == -1)
        selectNote(getIt);
    else
        gameOver();
}

function gameOver(){
    endTime = new Date().getTime();
    totalTime = endTime - startTime;
    var hours = Math.floor((totalTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((totalTime % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((totalTime % (1000 * 60)) / 1000);
    var strTime = hours +":"+minutes+":"+seconds;
    $('#game').remove();
    $('#abort').remove();
    $('#currentAnswer').remove();
    $('.risultati').css("visibility", "visible");
    $('.right').text(right);
    $('.wrong').text(wrong);
    $('.time').text(strTime);
}

function playAgain(){
    location.reload();
}