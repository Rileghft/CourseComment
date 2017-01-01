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