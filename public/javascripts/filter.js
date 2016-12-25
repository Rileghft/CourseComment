/**
 * Created by fnsne on 2016/12/22.
 */

document.addEventListener('DOMContentLoaded', function(){
    $('.filter_element').click( function () {
        var $box = $(this);
        if($box.is(":checked")) {
            /*var group = "input:radio[name='" + $box.attr("name") + "']";
            $(group).prop("checked", false);
            $box.prop("checked", true);*/
            //在這邊做點擊後要做的反應
        }else{
           /* $box.prop("checked",false);*/
        }
    })

});