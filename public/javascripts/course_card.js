/**
 * Created by fnsne on 2016/12/7.
 */
var json;
var year, semester, now_sem_year;
now_sem_year = getYearSemester()[0];

document.addEventListener('DOMContentLoaded', function(){
    var courses = document.getElementById("courses");
    getDefaultCourses(courses);
    $('#search').click( function () {
        var search_text = $('#search-content').prop("value");
        let year_sem = getYearSemester();
        let year = year_sem[0];
        let sem = year_sem[1];
        var courses = document.getElementById("courses");

        var data = {
            'year': year,
            'sem': sem,
            'searchText': search_text
        };
        console.log(data);
        $.ajax({
            url: "/api/search",
            data: JSON.stringify(data),
            type: "POST",
            dataType: "json",
            contentType : "application/json",
            success: function (result) {
                refresh_course_cards(courses, result);
            }

        });
    })
    $('#search-content').keyup(function (event) {
        if(event.keyCode == 13){
            $('#search').click();
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

function getDefaultCourses( courses ) {
    $.ajax({url: "/api/defaultCourseCards",
        type: "Get",
        dataType: "json",
        success : function (result) {
            //使用template
            refresh_course_cards(courses, result);
    }});
}

function refresh_course_cards( courses, obj ) {
    if(supportsTemplate()){
        remove_old_node_of(courses);
        //insert new cards
        var numOfData =obj.length;
        if(numOfData == 0){
            document.getElementById("courses").innerText = "查無資料";
        }else {
            for (var i = 0; i < numOfData; i++) {
                var course_card = document.querySelector('#course_card_template');

                insert_course_name(course_card.content, obj[i].name);
                insert_course_class(course_card.content, obj[i].courseID, obj[i].classID, obj[i].credit);
                insert_course_type(course_card.content, obj[i].type);
                insert_course_teachers(course_card.content, obj[i].teachers);
                insert_course_attribution(course_card.content, obj[i].attrs);
                insert_course_times(course_card.content, obj[i].times);
                insert_course_rating(course_card.content, obj[i].recommend);
                insert_course_difficulty(course_card.content, obj[i].difficulty);
                //insert_course_tags(course_card.content, obj[i].tags);

                var clone = document.importNode(course_card.content, true);
                courses.appendChild(clone);
            }
        }

    }else {//沒有支援Template
        document.write("This Browser Not Support");
    }
}

function remove_old_node_of( node ) {
    while( node.firstChild ){
        node.removeChild(node.firstChild);
    }
}

function insert_course_tags( course_content, tags) {
    course_content.querySelector('.tag').innerText = "tags : this is tags";
}

function insert_course_name( course_content, name ) {
    course_content.querySelector('.course_name').innerText = name;
}

function insert_course_class( course_content, course_number, course_class, course_credit ) {
    course_content.querySelector('.class_number').innerText = course_number;
    course_content.querySelector('.class').innerText = course_class+"班";
    course_content.querySelector('.credit').innerText = course_credit+"學分";
}

function insert_course_type( course_content, course_type ) {
    course_content.querySelector('.type').innerText = course_type;
}

function insert_course_teachers( course_content, teachers ) {
    var teacherNameStr = teachers[0];
    for(var i = 1 ; i < teachers.length; i++) {
        teacherNameStr += ", " + teachers[i];
    }

    course_content.querySelector('.couse_teacher').innerText = teacherNameStr;
}

function insert_course_attribution( course_content, attrs ) {
    if(attrs.length == 0){
        course_content.querySelector('.attr').innerText ="\n";
    }else{
        var attrStr = attrs[0];
        for(var i = 1; i < attrs.length; i++){
            attrStr += "\n" + attrs[i];
        }
        course_content.querySelector('.attr').innerText =attrStr;
    }
}

function insert_course_times( course_content, times ) {
    var timeStr = "時間 : ";

    if(times.length == 0){
        timeStr += "無資料";
    }else {
        timeStr += times[0];

        for (var i = 1; ( i < times.length ) && ( i < 4 ); i++) {
            timeStr += ", " + times[i];
        }
        if (times.length > 4) {
            timeStr += "...";
            var realTimeStr = "";
            realTimeStr += times[0];
            for (var i = 1; i < times.length; i++) {
                realTimeStr += ", " + times[i];
            }
            course_content.querySelector('.time').title = realTimeStr;
        }
    }
    course_content.querySelector('.time').innerText = timeStr;
}

function insert_course_rating( course_content, rating ) {
    var star_width = 22;
    var star_margin = 1;
    var star_png_width = 120;

    var rating_width = 0;
    var integer = Math.floor(rating);
    var decimal = rating - integer;
    for(var i = 0 ; i< integer; i++){
        rating_width += (star_width + star_margin + star_margin);
        //star width 20, margin 3 so star and the left academy-list is 20 + 3 + 3 = 26
    }
    rating_width += decimal * star_width;
    rating_width = (rating_width > star_png_width) ? star_png_width : rating_width;

    course_content.querySelector('.nostar').style.width = rating_width+"px";
}

function insert_course_difficulty( course_content, difficulty ) {
    var skull_width = 22;
    var skull_margin = 1;
    var skull_png_width = 120;

    var difficulty_width = 0;
    var integer = Math.floor(difficulty);
    var decimal = difficulty - integer;
    for(var i = 0 ; i< integer; i++){
        difficulty_width+= (skull_width + skull_margin + skull_margin);
        //star width 20, margin 3 so star and the left academy-list is 20 + 3 + 3 = 26
    }
    difficulty_width += decimal * skull_width;
    difficulty_width = (difficulty_width> skull_png_width) ? skull_png_width : difficulty_width;

    course_content.querySelector('.difficulty').style.width = difficulty_width+"px";
}

function supportsTemplate() {
    return 'content' in document.createElement('template');
}
