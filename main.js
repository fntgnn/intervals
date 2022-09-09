
$(document).ready(function() {
    if (navigator && navigator.serviceWorker) {
        navigator.serviceWorker.register('sw.js');
    }

    //install button
    /*let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        deferredPrompt = e;
        alert(e);
    });
    const installApp = document.getElementById('installApp');

    installApp.addEventListener('click', async () => {
        if (deferredPrompt !== null) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                deferredPrompt = null;
            }
        }
    });*/


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

var startTime = 0;
var endTime = 0;

var stats = [];

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
    start();
}

function start(){
    $('#interval').css('visibility','hidden');
    $('#game').css('visibility','hidden');
}

function chooseKey(k){
    var n;
    chooseLength();
    if (k == undefined)
        n = Math.floor(Math.random() * tunes.length);
    else{
        console.log(tunes[0]['key'])
        for(var i = 0; i < tunes.length; i++){
            if(tunes[i]['key'] == k)
                n = i;
        }
    }
    mainKey = tunes[n];
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
    $('#setKey').css('visibility','visible');
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
        newInterval = Math.floor(Math.random()*intervals[diff].length);
        while(newInterval == interval)
            newInterval = Math.floor(Math.random()*intervals[diff].length);
        interval = newInterval;
        $('#interval').text(intervals[diff][interval]);
    }
}

function getNote(note){
    total++;
    var getIt = false;
    if(mainKey[intervals[diff][interval]] == note){
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
    $('.time').text(totalTime);
    writeTodayStats(strTime);  
}

function writeTodayStats(strTime){
    var now = Date.now();
    var stat = {
        "date": now,
        "key": mainKey["key"],
        "difficulty": diff,
        "howMany": howMany,
        "right": right,
        "wrong": wrong,
        "time": strTime, 
    };
    oldStats = JSON.parse(localStorage.getItem("stats"));
    if(oldStats == null)
        stats[0] = stat;
    else{
        stats = oldStats;
        stats.push(stat);
    }
    localStorage.removeItem("stats");
    localStorage.setItem("stats",JSON.stringify(stats));
}

function playAgain(){
    location.reload();
}

function today(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy +'-' + mm + '-' + dd;
    return today;
}