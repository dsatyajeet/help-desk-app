/**
 * Created by ajitmogre on 01/12/15.
 */
function toggle(id1,id2){
    $(id1).show();
    $(id2).hide();
}

function addNotification(message,type,options){
    $.notify(message, type,options);
}
