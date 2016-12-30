/**
 * Created by fnsne on 2016/12/22.
 */

var filter_data = {
    'year': getYearSemester()[0],
    'sem': getYearSemester()[1],
    'deptType': "FC",
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

    $('#semester_select').change(function () {
        let $sem = $(this);
        let sem = $sem.val();
        filter_data.sem = parseInt(sem);
        $('#semester_text').prop('innerText', "第"+sem+"學期");
        filterQuery();
    });

    $('#sem_year_select').change(function () {
        let $year = $(this);
        let sem_year = $year.val();
        filter_data.year = parseInt(sem_year);
        $('#semester_year_text').prop('innerText', sem_year+"學年");
        filterQuery();
    });

    $('#default_sem_year').click(function () {
        let year = getYearSemester()[0];
        let sem = getYearSemester()[1];
        filter_data.year =year;
        $('#sem_year_select option[value="'+year+'"]').prop('selected', 'selected');
        $('#semester_year_text').prop('innerText', year+"學年");
        filter_data.sem = sem;
        $('#semester_select option[value="'+sem+'"]').prop('selected', 'selected');
        $('#semester_text').prop('innerText', "第"+sem+"學期");

        filterQuery();
    });

    create_sem_year_select();
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

function create_sem_year_select() {
    if(supportsTemplate()){
        let select = document.querySelector('#sem_year_template');
        let begin_sem_year = 99;
        let sem_year_select = document.getElementById('sem_year_select');
        for(var i = now_sem_year; i >= begin_sem_year; i--) {
            select.content.querySelector('.sem_year_element').innerText = i;
            select.content.querySelector('.sem_year_element').value = i;
            var clone = document.importNode(select.content, true);
            sem_year_select.appendChild(clone);
        }

    }else {//沒有支援Template
        document.write("This Browser Not Support");
    }
}
