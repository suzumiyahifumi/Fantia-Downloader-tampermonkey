/* jshint esversion: 9 */
// ==UserScript==
// @name         Fantia downloader
// @name:en      Fantia downloader
// @name:ja      Fantia downloader
// @namespace    http://tampermonkey.net/
// @version      3.1.8
// @description  Download your Fantia rewards more easily!
// @description:en  Download your Fantia rewards more easily!
// @description:ja  Download your Fantia rewards more easily!
// @author       suzumiyahifumi
// @include        https://fantia.jp/posts/*
// @include        https://fantia.jp/fanclubs/*/backnumbers*
// @icon         https://www.google.com/s2/favicons?domain=fantia.jp
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.0/jszip.min.js
// @grant        none
// ==/UserScript==

//log: 3.1.5 remove jQuery inject
(function () {
	'use strict';

	Date.prototype.Format = function (fmt) {
		let o = {
			"M+": this.getMonth() + 1,
			"d+": this.getDate(),
			"h+": this.getHours(),
			"m+": this.getMinutes(),
			"s+": this.getSeconds(),
			"q+": Math.floor((this.getMonth() + 3) / 3),
			"S": this.getMilliseconds()
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (let k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	};

	$('head').append(`<style type="text/css">
    .fa-download2::before{
        content: "\\f021"
    }
    .hdr{ pointer-events: none; }
	.titleImage{
		background-image: url("data:image/png;base64,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");
		background-repeat: no-repeat;
		background-position: center;
		background-size: 200px;
	}
	#settingCenter{
		position: fixed;
		z-index: 9999;
		width: 50px;
		height: 50px;
		left: 50px;
		top: calc(100vh - 100px);
		border-style: solid;
		border-color: #c3c3c345;
		border-width: thin;
		border-radius: 50px;
		color: #c3c3c345;
		padding: 10px 20px;
		cursor: pointer;
		transition: border-color 0.8s;
		transition: box-shadow 0.5s;
		box-shadow: 0 0 10px #000;
		font-size: 3em;
		backdrop-filter: blur(5px);
		background-image: url("data:image/svg+xml;charset=UTF-8,<svg enable-background='new 0 0 24 24' height='512' viewBox='0 0 24 24' width='512' xmlns='http://www.w3.org/2000/svg'><path d='m22.683 9.394-1.88-.239c-.155-.477-.346-.937-.569-1.374l1.161-1.495c.47-.605.415-1.459-.122-1.979l-1.575-1.575c-.525-.542-1.379-.596-1.985-.127l-1.493 1.161c-.437-.223-.897-.414-1.375-.569l-.239-1.877c-.09-.753-.729-1.32-1.486-1.32h-2.24c-.757 0-1.396.567-1.486 1.317l-.239 1.88c-.478.155-.938.345-1.375.569l-1.494-1.161c-.604-.469-1.458-.415-1.979.122l-1.575 1.574c-.542.526-.597 1.38-.127 1.986l1.161 1.494c-.224.437-.414.897-.569 1.374l-1.877.239c-.753.09-1.32.729-1.32 1.486v2.24c0 .757.567 1.396 1.317 1.486l1.88.239c.155.477.346.937.569 1.374l-1.161 1.495c-.47.605-.415 1.459.122 1.979l1.575 1.575c.526.541 1.379.595 1.985.126l1.494-1.161c.437.224.897.415 1.374.569l.239 1.876c.09.755.729 1.322 1.486 1.322h2.24c.757 0 1.396-.567 1.486-1.317l.239-1.88c.477-.155.937-.346 1.374-.569l1.495 1.161c.605.47 1.459.415 1.979-.122l1.575-1.575c.542-.526.597-1.379.127-1.985l-1.161-1.494c.224-.437.415-.897.569-1.374l1.876-.239c.753-.09 1.32-.729 1.32-1.486v-2.24c.001-.757-.566-1.396-1.316-1.486zm-10.683 7.606c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z'/></svg>");
		background-size: 30px;
		background-repeat: no-repeat;
		background-position: center;
	}
	#settingCenter:hover{
		border-color: #c3c3c370;
		color: #c3c3c370;
		box-shadow: 0px 0px 20px #000;
	}
	#settingCenter:active{
		border-color: #fe7070;
		color: #fe7070;
	}

	#settingCenter:after {
		content: '';
		display: block;
		position: absolute;
		width: 50px;
		height: 50px;
		top: 0;
		left: 0;
		border-radius: 50px;
		pointer-events: none;
		background-image: radial-gradient(circle, #fe7070 10%, transparent 10.01%);
		background-repeat: no-repeat;
		background-position: 50%;
		transform: scale(10, 10);
		opacity: 0;
		transition: transform .5s, opacity .5s;
	}

	#settingCenter:active:after {
		transform: scale(0, 0);
		opacity: .3;
		transition: 0s;
	}

	.close {
		display: none;
	}

	.unBlur {
		background-color: #adadaded !important;
		backdrop-filter: blur(0px) !important;
	}

	#settingCenterDiv{
		position: fixed;
		z-index: 9999;
		width: 500px;
		height: 90vh;
		left: calc(50vw - 250px);
		top: 5vh;
		background-color: #9090907d;
		border-radius: 15px;
		backdrop-filter: blur(15px);
		box-shadow: 0 0 10px #000;
		text-align: center;
		margin: 0 auto;
		overflow: auto;
		min-height: 450px;
	}

	.settingCenterButton:hover {
		border-bottom-style: groove;
		border-bottom-color: #fff;
	}
	.settingCenterButton:active {
		border-bottom-style: none;
		border-bottom-color: #fff0;
	}

	#cookieOn:checked ~ #cookieOnLabel {
  		background-color: #fff;
	}
	#cookieOff:checked ~ #cookieOffLabel {
  		background-color: #fff;
	}
	#generalSave:checked ~ #generalSaveLabel {
  		background-color: #fff;
	}
	#authorSave:checked ~ #authorSaveLabel {
  		background-color: #fff;
	}

	#paramsTable table {
		width: 100%;
		height: 100%;
	}
	#paramsTable th{
		text-align: center;
	}
	#paramsTable table, #paramsTable td {
		border: 1px solid #fff0;
	}

	#paramsTable thead, #paramsTable tfoot {
		background-color: #fff0;
		color: #fff;
	}

    </style>`);

	$('nav.scroll-tabs>div').append(`<a id="set" class="tab-item tab-item-text set-FD" style="cursor: pointer;" onclick="JAVASCRIPT:getDownLoadButton()">擷取下載</a>`);

	let init = setInterval(() => {
		let pageType = (window.location.href.match(/https:\/\/fantia\.jp\/posts\/*/g) != null) ? `post` : `backnumber`;
		let post = (pageType == "backnumber") ? 1 : $(`.the-post`).length;
		if (window.setting) {
			var postContent = (window.setting.metaData.content == undefined || window.setting.metaData.content.length == 0) ? true : false;
		} else {
			window.setting = new Setting();
		}
		if (($(`div[id^='post-content-id-']`).length != 0 || postContent) && post != 0) {

			// for nonImgbox
			$(`div.image-thumbnails`).each((i, div) => {
				let b = $(div).closest('div.content-block').find(`div.text-center > div.btn-group-tabs`);
				if (b.length == 0) $(div).before(`<div ng-if="$ctrl.isVisibleAndMulti()" class="ng-scope"><div class="text-center"><div class="btn-group btn-group-tabs mb-20" role="group"></div></div></div>`);
			});

			// for single image
			$(`a.fantiaImage`).each((i, div) => {
				$(div).before(`<div ng-if="$ctrl.isVisibleAndMulti()" class="ng-scope blogBox" blog-img-index="${$(div).attr("data-id")}"><div class="text-center"><div class="btn-group btn-group-tabs mb-20" role="group"></div></div></div>`);
			});
			// for post
			$(`.the-post .post-thumbnail .img-default`).closest(`div.post-thumbnail`).before(`<div ng-if="$ctrl.isVisibleAndMulti()" class="ng-scope"><div class="text-center"><div class="btn-group btn-group-tabs mb-20" role="group"></div></div></div>`);
			window.getDownLoadButton();
			clearInterval(init);
		}
	}, 500);

	class Setting {
		constructor() {

			this.pageType = (window.location.href.match(/https:\/\/fantia\.jp\/posts\/*/g) != null) ? `post` : `backnumber`;
			let qs = new URLSearchParams((this.pageType == `post`) ? `` : (window.location.search == ``) ? $(`div.text-center>a.active`).attr("href").split("?")[1] : window.location.search);
			this.jsonUrl = `https://fantia.jp/api/v1/${(this.pageType == `post`) ? `posts/${window.location.href.split("/").pop()}` : `fanclub/backnumbers/monthly_contents/plan/${qs.get("plan")}/month/${qs.get("month")}`}`;

			let authorId = $("h1.fanclub-name>a").attr(`href`).split("/").pop();

			const keyArr = [`cookieSave`, `lang`, `authorId_${authorId}`, `generalSaveZIP`, `generalSaveFile`, `authorSaveZIP_${authorId}`, `authorSaveFile_${authorId}`, `dateFormat`];
			this.cookieOri = document.cookie;
			this.cookie = this.cookieParser(keyArr);
			this.cookieSave = this.cookie.cookieSave || this.defaultCookie(`cookieSave`);

			this.setCookie({
				cookieSave: this.cookieSave,
				lang: (this.cookieSave == `On`) ? this.cookie.lang : this.getOriLang(),
				generalSave: this.defaultCookie(`generalSave`),
				authorSave: this.defaultCookie(`authorSave`),
				authorSaveCheck: this.cookie[`authorId_${authorId}`] || this.defaultCookie(`authorSaveCheck`),
				authorId: authorId,
				dateFormat: (this.cookieSave == `On`) ? this.cookie.dateFormat : this.defaultCookie(`dateFormat`)
			});
			if (this.cookieSave == `On`) {
				let g = this.cookieParser([`generalSaveZIP`, `generalSaveFile`]);
				this.setCookie({
					generalSave: {
						zipName: g.generalSaveZIP,
						fileName: g.generalSaveFile
					}
				});
				if (this.cookie[`authorId_${authorId}`] || this.cookie[`authorId_${authorId}`] == `On`) {
					let a = this.cookieParser([`authorSaveZIP_${authorId}`, `authorSaveFile_${authorId}`]);
					this[`authorId_${authorId}`] = `On`;
					this.setCookie({
						authorSaveCheck: `On`,
						authorSave: {
							zipName: a[`authorSaveZIP_${authorId}`],
							fileName: a[`authorSaveFile_${authorId}`]
						}
					});
				}
			}
			this.saveCookie(false);

			this.metaJson = {};
			this.metaData = {};

			if (window.csrfToken) {
				$.ajaxSetup({
					headers: {
						"x-csrf-token": window.csrfToken
					}
				});
			}
			let self = this;
			$.get(this.jsonUrl, (json) => {
				self.metaJson = json;
				let data = json[self.pageType];
				self.metaData = {
					user: data.fanclub.creator_name,
					uid: data.fanclub.id,
					content: data[`${self.pageType}_contents`]
				};
			});
			return this;
		}

		saveCookie(check) {
			if (this.cookie.cookieSave == 'On') {
				let date = new Date();
				date.setDate(date.getDate() + 75);
				let cookie = {
					cookieSave: this.cookie.cookieSave,
					lang: this.cookie.lang,
					dateFormat: this.cookie.dateFormat,
					Expires: date.toUTCString()
				};
				cookie.generalSaveZIP = this.cookie.generalSave.zipName;
				cookie.generalSaveFile = this.cookie.generalSave.fileName;
				if (this[`authorId_${this.authorId}`] == 'On') {
					cookie[`authorId_${this.authorId}`] = 'On';
					cookie[`authorSaveZIP_${this.authorId}`] = this.cookie.authorSave.zipName;
					cookie[`authorSaveFile_${this.authorId}`] = this.cookie.authorSave.fileName;
				}
				this.updateCookie(cookie);
			} else {
				let date = new Date();
				date.setDate(date.getTime() - 1);
				let cookie = {
					cookieSave: 'Off',
					Expires: date.toUTCString()
				};
				cookie[`authorId_${this.authorId}`] = 'Off';
				this.updateCookie(cookie);
			}
			return (check != false) ? alert(this.getDefault(`saveMessage`, this.lang)) : true;
		}

		updateCookie(cookie = undefined) {
			let Expires = cookie.Expires;
			delete cookie.Expires;
			for (let [key, value] of Object.entries(cookie)) {
				document.cookie = `${key}=${value}; Expires=${Expires}; Path=/`;
			}
			this.cookieOri = document.cookie;
			return this.cookieOri;
		}

		cookieParser(keyArr) {
			return (typeof keyArr == `string`) ? document.cookie.split('; ').map(row => row.split('=')).filter(row => keyArr == row[0])[1] || undefined : Object.fromEntries(document.cookie.split('; ').map(row => row.split('=')).filter(row => keyArr.includes(row[0])));
		}

		setCookie(settingObj) {
			for (let [key, value] of Object.entries(settingObj)) {
				this.cookie[key] = value;
				this[key] = value;
			}
			return this.cookie;
		}

		setLang(Lang) {
			let lang = Lang || this.getOriLang().toLowerCase();
			if (/^ja\b/.test(lang)) this.lang = `ja`;
			if (/^zh\b/.test(lang)) this.lang = `zh`;
			return this.lang;
		}

		getOriLang() {
			let res = `en`;
			let lang = (navigator.language || navigator.browserLanguage).toLowerCase();
			if (/^ja\b/.test(lang)) res = `ja`;
			if (/^zh\b/.test(lang)) res = `zh`;
			return res;
		}

		defaultCookie(key) {
			let defaultSetting = {
				cookieSave: "Off",
				lang: this.getOriLang(),
				generalSave: {
					zipName: `{postTitle}_{boxTitle}`,
					fileName: `{imgIndex:0}`
				},
				authorSave: {
					zipName: `[{user}]{postTitle}_{boxTitle}`,
					fileName: `{boxTitle}_{imgIndex:0}`
				},
				authorSaveCheck: `Off`,
				dateFormat: `yyyyMMdd`
			};
			return (key) ? defaultSetting[key] : defaultSetting;
		}

		getDefault(key, lang = undefined) {
			let defaultSetting = {
				en: {
					downloadImg: `Download Images`,
					downloadImgZip: `Download ZIP`,
					retrieving: `Retrieving Link`,
					zipping: `Zipping`,
					processing: `Processing`,
					done: `Done`,
					// 按紐
					settingCenter: `Setting`,
					cookieButton: `Cookie`,
					languageButton: `言語設定／Language／界面語言`,
					generalSave: `Global Save`,
					authorSave: `Author Save`,
					zipName: `ZIP file name`,
					fileName: `image file name`,
					dateFormat: `Date Format`,
					saveSetting: `Apply Setting`,
					closeSetting: `Close`,
					tableParams: `Parameter`,
					tableMean: `Mean`,
					saveMessage: `Setting has save!`,
					// 參數
					user: `Creator Name`,
					uid: `Creator ID`,
					postTitle: `Post Title`,
					postId: `Post ID`,
					boxTitle: `Image Box Title`,
					"imgIndex:0": `Index for image, Number is first index number.`,
					plan: `Name of Plan`,
					fee: `fee of Plan`,
					postDate: `Post Date`,
					taskDate: `Download Date`,
					ext: `Filename Extension`
				},
				ja: {
					downloadImg: `ダウンロード`,
					downloadImgZip: `ZIPダウンロード`,
					retrieving: `取得中`,
					zipping: `zip圧縮`,
					processing: `圧縮`,
					done: `ダウンロード完了`,
					// 按紐
					settingCenter: `設定`,
					cookieButton: `Cookie`,
					languageButton: `Language／言語設定／界面語言`,
					generalSave: `保存の設定`,
					authorSave: `クリエイターに保存`,
					zipName: `ZIPフォルダ`,
					fileName: `ファイル`,
					dateFormat: `日時の設定`,
					saveSetting: `設定を保存する`,
					closeSetting: `閉じる`,
					tableParams: `パラメータ`,
					tableMean: `効果`,
					saveMessage: `設定を保存しました！`,
					// 參數
					user: `クリエイターの名前`,
					uid: `クリエイターのID`,
					postTitle: `投稿のタイトル`,
					postId: `投稿のID`,
					boxTitle: `イラストボックスのタイトル`,
					"imgIndex:0": `画像のインデックス、番号は最初のインデックス番号です`,
					plan: `プラン名`,
					fee: `プランの月額料金`,
					postDate: `公開日時`,
					taskDate: `ダウンロード日時`,
					ext: `拡張子`
				},
				zh: {
					downloadImg: `全圖片下載`,
					downloadImgZip: `ZIP 下載`,
					retrieving: `擷取連結中`,
					zipping: `壓縮檔案中`,
					processing: `壓縮`,
					done: `下載已完成`,
					// 按紐
					settingCenter: `設定`,
					cookieButton: `Cookie`,
					languageButton: `Language／界面語言／言語設定`,
					generalSave: `全域設定`,
					authorSave: `作者特訂`,
					zipName: `壓縮檔檔名`,
					fileName: `圖片檔檔名`,
					dateFormat: `日期時間格式`,
					saveSetting: `儲存設定`,
					closeSetting: `關閉`,
					tableParams: `參數`,
					tableMean: `效果`,
					saveMessage: `設定已儲存！`,
					// 參數
					user: `創作者名稱`,
					uid: `創作者 ID`,
					postTitle: `投稿標題`,
					postId: `投稿 ID`,
					boxTitle: `圖片區標題`,
					"imgIndex:0": `檔案排序號，數字決定起始數字`,
					plan: `訂閱方案名`,
					fee: `瀏覽月費`,
					postDate: `投稿日期`,
					taskDate: `下載日期`,
					ext: `檔案副檔名`
				}
			};
			return (key) ? defaultSetting[lang || this.lang][key] : defaultSetting[lang || this.lang];
		}

		renderSettingParams() {
			$(`#cookie${this.cookieSave}`).attr("checked", true);
			$(`#${(this.authorSaveCheck == `On`) ? `authorSave` : `generalSave`}`).attr("checked", true);
			$(`#selectSetting option[value='${this.lang}']`).attr("selected", true);
			$(`#zipNameInput`).val(this[(this.authorSaveCheck == `On`) ? `authorSave` : `generalSave`].zipName);
			$(`#fileNameInput`).val(this[(this.authorSaveCheck == `On`) ? `authorSave` : `generalSave`].fileName);
			$(`#dateFormatInput`).val(this.dateFormat);
			$(`#paramsTable`).html(this.paramsTemplate(this.lang));
			return this;
		}

		changeStyle(mode) {
			let blur = CSS.supports(`backdrop-filter`, `blur(15px)`);
			switch (mode) {
				case `Blur`:

					return;
				case `unBlur`:
					return;
				default:
					return;
			}
		}

		changeLang(Lang) {
			let lang = Lang || $("#selectSetting option:selected").val();
			this.setCookie({
				lang: lang
			});
			$("#titleSetting").text(this.getDefault(`settingCenter`, lang));
			$("#cookieSetting").text(this.getDefault(`cookieButton`, lang));
			$("#langSetting").text(this.getDefault(`languageButton`, lang));
			$("#generalSaveSetting").text(this.getDefault(`generalSave`, lang));
			$("#authorSaveSetting").text(this.getDefault(`authorSave`, lang));
			$("#zipNameSetting").text(this.getDefault(`zipName`, lang));
			$("#fileNameSetting").text(this.getDefault(`fileName`, lang));
			$("#dateFormatSetting").text(this.getDefault(`dateFormat`, lang));
			$("#saveSetting").text(this.getDefault(`saveSetting`, lang));
			$("#closeSetting").text(this.getDefault(`closeSetting`, lang));
			$(".downloadSpan").text(this.getDefault('downloadImg', lang));
			$(".downloadSpanZip").text(this.getDefault('downloadImgZip', lang));
			$("#paramsTable").html(this.paramsTemplate(this.lang));
			return;
		}

		changeName(type) {
			let name = $(`#${type}NameInput`).val();
			let setting = $(`input[name='saveCheck']:checked`).attr("id");
			if (name == ``) {
				this.changeSaveSetting(setting);
			} else {
				this[setting][`${type}Name`] = name;
			}
			return;
		}

		changeSaveSetting(id) {
			let setting = this[id];
			$(`#zipNameInput`).val(setting.zipName);
			$(`#zipNameInput`).attr("placeholder", setting.zipName);
			$(`#fileNameInput`).val(setting.fileName);
			$(`#fileNameInput`).attr("placeholder", setting.fileName);
			return;
		}

		paramsTemplate(lang = this.lang) {
			let table = `<table><tbody><tr style="text-align:center;">
							<th>${setting.getDefault(`tableParams`, lang)}</th>
							<th>${setting.getDefault(`tableMean`, lang)}</th>
						</tr>`;
			let a = [`user`, `uid`, `postTitle`, `postId`, `boxTitle`, `imgIndex:0`, `plan`, `fee`, `postDate`, `taskDate`, `ext`].forEach((p, i) => {
				table += `<tr style="background-color: ${(i % 2 == 0) ? `#71b6ff2b` : `#fff0`};">
							<td style="border-right: 1px solid #131313;">{${p}}</td>
							<td style="border-left: 1px solid #131313;">${setting.getDefault(p, lang)}</td>
						</tr>`;
			});

			table += `</tbody></table>`;

			return table;
		}

		settingCenterTemplate(lang) {
			return `<div id="settingCenterDiv" class="close ${(CSS.supports(`backdrop-filter`, `blur(15px)`)) ? `` : `unBlur`}">
	<div class="settingTitleColor" style="width: 100%;height: 25px;position: relative;background-color: #ffffff78;display: flex;align-items: center;">
		<p id="titleSetting" style="margin: 0 auto;">${this.getDefault(`settingCenter`, lang)}</p>
	</div>
	<div class="titleImage" onclick="location.href = 'https://github.com/suzumiyahifumi/Fantia-Downloader-tampermonkey'" style="width: 100%;height: 55px;background-color: #ffffff78;position: relative;margin: 0 auto;cursor: pointer;border-top-style: solid;border-top-color: #757575;border-top-width: 1px;border-bottom-left-radius: 10px;border-bottom-right-radius: 10px;"></div>
	<div style="width: 95%;height: 2.5em;background-color: #fff0;margin: 10px auto;position: relative;border-radius: 5px;">
		<div class="settingTitleColor" style="width: calc(50% - 1px);height: 100%;background-color: #ffffff69;border-top-left-radius: 5px;border-bottom-left-radius: 5px;float: left;display: flex;align-items: center;margin: 0 1px 0 auto;">
			<p id="cookieSetting" style="margin: 0 auto;">${this.getDefault(`cookieButton`, lang)}</p>
		</div>
		<div class="settingTitleColor" style="width: calc(50% - 1px);height: 100%;background-color: #ffffff69;border-top-right-radius: 5px;border-bottom-right-radius: 5px;float: left;position: relative;margin: 0 auto 0 1px;">
			<label style="float: left;width: 50%;height: 100%;display: flex;align-items: center;cursor: pointer;margin: auto;" for="cookieOn" id="cookieOnLabel" class="settingCenterButton"><input style="cursor: pointer;appearance: none;" type="radio" id="cookieOn" onclick="setting.setCookie({cookieSave:'On'})" name="cookieCheck">
				<div id="cookieOnLabel" style="width: 100%;height: 100%;display: flex;align-items: center;cursor: pointer;margin: auto;">
					<span style="margin: 0 auto;">On</span></div>
			</label><label style="float: left;width: 50%;height: 100%;display: flex;align-items: center;cursor: pointer;margin: auto;border-top-right-radius: 5px;border-bottom-right-radius: 5px;" for="cookieOff" id="cookieOffLabel" class="settingCenterButton"><input style="cursor: pointer;appearance: none;" type="radio" name="cookieCheck" id="cookieOff" onclick="setting.setCookie({cookieSave:'Off'})">
				<div style="width: 100%;height: 100%;display: flex;align-items: center;cursor: pointer;margin: auto;border-top-right-radius: 5px;border-bottom-right-radius: 5px;" id="cookieOffLabel"><span style="margin: 0 auto;">Off</span></div>
			</label></div>
	</div>
	<div style="width: 95%;height: 2.5em;background-color: #fff0;margin: 10px auto;position: relative;border-radius: 5px;">
		<div class="settingTitleColor" style="width: calc(50% - 1px);height: 100%;background-color: #ffffff69;border-top-left-radius: 5px;border-bottom-left-radius: 5px;float: left;display: flex;align-items: center;margin: 0 1px 0 auto;">
			<p id="langSetting" style="margin: 0 auto;">${this.getDefault(`languageButton`, lang)}</p>
		</div>
		<div class="settingCenterButton" style="width: calc(50% - 1px);height: 100%;background-color: #77777769;border-top-right-radius: 5px;border-bottom-right-radius: 5px;border-left-color: #c8c8c800;border-left-width: 1px;border-left-style: solid;float: left;position: relative;margin: 0 auto 0 1px;">
			<select id="selectSetting" onchange="setting.changeLang()" style="height: 100%;border-style: hidden;border-top-right-radius: 5px;border-bottom-right-radius: 5px;width: 100%;background-color: #fff;cursor: pointer;text-align: center;text-align-last: center;-webkit-appearance: none;-moz-appearance: none;" name="lang">
				<option value="zh">中文</option>
				<option value="en">English</option>
				<option value="ja">日本語</option>
			</select></div>
	</div>
	<div style="width: 95%;height: calc(100% - 80px - 50px - 7.5em);background-color: #fff0;margin: 10px auto;position: relative;border-radius: 5px;">
		<div class="settingTitleColor" style="width: calc(50% - 1px);height: 2.5em;background-color: #ffffff69;border-top-left-radius: 5px;float: left;display: flex;align-items: center;cursor: pointer;margin: 0 1px 1px 0;/*! border-bottom-style: groove; *//*! border-bottom-color: #fff; */">
			<label style="float: left;width: 100%;height: 100%;display: flex;align-items: center;cursor: pointer;margin: auto;" for="generalSave" class="settingCenterButton"><input style="cursor: pointer;appearance: none;" type="radio" id="generalSave" name="saveCheck">
				<div style="width: 100%;height: 100%;display: flex;align-items: center;cursor: pointer;margin: auto;border-top-left-radius: 5px;" id="generalSaveLabel" onclick="setting.changeSaveSetting('generalSave');setting.setCookie({authorSaveCheck:'Off', authorId_${this.authorId}: 'Off'})"><span id="generalSaveSetting" style="margin: 0 auto;">${this.getDefault(`generalSave`, lang)}</span></div>
			</label></div>
		<div class="settingTitleColor" style="width: calc(50% - 1px);height: 2.5em;background-color: #ffffff69;border-top-right-radius: 5px;float: left;display: flex;align-items: center;position: relative;cursor: pointer;margin: 0 0 1px 1px;">
			<label style="float: left;width: 100%;height: 100%;display: flex;align-items: center;cursor: pointer;margin: auto;" for="authorSave" class="settingCenterButton"><input style="cursor: pointer;appearance: none;" type="radio" name="saveCheck" id="authorSave">
				<div style="width: 100%;height: 100%;display: flex;align-items: center;cursor: pointer;margin: auto;border-top-right-radius: 5px;" id="authorSaveLabel" onclick="setting.changeSaveSetting('authorSave');setting.setCookie({authorSaveCheck:'On', authorId_${this.authorId}: 'On'})"><span id="authorSaveSetting" style="margin: 0 auto;">${this.getDefault(`authorSave`, lang)}</span></div>
			</label></div>
		<div class="settingTitleColor" style="width: calc(25% - 1px);height: 2.5em;float: left;display: flex;align-items: center;position: relative;background-color: #ffffff69;margin: 1px 1px 1px 0;">
			<p id="zipNameSetting" style="margin: 0 auto;">${this.getDefault(`zipName`, lang)}</p>
		</div>
		<div class="settingTitleColor" style="width: calc(60% - 1px);height: 2.5em;background-color: #ffffff69;float: left;display: flex;align-items: center;position: relative;cursor: pointer;margin: 1px 1px 1px 1px;">
			<input id="zipNameInput" onchange="setting.changeName('zip')" placeholder="{postTitle}_{boxTitle}" style="margin: 0 auto;background: #ffffff2e;width: 95%;border-style: none;padding: 0.2em;">
		</div>
		<div class="settingTitleColor" style="width: calc(15% - 2px);height: 2.5em;background-color: #ffffff69;float: left;display: flex;align-items: center;position: relative;margin: 1px auto 1px 1px;">
			<p style="margin: 0 auto;">.zip</p>
		</div>
		<div class="settingTitleColor" style="width: calc(25% - 1px);height: 2.5em;float: left;display: flex;align-items: center;position: relative;background-color: #ffffff69;margin: 1px 1px 1px auto;">
			<p id="fileNameSetting" style="margin: 0 auto;">${this.getDefault(`fileName`, lang)}</p>
		</div>
		<div class="settingTitleColor" style="width: calc(60% - 1px);height: 2.5em;background-color: #ffffff69;float: left;display: flex;align-items: center;position: relative;cursor: pointer;margin: 1px 1px 1px 1px;">
			<input id="fileNameInput" onchange="setting.changeName('file')" placeholder="{imgIndex:0}" style="margin: 0 auto;background: #ffffff2e;width: 95%;border-style: none;padding: 0.2em;">
		</div>
		<div class="settingTitleColor" style="width: calc(15% - 2px);height: 2.5em;background-color: #ffffff69;float: left;display: flex;align-items: center;position: relative;margin: 1px auto 1px 1px;">
			<p style="margin: 0 auto;">.{ext}</p>
		</div>
		<div class="settingTitleColor" style="width: calc(50% - 1px);height: 2.5em;float: left;display: flex;align-items: center;position: relative;background-color: #ffffff69;margin: 1px 1px 1px 0;">
			<p id="dateFormatSetting" style="margin: 0 auto;">${this.getDefault(`dateFormat`, lang)}</p>
		</div>
		<div class="settingTitleColor" style="width: calc(50% - 1px);height: 2.5em;background-color: #ffffff69;float: left;display: flex;align-items: center;position: relative;margin: 1px auto 1px 1px;">
			<input id="dateFormatInput" onchange="setting.setCookie({dateFormat: $('#dateFormatInput').val()})" style="margin: 0 auto;background: #ffffff2e;width: 95%;border-style: none;padding: 0.2em;text-align:center;">
		</div>
		<div id="paramsTable" class="settingTitleColor" style="width: 100%;height: calc(100% - 10em - 6px);position: relative;background-color: #ffffff69;border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;float: left;margin: 1px 0 0 0;overflow: auto;">
		</div>
	</div>
	<div class="settingTitleColor" style="width: 95%;height: 2.5em;background-color: #fff0;margin: 10px auto;position: relative;border-radius: 5px;">
		<div class="settingCenterButton" style="width: calc(65% - 5px);height: 100%;background-color: #ffffff69;border-radius: 5px;float: left;cursor: pointer;display: flex;align-items: center;margin: 0 5px 0 0;" onclick="setting.saveCookie();">
			<p id="saveSetting" style="margin: 0 auto;">${this.getDefault(`saveSetting`, lang)}</p>
		</div>
		<div class="settingCenterButton" style="width: calc(35% - 5px);height: 100%;background-color: #f65c5c9e;float: left;position: relative;border-radius: 5px;cursor: pointer;display: flex;align-items: center;margin: 0 0 0 5px;" onclick="$('#settingCenterDiv').addClass('close')">
			<p id="closeSetting" style="margin: 0 auto;">${this.getDefault(`closeSetting`, lang)}</p>
		</div>
	</div>
</div>`;
		}
	}

	class downloader {
		constructor(event) {
			this.pageType = setting.pageType;
			this.metaData = setting.metaData;
			this.button = ($(event.target).is("button")) ? $(event.target) : $(event.target).closest("button");
			this.boxType = this.button.attr("box-type");
			this.postContent = $(event.target).closest(".boxIndex");
			this.type = (this.button.hasClass(`zip`)) ? `zip` : `file`;
			this.boxIndex = this.postContent.attr("boxIndex");

			if (this.boxType == "box") {
				let content = this.metaData.content[this.boxIndex];
				let p = (content.plan == null) ? `一般公開` : undefined;
				this.metaData.category = content.category;
				this.metaData.indextype = (content.category == "blog") ? this.button.closest(".blogBox").attr("blog-img-index") : "photo_gallery";
				this.metaData.srcArr = (content.category == "blog") ? [JSON.parse(content.comment).ops.filter(i => {
					return (i.insert.fantiaImage && i.insert.fantiaImage.id == this.metaData.indextype) ? true : false
				})[0].insert.fantiaImage.original_url] : content.post_content_photos.map(img => img.url.original);
				this.metaData.fee = p || content.plan.price;
				this.metaData.plan = p || content.plan.name;
				this.metaData.postDate = content.parent_post.date;
				this.metaData.postId = content.parent_post.url.split("/").pop();
				this.metaData.postTitle = content.parent_post.title;
				this.metaData.title = content.title;
				this.metaData.d = (content.category == "photo_gallery") ? downloader.getDigits(Number(content.post_content_photos.length)) : 1;
			} else if (this.boxType == "post") {
				let p = `一般公開`;
				this.metaData.category = "post";
				this.metaData.indextype = "post";
				this.metaData.srcArr = [setting.metaJson.post.thumb.original];
				this.metaData.fee = p;
				this.metaData.plan = p;
				this.metaData.postDate = setting.metaJson.post.posted_at;
				this.metaData.postId = setting.metaJson.post.uri.show.split("/").pop();
				this.metaData.postTitle = setting.metaJson.post.title;
				this.metaData.title = setting.metaJson.post.title;
				this.metaData.d = 1;
			}
			this.zipName = `${setting[`${(setting.authorSaveCheck == 'On') ? `author` : `general`}Save`].zipName}.zip`;
			this.fileName = `${setting[`${(setting.authorSaveCheck == 'On') ? `author` : `general`}Save`].fileName}.{ext}`;
			this.dateFormat = setting.dateFormat;
			this.zipfmt = ``;
			this.zipImgIndex0 = 0;
			this.filefmt = ``;
			this.fileImgIndex0 = 0;
			this.d = this.metaData.d;

			this.zip = (this.type == `zip`) ? new JSZip() : undefined;
			return this.downloadImg();
		}

		changeButton(mode, input = false) {
			let button = this.button;
			switch (mode) {
				case `start`:
					button.addClass(['active', 'hdr']);
					if (this.type == `file`) {
						button.find('i').removeClass('fa-download');
						button.find('i').addClass('fa-spinner');
						button.find('i').addClass('fa-pulse');
					} else {
						button.find('i').removeClass('fa-file-archive-o');
						button.find('i').addClass('fa-spinner');
						button.find('i').addClass('fa-pulse');
					}
					break;
				case `catchLink`:
					button.find('span').text(setting.getDefault(`retrieving`));
					break;
				case `countTask`:
					button.find('span').text(`${this.finCount} / ${this.imgSrc.length}`);
					break;
				case `pickUp`:
					button.find('span').text(setting.getDefault(`zipping`));
					break;
				case `end`:
					if (this.type == `file`) {
						button.find('i').removeClass('fa-pulse').removeClass('fa-spinner').addClass('fa-download');
					} else {
						button.find('i').removeClass('fa-pulse').removeClass('fa-spinner').addClass('fa-file-archive-o');
					}
					button.removeClass(['active', 'hdr']);
					button.find('span').text(setting.getDefault(`done`));
					break;
				case `log`:
					button.find('span').text(input);
					break;
				default:
					return this;
			}
			return this;
		}

		paramsParser(type, fmt) {
			let o = {
				user: () => {
					return this.metaData.user || $("h1.fanclub-name>a").text();
				},
				uid: () => {
					return this.metaData.uid || this.authorId;
				},
				postTitle: () => {
					return this.metaData.postTitle || $("h1.post-title").text();
				},
				postId: () => {
					return this.metaData.postId || window.location.href.split("/").pop();
				},
				boxTitle: () => {
					return this.metaData.boxTitle || this.button.closest("div.post-content-inner").find('h2').text();
				},
				plan: () => {
					let feeStr = this.metaData.plan || this.button.closest("div.post-content-inner").find(`div.post-content-for strong.ng-binding`).text();
					let match = this.metaData.plan || feeStr.match(new RegExp(/（\d+円）以上限定$/g));
					if (match != null) return this.metaData.plan || feeStr.replace(match[0], ``);
					return this.metaData.plan || `一般公開`;
				},
				fee: () => {
					let feeStr = this.metaData.fee || this.button.closest("div.post-content-inner").find(`div.post-content-for strong.ng-binding`).text();
					let match = this.metaData.fee || feeStr.match(new RegExp(/（(\d+)円）以上限定$/g));
					if (match != null) return this.metaData.fee || RegExp.$1;
					return this.metaData.fee || `一般公開`;
				},
				postDate: () => {
					return new Date(this.metaData.postDate || $(`small.post-date>span`).text()).Format(this.dateFormat);
				},
				taskDate: () => {
					return new Date().Format(this.dateFormat);
				}
			};

			for (let k in o) {
				if (new RegExp('(\\{' + k + '\\})', 'g').test(fmt)) fmt = fmt.replace(RegExp.$1, o[k]());
			}

			let s = (/\{imgIndex(\:(\d+))?\}/g.test(fmt)) ? RegExp.$2 : 0;
			if (/\{imgIndex(\:(\d+))?\}/g.test(fmt)) fmt = fmt.replace(RegExp.$1, ``);
			this[`${type}fmt`] = fmt;
			this[`${type}ImgIndex0`] = s;
			return this;
		}

		nextName(type, index, mimeType) {
			if (this.metaData.indextype != "photo_gallery") return this[`${type}fmt`].replace(`{imgIndex}`, (this.metaData.indextype).toString().padStart(this.d, 0)).replace(`{ext}`, mimeType.toString().split(`/`)[1]);
			return this[`${type}fmt`].replace(`{imgIndex}`, (Number(index) + Number(this[`${type}ImgIndex0`])).toString().padStart(this.d, 0)).replace(`{ext}`, mimeType.toString().split(`/`)[1]);
		}

		downloadImg() {
			let dataCont = 0;
			this.paramsParser(`zip`, this.zipName);
			this.paramsParser(`file`, this.fileName);
			this.changeButton(`start`);
			this.changeButton(`catchLink`);
			this.changeButton(`log`, `${dataCont} / ${this.metaData.srcArr.length}`);
			let self = this;
			this.metaData.srcArr.forEach((url, i) => {
				downloader.loadAsArrayBuffer(url, function (imgData, mimeType, lastModified) {
					dataCont += 1;
					self.changeButton(`log`, `${dataCont} / ${self.metaData.srcArr.length}`);
					self.mimeType = mimeType;
					if (self.zip == undefined) {
						if (dataCont == self.metaData.srcArr.length) self.changeButton('end');
						let content = new Blob([imgData], {
							type: mimeType
						});
						downloader.download(content, self.nextName('file', i, mimeType));
						return;
					} else {
						const sDate = lastModified && lastModified !== '' ? new Date(lastModified) : null
						const date = sDate ? new Date(sDate.getTime() - sDate.getTimezoneOffset() * 60000) : new Date()
						self.zip.file(self.nextName('file', i, mimeType), imgData, {
							date
						});
						if (dataCont == self.metaData.srcArr.length) {
							self.changeButton(`pickUp`);
							self.zip.generateAsync({
								type: "blob"
							},
								function updateCallback(metadata) {
									self.changeButton(`log`, `${setting.getDefault(`processing`)}：${metadata.percent.toFixed(2)} %`);
								}).then(function (content) {
									self.changeButton('end');
									downloader.download(content, self.nextName('zip', 0, mimeType));
									return;
								});
						}
					}
				});
			});
		}

		static download(content, name) {
			let tag = document.createElement('a');
			tag.href = (URL || webkitURL).createObjectURL(content);
			tag.download = name;
			document.body.appendChild(tag);
			tag.click();
			document.body.removeChild(tag);
			return;
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
				return new Error(`ERROR`);
			};
			xhr.onload = function () {
				if (xhr.status === 200) {
					callback(xhr.response, xhr.getResponseHeader("Content-Type"), xhr.getResponseHeader("Last-Modified"));
				} else {
					return new Error(`ERROR`);
				}
			};
			xhr.send();
		}
	}

	window.getDownLoadButton = () => {
		$("div.post-content-inner").each((i, div) => {
			$(div).addClass("boxIndex").attr("boxIndex", i);
			$(div).find("div.btn-group-tabs").append(`<button box-type="box" class="btn btn-default btn-md downloadButton zip" onclick="getImg(event)"><i class="fa fa-file-archive-o fa-2x" style="color: #f9a63b  !important;"></i> <span class="btn-text-sub downloadSpanZip" style="color: #f9a63b  !important;">${setting.getDefault('downloadImgZip')}</span></button><button box-type="box" class="btn btn-default btn-md downloadButton file" onclick="getImg(event)"><i class="fa fa-download fa-2x" style="color: #fe7070 !important;"></i> <span class="btn-text-sub downloadSpan" style="color: #fe7070 !important;">${setting.getDefault('downloadImg')}</span></button>`);
		});
		$(`.the-post`).find("div.btn-group-tabs").append(`<button box-type="post" class="btn btn-default btn-md downloadButton zip" onclick="getImg(event)"><i class="fa fa-file-archive-o fa-2x" style="color: #f9a63b  !important;"></i> <span class="btn-text-sub downloadSpanZip" style="color: #f9a63b  !important;">${setting.getDefault('downloadImgZip')}</span></button><button box-type="post" class="btn btn-default btn-md downloadButton file" onclick="getImg(event)"><i class="fa fa-download fa-2x" style="color: #fe7070 !important;"></i> <span class="btn-text-sub downloadSpan" style="color: #fe7070 !important;">${setting.getDefault('downloadImg')}</span></button>`);
		$('.set-FD').remove();
		$("div#page").append(`<div id="settingCenter" onclick="openSettingCenter()"></div>`);
		$("div#page").append(setting.settingCenterTemplate());
		setting.renderSettingParams().paramsTemplate();
		return;
	};

	window.openSettingCenter = () => {
		if ($(`#settingCenterDiv`).hasClass(`close`)) {
			$(`#settingCenterDiv`).removeClass(`close`);
		}
		return;
	};

	window.getImg = (event) => {
		return checkBrowser(event, (event) => {
			return new downloader(event);
		});
	};

	window.checkBrowser = (event, callBack) => {
		try {
			let excludes = [];
			let ex = excludes.map(b => navigator.userAgent.indexOf(b)).filter(b => (b != -1) ? true : false);
			if (ex.length >= 1) {
				alert(`請使用 Firefox 下載圖片！\nPlease run this script on Firefox!\n
				Also you can check the new script version!`);
				return;
			} else {
				return callBack(event);
			}
		} catch (err) {
			console.log(err);
			alert(`出了些問題！你可以嘗試使用 Firefox 下載圖片！\nThere are some ERROR, You can try this script on Firefox!\n
				Also you can check the new script version!`);
			return;
		}
	};
})();
