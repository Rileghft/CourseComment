/**
* Created by Jomini on 2017/1/1
*/

// 按下tab事件
function openTab(evt, tabName) {
        var i, tabContent, tabLinks;
        tabContent = document.getElementsByClassName("tab_content");
        for(i = 0; i < tabContent.length; ++i)
        {
            tabContent[i].style.display="none";
        }

        /*tabLinks = document.getElementsByClassName("tab_links");
        for(i = 0; i < tabLinks.length; ++i)
        {
            tabLinks[i].className = tabLinks[i].className.replace(" active", "");
        }*/
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";
    }

// 推薦度circle
window.onload = function(maxScore, getScore) {
    maxScore = 5; getScore = 3.1; // 課堂分數作為參數傳入或之後在此function中做讀該課程資料的動作
    var i, radius = 100;
    var circle = 2 * radius * Math.PI;
    var elements = document.getElementsByTagName("circle");

    // 設定circle大小，中心圓需要比較小
    for(i = 0; i < elements.length; ++i) {
        elements[i].setAttribute("r", radius);
        elements[i].setAttribute("stroke-dasharray", circle);
    }
    elements = document.getElementsByClassName("radial-progress-center");
    elements[0].setAttribute('r', (radius - 5));

    var currentCount = 1;
    var maxCount = 36; // 將一個圓分為幾個part.
    var stopCount = getScore / maxScore * maxCount; // 總共轉幾個part.
    var offset = 0;
    elements = document.getElementsByClassName("radial-progress-cover");
    var intervalId = setInterval(function() {
        if(currentCount > stopCount) {
            clearInterval(intervalId);
            return;
        }
        offset = -(circle/maxCount) * currentCount;
        elements[0].setAttribute("stroke-dashoffset", offset);
        ++currentCount;
    }, 30);
}