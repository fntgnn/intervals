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
        $('#stats').css("visibility", "visible");
    }
}

function writeAllStats(){
    //all
    todayDate = today();
    for(var i = 0; i < stats.length; i++){
        var rawDate = stats[i]['date'];
        var day = getDateForTable(rawDate);
        var strStat = '<tr><td>'+day+'</td><td>'+stats[i]['key']+'</td><td>'+stats[i]['difficulty']+'</td><td>'+stats[i]['howMany']+'</td><td>'+stats[i]['right']+'</td><td>'+stats[i]['wrong']+'</td><td>'+stats[i]['time']+'</td></tr>'
        $('#tblAllStats').append(strStat);
        if(todayDate == day){
            $('#tblTodayStats').append(strStat);

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

function today(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy +'-' + mm + '-' + dd;
    return today;
}


});