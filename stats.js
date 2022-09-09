$(document).ready(function() {
var stats = [];
getStats();
console.log(stats);
refreshComponents();


function getStats(){
    stats = JSON.parse(localStorage.getItem("stats"));
    writeAllStats();
}

function clearStats(){
    if(confirm("Are you sure?")){
        localStorage.removeItem("stats");
        stats = [];
        refreshComponents();
    }
}

function refreshComponents(){
    if(stats == null || stats.length == 0){
        $('#empty').css('visibility', 'visible');
    }
    else{
        $('#empty').remove();
        $('#todayStats').css("visibility", "visible");
        $('#allStats').css("visibility", "visible");
        $('#bestKey').css("visibility", "visible");
        $('#worstKey').css("visibility", "visible");
    }
}

function writeAllStats(){
    //all & today
    todayDate = today();
    keys = []
    for(var i = 0; i < stats.length; i++){
        var rawDate = stats[i]['date'];
        var day = getDateForTable(rawDate);
        var strStat = '<tr><td>'+day+'</td><td>'+stats[i]['key']+'</td><td>'+stats[i]['difficulty']+'</td><td>'+stats[i]['howMany']+'</td><td>'+stats[i]['right']+'</td><td>'+stats[i]['wrong']+'</td><td>'+getStrTime(stats[i]['time'])+'</td></tr>'
        $('#tblAllStats').append(strStat);
        if(todayDate == day){
            $('#tblTodayStats').append(strStat);

        }        
        //prepare Distink Key Done
        found = false;
        for(var j = 0; j < keys.length; j++)
            if(stats[i]['key'] == keys[j]){
                found = true;
                break;
            }
        if(found == false)
            keys.push(stats[i]['key']);
    }
    //best key
    for(var i = 0; i < keys.length; i++){
        statKey = [];
        for(var j = 0; j < stats.length; j++){
            if(keys[i] == stats[j]['key'])
                statKey.push(stats[j]);
        }
    }

}

function getDateForTable(rawDate){
    var d = new Date(rawDate);
    var dd = String(d.getDate()).padStart(2, '0');
    console.log(dd);
    var mm = String(d.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = d.getFullYear();

    date = yyyy +'-' + mm + '-' + dd;
    return date;
}

function getStrTime(totalTime){
    var hours = Math.floor((totalTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((totalTime % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((totalTime % (1000 * 60)) / 1000);
    var strTime = hours +":"+minutes+":"+seconds;
    return strTime;
}

function today(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy +'-' + mm + '-' + dd;
    return today;
}


});