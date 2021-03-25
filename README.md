# Fantia-Downloader-tampermonkey
在 Fantia 的圖片框上增加下載按鈕，點擊後自動打包成 ZIP 並下載儲存。 <br>
This script will add a download button to the Fanita Image Box for downloading whole image in a ZIP file.
### 請搭配 Tampermonkey 服用:<br>
Please use this script with Tampermonkey. <br>
[Tampermonkey](https://www.tampermonkey.net/)
<br>
### 可以從 greasyfork 取得腳本：<br>
You can install this script from greasyfork.<br>
[greasyfork Fantia downloader](https://greasyfork.org/zh-TW/scripts/423306-fantia-downloader)
<br>
### 可以在 GitHub 上看到維護的 code:<br>
Check source code on GitHub.<br>
[Fantia-Downloader-tampermonkey](https://github.com/suzumiyahifumi/Fantia-Downloader-tampermonkey)
# 注意！ watch out! 
請使用 Firefox 來安裝此腳本。由於 Chrome 在跨域加載圖片上似乎有些問題，詳細內容可以查閱這裡：<br>
[ The Image tag with crossOrigin=“Anonymous” can't load success ](https://stackoverflow.com/questions/49503171/the-image-tag-with-crossorigin-anonymous-cant-load-success-from-s3)<br>
我嘗試使用其他方法，但是在 chrome 上依然無法奏效！[ 參考這裡 ](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image)<br>
Please run this script on Firefox. If use chrome, You might met a CORS problem by bug of chrome.<br>
I try to fix this problem, but I think it is not my problem also not CORS. Because I use different CORS method to load the image but just fail.

# Usage

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
