/* jshint esversion: 9 */
// ==UserScript==
// @name         Fantia downloader
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Download your Fantia rewards more easily! 
// @author       suzumiyahifumi
// @match        https://fantia.jp/posts/*
// @icon         https://www.google.com/s2/favicons?domain=fantia.jp
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.0/jszip.min.js
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	$('head').append(`<style type="text/css">
	.fa-download2::before{
		content: "\\f021"
	}
	.hdr{ pointer-events: none; }
	</style>`);

	$('nav.scroll-tabs>div').append(`<a id="set" class="tab-item tab-item-text" style="cursor: pointer;" onclick="JAVASCRIPT:getDownLoadButton()">擷取下載</a>`);

	window.getDownLoadButton = () => {
		$('div.btn-group-tabs').each((i, div) => {
			$(div).append(`<button class="btn btn-default btn-md" onclick="getImg(event)"><i class="fa fa-download fa-2x" style="color: #fe7070 !important;"></i> <span class="btn-text-sub" style="color: #fe7070 !important;">全圖片下載</span></button>`);
			$('#set').remove();
		});
	};

	var init = setInterval(() => {
		if ($('nav.post-next-prev-buttons').length != 0) {
			if ($('div.btn-group-tabs').length != 0) {
				window.getDownLoadButton();
				clearInterval(init);
			} else {
				$('#set').remove();
				clearInterval(init);
			}
		}
	}, 500);

	window.getImg_ = (event) => {
		let srcArr = [];
		let dataCont = 0;
		var downloadB = ($(event.target).is("button")) ? $(event.target) : $(event.target).closest("button");
		downloadB.addClass(['active', 'hdr']);
		downloadB.find('i').removeClass('fa-download').addClass('fa-download2');
		downloadB.find('span').text(`擷取連結中`);
		$($(event.target).closest('div.content-block').find('div.image-thumbnails')[0]).find('img').each((i, img) => {
			let src = $(img).attr('src');
			let id = /file\/\d+\//g.exec(src);
			if (id[0] != null) {
				srcArr.push(`https://fantia.jp/posts/SRC/post_content_photo/SRC`.replaceAll(`SRC`, /\d+/.exec(id)[0]));
			}
		});
		downloadB.find('span').text(`${dataCont} / ${srcArr.length}`);

		var zip = new JSZip();
		srcArr.digits = window.getDigits(Number(srcArr.length));
		srcArr.forEach((url, i) => {
			$.get(url, function (data) {
				let div = document.createElement("div");
				$(div).html(data);
				$(div).find('img').attr("id", `${i}_img`);
				let imgSRC = $(div).find('img').attr("src");
				$(div).remove();

				/*
				loadAsArrayBuffer(imgSRC, function (imgData) {
					dataCont += 1;
					downloadB.find('span').text(`${dataCont} / ${srcArr.length}`);
					zip.file(`${i.toString().padStart(srcArr.digits, 0)}.jpg`, imgData);
					if (dataCont == srcArr.length) {
						downloadB.find('span').text(`壓縮檔案中`);
						zip.generateAsync({
							type: "blob"
						}).then(function (content) {
							downloadB.find('i').removeClass('fa-download2').addClass('fa-download');
							downloadB.removeClass(['active', 'hdr']);
							downloadB.find('span').text(`下載已完成`);
							let tag = document.createElement('a');
							tag.href = (URL || webkitURL).createObjectURL(content);
							tag.download = `${$("h1.post-title").text()}_${downloadB.closest("div.post-content-inner").find('h2').text()}`;
							document.body.appendChild(tag);
							tag.click();
							document.body.removeChild(tag);
						});
					}
				});
				*/
			});

		});
		return;
	};

	window.getDigits = (i) => {
		let L = 0;
		while (i >= 1) {
			i = i / 10;
			L += 1;
		}
		return `${L}`;
	};

	window.loadAsArrayBuffer = (url, callback) => {
		let xhr = new XMLHttpRequest();
		xhr.open("GET", url);
		xhr.responseType = "arraybuffer";
		xhr.onerror = function (error) {
			console.log(`error`)
		};
		xhr.onload = function () {
			if (xhr.status === 200) {
				callback(xhr.response, url)
			} else {
				console.log(`error`)
			}
		};
		xhr.send();
	};

	window.getImg = (event) => {
		let srcArr = [];
		let dataCont = 0;
		var downloadB = ($(event.target).is("button")) ? $(event.target) : $(event.target).closest("button");
		downloadB.addClass(['active', 'hdr']);
		downloadB.find('i').removeClass('fa-download').addClass('fa-download2');
		downloadB.find('span').text(`擷取連結中`);
		$($(event.target).closest('div.content-block').find('div.image-thumbnails')[0]).find('img').each((i, img) => {
			let src = $(img).attr('src');
			let id = /file\/\d+\//g.exec(src);
			if (id[0] != null) {
				srcArr.push(`https://fantia.jp/posts/SRC/post_content_photo/SRC`.replaceAll(`SRC`, /\d+/.exec(id)[0]));
			}
		});
		downloadB.find('span').text(`${dataCont} / ${srcArr.length}`);

		let imageDownloader = new DownloadImage(downloadB, srcArr);
		imageDownloader.startDownloadAll();

		return;
	};

	class DownloadImage{
		constructor(downloadButton, urls) {
			this.urlArray = urls;
			this.l = urls.length;
			this.saveObj = {};
			this.count = 0;
			this.downloadB = downloadButton;
			this.digits = DownloadImage.getDigits(Number(this.l));
			this.zip = new JSZip();
			return this;
		}

		static getDigits(i){
			let L = 0;
			while (i >= 1) {
				i = i / 10;
				L += 1;
			}
			return `${L}`;
		}

		startDownloadAll() {
			let self = this;
			this.urlArray.forEach((url, i) => {
				console.log(url)
				$.get(url, function (data) {
					let div = document.createElement("div");
					$(div).html(data);
					$(div).find('img').attr("id", `${i}_img`);
					let imgSRC = $(div).find('img').attr("src");
				//	$(div).remove();
					console.log(imgSRC)
				//	startDownload(url);
				/*
					console.log($(div).find('img')[0])
					let img = $(div).find('img')[0];
					self.downloadedImg = img;
					img.onload = self.imageReceived(self, i)
					self.imageReceived($(div).find('img')[0], i);
				*/
				
					var downloadedImg = new Image();
					self.saveObj[i] = downloadedImg;
					downloadedImg.crossOrigin = "Anonymous";
					function imageReceived() {
						let canvas = document.createElement("canvas");
						let context = canvas.getContext("2d");
						console.log(downloadedImg)
						console.log(downloadedImg.width)
						canvas.width = downloadedImg.width;
						canvas.height = downloadedImg.height;

						context.drawImage(downloadedImg, 0, 0);

						try {
							//	localStorage.setItem("saved-image-example", canvas.toDataURL("image/png"));
							let imgData = canvas.toDataURL("image/jpeg");
							console.log("AAAAAA", imgData);
							self.zip.file(`${i.toString().padStart(self.l.digits, 0)}.jpg`, imgData.split('base64,')[1], {
								base64: true
							});
							self.count += 1;
							if (self.count == self.l) {
								self.downloadImg();
							}
						} catch (err) {
							console.log("Error: " + err);
						}
					}
					downloadedImg.onload = imageReceived();
					let rand = '?' + Math.random();
					downloadedImg.src = `${imgSRC}${rand}`;
					document.body.appendChild(downloadedImg)
				});
			});
		}

		imageReceived_(img, name) {
			let canvas = document.createElement("canvas");
			document.body.appendChild(canvas)
			let context = canvas.getContext("2d");
			console.log(img)
			console.log(img.width)
			canvas.width = 1000;
			canvas.height = 1000;

			context.drawImage(img, 0, 0);

			try {
				console.log(canvas.toDataURL("image/jpeg"))
				let imgData = canvas.toDataURL("image/jpeg");
				console.log("AAAAAA", imgData);
				this.zip.file(`${name.toString().padStart(this.l.digits, 0)}.jpg`, imgData.split('base64,')[1], {
					base64: true
				});
				this.count += 1;
				if (this.count == this.l) {
					this.downloadImg();
				}
			} catch (err) {
				console.log("Error: " + err);
			}
		}

		downloadImg(){
			let self = this;
			this.downloadB.find('span').text(`壓縮檔案中`);
			this.zip.generateAsync({
				type: "blob"
			}).then(function (content) {
				self.downloadB.find('i').removeClass('fa-download2').addClass('fa-download');
				self.downloadB.removeClass(['active', 'hdr']);
				self.downloadB.find('span').text(`下載已完成`);
				let tag = document.createElement('a');
				tag.href = (URL || webkitURL).createObjectURL(content);
				tag.download = `${$("h1.post-title").text()}_${self.downloadB.closest("div.post-content-inner").find('h2').text()}`;
				document.body.appendChild(tag);
				tag.click();
				document.body.removeChild(tag);
			});
		}

		/*
		startDownload(imageURL) {
			this.downloadedImg = new Image();
			this.downloadedImg.crossOrigin = "Anonymous";
			this.downloadedImg.addEventListener("load", this.imageReceived(i), false);
			this.downloadedImg.src = imageURL;
		}
		*/
	}
/*
	var downloadedImg_ = '';

	window.startDownload = (url) => {
		let imageURL = url;

		downloadedImg_ = new Image;
		downloadedImg_.crossOrigin = "Anonymous";
		downloadedImg_.addEventListener("load", imageReceived, false);
		downloadedImg_.src = imageURL;
	};

	window.imageReceived = () => {
		let canvas = document.createElement("canvas");
		let context = canvas.getContext("2d");

		canvas.width = downloadedImg_.width;
		canvas.height = downloadedImg_.height;

		context.drawImage(downloadedImg_, 0, 0);

		try {
			//localStorage.setItem("saved-image-example", canvas.toDataURL("image/png"));
			console.log(canvas.toDataURL("image/png"));
		} catch (err) {
			console.log("Error: " + err);
		}
	};
*/
})();
