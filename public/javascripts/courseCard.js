/**
 * Created by 楊舜宇 on 2017/1/2.
 */

Vue.component('course-card', {
    template: "#course-card-template",
    props: {
        course: Object
    },
    computed: {
        times: function () {
            if (typeof(this.course.times) != typeof([]) || this.course.times.length === 0) {
                return "未指定時間";
            }
            else {
                return this.course.times.join('、');
            }
        },
        recommend: function () {
            return this.course.recommend;
        },
        difficulty: function () {
            return this.course.difficulty;
        },
        link: function () {
            return `/courseDetail?year=${year}&sem=${sem}&courseID=${this.course.courseID}&class=${this.course.classID}`;
        }
    }
});

var courses = new Vue({
    el: "#courses",
    data: {
        courseData: []
    },
    created: function () {
        getDefaultCourseCards()
    }
});

function queryFilteredCourseCard() {
    $.ajax({
        url: "/api/courseCardFilter",
        data: JSON.stringify(filter_data),
        type: "POST",
        dataType: "json",
        contentType : "application/json",
        success: function (result) {
            courses.courseData = result;
        },
        error: function(e) {
            console.log(e);
        }
    });
}

function getDefaultCourseCards() {
    $.ajax({
        url: `/api/defaultCourseCards?year=${year}&sem=${sem}&deptType=${deptType}`,
        type: "Get",
        dataType: "json",
        success : function (result) {
            courses.courseData = result;
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function search() {
    let searchText = $('#search-content').val();

    let data = {
        'year': year,
        'sem': sem,
        'searchText': searchText
    };
    $.ajax({
        url: "/api/search",
        data: JSON.stringify(data),
        type: "POST",
        dataType: "json",
        contentType : "application/json",
        success: function (result) {
            courses.courseData = result;
        },
        error: function (e) {
            console.log(e);
        }
    });
}

