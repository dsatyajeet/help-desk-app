/**
 * Created by ajitmogre on 01/12/15.
 */
function toggle(id1,id2){
    $(id1).show();
    $(id2).hide();
}

$( document ).ready(function() {
    $.notify("Do not press this button", "info",{ position:"",  showAnimation: 'slideDown' });

});