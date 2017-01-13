/**
 * Created by fnsne on 2016/12/22.
 */

var year = getYearSemester()[0];
var sem = getYearSemester()[1];
var deptType = 'FC';

var filter_data = {
    'year': year,
    'sem': sem,
    'deptType': "FC",
    'grade': 0,
    'degree': "all",
    'type': "all"
}

var degreeMap = {
    'BS': '學士',
    'MS': '碩士',
    'PhD': '博士',
    'all': 'all'
}
document.addEventListener('DOMContentLoaded', function(){
    $('#sem_year_select option[value="'+year+'"]').prop('selected', 'selected');
    $('#semester_select option[value="'+sem+'"]').prop('selected', 'selected');
    $('.filter-grade').click(function () {
        let $box = $(this);
        let gradeName = $box.data("text");
        let grade = $box.val();
        $('#grade_text').prop( "innerText" , gradeName);
        filter_data.grade = parseInt(grade);
        queryFilteredCourseCard();
    });

    $('.filter-degree').click(function() {
        let $degree = $(this);
        let degreeName = $degree.data("text");
        let degree = $degree.val();
        $('#education_text').prop( "innerText" , degreeName);
        filter_data.degree = degree;
        queryFilteredCourseCard();
    });

    $('.filter-type').click(function() {
        let $type = $(this);
        let typeName = $type.data('text');
        let type = $type.val();
        $('#course_type_text').prop( "innerText" , typeName);
        filter_data.type = type;
        queryFilteredCourseCard();
    });

    $('.dept').click(function () {
        var $list = $(this);
        var dept = $list.data("dept");
        var depType_degree = dept.split('-');
        var deptType = depType_degree[0];
        var degree = depType_degree[1];
        filter_data.deptType = deptType;
        filter_data.degree = degreeMap[degree];

        var deptName = $list.prop("innerText");
        $('#deptName').prop("innerText", deptName);
        $('.filter-degree[checked]').prop('checked', false);
        $('.filter-degree[value="' + filter_data.degree + '"]').prop('checked', true);

        queryFilteredCourseCard();
    });

    $('#semester_select').change(function () {
        let $sem = $(this);
        let sem = parseInt($sem.val());
        filter_data.sem = sem;
        window.sem = sem;
        $('#semester_text').prop('innerText', "第"+sem+"學期");
        queryFilteredCourseCard();
    });

    $('#sem_year_select').change(function () {
        let $year = $(this);
        let sem_year = $year.val();
        filter_data.year = parseInt(sem_year);
        $('#semester_year_text').prop('innerText', sem_year+"學年");
        queryFilteredCourseCard();
    });

    $('#default_sem_year').click(function () {
        let year = getYearSemester()[0];
        let sem = getYearSemester()[1];
        filter_data.year =year;
        window.year = year;
        $('#sem_year_select option[value="'+year+'"]').prop('selected', 'selected');
        filter_data.sem = sem;
        window.sem = sem;
        $('#semester_select option[value="'+sem+'"]').prop('selected', 'selected');

        queryFilteredCourseCard();
    });

    create_sem_year_select();
});

function create_sem_year_select() {
    if(supportsTemplate()){
        let select = document.querySelector('#sem_year_template');
        let current_sem = getYearSemester()[0];
        let begin_sem_year = 95;
        let sem_year_select = document.getElementById('sem_year_select');
        let i;
        for(i = current_sem; i >= begin_sem_year; i--) {
            select.content.querySelector('.sem_year_element').innerText = i;
            select.content.querySelector('.sem_year_element').value = i;
            var clone = document.importNode(select.content, true);
            sem_year_select.appendChild(clone);
        }

    }else {//沒有支援Template
        document.write("This Browser Not Support");
    }
}

function supportsTemplate() {
    return 'content' in document.createElement('template');
}

document.addEventListener('DOMContentLoaded', function(){
    var courses = document.getElementById("courses");
    getDefaultCourseCards(courses);
    $('#search').click(search)
    $('#search-content').keyup(function (event) {
        if(event.keyCode == 13){
            search();
        }
    })
});

function getYearSemester() {
    var today = new Date();
    var ADyear = today.getFullYear();
    var ROCyear = ADyear - 1911;
    var month = today.getMonth();

    var sem = (month > 11 || month < 5)? 2: 1;
    var semesterYear =  ROCyear - (sem == 2? 1: 0);
    return [semesterYear, sem];
}

