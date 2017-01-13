/**
 * Created by Jomini on 2017/1/1
 * rewrite by 楊舜宇 on 2017/1/14
 */

var year = parseQueryString(location.href).year;
var sem = parseQueryString(location.href).sem;
var courseData = {};

function getCourseInfo() {
    $.ajax({
        url: "/api/courseDetail",
        data: JSON.stringify(parseQueryString(location.href)),
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        success: function (response) {
            courseData = response;
            inject_data();
            $('#write-comment').click(function () {
                location.href = `/studentQuestionnaire?year=${year}&sem=${sem}&courseID=${courseData.courseID}&class=${courseData.classID}`;
            });
        },
        error: function (error) {
            console.log(error);
            alert("找不到此課程資訊");
            window.location = location.host;
        }
    });
}

$(document).ready(function () {
    getCourseInfo();
});

function inject_data() {
    inject_value('.course-type', courseData.type);
    inject_value('.course-name', courseData.name);
    inject_multi_value('.attr-container ul', 'li', 'attr', courseData.attrs);
    inject_value('.teachers span:nth-of-type(2)', courseData.teachers.join('、'));
    inject_value('.recommend', courseData.recommend.toFixed(1));
    inject_value('.dept', courseData.deptName + ' ' + courseData.grade + '年級');
    inject_value('.difficulty', courseData.difficulty.toFixed(1));
    inject_value('.credit', courseData.credit);
    inject_value('.place span:nth-of-type(2)', Object.keys(courseData.place_time).join('、'));
    inject_value('.pre-requisite span:nth-of-type(2)', courseData.preRequisite.join('、'));
    inject_value('.time span:nth-of-type(2)', courseData.times.join('、'));
    inject_value('.introduce p', courseData.courseIntro);
    inject_value('.teach-approach p', courseData.teachApproach);
    inject_value('.note', courseData.note);
    inject_value('.tag', courseData.tags.join('、'));
    inject_table_values('#outline tbody', 1, courseData.outline);
    inject_table_values('#dept-obj tbody', 1, courseData.obj_dept[true]);
    inject_table_values('#stu-obj tbody', 1, courseData.obj_stu[true]);
    inject_scoring('#scoring tbody', courseData.scoring);
    inject_scoring('#other-scoring tbody', courseData.otherScoring);
    inject_textbook('#book', courseData.books);
    inject_value('#office-hour p', courseData.officeHour);
}
function inject_value(selector, value) {
    if (value !== "" && value !== "unknown") {
        $(selector).text(value);
    }
}
function inject_multi_value(selector, tag, className, values) {
    let $container = $(selector);
    let i;
    for (i = 0; i < values.length; ++i){
        let element = document.createElement(tag);
        element.class = className;
        element.textContent = values[i];
        $container.append(element);
    }
}
function inject_table_values(selector, colNum, values) {
    let $container = $(selector);
    let i;
    for (i = 0; i < values.length; ++i) {
        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        td1.textContent = i + 1;
        let td2 = document.createElement('td');
        td2.textContent = values[i];
        tr.appendChild(td1);
        tr.appendChild(td2);
        $container.append(tr);
    }
}
function inject_scoring(selector, data) {
    let $container = $(selector);
    let rowNum = 0;
    data.forEach(row => {
        ++rowNum;
        let tr = document.createElement('tr');
        tr = append_td(tr, rowNum);
        tr = append_td(tr, row['item']);
        tr = append_td(tr, row['midWeight']);
        tr = append_td(tr, row['finalWeight']);
        $container.append(tr);
    });
}
function inject_textbook(selector, data) {
    let $container = $(selector);
    let rowNum = 0;
    data.forEach(row => {
        ++rowNum;
        let tr = document.createElement('tr');
        tr = append_td(tr, rowNum);
        tr = append_td(tr, row['title']);
        tr = append_td(tr, row['dataType']);
        tr = append_td(tr, row['type']);
        tr = append_td(tr, row['lang']);
        let link = document.createElement('a');
        link.textContent = "資源連結";
        link.setAttribute('href', row['link']);
        let td = document.createElement('td');
        td.appendChild(link);
        tr.appendChild(td);
        $container.append(tr);
    });
}
function append_td(tr, value) {
    let td = document.createElement('td');
    td.textContent = value;
    tr.appendChild(td);
    return tr;
}
function parseQueryString(url) {
    let matches = url.match(/.*?\?year=(\d+)&sem=(\d)&courseID=([\w\d]+)&class=([\w\d]+)/);
    let params = {
        "year": parseInt(matches[1]),
        "sem": parseInt(matches[2]),
        "courseID": matches[3],
        "class": matches[4],
    }
    return params;
}
