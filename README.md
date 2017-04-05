# Course Comment

![snapshot lost](https://raw.github.com/Rileghft/CourseComment/master/snapshot/home.png)

## 簡介

CourseComment是一個元智課程查詢與評論系統，改善原有搜尋系統，讓使用者更容易搜尋過濾資訊，快速的找到有興趣的課程，並評論上過的課程，提供其他學生參考。網頁分為三部分，首頁提供課程搜尋過濾，課程資訊頁面提供課程詳細資訊與評分，評論頁面(未完成)。

![snapshot lost](https://raw.github.com/Rileghft/CourseComment/master/snapshot/detail.png)


## 如何建置專案

1. `git clone https://github.com/Rileghft/CourseComment.git` 或下載專案

2. 安裝JDK8+，並設定環境路徑

3. 安裝MongoDB

4. 解壓縮元智課程資料 data/yzuCourse.zip

5. 啟動MongoDB Server，`mongod -dbpath=<元智課程資料路徑>`

6. 安裝Play Web Framework 啟動器 [Activator](https://www.lightbend.com/activator/download) 或[sbt](http://www.scala-sbt.org/)來建置專案

7. 設定activator 或 sbt 環境路徑

8. 開啟終端機，切換到專案目錄，輸入activator run 或 sbt run

9. 打開瀏覽器 [localhost:9000](http://localhost:9000)