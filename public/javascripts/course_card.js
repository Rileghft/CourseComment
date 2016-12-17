/**
 * Created by fnsne on 2016/12/7.
 */
var json = '{ "courses" :[ {"name": "計算機圖學", "class_number": "CS314", "class": "A", "credit" : "3", "type" : "選修", "teacher": "葉亦成", "attr" : "學程A", "position" : "1201A", "difficulty" : "3", "rating": "3.8", "tag" : ["tag1, tag2"] },{"name": "程式設計(一)", "class_number": "CS301", "class": "A", "credit" : "3", "type" : "必修", "teacher": "林基成", "attr" : "學程B", "position" : "1401B", "difficulty" : "4", "rating": "4.7", "tag" : ["tag3, tag4, tag5"]}]}';
var obj = JSON.parse(json);
var star_image = "/assets/stars.png";
var id_num = 0;

document.addEventListener('DOMContentLoaded', function(){

    var courses = document.getElementById("courses");
    /* 動態產生的部分 目前沒用到
    for(var i = 0 ; i < 2; i++){
        var course_card = create_course_card(obj.courses[i]);
        courses.appendChild(course_card);
    }*/

   //使用template
    if(supportsTemplate()){
        for(var i = 0 ; i < 2; i++){
            var course_card = document.querySelector('#course_card_template');
            course_card.content.querySelector('.course_name').innerText = obj.courses[i].name;

            insert_course_name(course_card.content, obj.courses[i].name);
            insert_course_class(course_card.content, obj.courses[i].class_number, obj.courses[i].class, obj.courses[i].credit);
            insert_course_type(course_card.content, obj.courses[i].type);
            insert_course_teacher(course_card.content, obj.courses[i].teacher);
            insert_course_attribution(course_card.content, obj.courses[i].attr);
            insert_course_position(course_card.content, obj.courses[i].position);
            insert_course_rating(course_card.content, obj.courses[i].rating);
            insert_course_difficulty(course_card.content, obj.courses[i].difficulty);

            var clone = document.importNode(course_card.content, true);
            courses.appendChild(clone);
        }

    }else {//沒有支援Template
        document.write("This Browser Not Support");
    }
});

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

function insert_course_teacher( course_content, teacher_name ) {
    course_content.querySelector('.couse_teacher').innerText = teacher_name;
}

function insert_course_attribution( course_content, attr ) {
    course_content.querySelector('.attr').innerText = attr;
}

function insert_course_position( course_content, position ) {
    course_content.querySelector('.position').innerText = "地點 : "+position;
}

function insert_course_rating( course_content, rating ) {
    var star_width = 20;
    var star_margin = 3;
    var star_png_width = 124;

    var rating_width = 0;
    var integer = Math.floor(rating);
    var decimal = rating - integer;
    for(var i = 0 ; i< integer; i++){
        rating_width += (star_width + star_margin + star_margin);
        //star width 20, margin 3 so star and the left space is 20 + 3 + 3 = 26
    }
    rating_width += decimal * star_width;
    rating_width = (rating_width > star_png_width) ? star_png_width : rating_width;

    course_content.querySelector('.rating').style.width = rating_width+"px";
}

function insert_course_difficulty( course_content, difficulty ) {
    course_content.querySelector('.difficulty').innerText = "難度 : "+difficulty;
}

function supportsTemplate() {
    return 'content' in document.createElement('template');
}
