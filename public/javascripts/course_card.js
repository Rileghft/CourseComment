/**
 * Created by fnsne on 2016/12/7.
 */
var json = '{ "courses" :[ {"name": "計算機圖學", "teacher": "葉亦成", "rating": "3.8"},{"name": "程式設計(一)", "teacher": "林基成", "rating": "4.7"} ]}';
var obj = JSON.parse(json);
var star_image = "/assets/stars.png";
var id_num = 0;

document.addEventListener('DOMContentLoaded', function(){

    var courses = document.getElementById("courses");
    /* 動態產生的部分
    for(var i = 0 ; i < 2; i++){
        var course_card = create_course_card(obj.courses[i]);
        courses.appendChild(course_card);
    }*/

   //使用template
    if(supportsTemplate()){
        for(var i = 0 ; i < 2; i++){
            var course_card = document.querySelector('#course_card_template');
            course_card.content.querySelector('.course_name').innerText = obj.courses[i].name;
            course_card.content.querySelector('.couse_teacher').innerText = obj.courses[i].teacher;
            var clone = document.importNode(course_card.content, true);
            courses.appendChild(clone);
        }

    }else {//沒有支援Template
        document.write("This Browser Not Support");
    }
});

function supportsTemplate() {
    return 'content' in document.createElement('template');
}

//由此開始是動態產生的code
function create_course_card(course_content) {
    var course_card = document.createElement("div");
    var att = document.createAttribute("class");
    att.value = "course_card";
    course_card.setAttributeNode(att);

    var title = create_course_title(course_content.name);
    var teacher = create_course_teacher(course_content.teacher);
    var rating_bar = create_rating_bar(course_content.rating);

    course_card.appendChild(title);
    course_card.appendChild(teacher);
    course_card.appendChild(rating_bar);
    return course_card;
}

function create_course_title(name) {
    var title = document.createElement("div");
    title.innerText = "課程名稱 : "+name;
    var att = document.createAttribute("class");
    att.value = "course_title";
    title.setAttributeNode(att);
    return title;
}

function create_course_teacher(name) {
    var teacher = document.createElement("div");
    teacher.innerText = "授課教授 : "+name;
    var att = document.createAttribute("class");
    att.value = "course_teacher";
    teacher.setAttributeNode(att);
    return teacher;
}

function create_rating_bar(rating) {
    var star_width = 20;
    var star_margin = 3;
    var star_png_width = 124;

    var prograce = document.createElement("div");
    var att_prograce_class = document.createAttribute("class");
    att_prograce_class.value = "rating ";
    prograce.setAttributeNode(att_prograce_class);
    //create star
    var stars = document.createElement("div");
    var att_star_class = document.createAttribute("class");
    att_star_class.value = "nostar";
    var att_style = document.createAttribute("style");
    att_style.value = "background-image: url( "+star_image+")";

    stars.setAttributeNode(att_style);
    stars.setAttributeNode(att_star_class);

    var rating_width = 0;
    var integer = Math.floor(rating);
    var decimal = rating - integer;
    for(var i = 0 ; i< integer; i++){
        rating_width += (star_width + star_margin + star_margin);
        //star width 20, margin 3 so star and the left space is 20 + 3 + 3 = 26
    }
    rating_width += decimal * star_width;
    rating_width = (rating_width > star_png_width) ? star_png_width : rating_width;

    prograce.style.width = rating_width+"px";

    prograce.appendChild(stars);
    return prograce;
}
//到此為止是動態產生的code