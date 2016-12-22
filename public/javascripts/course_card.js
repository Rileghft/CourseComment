/**
 * Created by fnsne on 2016/12/7.
 */
//var json = '{ "courses" :[ {"name": "計算機圖學", "class_number": "CS314", "class": "A", "credit" : "3", "type" : "選修", "teacher": "葉亦成", "attr" : "學程A", "position" : "1201A", "difficulty" : "3", "rating": "3.8", "tag" : ["tag1, tag2"] },{"name": "程式設計(一)", "class_number": "CS301", "class": "A", "credit" : "3", "type" : "必修", "teacher": "林基成", "attr" : "學程B", "position" : "1401B", "difficulty" : "4", "rating": "4.7", "tag" : ["tag3, tag4, tag5"]}]}';
var json;
var obj;

document.addEventListener('DOMContentLoaded', function(){

    var courses = document.getElementById("courses");
    /* 動態產生的部分 目前沒用到
    for(var i = 0 ; i < 2; i++){
        var course_card = create_course_card(obj.courses[i]);
        courses.appendChild(course_card);
    }*/

    getCourses(courses);


});

function getCourses(courses) {
    $.ajax({url: "/api/defaultCourseCards",
        type: "Get",
        dataType: "json",
        success : function (result) {
            obj = result;
            //使用template
        if(supportsTemplate()){
            var numOfData = result.length;
            for(var i = 0 ; i < numOfData; i++){
                var course_card = document.querySelector('#course_card_template');

            insert_course_name(course_card.content, obj[i].name);
            insert_course_class(course_card.content, obj[i].courseID, obj[i].classID, obj[i].credit);
            insert_course_type(course_card.content, obj[i].type);
            insert_course_teachers(course_card.content, obj[i].teachers);
            insert_course_attribution(course_card.content, obj[i].attrs);
            insert_course_place_time(course_card.content, obj[i].place_time);
            insert_course_rating(course_card.content, obj[i].recommend);
            insert_course_difficulty(course_card.content, obj[i].difficulty);

                var clone = document.importNode(course_card.content, true);
                courses.appendChild(clone);
        }

    }else {//沒有支援Template
        document.write("This Browser Not Support");
    }
    }});
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
        course_content.querySelector('.attr').innerText =attrs;
    }else{
        var attrStr = attrs[0];
        for(var i = 1; i < attrs.length; i++){
            attrStr += "," + attrs[i];
        }
        course_content.querySelector('.attr').innerText =attrStr;
    }
}

function insert_course_place_time( course_content, place_time ) {
    var place = Object.keys(place_time);
    var time = place_time[place];
    course_content.querySelector('.position').innerText = "地點 : " + place + ", 時間 : " +  time;
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
        //star width 20, margin 3 so star and the left space is 20 + 3 + 3 = 26
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
        //star width 20, margin 3 so star and the left space is 20 + 3 + 3 = 26
    }
    difficulty_width += decimal * skull_width;
    difficulty_width = (difficulty_width> skull_png_width) ? skull_png_width : difficulty_width;

    course_content.querySelector('.difficulty').style.width = difficulty_width+"px";
}

function supportsTemplate() {
    return 'content' in document.createElement('template');
}
