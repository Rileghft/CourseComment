/**
 * Created by fnsne on 2016/12/22.
 */

var filter_data = {
    'year': getYearSemester()[0],
    'sem': getYearSemester()[1],
    'deptType': "",
    'grade': 0,
    'degree': "all",
    'type': "all"
}
document.addEventListener('DOMContentLoaded', function(){
    $('.filter-grade').click(function () {
        let $box = $(this);
        let gradeName = $box.data("text");
        let grade = $box.val();
        $('#grade_text').prop( "innerText" , gradeName);
        filter_data.grade = parseInt(grade);
        filterQuery();
    });

    $('.filter-degree').click(function() {
        let $degree = $(this);
        let degreeName = $degree.data("text");
        let degree = $degree.val();
        $('#education_text').prop( "innerText" , degreeName);
        filter_data.degree = degree;
        filterQuery();
    });

    $('.filter-type').click(function() {
        let $type = $(this);
        let typeName = $type.data('text');
        let type = $type.val();
        $('#course_type_text').prop( "innerText" , typeName);
        filter_data.type = type;
        filterQuery();
    });

    $('.dept').click(function () {
        var $list = $(this);
        var dept = $list.data("dept");
        var depType_degree = dept.split('-');
        var deptType = depType_degree[0];
        var degree = depType_degree[1];
        filter_data.deptType = deptType;

        switch (degree){
            case 'BS':
                filter_data.degree = '學士';
                $('#education_text').prop("innerText", '學士');
                break;
            case 'MS':
                filter_data.degree = '碩士';
                $('#education_text').prop("innerText", '碩士');
                break;
            case 'PhD':
                filter_data.degree = '博士';
                $('#education_text').prop("innerText", '博士');
                break;
            default:
                filter_data.degree = degree;
                $('#education_text').prop("innerText", '全部學歷');
        }

        $('.filter-degree[checked]').prop('checked', false);
        $('.filter-degree[value="' + filter_data.degree + '"]').prop('checked', true);

        filterQuery();
    });
});

function filterQuery() {
    $.ajax({
        url: "/api/courseCardFilter",
        data: JSON.stringify(filter_data),
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
}
