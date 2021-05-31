# Fantia-Downloader-tampermonkey
在 Fantia 的圖片框上增加下載按鈕，點擊後自動打包成 ZIP 並下載儲存。 <br>
新功能： 自定義下載名稱！ <br>
This script will add a download button to the Fanita Image Box for downloading whole image in a ZIP file.<br>
new functionality: Rename the download file!
#### NEW Version v2.3
* 支援 Google Chrome ／ Support Google Chrome.<br>
* 支援 中文、English、日本語 ／ Support English, 日本語 and 中文.<br>
* 支援 自訂下載名稱 ／ Support set the format of download file Name by yourself.<br>
* 支援 儲存設定 ／ Support save setting with Cookie<br>
* 支援 模糊主題 ／ Support Blur style for setting center.<br>

### 請搭配 Tampermonkey 服用:<br>
Please use this script with [Tampermonkey](https://www.tampermonkey.net/). <br>
<br>
### 可以從 greasyfork 取得腳本：<br>
You can install this script from greasyfork ([Fantia downloader](https://greasyfork.org/zh-TW/scripts/423306-fantia-downloader)).<br>
<br>
### 可以在 GitHub 上看到維護的 code:<br>
Check source code on GitHub ([Fantia-Downloader-tampermonkey](https://github.com/suzumiyahifumi/Fantia-Downloader-tampermonkey)).<br>

# 注意！ watch out! 
如果使用其他瀏覽器時遇到錯誤，<br>
請使用 Firefox 來安裝此腳本。由於 Chrome 在跨域加載圖片上似乎有些問題，詳細內容可以查閱這裡：<br>
[ The Image tag with crossOrigin=“Anonymous” can't load success ](https://stackoverflow.com/questions/49503171/the-image-tag-with-crossorigin-anonymous-cant-load-success-from-s3)<br><br>
我嘗試使用其他方法 ([ 參考這裡 ](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image))，但是在 chrome 上依然無法奏效！<br><br>
If you met some ERROR or Bug, Please run this script on Firefox. If use chrome, You might met a CORS problem by bug of chrome.<br>
I try to fix this problem, but I think it is not my problem also not CORS. Because I use different CORS method to load the image but just fail.

# Usage
#### 支援 Google Chrome <br>
開放其他瀏覽器使用！ Chrome 也可以用囉！<br>
支援3種語言的設定中心！ English、中文、日本語 <br>
自定義下載名稱！ 可使用Cookie紀錄設定！ <br>
Now, You can use this script on Chrome.<br>
New Setting Center support in three languages! English、中文、日本語 <br>
Rename the download file! Can save setting with Cookie! <br>

1. 點擊右下角的設定紐進入設定！預設不使用 Cookie！<br>
Click < Setting Center > which locate at right bottom of window! Don't apply Cookie is Default setting!<br>
<img src="https://i.imgur.com/e9AsjhV.png" />
<img src="https://i.imgur.com/cHDJipA.png" />

2. 點擊 < 作者特訂 > 可以針對創作者設定檔案名稱！請開啟 Cookie 紀錄本設定！<br>
Click < Author Save > to set file name for specific creator! Please apply Cookie Save!<br>
<img src="https://i.imgur.com/MwEVMzt.png" />

### About Setting Center Style
如果想使用 "毛玻璃主題" 請在 Firefox 的 "about:config" 中開啟 "layout.css.backdrop-filter.enabled"!<br>
Please open the "layout.css.backdrop-filter.enabled" in Firefox "about:config" to get the Blur style!<br>
<img src="https://i.imgur.com/fKq3fay.png" />

### Please run this script on Firefox.
1. 點擊圖片區域上方的 < 全圖片下載 > 會開始打包該區域內的圖片。<br>
Click < Download Picture > at the top of the picture area to packaging the pictures. <br>
<img src="https://i.imgur.com/SyRh7mZ.png" />

2. 擷取圖片連結並下載中。<br>
Retrieving the image link and downloading. <br>
<img src="https://i.imgur.com/FT7rY3Z.png" />

3. 將圖片打包成 ZIP 檔案中。<br>
Pack the picture into a ZIP file. <br>
<img src="https://i.imgur.com/K6IQ8Cj.png" />

4. 下載完成。<br>
Download completed.<br>
<img src="https://i.imgur.com/zP1QGMc.png" />
