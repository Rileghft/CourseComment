/**
 * Created by fnsne on 2016/12/22.
 */

var filter_data =  '{"year": "105", "sem": "1", "deptType": "CS", "grade": "1", "degree": "學士", "type": "系必修"}' ;
filter_data = JSON.parse(filter_data);
document.addEventListener('DOMContentLoaded', function(){
    $('.filter_element').click( function () {
        var $box = $(this);
        if($box.is(":checked")) {
            if( $box.prop("name") == "年級" ){
                $('#grade_text').prop( "innerText" , "");
                $('#grade_text').prop( "innerText" , $box.prop("value") );
                switch ($box.prop("value")){
                    case '一年級':
                        filter_data.grade = 1;
                        break;
                    case '二年級':
                        filter_data.grade = 2;
                        break;
                    case '三年級':
                        filter_data.grade = 3;
                        break;
                    case '四年級':
                        filter_data.grade = 4;
                        break;
                    case '全部':
                        filter_data.grade = 'all';
                        break;
                }
            }else if( $box.prop("name") == "學歷" ){
                $('#education_text').prop("innerText", $box.prop("value"));
                if($box.pror("value") == '全部') {
                    filter_data.degree = 'all';
                }else {
                    filter_data.degree = $box.prop("value");
                }
            }else if( $box.prop("name") == "課程類型" ){
                $('#course_type_text').prop("innerText", $box.prop("value") );
                if($box.pror("value") == '全部') {
                    filter_data.degree = 'all';
                }else {
                    filter_data.type = $box.prop("value");
                }
            }

            filter_data = JSON.stringify(filter_data);

            //向db要資料
            get_courses_from_db();
        }else{
           /* $box.prop("checked",false);*/
        }
    })

    $('li').click(function () {
        var $list = $(this);

    });
});

function get_courses_from_db() {
    $.ajax({
        url: "/api/courseCardFilter",
        data:filter_data,
        type: "POST",
        dataType: "json",
        contentType : "application/json",
        success: function (result) {
            var courses = document.getElementById("courses");
            refresh_course_cards(courses, result);
        },
        error: function(e) {
            console.log(e);
        }
    });
    filter_data = JSON.parse(filter_data);
}
