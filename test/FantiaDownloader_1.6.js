/* jshint esversion: 9 */
// ==UserScript==
// @name         Fantia downloader
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Download your Fantia rewards more easily! 
// @author       suzumiyahifumi
// @match        https://fantia.jp/posts/*
// @icon         https://www.google.com/s2/favicons?domain=fantia.jp
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.0/jszip.min.js
// @grant        none
// ==/UserScript==

(function () {
	'use strict';

	class Downloader {
		constructor(event) {
			this.button = ($(event.target).is("button")) ? $(event.target) : $(event.target).closest("button");
			this.imgSrc = [];
			this.imgOriSrc = [];
			this.zip = new JSZip();
			this.finCount = 0;
			this.digits = 0;
			return this;
		}

		async downloadImg() {
			var self = this;
			self.imgOriSrc.forEach((url, i) => {
				FantiaDownloader.loadAsArrayBuffer.call(self, url, function (imgData) {
					self.finCount += 1;
					self.changeButton(`countTask`);
					self.zip.file(`${i.toString().padStart(self.digits, 0)}.jpg`, imgData);
					if (self.finCount == self.imgOriSrc.length) {
						return Promise.resolve(self);
					}
				});
			});
		}

		async getZip() {
			let self = this;
			this.zip.generateAsync({
				type: "blob"
			}).then(function (content) {
				self.changeButton(`end`);
				// 開始下載 ZIP
				let tag = document.createElement('a');
				tag.href = (URL || webkitURL).createObjectURL(content);
				tag.download = `${$("h1.post-title").text()}_${downloadB.closest("div.post-content-inner").find('h2').text()}`;
				document.body.appendChild(tag);
				tag.click();
				document.body.removeChild(tag);
				return Promise.resolve(true);
			});
		}

		changeButton(mode) {
			let button = this.button;
			switch (mode) {
				case `start`:
					button.addClass(['active', 'hdr']);
					button.find('i').removeClass('fa-download').addClass('fa-download2');
					break;
				case `catchLink`:
					button.find('span').text(`擷取連結中`);
					break;
				case `countTask`:
					button.find('span').text(`${this.finCount} / ${this.imgSrc.length}`);
					break;
				case `pickUp`:
					button.find('span').text(`壓縮檔案中`);
					break;
				case `end`:
					button.find('i').removeClass('fa-download2').addClass('fa-download');
					button.removeClass(['active', 'hdr']);
					button.find('span').text(`下載已完成`);
					break;
				default:
					return this;
			}
			return this;
		}

		getImageLink() {
			let self = this;
			this.changeButton(`catchLink`);
			$($(this.button).closest('div.content-block').find('div.image-thumbnails')[0]).find('img').each((i, img) => {
				let src = $(img).attr('src');
				let id = /file\/\d+\//g.exec(src);
				if (id[0] != null) {
					self.imgSrc.push(`https://fantia.jp/posts/SRC/post_content_photo/SRC`.replaceAll(`SRC`, /\d+/.exec(id)[0]));
				}
			});
			this.digits = FantiaDownloader.getDigits(this.imgSrc);
			return this;
		}

		async getImageOriginalLink() {
			var self = this;
			self.imgSrc.forEach((url, i) => {
				$.get(url, function (data) {
					let div = document.createElement("div");
					$(div).html(data);
					$(div).find('img').attr("id", `${i}_img`);
					self.imgOriSrc.push($(div).find('img').attr("src"));
					$(div).remove();
					if (self.imgOriSrc, length == self.imgSrc.length) {
						self.changeButton(`countTask`);
						return Promise.resolve(self);
					}
				});
			});
		}
	}

	class FantiaDownloader {
		constructor() {
			$('head').append(`<style type="text/css">
				.fa-download2::before{
					content: "\\f021"
				}
				.hdr{ pointer-events: none; }
			</style>`);

			$('nav.scroll-tabs>div').append(`<a id="set" class="tab-item tab-item-text" style="cursor: pointer;" onclick="JAVASCRIPT:getDownLoadButton()">擷取下載</a>`);

			var init = setInterval(() => {
				if ($('nav.post-next-prev-buttons').length != 0) {
					if ($('div.btn-group-tabs').length != 0) {
						FantiaDownloader.insertDownloadButton();
						clearInterval(init);
					} else {
						$('#set').remove();
						clearInterval(init);
					}
				}
			}, 500);
			return this;
		}

		async Downloader(event) {
			let DownloaderObj = new Downloader(event);
			await DownloaderObj.changeButton(`start`).getImageLink().getImageOriginalLink().catch();
			console.log(DownloaderObj.imgOriSrc)
			await DownloaderObj.downloadImg().catch();
			await DownloaderObj.getZip().catch();
		}

		static insertDownloadButton() {
			$('div.btn-group-tabs').each((i, div) => {
				$(div).append(`<button class="btn btn-default btn-md" onclick="(async () => {await F.Downloader(event)})()"><i class="fa fa-download fa-2x" style="color: #fe7070 !important;"></i> <span class="btn-text-sub" style="color: #fe7070 !important;">全圖片下載</span></button>`);
				$('#set').remove();
			});
			return this;
		}

		static getDigits(i) {
			let L = 0;
			while (i >= 1) {
				i = i / 10;
				L += 1;
			}
			return `${L}`;
		}

		static loadAsArrayBuffer(url, callback) {
			let xhr = new XMLHttpRequest();
			xhr.open("GET", url);
			xhr.responseType = "arraybuffer";
			xhr.onerror = function (error) {
				console.log(`error`);
			};
			xhr.onload = function () {
				if (xhr.status === 200) {
					callback(xhr.response, url);
				} else {
					console.log(`error`);
				}
			};
			xhr.send();
		}
	}

	window.D = Downloader;
	window.F = new FantiaDownloader();
})();
