/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(6);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Template {
  constructor(html) {
    const template = document.createElement('template');
    template.innerHTML = html;
    this.fragment = template.content;
  }

  clone() {
    return this.fragment.cloneNode(true);
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Template;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__reset_css__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__reset_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__reset_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__main_css__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__main_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__main_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_app_App__ = __webpack_require__(9);





const root = document.getElementById('root');
const app = new __WEBPACK_IMPORTED_MODULE_2__components_app_App__["a" /* default */]();
root.appendChild(app.render());

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(5);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"sourceMap":true,"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js??ref--1-1!../node_modules/postcss-loader/lib/index.js??ref--1-2!./reset.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js??ref--1-1!../node_modules/postcss-loader/lib/index.js??ref--1-2!./reset.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "/* http://meyerweb.com/eric/tools/css/reset/ \n   v2.0 | 20110126\n   License: none (public domain)\n*/\n\nhtml, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, img, ins, kbd, q, s, samp, small, strike, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video {\n\tmargin: 0;\n\tpadding: 0;\n\tborder: 0;\n\tfont-size: 100%;\n\tfont: inherit;\n\tvertical-align: baseline;\n}\n\n/* HTML5 display-role reset for older browsers */\n\narticle, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {\n\tdisplay: block;\n}\n\nbody {\n\tline-height: 1;\n}\n\nnav ol, nav ul {\n\tlist-style: none;\n}\n\nblockquote, q {\n\tquotes: none;\n}\n\nblockquote:before, blockquote:after, q:before, q:after {\n\tcontent: '';\n\tcontent: none;\n}\n\ntable {\n\tborder-collapse: collapse;\n\tborder-spacing: 0;\n}", "", {"version":3,"sources":["/Users/enduser/Desktop/nacho/401/travel-app/reset.css"],"names":[],"mappings":"AAAA;;;EAGE;;AAEF;CAaC,UAAU;CACV,WAAW;CACX,UAAU;CACV,gBAAgB;CAChB,cAAc;CACd,yBAAyB;CACzB;;AACD,iDAAiD;;AACjD;CAEC,eAAe;CACf;;AACD;CACC,eAAe;CACf;;AACD;CACC,iBAAiB;CACjB;;AACD;CACC,aAAa;CACb;;AACD;CAEC,YAAY;CACZ,cAAc;CACd;;AACD;CACC,0BAA0B;CAC1B,kBAAkB;CAClB","file":"reset.css","sourcesContent":["/* http://meyerweb.com/eric/tools/css/reset/ \n   v2.0 | 20110126\n   License: none (public domain)\n*/\n\nhtml, body, div, span, applet, object, iframe,\nh1, h2, h3, h4, h5, h6, p, blockquote, pre,\na, abbr, acronym, address, big, cite, code,\ndel, dfn, img, ins, kbd, q, s, samp,\nsmall, strike, sub, sup, tt, var,\nb, u, i, center,\ndl, dt, dd, ol, ul, li,\nfieldset, form, label, legend,\ntable, caption, tbody, tfoot, thead, tr, th, td,\narticle, aside, canvas, details, embed, \nfigure, figcaption, footer, header, hgroup, \nmenu, nav, output, ruby, section, summary,\ntime, mark, audio, video {\n\tmargin: 0;\n\tpadding: 0;\n\tborder: 0;\n\tfont-size: 100%;\n\tfont: inherit;\n\tvertical-align: baseline;\n}\n/* HTML5 display-role reset for older browsers */\narticle, aside, details, figcaption, figure, \nfooter, header, hgroup, menu, nav, section {\n\tdisplay: block;\n}\nbody {\n\tline-height: 1;\n}\nnav ol, nav ul {\n\tlist-style: none;\n}\nblockquote, q {\n\tquotes: none;\n}\nblockquote:before, blockquote:after,\nq:before, q:after {\n\tcontent: '';\n\tcontent: none;\n}\ntable {\n\tborder-collapse: collapse;\n\tborder-spacing: 0;\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 6 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(8);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"sourceMap":true,"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js??ref--1-1!../node_modules/postcss-loader/lib/index.js??ref--1-2!./main.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js??ref--1-1!../node_modules/postcss-loader/lib/index.js??ref--1-2!./main.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "section {\n  color: #a6deff;\n}\nhtml {height: 100%;}\nbody {\n  font-family: 'Work Sans', sans-serif;\n  font-weight: 400;\n  color: #ffffff;\n  min-height: 100%;\n}\np {\n  margin-bottom: 1.3em;\n  line-height: 1.7;\n}\n/* Font sizing from http://type-scale.com/ */\nh1, h2, h3, h4 {\n  /* margin: 1em 0 0.5em; */\n  line-height: 1.1;\n  letter-spacing: 2px;\n  text-transform: uppercase;\n  padding: 0 0 1rem 0;\n  color: #ffffff;\n  font-weight: 700;\n  font-family: 'Trirong', serif;\n}\nh1 {\n  margin-top: 0;\n  font-size: 3.598em;\n}\nh2 {font-size: 2.827em;}\nh3 {font-size: 1.999em;}\nh4 {font-size: 1.414em;}\nfigcaption, small, .font_small {font-size: 0.8em; padding: 0 0 2rem; font-weight: 500;}\n/* hide screen-reader only text. https://webaim.org/techniques/css/invisiblecontent/ */\n.clip {\n  position: absolute !important;\n  clip: rect(1px 1px 1px 1px); /* IE6, IE7 */\n  clip: rect(1px, 1px, 1px, 1px);\n}\nimg {\n  display: block;\n  width: 100%;\n  height: auto;\n}\na {\n  text-decoration: none;\n  color: #a6deff;\n  -webkit-transition: 0.3s ease all;\n  transition: 0.3s ease all;\n  padding: 0 0 3px;\n  border-bottom: 3px solid #000000;\n}\na:hover {\n  color: #a6deff;\n  border-bottom: 3px solid #a6deff;\n}\n/*  -------- Media Queries ------- */\n/* Mobile */\n@media only screen and (min-width: 320px) and (max-width: 480px) {\n  h1 {\n    margin-top: 0;\n    font-size: 2.074em;\n  }\n  \n  h2 {\n    font-size: 1.728em;\n  }\n  \n  h3 {\n    font-size: 1.44em;\n  }\n  \n  h4 {\n    font-size: 1.2em;\n  }\n}\n/* Tablet */\n@media only screen and (min-width: 480px) and (max-width: 800px) {\n  h1 {\n      font-size: 2.957em;\n  }\n\n  h2 {\n      font-size: 2.369em;\n  }\n\n  h3 {\n      font-size: 1.777em;\n  }\n\n  h4 {\n      font-size: 1.333em;\n  }\n}", "", {"version":3,"sources":["/Users/enduser/Desktop/nacho/401/travel-app/components/variables.css","/Users/enduser/Desktop/nacho/401/travel-app/main.css"],"names":[],"mappings":"AAYA;EACE,eAAe;CAChB;ACZD,MAAM,aAAa,CAAC;AAEpB;EACE,qCAAqC;EACrC,iBAAiB;EACjB,eAAc;EACd,iBAAiB;CAClB;AAED;EACE,qBAAqB;EACrB,iBAAiB;CAClB;AAED,6CAA6C;AAC7C;EACE,0BAA0B;EAC1B,iBAAiB;EACjB,oBAAoB;EACpB,0BAA0B;EAC1B,oBAAoB;EACpB,eAAc;EACd,iBAAiB;EACjB,8BAA8B;CAC/B;AAED;EACE,cAAc;EACd,mBAAmB;CACpB;AAED,IAAI,mBAAmB,CAAC;AAExB,IAAI,mBAAmB,CAAC;AAExB,IAAI,mBAAmB,CAAC;AAExB,gCAAgC,iBAAiB,CAAC,kBAAkB,CAAC,iBAAiB,CAAC;AAEvF,uFAAuF;AACvF;EACE,8BAA8B;EAC9B,4BAA4B,CAAC,cAAc;EAC3C,+BAA+B;CAChC;AAED;EACE,eAAe;EACf,YAAY;EACZ,aAAa;CACd;AAED;EACE,sBAAsB;EACtB,eAAa;EACb,kCAA0B;EAA1B,0BAA0B;EAC1B,iBAAiB;EACjB,iCAAgC;CACjC;AAED;EACE,eAAa;EACb,iCAA+B;CAChC;AAED,qCAAqC;AAErC,YAAY;AACZ;EACE;IACE,cAAc;IACd,mBAAmB;GACpB;;EAED;IACE,mBAAmB;GACpB;;EAED;IACE,kBAAkB;GACnB;;EAED;IACE,iBAAiB;GAClB;CACF;AAED,YAAY;AACZ;EACE;MACI,mBAAmB;GACtB;;EAED;MACI,mBAAmB;GACtB;;EAED;MACI,mBAAmB;GACtB;;EAED;MACI,mBAAmB;GACtB;CACF","file":"main.css","sourcesContent":["$accent: #ff8c8c;\n$link: #a6deff;\n$darklink: #007BC2;\n$lightgray: #eeeeee;\n$darkgray: #444140;\n$white: #ffffff;\n$gray: #E0E0E0;\n$black: #000000;\n\n$maxViewportSize: 1280px;\n$padding: 2rem;\n\nsection {\n  color: #a6deff;\n}","@import './components/variables.css';\n\nhtml {height: 100%;}\n\nbody {\n  font-family: 'Work Sans', sans-serif;\n  font-weight: 400;\n  color: $white;\n  min-height: 100%;\n}\n\np {\n  margin-bottom: 1.3em;\n  line-height: 1.7;\n}\n\n/* Font sizing from http://type-scale.com/ */\nh1, h2, h3, h4 {\n  /* margin: 1em 0 0.5em; */\n  line-height: 1.1;\n  letter-spacing: 2px;\n  text-transform: uppercase;\n  padding: 0 0 1rem 0;\n  color: $white;\n  font-weight: 700;\n  font-family: 'Trirong', serif;\n}\n\nh1 {\n  margin-top: 0;\n  font-size: 3.598em;\n}\n\nh2 {font-size: 2.827em;}\n\nh3 {font-size: 1.999em;}\n\nh4 {font-size: 1.414em;}\n\nfigcaption, small, .font_small {font-size: 0.8em; padding: 0 0 2rem; font-weight: 500;}\n\n/* hide screen-reader only text. https://webaim.org/techniques/css/invisiblecontent/ */\n.clip {\n  position: absolute !important;\n  clip: rect(1px 1px 1px 1px); /* IE6, IE7 */\n  clip: rect(1px, 1px, 1px, 1px);\n}\n\nimg {\n  display: block;\n  width: 100%;\n  height: auto;\n}\n\na {\n  text-decoration: none;\n  color: $link;\n  transition: 0.3s ease all;\n  padding: 0 0 3px;\n  border-bottom: 3px solid $black;\n}\n\na:hover {\n  color: $link;\n  border-bottom: 3px solid $link;\n}\n\n/*  -------- Media Queries ------- */\n\n/* Mobile */\n@media only screen and (min-width: 320px) and (max-width: 480px) {\n  h1 {\n    margin-top: 0;\n    font-size: 2.074em;\n  }\n  \n  h2 {\n    font-size: 1.728em;\n  }\n  \n  h3 {\n    font-size: 1.44em;\n  }\n  \n  h4 {\n    font-size: 1.2em;\n  }\n}\n\n/* Tablet */\n@media only screen and (min-width: 480px) and (max-width: 800px) {\n  h1 {\n      font-size: 2.957em;\n  }\n\n  h2 {\n      font-size: 2.369em;\n  }\n\n  h3 {\n      font-size: 1.777em;\n  }\n\n  h4 {\n      font-size: 1.333em;\n  }\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Template__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_html__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__app_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_css__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__app_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__header_Header__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__home_Home__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__resources_Resources__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__footer_Footer_js__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__dom__ = __webpack_require__(30);









const template = new __WEBPACK_IMPORTED_MODULE_0__Template__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__app_html___default.a);

// Hash Navigation
const map = new Map();
map.set('#home', __WEBPACK_IMPORTED_MODULE_4__home_Home__["a" /* default */]);
map.set('#resources', __WEBPACK_IMPORTED_MODULE_5__resources_Resources__["a" /* default */]);

class App {

  constructor() {
    window.onhashchange = () => {
      this.setPage();
    };
  }
  
  setPage() {
    const Component = map.get(window.location.hash) || __WEBPACK_IMPORTED_MODULE_4__home_Home__["a" /* default */];
    const component = new Component();
    Object(__WEBPACK_IMPORTED_MODULE_7__dom__["a" /* removeChildren */])(this.main);
    this.main.appendChild(component.render());
  }

  render() {
    const dom = template.clone();   
      
    dom.querySelector('header').appendChild(new __WEBPACK_IMPORTED_MODULE_3__header_Header__["a" /* default */]().render());
    dom.querySelector('footer').appendChild(new __WEBPACK_IMPORTED_MODULE_6__footer_Footer_js__["a" /* default */]().render());

    this.main = dom.querySelector('main');
    this.setPage();

    return dom;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = App;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = "<header role=\"banner\" id=\"header\"></header>\n\n<main role=\"main\" id=\"main\" class=\"content\"></main>\n\n<footer role=\"contentinfo\" id=\"footer\"></footer>";

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(12);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"sourceMap":true,"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js??ref--1-1!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!./app.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js??ref--1-1!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!./app.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "section {\n  color: #a6deff;\n}\n#root {\n  min-height: 100vh;\n  display: grid;\n  grid-template-areas:\n  \"header\"\n  \"content\"\n  \"footer\";\n  grid-template-rows: auto 1fr auto;\n}\n.maxwidth-wrap {\n  /* width: 100%; */\n  max-width: 1280px;\n  margin: 0 auto;\n}\n#header {\n  grid-area: header;\n  background: #ffffff;\n  color: #000000;\n  padding: 2rem;\n  text-align: center;\n}\n#main {\n  grid-area: content;\n  background: #000000;\n}\n#footer {\n  grid-area: footer;\n  text-align: center;\n  padding: 2rem;\n  background: #000000;\n}", "", {"version":3,"sources":["/Users/enduser/Desktop/nacho/401/variables.css","/Users/enduser/Desktop/nacho/401/travel-app/app.css"],"names":[],"mappings":"AAYA;EACE,eAAe;CAChB;ACZD;EACE,kBAAkB;EAClB,cAAc;EACd;;;WAGS;EACT,kCAAkC;CACnC;AAED;EACE,kBAAkB;EAClB,kBAA4B;EAC5B,eAAe;CAChB;AAED;EACE,kBAAkB;EAClB,oBAAmB;EACnB,eAAc;EACd,cAAkB;EAClB,mBAAmB;CACpB;AAED;EACE,mBAAmB;EACnB,oBAAmB;CACpB;AAED;EACE,kBAAkB;EAClB,mBAAmB;EACnB,cAAkB;EAClB,oBAAmB;CACpB","file":"app.css","sourcesContent":["$accent: #ff8c8c;\n$link: #a6deff;\n$darklink: #007BC2;\n$lightgray: #eeeeee;\n$darkgray: #444140;\n$white: #ffffff;\n$gray: #E0E0E0;\n$black: #000000;\n\n$maxViewportSize: 1280px;\n$padding: 2rem;\n\nsection {\n  color: #a6deff;\n}","@import '../variables.css';\n\n#root {\n  min-height: 100vh;\n  display: grid;\n  grid-template-areas:\n  \"header\"\n  \"content\"\n  \"footer\";\n  grid-template-rows: auto 1fr auto;\n}\n\n.maxwidth-wrap {\n  /* width: 100%; */\n  max-width: $maxViewportSize;\n  margin: 0 auto;\n}\n\n#header {\n  grid-area: header;\n  background: $white;\n  color: $black;\n  padding: $padding;\n  text-align: center;\n}\n\n#main {\n  grid-area: content;\n  background: $black;\n}\n\n#footer {\n  grid-area: footer;\n  text-align: center;\n  padding: $padding;\n  background: $black;\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__header_html__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__header_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__header_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__header_css__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__header_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__header_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Template__ = __webpack_require__(2);




const template = new __WEBPACK_IMPORTED_MODULE_2__Template__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__header_html___default.a);

class Header {

  render() {
    const dom = template.clone();

    return dom;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Header;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<section class=\"maxwidth-wrap header-flex\">\n  <div>\n    <a href=\"#home\" class=\"logo\" alt=\"Go to Home page\"><img class=\"logo\" src=\"" + __webpack_require__(15) + "\" alt=\"Home logo image\"></a>\n  </div>\n  <nav role=\"navigation\">\n    <ul class=\"ulist\">\n      <li><a href=\"#home\" alt=\"Go to About Iceland page\">About Iceland</a></li>\n      <li><a href=\"#resources\" alt=\"Go to Resources page\">Resources</a></li>\n    </ul>\n  </nav>\n</section>";

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIyLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MDAuNCAzOC41IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MDAuNCAzOC41OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6Izk0RDZGRjt9Cgkuc3Qxe2ZvbnQtZmFtaWx5OidEaWRvdC1JdGFsaWMnO30KCS5zdDJ7Zm9udC1zaXplOjUwLjQzNjNweDt9Cjwvc3R5bGU+CjxnPgoJPGc+CgkJPHJlY3QgeD0iMC4yIiB5PSIxMy4zIiBjbGFzcz0ic3QwIiB3aWR0aD0iMzYiIGhlaWdodD0iMTIiLz4KCTwvZz4KCTxnPgoJCTxyZWN0IHg9IjEyLjIiIHk9IjEuNCIgY2xhc3M9InN0MCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjM2Ii8+Cgk8L2c+CjwvZz4KPHRleHQgdHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgMSA0NC4yNDk1IDM3LjM1MTEpIiBjbGFzcz0ic3QxIHN0MiI+VFJBVkVMICBJQ0VMQU5EPC90ZXh0Pgo8L3N2Zz4K"

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(17);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"sourceMap":true,"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js??ref--1-1!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!./header.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js??ref--1-1!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!./header.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "section {\n  color: #a6deff;\n}\n.header-flex {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n.logo {\n  max-width: 21rem;\n}\n.logo-text {\n  font-size: 1.5rem;\n}\n.ulist {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  margin: 0;\n}\n.ulist li {\n    padding: 0 1rem;\n  }\n.ulist li a {\n      color: #000000;\n      border-bottom: 3px solid #ffffff;\n      -webkit-transition: 0.3s ease all;\n      transition: 0.3s ease all;\n    }\n.ulist li a:hover {\n      border-bottom-color: #a6deff;\n    }\nnav {\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n}\n/*  -------- Media Queries ------- */\n/* Mobile */\n@media only screen and (min-width: 320px) and (max-width: 640px) {\n  .header-flex {\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n  }\n\n  .ulist {\n    margin: 1.1rem 0 0;\n  }\n}", "", {"version":3,"sources":["/Users/enduser/Desktop/nacho/401/variables.css","/Users/enduser/Desktop/nacho/401/travel-app/header.css"],"names":[],"mappings":"AAYA;EACE,eAAe;CAChB;ACZD;EACE,qBAAc;EAAd,qBAAc;EAAd,cAAc;EACd,0BAA+B;MAA/B,uBAA+B;UAA/B,+BAA+B;EAC/B,0BAAoB;MAApB,uBAAoB;UAApB,oBAAoB;CACrB;AAED;EACE,iBAAiB;CAClB;AAED;EACE,kBAAkB;CACnB;AAED;EACE,qBAAc;EAAd,qBAAc;EAAd,cAAc;EACd,yBAAwB;MAAxB,sBAAwB;UAAxB,wBAAwB;EACxB,UAAU;CAYX;AAXC;IACE,gBAAgB;GASjB;AARC;MACE,eAAc;MACd,iCAAgC;MAChC,kCAA0B;MAA1B,0BAA0B;KAC3B;AACD;MACE,6BAA2B;KAC5B;AAIL;EACE,sBAA0B;MAA1B,mBAA0B;UAA1B,0BAA0B;CAC3B;AAED,qCAAqC;AAErC,YAAY;AACZ;EACE;IACE,6BAAuB;IAAvB,8BAAuB;QAAvB,2BAAuB;YAAvB,uBAAuB;GACxB;;EAED;IACE,mBAAmB;GACpB;CACF","file":"header.css","sourcesContent":["$accent: #ff8c8c;\n$link: #a6deff;\n$darklink: #007BC2;\n$lightgray: #eeeeee;\n$darkgray: #444140;\n$white: #ffffff;\n$gray: #E0E0E0;\n$black: #000000;\n\n$maxViewportSize: 1280px;\n$padding: 2rem;\n\nsection {\n  color: #a6deff;\n}","@import '../variables.css';\n\n.header-flex {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.logo {\n  max-width: 21rem;\n}\n\n.logo-text {\n  font-size: 1.5rem;\n}\n\n.ulist {\n  display: flex;\n  justify-content: center;\n  margin: 0;\n  li {\n    padding: 0 1rem;\n    a {\n      color: $black;\n      border-bottom: 3px solid $white;\n      transition: 0.3s ease all;\n    }\n    a:hover {\n      border-bottom-color: $link;\n    }\n  }\n}\n\nnav {\n  justify-content: flex-end;\n}\n\n/*  -------- Media Queries ------- */\n\n/* Mobile */\n@media only screen and (min-width: 320px) and (max-width: 640px) {\n  .header-flex {\n    flex-direction: column;\n  }\n\n  .ulist {\n    margin: 1.1rem 0 0;\n  }\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__home_html__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__home_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__home_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__home_css__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__home_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__home_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Template__ = __webpack_require__(2);




const template = new __WEBPACK_IMPORTED_MODULE_2__Template__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__home_html___default.a);

class Home {

  render() {
    const dom = template.clone();

    return dom;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Home;


/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = "<picture>\n  <source media=\"(min-width: 1024px)\" srcset=\"images/hero-large.jpg, images/hero-large@2x.jpg 2x\">\n  <source media=\"(min-width: 720px)\" srcset=\"images/hero-medium.jpg, images/hero-medium@2x.jpg 2x\">\n  <source media=\"(min-width: 500px)\" srcset=\"images/hero-small.jpg, images/hero-small@2x.jpg 2x\">\n  <img srcset=\"images/hero-xsmall.jpg, images/hero-xsmall@2x.jpg 2x\" alt=\"Shoreline in Iceland\">\n</picture>\n\n<section class=\"hero-text\">\n  <h1 class=\"title\"><span class=\"small-title\">Welcome to</span><br>Iceland<br></h1>\n  <p class=\"small-title\">64.9631° N, 19.0208° W<br>Capital: Reykjavík  |  Population: 338,349</p>\n</section>\n\n<article class=\"maxwidth-wrap content-grid\">\n\n  <div>\n    <div class=\"hero-text1\">\n        <h1 class=\"title1\"><span class=\"small-title1\">Welcome to</span><br>Iceland<br></h1>\n        <p class=\"small-title1\">64.9631° N, 19.0208° W<br>Capital: Reykjavík  |  Population: 338,349</p>\n    </div>\n    <picture>\n      <source media=\"(min-width: 500px)\" srcset=\"images/iceland-land-small.jpg, images/iceland-land-small@2x.jpg 2x\">\n      <img srcset=\"images/iceland-land-xsmall.jpg, images/iceland-land-xsmall@2x.jpg 2x\" alt=\"Rugged landscpae in Iceland\">\n    </picture>\n  </div>\n  <div>\n    <h2>The Landscape</h2>\n    <p>Geologically, Iceland is part of the Mid-Atlantic Ridge, a ridge along which the oceanic crust spreads and forms new oceanic crust. This part of the mid-ocean ridge is located above a mantle plume, causing Iceland to be subaerial (above the surface of the sea). The ridge marks the boundary between the Eurasian and North American Plates, and Iceland was created by rifting and accretion through volcanism along the ridge.</p>\n    <p>—</p>\n  </div>\n\n  <div>\n    <picture>\n      <source media=\"(min-width: 500px)\" srcset=\"images/iceland-lagoon-small.jpg, images/iceland-lagoon-small@2x.jpg 2x\">\n      <img srcset=\"images/iceland-lagoon-xsmall.jpg, images/iceland-lagoon-xsmall@2x.jpg 2x\" alt=\"Famous lagoon pool in Iceland\">\n    </picture>\n  </div>\n  <div>\n    <h2>Geothermal Spa</h2>\n    <p>The Blue Lagoon (Icelandic: Bláa lónið) geothermal spa is one of the most visited attractions in Iceland. The spa is located in a lava field in Grindavík on the Reykjanes Peninsula, southwestern Iceland in a location favourable for Geothermal power, and is supplied by water used in the nearby Svartsengi geothermal power station. Bláa lónið is situated approximately 20 km (12 mi) from the Keflavík International Airport and 39 km (24 mi) from the capital city of Reykjavík, roughly a 21-minute drive from the airport and a 50-minute drive from Reykjavík.</p>    \n    <p>—</p>\n  </div>\n\n  <div>\n    <picture>\n      <source media=\"(min-width: 500px)\" srcset=\"images/iceland-city-small.jpg, images/iceland-city-small@2x.jpg 2x\">\n      <img srcset=\"images/iceland-city-xsmall.jpg, images/iceland-city-xsmall@2x.jpg 2x\" alt=\"City in Iceland\">\n    </picture>\n  </div>\n  <div>\n    <h2>Cities</h2>\n    <p>Greater Reykjavík (Icelandic: Höfuðborgarsvæðið, meaning \"The Capital Region\") is a name used collectively for Reykjavík and six municipalities around it.[2][3] The area is by far the largest urban area in Iceland.[4] Each municipality has its own elected council. Greater Reykjavík's population of 216 940 is over 60% of the population of Iceland, in an area that is only just over 1% of the total size of the country. The size of the greater Reykjavík area is calculated from the area of its constituent municipalities, including large areas of hinterland, not the much smaller urban core of about 200 km2 (77 sq mi).</p>\n    <p>—</p>\n  </div>\n\n</article>";

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(21);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"sourceMap":true,"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js??ref--1-1!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!./home.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js??ref--1-1!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!./home.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "section {\n  color: #a6deff;\n}\n.content-grid {\n  /* display: flex;\n  flex-direction: column; */\n  padding: 2rem;\n}\n.content-grid h2 {\n    color: #a6deff;\n    padding: 1.5rem 0 1rem;\n  }\n.content-grid img {\n    padding: 4rem 0 0;\n  }\n.hero-text {\n  text-align: right;\n  position: absolute;\n  top: 10rem;\n  right: 10rem;\n  z-index: 1000;\n}\n.title {\n  color: #000000;\n  font-size: 5rem;\n}\n.small-title {\n  font-size: 1rem;\n  padding: 0 0.5rem 0 0;\n  color: #000000;\n}\n.title1 {\n  font-size: 3.5rem;\n}\n.small-title1{\n  font-size: 1rem;\n}\n.content-grid > div:nth-child(1) {-webkit-box-ordinal-group: 2;-ms-flex-order: 1;order: 1;}\n.content-grid > div:nth-child(2) {-webkit-box-ordinal-group: 3;-ms-flex-order: 2;order: 2;}\n.content-grid > div:nth-child(3) {-webkit-box-ordinal-group: 4;-ms-flex-order: 3;order: 3;}\n.content-grid > div:nth-child(4) {-webkit-box-ordinal-group: 5;-ms-flex-order: 4;order: 4;}\n.content-grid > div:nth-child(5) {-webkit-box-ordinal-group: 6;-ms-flex-order: 5;order: 5;}\n.content-grid > div:nth-child(6) {-webkit-box-ordinal-group: 7;-ms-flex-order: 6;order: 6;}\n.content-grid > * {padding: 1rem;}\n/* ------ Media Queries ------- */\n@media screen and (min-width: 1000px) {\n  \n  .content-grid > div:nth-child(1) {grid-area: a;}\n  .content-grid > div:nth-child(2) {grid-area: b;}\n  .content-grid > div:nth-child(3) {grid-area: c;}\n  .content-grid > div:nth-child(4) {grid-area: d;}\n  .content-grid > div:nth-child(5) {grid-area: e;}\n  .content-grid > div:nth-child(6) {grid-area: f;}\n  \n  .content-grid {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    grid-template-areas:\n    \"a a b\"\n    \"d c c\"\n    \"e e f\";\n    -webkit-box-align: start;\n        -ms-flex-align: start;\n            align-items: flex-start;\n    grid-gap: 2rem;\n  }\n    .content-grid img {\n      padding: 1.8rem 0 0;\n    }\n}\n@media screen and (max-width:760px) {\n  .hero-text {\n    display: none;\n  }\n\n  .title1 {\n    margin: -4rem 0 0;\n  }\n}\n@media screen and (min-width:760px) and (max-width:1080px) {\n  \n  .hero-text {\n    top: 10rem;\n    right: 5rem;\n  }\n  \n  .title {\n    font-size: 3rem;\n  }\n\n  .hero-text1 {\n    display: none;\n  }\n\n}\n@media screen and (min-width:1080px) {\n  .hero-text1 {\n    display: none;\n  }\n}", "", {"version":3,"sources":["/Users/enduser/Desktop/nacho/401/variables.css","/Users/enduser/Desktop/nacho/401/travel-app/home.css"],"names":[],"mappings":"AAYA;EACE,eAAe;CAChB;ACZD;EACE;4BAC0B;EAC1B,cAAkB;CAQnB;AAPC;IACE,eAAa;IACb,uBAAuB;GACxB;AACD;IACE,kBAAkB;GACnB;AAGH;EACE,kBAAkB;EAClB,mBAAmB;EACnB,WAAW;EACX,aAAa;EACb,cAAc;CACf;AAED;EACE,eAAc;EACd,gBAAgB;CACjB;AAED;EACE,gBAAgB;EAChB,sBAAsB;EACtB,eAAc;CACf;AAED;EACE,kBAAkB;CACnB;AAED;EACE,gBAAgB;CACjB;AAED,kCAAkC,6BAAA,kBAAA,SAAS,CAAC;AAC5C,kCAAkC,6BAAA,kBAAA,SAAS,CAAC;AAC5C,kCAAkC,6BAAA,kBAAA,SAAS,CAAC;AAC5C,kCAAkC,6BAAA,kBAAA,SAAS,CAAC;AAC5C,kCAAkC,6BAAA,kBAAA,SAAS,CAAC;AAC5C,kCAAkC,6BAAA,kBAAA,SAAS,CAAC;AAC5C,mBAAmB,cAAc,CAAC;AAGlC,kCAAkC;AAElC;;EAEE,kCAAkC,aAAa,CAAC;EAChD,kCAAkC,aAAa,CAAC;EAChD,kCAAkC,aAAa,CAAC;EAChD,kCAAkC,aAAa,CAAC;EAChD,kCAAkC,aAAa,CAAC;EAChD,kCAAkC,aAAa,CAAC;;EAEhD;IACE,cAAc;IACd,sCAAsC;IACtC;;;YAGQ;IACR,yBAAwB;QAAxB,sBAAwB;YAAxB,wBAAwB;IACxB,eAAe;GAChB;IAGC;MACE,oBAAoB;KACrB;CAEJ;AAED;EACE;IACE,cAAc;GACf;;EAED;IACE,kBAAkB;GACnB;CACF;AAED;;EAEE;IACE,WAAW;IACX,YAAY;GACb;;EAED;IACE,gBAAgB;GACjB;;EAED;IACE,cAAc;GACf;;CAEF;AAED;EACE;IACE,cAAc;GACf;CACF","file":"home.css","sourcesContent":["$accent: #ff8c8c;\n$link: #a6deff;\n$darklink: #007BC2;\n$lightgray: #eeeeee;\n$darkgray: #444140;\n$white: #ffffff;\n$gray: #E0E0E0;\n$black: #000000;\n\n$maxViewportSize: 1280px;\n$padding: 2rem;\n\nsection {\n  color: #a6deff;\n}","@import '../variables.css';\n\n.content-grid {\n  /* display: flex;\n  flex-direction: column; */\n  padding: $padding;\n  h2 {\n    color: $link;\n    padding: 1.5rem 0 1rem;\n  }\n  img {\n    padding: 4rem 0 0;\n  }\n}\n\n.hero-text {\n  text-align: right;\n  position: absolute;\n  top: 10rem;\n  right: 10rem;\n  z-index: 1000;\n}\n\n.title {\n  color: $black;\n  font-size: 5rem;\n}\n\n.small-title {\n  font-size: 1rem;\n  padding: 0 0.5rem 0 0;\n  color: $black;\n}\n\n.title1 {\n  font-size: 3.5rem;\n}\n\n.small-title1{\n  font-size: 1rem;\n}\n\n.content-grid > div:nth-child(1) {order: 1;}\n.content-grid > div:nth-child(2) {order: 2;}\n.content-grid > div:nth-child(3) {order: 3;}\n.content-grid > div:nth-child(4) {order: 4;}\n.content-grid > div:nth-child(5) {order: 5;}\n.content-grid > div:nth-child(6) {order: 6;}\n.content-grid > * {padding: 1rem;}\n\n\n/* ------ Media Queries ------- */\n\n@media screen and (min-width: 1000px) {\n  \n  .content-grid > div:nth-child(1) {grid-area: a;}\n  .content-grid > div:nth-child(2) {grid-area: b;}\n  .content-grid > div:nth-child(3) {grid-area: c;}\n  .content-grid > div:nth-child(4) {grid-area: d;}\n  .content-grid > div:nth-child(5) {grid-area: e;}\n  .content-grid > div:nth-child(6) {grid-area: f;}\n  \n  .content-grid {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    grid-template-areas:\n    \"a a b\"\n    \"d c c\"\n    \"e e f\";\n    align-items: flex-start;\n    grid-gap: 2rem;\n  }\n\n  .content-grid {\n    img {\n      padding: 1.8rem 0 0;\n    }\n  }\n}\n\n@media screen and (max-width:760px) {\n  .hero-text {\n    display: none;\n  }\n\n  .title1 {\n    margin: -4rem 0 0;\n  }\n}\n\n@media screen and (min-width:760px) and (max-width:1080px) {\n  \n  .hero-text {\n    top: 10rem;\n    right: 5rem;\n  }\n  \n  .title {\n    font-size: 3rem;\n  }\n\n  .hero-text1 {\n    display: none;\n  }\n\n}\n\n@media screen and (min-width:1080px) {\n  .hero-text1 {\n    display: none;\n  }\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__resources_html__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__resources_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__resources_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__resources_css__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__resources_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__resources_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Template__ = __webpack_require__(2);




const template = new __WEBPACK_IMPORTED_MODULE_2__Template__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__resources_html___default.a);

class Resources {

  render() {
    const dom = template.clone();

    return dom;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Resources;


/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = "<picture>\n  <source media=\"(min-width: 1024px)\" srcset=\"images/hero1-large.jpg, images/hero1-large@2x.jpg 2x\">\n  <source media=\"(min-width: 720px)\" srcset=\"images/hero1-medium.jpg, images/hero1-medium@2x.jpg 2x\">\n  <source media=\"(min-width: 500px)\" srcset=\"images/hero1-small.jpg, images/hero1-small@2x.jpg 2x\">\n  <img srcset=\"images/hero1-xsmall.jpg, images/hero1-xsmall@2x.jpg 2x\" alt=\"Mountain in Iceland\">\n</picture>\n\n<section class=\"hero-resource\">\n  <h1 class=\"title-resource\"><span class=\"small-title-resource\">Iceland Travel</span><br>Resources<br></h1>\n  <p class=\"small-title-resource\">Flights | Eat | Explore</p>\n</section>\n\n<article class=\"maxwidth-wrap resource-grid\">\n  <div>\n    <section class=\"hero-resource1\">\n      <h1 class=\"title-resource\"><span class=\"small-title-resource\">Iceland Travel</span><br>Resources<br></h1>\n      <p class=\"small-title-resource\">Flights | Eat | Explore</p>\n    </section>\n  </div>\n\n  <div>\n    <h3>Flights</h3>\n    <ul class=\"ul-resource\">\n      <li><a href=\"https://www.tripadvisor.com/Flights-g189952-Iceland-Cheap_Discount_Airfares.html\" alt=\"Link to TripAdvisor Flights to Iceland\" target=\"_blank\" rel\"author noopener noreferrer\">TripAdvisor - Flight to Iceland</a></li>\n      <li><a href=\"https://guidetoiceland.is/travel-info/flights-to-iceland\" alt=\"Link to Guide to Iceland\" target=\"_blank\" rel\"author noopener noreferrer\">Guide to Iceland</a></li>\n      <li><a href=\"http://www.icelandair.us/destinations/flights-to-reykjavik/?gclid=EAIaIQobChMIn_nv2urz2AIVSiOBCh2tJwpgEAAYASABEgLOAPD_BwE\" alt=\"Link to IcelandAir\" target=\"_blank\" rel\"author noopener noreferrer\">IcelandAir</a></li>\n    </ul>\n  </div>\n\n  <div>\n    <h3>Eat</h3>\n    <ul class=\"ul-resource\">\n        <li><a href=\"https://www.tripadvisor.com/Restaurant_Review-g189970-d3372076-Reviews-Bergsson_Mathus-Reykjavik_Capital_Region.html\" alt=\"Link to Trip Advisor Bergsoon Mathus\" target=\"_blank\" rel\"author noopener noreferrer\">Bergsson Mathus</a></li>\n        <li><a href=\"https://www.tripadvisor.com/Restaurant_Review-g189970-d10303158-Reviews-Matarkjallarinn_Foodcellar-Reykjavik_Capital_Region.html\" alt=\"Link to Trip Advisor Matarkjallarinn\" target=\"_blank\" rel\"author noopener noreferrer\">Matarkjallarinn</a></li>\n        <li><a href=\"https://www.tripadvisor.com/Restaurant_Review-g189970-d4106587-Reviews-Kaffivagninn-Reykjavik_Capital_Region.html\" alt=\"Link to Trip Advisor Kaffivagninn\" target=\"_blank\" rel\"author noopener noreferrer\">Kaffivagninn</a></li>\n      </ul>\n  </div>\n\n  <div>\n    <h3>Explore</h3>\n    <ul class=\"ul-resource\">\n        <li><a href=\"http://www.bluelagoon.com/\" alt=\"Link to Blue Lagoon\" target=\"_blank\" rel\"author noopener noreferrer\">Blue Lagoon</a></li>\n        <li><a href=\"https://en.wikipedia.org/wiki/Th%C3%B3rsm%C3%B6rk\" alt=\"Link to Wikipedia Thórsmörk\" target=\"_blank\" rel\"author noopener noreferrer\">Thórsmörk</a></li>\n        <li><a href=\"http://icelagoon.is/\" alt=\"Link to Jökulsárlón Glacier Lagoon\" target=\"_blank\" rel\"author noopener noreferrer\">Jökulsárlón - Glacier Lagoon</a></li>\n      </ul>\n  </div>\n  \n</article>";

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(25);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"sourceMap":true,"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js??ref--1-1!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!./resources.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js??ref--1-1!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!./resources.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "section {\n  color: #a6deff;\n}\n.hero-resource {\n  text-align: center;\n  position: absolute;\n  top: 10rem;\n  left: 50%;\n  -webkit-transform: translateX(-50%);\n          transform: translateX(-50%);\n  margin: 0 auto;\n  z-index: 1000;\n}\n.title-resource {\n  color: #000000;\n  font-size: 4rem;\n}\n.small-title-resource {\n  font-size: 1rem;\n  padding: 0 0.5rem 0 0;\n  color: #000000;\n}\n.ul-resource {\n  margin: 0 0 0 1rem;\n}\n.ul-resource li {\n    padding: 0.8rem 0;\n    list-style-type: circle;\n    \n  }\n.ul-resource li a {\n      color: #ffffff;\n      -webkit-transition: 0.3s ease all;\n      transition: 0.3s ease all\n    }\n.ul-resource li a:hover {\n  color: #a6deff;\n  margin: 0 0 0 0.5rem;\n}\n.resource-grid {\n  padding: 2rem;\n}\n.resource-grid h3 {\n    color: #a6deff;\n    padding: 1.5rem 0 1rem;\n  }\n.resource-grid img {\n    padding: 4rem 0 0;\n  }\n.resource-grid > div:nth-child(1) {-webkit-box-ordinal-group: 2;-ms-flex-order: 1;order: 1;}\n.resource-grid > div:nth-child(2) {-webkit-box-ordinal-group: 3;-ms-flex-order: 2;order: 2;}\n.resource-grid > div:nth-child(3) {-webkit-box-ordinal-group: 4;-ms-flex-order: 3;order: 3;}\n.resource-grid > div:nth-child(4) {-webkit-box-ordinal-group: 5;-ms-flex-order: 4;order: 4;}\n.resource-grid > * {padding: 1rem;}\n@media screen and (min-width: 1000px) {\n  .resource-grid > div:nth-child(1) {grid-area: a;}\n  .resource-grid > div:nth-child(2) {grid-area: b;}\n  .resource-grid > div:nth-child(3) {grid-area: c;}\n  .resource-grid > div:nth-child(4) {grid-area: d;}\n  \n  .resource-grid {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    grid-template-areas:\n    \"a a a\"\n    \"b c d\";\n    -webkit-box-align: start;\n        -ms-flex-align: start;\n            align-items: flex-start;\n    grid-gap: 2rem;\n  }\n}\n@media screen and (min-width: 800px) {\n  .hero-resource1 {\n    display: none;\n  }\n}\n@media screen and (max-width: 1200px) {\n  .hero-resource {\n    top: 7rem;\n  }\n    .hero-resource .title-resource {\n      font-size: 3rem;\n    }\n}\n@media screen and (max-width: 800px) {\n  .hero-resource {\n    display: none;\n  }\n    .hero-resource1 .title-resource {\n      color: #ffffff;\n      font-size: 3rem;\n    }\n    .hero-resource1 .small-title-resource {\n      color: #ffffff;\n    }\n}", "", {"version":3,"sources":["/Users/enduser/Desktop/nacho/401/variables.css","/Users/enduser/Desktop/nacho/401/travel-app/resources.css"],"names":[],"mappings":"AAYA;EACE,eAAe;CAChB;ACZD;EACE,mBAAmB;EACnB,mBAAmB;EACnB,WAAW;EACX,UAAU;EACV,oCAA4B;UAA5B,4BAA4B;EAC5B,eAAe;EACf,cAAc;CACf;AAED;EACE,eAAc;EACd,gBAAgB;CACjB;AAED;EACE,gBAAgB;EAChB,sBAAsB;EACtB,eAAc;CACf;AAED;EACE,mBAAmB;CAcpB;AAbC;IACE,kBAAkB;IAClB,wBAAwB;;GAUzB;AATC;MACE,eAAc;MACd,kCAA0B;MAA1B,yBAA0B;KAK3B;AAJC;EACE,eAAa;EACb,qBAAqB;CACtB;AAMP;EACE,cAAkB;CAQnB;AAPC;IACE,eAAa;IACb,uBAAuB;GACxB;AACD;IACE,kBAAkB;GACnB;AAGH,mCAAmC,6BAAA,kBAAA,SAAS,CAAC;AAC7C,mCAAmC,6BAAA,kBAAA,SAAS,CAAC;AAC7C,mCAAmC,6BAAA,kBAAA,SAAS,CAAC;AAC7C,mCAAmC,6BAAA,kBAAA,SAAS,CAAC;AAC7C,oBAAoB,cAAc,CAAC;AAEnC;EACE,mCAAmC,aAAa,CAAC;EACjD,mCAAmC,aAAa,CAAC;EACjD,mCAAmC,aAAa,CAAC;EACjD,mCAAmC,aAAa,CAAC;;EAEjD;IACE,cAAc;IACd,sCAAsC;IACtC;;YAEQ;IACR,yBAAwB;QAAxB,sBAAwB;YAAxB,wBAAwB;IACxB,eAAe;GAChB;CACF;AAED;EACE;IACE,cAAc;GACf;CACF;AAED;EACE;IACE,UAAU;GAIX;IAHC;MACE,gBAAgB;KACjB;CAEJ;AAED;EACE;IACE,cAAc;GACf;IAGC;MACE,eAAc;MACd,gBAAgB;KACjB;IACD;MACE,eAAc;KACf;CAEJ","file":"resources.css","sourcesContent":["$accent: #ff8c8c;\n$link: #a6deff;\n$darklink: #007BC2;\n$lightgray: #eeeeee;\n$darkgray: #444140;\n$white: #ffffff;\n$gray: #E0E0E0;\n$black: #000000;\n\n$maxViewportSize: 1280px;\n$padding: 2rem;\n\nsection {\n  color: #a6deff;\n}","@import '../variables.css';\n\n.hero-resource {\n  text-align: center;\n  position: absolute;\n  top: 10rem;\n  left: 50%;\n  transform: translateX(-50%);\n  margin: 0 auto;\n  z-index: 1000;\n}\n\n.title-resource {\n  color: $black;\n  font-size: 4rem;\n}\n\n.small-title-resource {\n  font-size: 1rem;\n  padding: 0 0.5rem 0 0;\n  color: $black;\n}\n\n.ul-resource {\n  margin: 0 0 0 1rem;\n  li {\n    padding: 0.8rem 0;\n    list-style-type: circle;\n    a {\n      color: $white;\n      transition: 0.3s ease all;\n      &:hover {\n        color: $link;\n        margin: 0 0 0 0.5rem;\n      }\n    }\n    \n  }\n}\n\n.resource-grid {\n  padding: $padding;\n  h3 {\n    color: $link;\n    padding: 1.5rem 0 1rem;\n  }\n  img {\n    padding: 4rem 0 0;\n  }\n}\n\n.resource-grid > div:nth-child(1) {order: 1;}\n.resource-grid > div:nth-child(2) {order: 2;}\n.resource-grid > div:nth-child(3) {order: 3;}\n.resource-grid > div:nth-child(4) {order: 4;}\n.resource-grid > * {padding: 1rem;}\n\n@media screen and (min-width: 1000px) {\n  .resource-grid > div:nth-child(1) {grid-area: a;}\n  .resource-grid > div:nth-child(2) {grid-area: b;}\n  .resource-grid > div:nth-child(3) {grid-area: c;}\n  .resource-grid > div:nth-child(4) {grid-area: d;}\n  \n  .resource-grid {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    grid-template-areas:\n    \"a a a\"\n    \"b c d\";\n    align-items: flex-start;\n    grid-gap: 2rem;\n  }\n}\n\n@media screen and (min-width: 800px) {\n  .hero-resource1 {\n    display: none;\n  }\n}\n\n@media screen and (max-width: 1200px) {\n  .hero-resource {\n    top: 7rem;\n    .title-resource {\n      font-size: 3rem;\n    }\n  }\n}\n\n@media screen and (max-width: 800px) {\n  .hero-resource {\n    display: none;\n  }\n\n  .hero-resource1 {\n    .title-resource {\n      color: $white;\n      font-size: 3rem;\n    }\n    .small-title-resource {\n      color: $white;\n    }\n  }\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__footer_html__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__footer_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__footer_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__footer_css__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__footer_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__footer_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Template__ = __webpack_require__(2);




const template = new __WEBPACK_IMPORTED_MODULE_2__Template__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__footer_html___default.a);

class Footer {

  render() {
    const dom = template.clone();

    return dom;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Footer;


/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = "<p>(c) Travel Iceland — <a href=\"https://github.com/limongoo/travel-app\" target=\"_blank\" rel\"author noopener noreferrer\">Ivan Limongan</a></p>\n";

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(29);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"sourceMap":true,"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js??ref--1-1!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!./footer.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js??ref--1-1!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!./footer.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "", "", {"version":3,"sources":[],"names":[],"mappings":"","file":"footer.css","sourceRoot":""}]);

// exports


/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const removeChildren = node => {
  while(node.hasChildNodes()) {
    node.removeChild(node.lastChild);
  }
};
/* harmony export (immutable) */ __webpack_exports__["a"] = removeChildren;


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMTQwNTI5OTNmZjNlM2MwMmM5MDEiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9UZW1wbGF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVzZXQuY3NzPzZkMmIiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Jlc2V0LmNzcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi91cmxzLmpzIiwid2VicGFjazovLy8uL3NyYy9tYWluLmNzcz9jMWNiIiwid2VicGFjazovLy8uL3NyYy9tYWluLmNzcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9hcHAvQXBwLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2FwcC9hcHAuaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9hcHAvYXBwLmNzcz9hZmI2Iiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2FwcC9hcHAuY3NzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2hlYWRlci9IZWFkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvaGVhZGVyL2hlYWRlci5odG1sIiwid2VicGFjazovLy8uL3NyYy9pbWFnZXMvY3Jvc3Muc3ZnIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2hlYWRlci9oZWFkZXIuY3NzP2EyYjQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvaGVhZGVyL2hlYWRlci5jc3MiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvaG9tZS9Ib21lLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2hvbWUvaG9tZS5odG1sIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2hvbWUvaG9tZS5jc3M/N2YxZiIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9ob21lL2hvbWUuY3NzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3Jlc291cmNlcy9SZXNvdXJjZXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvcmVzb3VyY2VzL3Jlc291cmNlcy5odG1sIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3Jlc291cmNlcy9yZXNvdXJjZXMuY3NzPzZhZmUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvcmVzb3VyY2VzL3Jlc291cmNlcy5jc3MiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvZm9vdGVyL0Zvb3Rlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9mb290ZXIvZm9vdGVyLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvZm9vdGVyL2Zvb3Rlci5jc3M/NmVhNiIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9mb290ZXIvZm9vdGVyLmNzcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9kb20uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFD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QUFVLHFDQUFxQyxVQUFVLHFDQUFxQyxVQUFVLHFDQUFxQyxVQUFVLHNCQUFzQixlQUFlLDJDQUEyQyx1Q0FBdUMsY0FBYyx1Q0FBdUMsY0FBYyx1Q0FBdUMsY0FBYyx1Q0FBdUMsY0FBYyx3QkFBd0Isb0JBQW9CLDRDQUE0Qyx5REFBeUQsOEJBQThCLHFCQUFxQixLQUFLLEdBQUcsMENBQTBDLHFCQUFxQixvQkFBb0IsS0FBSyxHQUFHLDJDQUEyQyxvQkFBb0IsZ0JBQWdCLHVCQUF1Qix3QkFBd0IsT0FBTyxLQUFLLEdBQUcsMENBQTBDLG9CQUFvQixvQkFBb0IsS0FBSyx1QkFBdUIsdUJBQXVCLHNCQUFzQix3QkFBd0IsT0FBTyw2QkFBNkIsc0JBQXNCLE9BQU8sS0FBSyxHQUFHLG1CQUFtQjs7QUFFL2pMOzs7Ozs7Ozs7Ozs7O0FDUEE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEM7Ozs7Ozs7O0FDYkEsMEs7Ozs7OztBQ0FBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsZ0NBQWdDLFVBQVUsRUFBRTtBQUM1QyxDOzs7Ozs7QUN6QkE7QUFDQTs7O0FBR0E7QUFDQSxpQ0FBa0Msc0ZBQXNGOztBQUV4SDs7Ozs7Ozs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEUiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMTQwNTI5OTNmZjNlM2MwMmM5MDEiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXNlU291cmNlTWFwKSB7XG5cdHZhciBsaXN0ID0gW107XG5cblx0Ly8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXHRsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHR2YXIgY29udGVudCA9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKTtcblx0XHRcdGlmKGl0ZW1bMl0pIHtcblx0XHRcdFx0cmV0dXJuIFwiQG1lZGlhIFwiICsgaXRlbVsyXSArIFwie1wiICsgY29udGVudCArIFwifVwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdFx0XHR9XG5cdFx0fSkuam9pbihcIlwiKTtcblx0fTtcblxuXHQvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuXHRsaXN0LmkgPSBmdW5jdGlvbihtb2R1bGVzLCBtZWRpYVF1ZXJ5KSB7XG5cdFx0aWYodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpXG5cdFx0XHRtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCBcIlwiXV07XG5cdFx0dmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGlkID0gdGhpc1tpXVswXTtcblx0XHRcdGlmKHR5cGVvZiBpZCA9PT0gXCJudW1iZXJcIilcblx0XHRcdFx0YWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuXHRcdH1cblx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IG1vZHVsZXNbaV07XG5cdFx0XHQvLyBza2lwIGFscmVhZHkgaW1wb3J0ZWQgbW9kdWxlXG5cdFx0XHQvLyB0aGlzIGltcGxlbWVudGF0aW9uIGlzIG5vdCAxMDAlIHBlcmZlY3QgZm9yIHdlaXJkIG1lZGlhIHF1ZXJ5IGNvbWJpbmF0aW9uc1xuXHRcdFx0Ly8gIHdoZW4gYSBtb2R1bGUgaXMgaW1wb3J0ZWQgbXVsdGlwbGUgdGltZXMgd2l0aCBkaWZmZXJlbnQgbWVkaWEgcXVlcmllcy5cblx0XHRcdC8vICBJIGhvcGUgdGhpcyB3aWxsIG5ldmVyIG9jY3VyIChIZXkgdGhpcyB3YXkgd2UgaGF2ZSBzbWFsbGVyIGJ1bmRsZXMpXG5cdFx0XHRpZih0eXBlb2YgaXRlbVswXSAhPT0gXCJudW1iZXJcIiB8fCAhYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuXHRcdFx0XHRpZihtZWRpYVF1ZXJ5ICYmICFpdGVtWzJdKSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IG1lZGlhUXVlcnk7XG5cdFx0XHRcdH0gZWxzZSBpZihtZWRpYVF1ZXJ5KSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IFwiKFwiICsgaXRlbVsyXSArIFwiKSBhbmQgKFwiICsgbWVkaWFRdWVyeSArIFwiKVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxpc3QucHVzaChpdGVtKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdHJldHVybiBsaXN0O1xufTtcblxuZnVuY3Rpb24gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApIHtcblx0dmFyIGNvbnRlbnQgPSBpdGVtWzFdIHx8ICcnO1xuXHR2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG5cdGlmICghY3NzTWFwcGluZykge1xuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG5cblx0aWYgKHVzZVNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHZhciBzb3VyY2VNYXBwaW5nID0gdG9Db21tZW50KGNzc01hcHBpbmcpO1xuXHRcdHZhciBzb3VyY2VVUkxzID0gY3NzTWFwcGluZy5zb3VyY2VzLm1hcChmdW5jdGlvbiAoc291cmNlKSB7XG5cdFx0XHRyZXR1cm4gJy8qIyBzb3VyY2VVUkw9JyArIGNzc01hcHBpbmcuc291cmNlUm9vdCArIHNvdXJjZSArICcgKi8nXG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKCdcXG4nKTtcblx0fVxuXG5cdHJldHVybiBbY29udGVudF0uam9pbignXFxuJyk7XG59XG5cbi8vIEFkYXB0ZWQgZnJvbSBjb252ZXJ0LXNvdXJjZS1tYXAgKE1JVClcbmZ1bmN0aW9uIHRvQ29tbWVudChzb3VyY2VNYXApIHtcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG5cdHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpO1xuXHR2YXIgZGF0YSA9ICdzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCwnICsgYmFzZTY0O1xuXG5cdHJldHVybiAnLyojICcgKyBkYXRhICsgJyAqLyc7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuXG52YXIgc3R5bGVzSW5Eb20gPSB7fTtcblxudmFyXHRtZW1vaXplID0gZnVuY3Rpb24gKGZuKSB7XG5cdHZhciBtZW1vO1xuXG5cdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHR5cGVvZiBtZW1vID09PSBcInVuZGVmaW5lZFwiKSBtZW1vID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRyZXR1cm4gbWVtbztcblx0fTtcbn07XG5cbnZhciBpc09sZElFID0gbWVtb2l6ZShmdW5jdGlvbiAoKSB7XG5cdC8vIFRlc3QgZm9yIElFIDw9IDkgYXMgcHJvcG9zZWQgYnkgQnJvd3NlcmhhY2tzXG5cdC8vIEBzZWUgaHR0cDovL2Jyb3dzZXJoYWNrcy5jb20vI2hhY2stZTcxZDg2OTJmNjUzMzQxNzNmZWU3MTVjMjIyY2I4MDVcblx0Ly8gVGVzdHMgZm9yIGV4aXN0ZW5jZSBvZiBzdGFuZGFyZCBnbG9iYWxzIGlzIHRvIGFsbG93IHN0eWxlLWxvYWRlclxuXHQvLyB0byBvcGVyYXRlIGNvcnJlY3RseSBpbnRvIG5vbi1zdGFuZGFyZCBlbnZpcm9ubWVudHNcblx0Ly8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vd2VicGFjay1jb250cmliL3N0eWxlLWxvYWRlci9pc3N1ZXMvMTc3XG5cdHJldHVybiB3aW5kb3cgJiYgZG9jdW1lbnQgJiYgZG9jdW1lbnQuYWxsICYmICF3aW5kb3cuYXRvYjtcbn0pO1xuXG52YXIgZ2V0RWxlbWVudCA9IChmdW5jdGlvbiAoZm4pIHtcblx0dmFyIG1lbW8gPSB7fTtcblxuXHRyZXR1cm4gZnVuY3Rpb24oc2VsZWN0b3IpIHtcblx0XHRpZiAodHlwZW9mIG1lbW9bc2VsZWN0b3JdID09PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHR2YXIgc3R5bGVUYXJnZXQgPSBmbi5jYWxsKHRoaXMsIHNlbGVjdG9yKTtcblx0XHRcdC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG5cdFx0XHRpZiAoc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHQvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuXHRcdFx0XHRcdC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG5cdFx0XHRcdFx0c3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcblx0XHRcdFx0fSBjYXRjaChlKSB7XG5cdFx0XHRcdFx0c3R5bGVUYXJnZXQgPSBudWxsO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRtZW1vW3NlbGVjdG9yXSA9IHN0eWxlVGFyZ2V0O1xuXHRcdH1cblx0XHRyZXR1cm4gbWVtb1tzZWxlY3Rvcl1cblx0fTtcbn0pKGZ1bmN0aW9uICh0YXJnZXQpIHtcblx0cmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KVxufSk7XG5cbnZhciBzaW5nbGV0b24gPSBudWxsO1xudmFyXHRzaW5nbGV0b25Db3VudGVyID0gMDtcbnZhclx0c3R5bGVzSW5zZXJ0ZWRBdFRvcCA9IFtdO1xuXG52YXJcdGZpeFVybHMgPSByZXF1aXJlKFwiLi91cmxzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGxpc3QsIG9wdGlvbnMpIHtcblx0aWYgKHR5cGVvZiBERUJVRyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBERUJVRykge1xuXHRcdGlmICh0eXBlb2YgZG9jdW1lbnQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIlRoZSBzdHlsZS1sb2FkZXIgY2Fubm90IGJlIHVzZWQgaW4gYSBub24tYnJvd3NlciBlbnZpcm9ubWVudFwiKTtcblx0fVxuXG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG5cdG9wdGlvbnMuYXR0cnMgPSB0eXBlb2Ygb3B0aW9ucy5hdHRycyA9PT0gXCJvYmplY3RcIiA/IG9wdGlvbnMuYXR0cnMgOiB7fTtcblxuXHQvLyBGb3JjZSBzaW5nbGUtdGFnIHNvbHV0aW9uIG9uIElFNi05LCB3aGljaCBoYXMgYSBoYXJkIGxpbWl0IG9uIHRoZSAjIG9mIDxzdHlsZT5cblx0Ly8gdGFncyBpdCB3aWxsIGFsbG93IG9uIGEgcGFnZVxuXHRpZiAoIW9wdGlvbnMuc2luZ2xldG9uICYmIHR5cGVvZiBvcHRpb25zLnNpbmdsZXRvbiAhPT0gXCJib29sZWFuXCIpIG9wdGlvbnMuc2luZ2xldG9uID0gaXNPbGRJRSgpO1xuXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIDxoZWFkPiBlbGVtZW50XG5cdGlmICghb3B0aW9ucy5pbnNlcnRJbnRvKSBvcHRpb25zLmluc2VydEludG8gPSBcImhlYWRcIjtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSBib3R0b20gb2YgdGhlIHRhcmdldFxuXHRpZiAoIW9wdGlvbnMuaW5zZXJ0QXQpIG9wdGlvbnMuaW5zZXJ0QXQgPSBcImJvdHRvbVwiO1xuXG5cdHZhciBzdHlsZXMgPSBsaXN0VG9TdHlsZXMobGlzdCwgb3B0aW9ucyk7XG5cblx0YWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlIChuZXdMaXN0KSB7XG5cdFx0dmFyIG1heVJlbW92ZSA9IFtdO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cblx0XHRcdGRvbVN0eWxlLnJlZnMtLTtcblx0XHRcdG1heVJlbW92ZS5wdXNoKGRvbVN0eWxlKTtcblx0XHR9XG5cblx0XHRpZihuZXdMaXN0KSB7XG5cdFx0XHR2YXIgbmV3U3R5bGVzID0gbGlzdFRvU3R5bGVzKG5ld0xpc3QsIG9wdGlvbnMpO1xuXHRcdFx0YWRkU3R5bGVzVG9Eb20obmV3U3R5bGVzLCBvcHRpb25zKTtcblx0XHR9XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG1heVJlbW92ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gbWF5UmVtb3ZlW2ldO1xuXG5cdFx0XHRpZihkb21TdHlsZS5yZWZzID09PSAwKSB7XG5cdFx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIGRvbVN0eWxlLnBhcnRzW2pdKCk7XG5cblx0XHRcdFx0ZGVsZXRlIHN0eWxlc0luRG9tW2RvbVN0eWxlLmlkXTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59O1xuXG5mdW5jdGlvbiBhZGRTdHlsZXNUb0RvbSAoc3R5bGVzLCBvcHRpb25zKSB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cblx0XHRpZihkb21TdHlsZSkge1xuXHRcdFx0ZG9tU3R5bGUucmVmcysrO1xuXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oaXRlbS5wYXJ0c1tqXSk7XG5cdFx0XHR9XG5cblx0XHRcdGZvcig7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgcGFydHMgPSBbXTtcblxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0cGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cblx0XHRcdHN0eWxlc0luRG9tW2l0ZW0uaWRdID0ge2lkOiBpdGVtLmlkLCByZWZzOiAxLCBwYXJ0czogcGFydHN9O1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBsaXN0VG9TdHlsZXMgKGxpc3QsIG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlcyA9IFtdO1xuXHR2YXIgbmV3U3R5bGVzID0ge307XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBsaXN0W2ldO1xuXHRcdHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuXHRcdHZhciBjc3MgPSBpdGVtWzFdO1xuXHRcdHZhciBtZWRpYSA9IGl0ZW1bMl07XG5cdFx0dmFyIHNvdXJjZU1hcCA9IGl0ZW1bM107XG5cdFx0dmFyIHBhcnQgPSB7Y3NzOiBjc3MsIG1lZGlhOiBtZWRpYSwgc291cmNlTWFwOiBzb3VyY2VNYXB9O1xuXG5cdFx0aWYoIW5ld1N0eWxlc1tpZF0pIHN0eWxlcy5wdXNoKG5ld1N0eWxlc1tpZF0gPSB7aWQ6IGlkLCBwYXJ0czogW3BhcnRdfSk7XG5cdFx0ZWxzZSBuZXdTdHlsZXNbaWRdLnBhcnRzLnB1c2gocGFydCk7XG5cdH1cblxuXHRyZXR1cm4gc3R5bGVzO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQgKG9wdGlvbnMsIHN0eWxlKSB7XG5cdHZhciB0YXJnZXQgPSBnZXRFbGVtZW50KG9wdGlvbnMuaW5zZXJ0SW50bylcblxuXHRpZiAoIXRhcmdldCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0SW50bycgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuXHR9XG5cblx0dmFyIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wID0gc3R5bGVzSW5zZXJ0ZWRBdFRvcFtzdHlsZXNJbnNlcnRlZEF0VG9wLmxlbmd0aCAtIDFdO1xuXG5cdGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcInRvcFwiKSB7XG5cdFx0aWYgKCFsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCkge1xuXHRcdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgdGFyZ2V0LmZpcnN0Q2hpbGQpO1xuXHRcdH0gZWxzZSBpZiAobGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpIHtcblx0XHRcdHRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGUsIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcblx0XHR9XG5cdFx0c3R5bGVzSW5zZXJ0ZWRBdFRvcC5wdXNoKHN0eWxlKTtcblx0fSBlbHNlIGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcImJvdHRvbVwiKSB7XG5cdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcblx0fSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJvYmplY3RcIiAmJiBvcHRpb25zLmluc2VydEF0LmJlZm9yZSkge1xuXHRcdHZhciBuZXh0U2libGluZyA9IGdldEVsZW1lbnQob3B0aW9ucy5pbnNlcnRJbnRvICsgXCIgXCIgKyBvcHRpb25zLmluc2VydEF0LmJlZm9yZSk7XG5cdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgbmV4dFNpYmxpbmcpO1xuXHR9IGVsc2Uge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIltTdHlsZSBMb2FkZXJdXFxuXFxuIEludmFsaWQgdmFsdWUgZm9yIHBhcmFtZXRlciAnaW5zZXJ0QXQnICgnb3B0aW9ucy5pbnNlcnRBdCcpIGZvdW5kLlxcbiBNdXN0IGJlICd0b3AnLCAnYm90dG9tJywgb3IgT2JqZWN0LlxcbiAoaHR0cHM6Ly9naXRodWIuY29tL3dlYnBhY2stY29udHJpYi9zdHlsZS1sb2FkZXIjaW5zZXJ0YXQpXFxuXCIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudCAoc3R5bGUpIHtcblx0aWYgKHN0eWxlLnBhcmVudE5vZGUgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblx0c3R5bGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZSk7XG5cblx0dmFyIGlkeCA9IHN0eWxlc0luc2VydGVkQXRUb3AuaW5kZXhPZihzdHlsZSk7XG5cdGlmKGlkeCA+PSAwKSB7XG5cdFx0c3R5bGVzSW5zZXJ0ZWRBdFRvcC5zcGxpY2UoaWR4LCAxKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTdHlsZUVsZW1lbnQgKG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuXG5cdG9wdGlvbnMuYXR0cnMudHlwZSA9IFwidGV4dC9jc3NcIjtcblxuXHRhZGRBdHRycyhzdHlsZSwgb3B0aW9ucy5hdHRycyk7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBzdHlsZSk7XG5cblx0cmV0dXJuIHN0eWxlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVMaW5rRWxlbWVudCAob3B0aW9ucykge1xuXHR2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpO1xuXG5cdG9wdGlvbnMuYXR0cnMudHlwZSA9IFwidGV4dC9jc3NcIjtcblx0b3B0aW9ucy5hdHRycy5yZWwgPSBcInN0eWxlc2hlZXRcIjtcblxuXHRhZGRBdHRycyhsaW5rLCBvcHRpb25zLmF0dHJzKTtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIGxpbmspO1xuXG5cdHJldHVybiBsaW5rO1xufVxuXG5mdW5jdGlvbiBhZGRBdHRycyAoZWwsIGF0dHJzKSB7XG5cdE9iamVjdC5rZXlzKGF0dHJzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRlbC5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyc1trZXldKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGFkZFN0eWxlIChvYmosIG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlLCB1cGRhdGUsIHJlbW92ZSwgcmVzdWx0O1xuXG5cdC8vIElmIGEgdHJhbnNmb3JtIGZ1bmN0aW9uIHdhcyBkZWZpbmVkLCBydW4gaXQgb24gdGhlIGNzc1xuXHRpZiAob3B0aW9ucy50cmFuc2Zvcm0gJiYgb2JqLmNzcykge1xuXHQgICAgcmVzdWx0ID0gb3B0aW9ucy50cmFuc2Zvcm0ob2JqLmNzcyk7XG5cblx0ICAgIGlmIChyZXN1bHQpIHtcblx0ICAgIFx0Ly8gSWYgdHJhbnNmb3JtIHJldHVybnMgYSB2YWx1ZSwgdXNlIHRoYXQgaW5zdGVhZCBvZiB0aGUgb3JpZ2luYWwgY3NzLlxuXHQgICAgXHQvLyBUaGlzIGFsbG93cyBydW5uaW5nIHJ1bnRpbWUgdHJhbnNmb3JtYXRpb25zIG9uIHRoZSBjc3MuXG5cdCAgICBcdG9iai5jc3MgPSByZXN1bHQ7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgXHQvLyBJZiB0aGUgdHJhbnNmb3JtIGZ1bmN0aW9uIHJldHVybnMgYSBmYWxzeSB2YWx1ZSwgZG9uJ3QgYWRkIHRoaXMgY3NzLlxuXHQgICAgXHQvLyBUaGlzIGFsbG93cyBjb25kaXRpb25hbCBsb2FkaW5nIG9mIGNzc1xuXHQgICAgXHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdCAgICBcdFx0Ly8gbm9vcFxuXHQgICAgXHR9O1xuXHQgICAgfVxuXHR9XG5cblx0aWYgKG9wdGlvbnMuc2luZ2xldG9uKSB7XG5cdFx0dmFyIHN0eWxlSW5kZXggPSBzaW5nbGV0b25Db3VudGVyKys7XG5cblx0XHRzdHlsZSA9IHNpbmdsZXRvbiB8fCAoc2luZ2xldG9uID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpKTtcblxuXHRcdHVwZGF0ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZSwgc3R5bGVJbmRleCwgZmFsc2UpO1xuXHRcdHJlbW92ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZSwgc3R5bGVJbmRleCwgdHJ1ZSk7XG5cblx0fSBlbHNlIGlmIChcblx0XHRvYmouc291cmNlTWFwICYmXG5cdFx0dHlwZW9mIFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5jcmVhdGVPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwucmV2b2tlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgQmxvYiA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIlxuXHQpIHtcblx0XHRzdHlsZSA9IGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IHVwZGF0ZUxpbmsuYmluZChudWxsLCBzdHlsZSwgb3B0aW9ucyk7XG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlKTtcblxuXHRcdFx0aWYoc3R5bGUuaHJlZikgVVJMLnJldm9rZU9iamVjdFVSTChzdHlsZS5ocmVmKTtcblx0XHR9O1xuXHR9IGVsc2Uge1xuXHRcdHN0eWxlID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IGFwcGx5VG9UYWcuYmluZChudWxsLCBzdHlsZSk7XG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlKTtcblx0XHR9O1xuXHR9XG5cblx0dXBkYXRlKG9iaik7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZVN0eWxlIChuZXdPYmopIHtcblx0XHRpZiAobmV3T2JqKSB7XG5cdFx0XHRpZiAoXG5cdFx0XHRcdG5ld09iai5jc3MgPT09IG9iai5jc3MgJiZcblx0XHRcdFx0bmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiZcblx0XHRcdFx0bmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcFxuXHRcdFx0KSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dXBkYXRlKG9iaiA9IG5ld09iaik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlbW92ZSgpO1xuXHRcdH1cblx0fTtcbn1cblxudmFyIHJlcGxhY2VUZXh0ID0gKGZ1bmN0aW9uICgpIHtcblx0dmFyIHRleHRTdG9yZSA9IFtdO1xuXG5cdHJldHVybiBmdW5jdGlvbiAoaW5kZXgsIHJlcGxhY2VtZW50KSB7XG5cdFx0dGV4dFN0b3JlW2luZGV4XSA9IHJlcGxhY2VtZW50O1xuXG5cdFx0cmV0dXJuIHRleHRTdG9yZS5maWx0ZXIoQm9vbGVhbikuam9pbignXFxuJyk7XG5cdH07XG59KSgpO1xuXG5mdW5jdGlvbiBhcHBseVRvU2luZ2xldG9uVGFnIChzdHlsZSwgaW5kZXgsIHJlbW92ZSwgb2JqKSB7XG5cdHZhciBjc3MgPSByZW1vdmUgPyBcIlwiIDogb2JqLmNzcztcblxuXHRpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuXHRcdHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IHJlcGxhY2VUZXh0KGluZGV4LCBjc3MpO1xuXHR9IGVsc2Uge1xuXHRcdHZhciBjc3NOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKTtcblx0XHR2YXIgY2hpbGROb2RlcyA9IHN0eWxlLmNoaWxkTm9kZXM7XG5cblx0XHRpZiAoY2hpbGROb2Rlc1tpbmRleF0pIHN0eWxlLnJlbW92ZUNoaWxkKGNoaWxkTm9kZXNbaW5kZXhdKTtcblxuXHRcdGlmIChjaGlsZE5vZGVzLmxlbmd0aCkge1xuXHRcdFx0c3R5bGUuaW5zZXJ0QmVmb3JlKGNzc05vZGUsIGNoaWxkTm9kZXNbaW5kZXhdKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3R5bGUuYXBwZW5kQ2hpbGQoY3NzTm9kZSk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGFwcGx5VG9UYWcgKHN0eWxlLCBvYmopIHtcblx0dmFyIGNzcyA9IG9iai5jc3M7XG5cdHZhciBtZWRpYSA9IG9iai5tZWRpYTtcblxuXHRpZihtZWRpYSkge1xuXHRcdHN0eWxlLnNldEF0dHJpYnV0ZShcIm1lZGlhXCIsIG1lZGlhKVxuXHR9XG5cblx0aWYoc3R5bGUuc3R5bGVTaGVldCkge1xuXHRcdHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcblx0fSBlbHNlIHtcblx0XHR3aGlsZShzdHlsZS5maXJzdENoaWxkKSB7XG5cdFx0XHRzdHlsZS5yZW1vdmVDaGlsZChzdHlsZS5maXJzdENoaWxkKTtcblx0XHR9XG5cblx0XHRzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVMaW5rIChsaW5rLCBvcHRpb25zLCBvYmopIHtcblx0dmFyIGNzcyA9IG9iai5jc3M7XG5cdHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuXG5cdC8qXG5cdFx0SWYgY29udmVydFRvQWJzb2x1dGVVcmxzIGlzbid0IGRlZmluZWQsIGJ1dCBzb3VyY2VtYXBzIGFyZSBlbmFibGVkXG5cdFx0YW5kIHRoZXJlIGlzIG5vIHB1YmxpY1BhdGggZGVmaW5lZCB0aGVuIGxldHMgdHVybiBjb252ZXJ0VG9BYnNvbHV0ZVVybHNcblx0XHRvbiBieSBkZWZhdWx0LiAgT3RoZXJ3aXNlIGRlZmF1bHQgdG8gdGhlIGNvbnZlcnRUb0Fic29sdXRlVXJscyBvcHRpb25cblx0XHRkaXJlY3RseVxuXHQqL1xuXHR2YXIgYXV0b0ZpeFVybHMgPSBvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyA9PT0gdW5kZWZpbmVkICYmIHNvdXJjZU1hcDtcblxuXHRpZiAob3B0aW9ucy5jb252ZXJ0VG9BYnNvbHV0ZVVybHMgfHwgYXV0b0ZpeFVybHMpIHtcblx0XHRjc3MgPSBmaXhVcmxzKGNzcyk7XG5cdH1cblxuXHRpZiAoc291cmNlTWFwKSB7XG5cdFx0Ly8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjY2MDM4NzVcblx0XHRjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiICsgYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSArIFwiICovXCI7XG5cdH1cblxuXHR2YXIgYmxvYiA9IG5ldyBCbG9iKFtjc3NdLCB7IHR5cGU6IFwidGV4dC9jc3NcIiB9KTtcblxuXHR2YXIgb2xkU3JjID0gbGluay5ocmVmO1xuXG5cdGxpbmsuaHJlZiA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG5cblx0aWYob2xkU3JjKSBVUkwucmV2b2tlT2JqZWN0VVJMKG9sZFNyYyk7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBUZW1wbGF0ZSB7XG4gIGNvbnN0cnVjdG9yKGh0bWwpIHtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gaHRtbDtcbiAgICB0aGlzLmZyYWdtZW50ID0gdGVtcGxhdGUuY29udGVudDtcbiAgfVxuXG4gIGNsb25lKCkge1xuICAgIHJldHVybiB0aGlzLmZyYWdtZW50LmNsb25lTm9kZSh0cnVlKTtcbiAgfVxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBvbmVudHMvVGVtcGxhdGUuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0ICcuL3Jlc2V0LmNzcyc7XG5pbXBvcnQgJy4vbWFpbi5jc3MnO1xuXG5pbXBvcnQgQXBwIGZyb20gJy4vY29tcG9uZW50cy9hcHAvQXBwJztcblxuY29uc3Qgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290Jyk7XG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5yb290LmFwcGVuZENoaWxkKGFwcC5yZW5kZXIoKSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvbWFpbi5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMS0yIS4vcmVzZXQuY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHtcInNvdXJjZU1hcFwiOnRydWUsXCJobXJcIjp0cnVlfVxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMS0yIS4vcmVzZXQuY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0xLTIhLi9yZXNldC5jc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3Jlc2V0LmNzc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHRydWUpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLyogaHR0cDovL21leWVyd2ViLmNvbS9lcmljL3Rvb2xzL2Nzcy9yZXNldC8gXFxuICAgdjIuMCB8IDIwMTEwMTI2XFxuICAgTGljZW5zZTogbm9uZSAocHVibGljIGRvbWFpbilcXG4qL1xcblxcbmh0bWwsIGJvZHksIGRpdiwgc3BhbiwgYXBwbGV0LCBvYmplY3QsIGlmcmFtZSwgaDEsIGgyLCBoMywgaDQsIGg1LCBoNiwgcCwgYmxvY2txdW90ZSwgcHJlLCBhLCBhYmJyLCBhY3JvbnltLCBhZGRyZXNzLCBiaWcsIGNpdGUsIGNvZGUsIGRlbCwgZGZuLCBpbWcsIGlucywga2JkLCBxLCBzLCBzYW1wLCBzbWFsbCwgc3RyaWtlLCBzdWIsIHN1cCwgdHQsIHZhciwgYiwgdSwgaSwgY2VudGVyLCBkbCwgZHQsIGRkLCBvbCwgdWwsIGxpLCBmaWVsZHNldCwgZm9ybSwgbGFiZWwsIGxlZ2VuZCwgdGFibGUsIGNhcHRpb24sIHRib2R5LCB0Zm9vdCwgdGhlYWQsIHRyLCB0aCwgdGQsIGFydGljbGUsIGFzaWRlLCBjYW52YXMsIGRldGFpbHMsIGVtYmVkLCBmaWd1cmUsIGZpZ2NhcHRpb24sIGZvb3RlciwgaGVhZGVyLCBoZ3JvdXAsIG1lbnUsIG5hdiwgb3V0cHV0LCBydWJ5LCBzZWN0aW9uLCBzdW1tYXJ5LCB0aW1lLCBtYXJrLCBhdWRpbywgdmlkZW8ge1xcblxcdG1hcmdpbjogMDtcXG5cXHRwYWRkaW5nOiAwO1xcblxcdGJvcmRlcjogMDtcXG5cXHRmb250LXNpemU6IDEwMCU7XFxuXFx0Zm9udDogaW5oZXJpdDtcXG5cXHR2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XFxufVxcblxcbi8qIEhUTUw1IGRpc3BsYXktcm9sZSByZXNldCBmb3Igb2xkZXIgYnJvd3NlcnMgKi9cXG5cXG5hcnRpY2xlLCBhc2lkZSwgZGV0YWlscywgZmlnY2FwdGlvbiwgZmlndXJlLCBmb290ZXIsIGhlYWRlciwgaGdyb3VwLCBtZW51LCBuYXYsIHNlY3Rpb24ge1xcblxcdGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cXG5ib2R5IHtcXG5cXHRsaW5lLWhlaWdodDogMTtcXG59XFxuXFxubmF2IG9sLCBuYXYgdWwge1xcblxcdGxpc3Qtc3R5bGU6IG5vbmU7XFxufVxcblxcbmJsb2NrcXVvdGUsIHEge1xcblxcdHF1b3Rlczogbm9uZTtcXG59XFxuXFxuYmxvY2txdW90ZTpiZWZvcmUsIGJsb2NrcXVvdGU6YWZ0ZXIsIHE6YmVmb3JlLCBxOmFmdGVyIHtcXG5cXHRjb250ZW50OiAnJztcXG5cXHRjb250ZW50OiBub25lO1xcbn1cXG5cXG50YWJsZSB7XFxuXFx0Ym9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcXG5cXHRib3JkZXItc3BhY2luZzogMDtcXG59XCIsIFwiXCIsIHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIi9Vc2Vycy9lbmR1c2VyL0Rlc2t0b3AvbmFjaG8vNDAxL3RyYXZlbC1hcHAvcmVzZXQuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBOzs7RUFHRTs7QUFFRjtDQWFDLFVBQVU7Q0FDVixXQUFXO0NBQ1gsVUFBVTtDQUNWLGdCQUFnQjtDQUNoQixjQUFjO0NBQ2QseUJBQXlCO0NBQ3pCOztBQUNELGlEQUFpRDs7QUFDakQ7Q0FFQyxlQUFlO0NBQ2Y7O0FBQ0Q7Q0FDQyxlQUFlO0NBQ2Y7O0FBQ0Q7Q0FDQyxpQkFBaUI7Q0FDakI7O0FBQ0Q7Q0FDQyxhQUFhO0NBQ2I7O0FBQ0Q7Q0FFQyxZQUFZO0NBQ1osY0FBYztDQUNkOztBQUNEO0NBQ0MsMEJBQTBCO0NBQzFCLGtCQUFrQjtDQUNsQlwiLFwiZmlsZVwiOlwicmVzZXQuY3NzXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi8qIGh0dHA6Ly9tZXllcndlYi5jb20vZXJpYy90b29scy9jc3MvcmVzZXQvIFxcbiAgIHYyLjAgfCAyMDExMDEyNlxcbiAgIExpY2Vuc2U6IG5vbmUgKHB1YmxpYyBkb21haW4pXFxuKi9cXG5cXG5odG1sLCBib2R5LCBkaXYsIHNwYW4sIGFwcGxldCwgb2JqZWN0LCBpZnJhbWUsXFxuaDEsIGgyLCBoMywgaDQsIGg1LCBoNiwgcCwgYmxvY2txdW90ZSwgcHJlLFxcbmEsIGFiYnIsIGFjcm9ueW0sIGFkZHJlc3MsIGJpZywgY2l0ZSwgY29kZSxcXG5kZWwsIGRmbiwgaW1nLCBpbnMsIGtiZCwgcSwgcywgc2FtcCxcXG5zbWFsbCwgc3RyaWtlLCBzdWIsIHN1cCwgdHQsIHZhcixcXG5iLCB1LCBpLCBjZW50ZXIsXFxuZGwsIGR0LCBkZCwgb2wsIHVsLCBsaSxcXG5maWVsZHNldCwgZm9ybSwgbGFiZWwsIGxlZ2VuZCxcXG50YWJsZSwgY2FwdGlvbiwgdGJvZHksIHRmb290LCB0aGVhZCwgdHIsIHRoLCB0ZCxcXG5hcnRpY2xlLCBhc2lkZSwgY2FudmFzLCBkZXRhaWxzLCBlbWJlZCwgXFxuZmlndXJlLCBmaWdjYXB0aW9uLCBmb290ZXIsIGhlYWRlciwgaGdyb3VwLCBcXG5tZW51LCBuYXYsIG91dHB1dCwgcnVieSwgc2VjdGlvbiwgc3VtbWFyeSxcXG50aW1lLCBtYXJrLCBhdWRpbywgdmlkZW8ge1xcblxcdG1hcmdpbjogMDtcXG5cXHRwYWRkaW5nOiAwO1xcblxcdGJvcmRlcjogMDtcXG5cXHRmb250LXNpemU6IDEwMCU7XFxuXFx0Zm9udDogaW5oZXJpdDtcXG5cXHR2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XFxufVxcbi8qIEhUTUw1IGRpc3BsYXktcm9sZSByZXNldCBmb3Igb2xkZXIgYnJvd3NlcnMgKi9cXG5hcnRpY2xlLCBhc2lkZSwgZGV0YWlscywgZmlnY2FwdGlvbiwgZmlndXJlLCBcXG5mb290ZXIsIGhlYWRlciwgaGdyb3VwLCBtZW51LCBuYXYsIHNlY3Rpb24ge1xcblxcdGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5ib2R5IHtcXG5cXHRsaW5lLWhlaWdodDogMTtcXG59XFxubmF2IG9sLCBuYXYgdWwge1xcblxcdGxpc3Qtc3R5bGU6IG5vbmU7XFxufVxcbmJsb2NrcXVvdGUsIHEge1xcblxcdHF1b3Rlczogbm9uZTtcXG59XFxuYmxvY2txdW90ZTpiZWZvcmUsIGJsb2NrcXVvdGU6YWZ0ZXIsXFxucTpiZWZvcmUsIHE6YWZ0ZXIge1xcblxcdGNvbnRlbnQ6ICcnO1xcblxcdGNvbnRlbnQ6IG5vbmU7XFxufVxcbnRhYmxlIHtcXG5cXHRib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xcblxcdGJvcmRlci1zcGFjaW5nOiAwO1xcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlcj97XCJpbXBvcnRMb2FkZXJzXCI6MSxcInNvdXJjZU1hcFwiOnRydWV9IS4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYj97XCJzb3VyY2VNYXBcIjp0cnVlfSEuL3NyYy9yZXNldC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXG4vKipcbiAqIFdoZW4gc291cmNlIG1hcHMgYXJlIGVuYWJsZWQsIGBzdHlsZS1sb2FkZXJgIHVzZXMgYSBsaW5rIGVsZW1lbnQgd2l0aCBhIGRhdGEtdXJpIHRvXG4gKiBlbWJlZCB0aGUgY3NzIG9uIHRoZSBwYWdlLiBUaGlzIGJyZWFrcyBhbGwgcmVsYXRpdmUgdXJscyBiZWNhdXNlIG5vdyB0aGV5IGFyZSByZWxhdGl2ZSB0byBhXG4gKiBidW5kbGUgaW5zdGVhZCBvZiB0aGUgY3VycmVudCBwYWdlLlxuICpcbiAqIE9uZSBzb2x1dGlvbiBpcyB0byBvbmx5IHVzZSBmdWxsIHVybHMsIGJ1dCB0aGF0IG1heSBiZSBpbXBvc3NpYmxlLlxuICpcbiAqIEluc3RlYWQsIHRoaXMgZnVuY3Rpb24gXCJmaXhlc1wiIHRoZSByZWxhdGl2ZSB1cmxzIHRvIGJlIGFic29sdXRlIGFjY29yZGluZyB0byB0aGUgY3VycmVudCBwYWdlIGxvY2F0aW9uLlxuICpcbiAqIEEgcnVkaW1lbnRhcnkgdGVzdCBzdWl0ZSBpcyBsb2NhdGVkIGF0IGB0ZXN0L2ZpeFVybHMuanNgIGFuZCBjYW4gYmUgcnVuIHZpYSB0aGUgYG5wbSB0ZXN0YCBjb21tYW5kLlxuICpcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3MpIHtcbiAgLy8gZ2V0IGN1cnJlbnQgbG9jYXRpb25cbiAgdmFyIGxvY2F0aW9uID0gdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cubG9jYXRpb247XG5cbiAgaWYgKCFsb2NhdGlvbikge1xuICAgIHRocm93IG5ldyBFcnJvcihcImZpeFVybHMgcmVxdWlyZXMgd2luZG93LmxvY2F0aW9uXCIpO1xuICB9XG5cblx0Ly8gYmxhbmsgb3IgbnVsbD9cblx0aWYgKCFjc3MgfHwgdHlwZW9mIGNzcyAhPT0gXCJzdHJpbmdcIikge1xuXHQgIHJldHVybiBjc3M7XG4gIH1cblxuICB2YXIgYmFzZVVybCA9IGxvY2F0aW9uLnByb3RvY29sICsgXCIvL1wiICsgbG9jYXRpb24uaG9zdDtcbiAgdmFyIGN1cnJlbnREaXIgPSBiYXNlVXJsICsgbG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXFwvW15cXC9dKiQvLCBcIi9cIik7XG5cblx0Ly8gY29udmVydCBlYWNoIHVybCguLi4pXG5cdC8qXG5cdFRoaXMgcmVndWxhciBleHByZXNzaW9uIGlzIGp1c3QgYSB3YXkgdG8gcmVjdXJzaXZlbHkgbWF0Y2ggYnJhY2tldHMgd2l0aGluXG5cdGEgc3RyaW5nLlxuXG5cdCAvdXJsXFxzKlxcKCAgPSBNYXRjaCBvbiB0aGUgd29yZCBcInVybFwiIHdpdGggYW55IHdoaXRlc3BhY2UgYWZ0ZXIgaXQgYW5kIHRoZW4gYSBwYXJlbnNcblx0ICAgKCAgPSBTdGFydCBhIGNhcHR1cmluZyBncm91cFxuXHQgICAgICg/OiAgPSBTdGFydCBhIG5vbi1jYXB0dXJpbmcgZ3JvdXBcblx0ICAgICAgICAgW14pKF0gID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgIHwgID0gT1Jcblx0ICAgICAgICAgXFwoICA9IE1hdGNoIGEgc3RhcnQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICg/OiAgPSBTdGFydCBhbm90aGVyIG5vbi1jYXB0dXJpbmcgZ3JvdXBzXG5cdCAgICAgICAgICAgICAgICAgW14pKF0rICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgIHwgID0gT1Jcblx0ICAgICAgICAgICAgICAgICBcXCggID0gTWF0Y2ggYSBzdGFydCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgICAgICBbXikoXSogID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgXFwpICA9IE1hdGNoIGEgZW5kIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICApICA9IEVuZCBHcm91cFxuICAgICAgICAgICAgICAqXFwpID0gTWF0Y2ggYW55dGhpbmcgYW5kIHRoZW4gYSBjbG9zZSBwYXJlbnNcbiAgICAgICAgICApICA9IENsb3NlIG5vbi1jYXB0dXJpbmcgZ3JvdXBcbiAgICAgICAgICAqICA9IE1hdGNoIGFueXRoaW5nXG4gICAgICAgKSAgPSBDbG9zZSBjYXB0dXJpbmcgZ3JvdXBcblx0IFxcKSAgPSBNYXRjaCBhIGNsb3NlIHBhcmVuc1xuXG5cdCAvZ2kgID0gR2V0IGFsbCBtYXRjaGVzLCBub3QgdGhlIGZpcnN0LiAgQmUgY2FzZSBpbnNlbnNpdGl2ZS5cblx0ICovXG5cdHZhciBmaXhlZENzcyA9IGNzcy5yZXBsYWNlKC91cmxcXHMqXFwoKCg/OlteKShdfFxcKCg/OlteKShdK3xcXChbXikoXSpcXCkpKlxcKSkqKVxcKS9naSwgZnVuY3Rpb24oZnVsbE1hdGNoLCBvcmlnVXJsKSB7XG5cdFx0Ly8gc3RyaXAgcXVvdGVzIChpZiB0aGV5IGV4aXN0KVxuXHRcdHZhciB1bnF1b3RlZE9yaWdVcmwgPSBvcmlnVXJsXG5cdFx0XHQudHJpbSgpXG5cdFx0XHQucmVwbGFjZSgvXlwiKC4qKVwiJC8sIGZ1bmN0aW9uKG8sICQxKXsgcmV0dXJuICQxOyB9KVxuXHRcdFx0LnJlcGxhY2UoL14nKC4qKSckLywgZnVuY3Rpb24obywgJDEpeyByZXR1cm4gJDE7IH0pO1xuXG5cdFx0Ly8gYWxyZWFkeSBhIGZ1bGwgdXJsPyBubyBjaGFuZ2Vcblx0XHRpZiAoL14oI3xkYXRhOnxodHRwOlxcL1xcL3xodHRwczpcXC9cXC98ZmlsZTpcXC9cXC9cXC8pL2kudGVzdCh1bnF1b3RlZE9yaWdVcmwpKSB7XG5cdFx0ICByZXR1cm4gZnVsbE1hdGNoO1xuXHRcdH1cblxuXHRcdC8vIGNvbnZlcnQgdGhlIHVybCB0byBhIGZ1bGwgdXJsXG5cdFx0dmFyIG5ld1VybDtcblxuXHRcdGlmICh1bnF1b3RlZE9yaWdVcmwuaW5kZXhPZihcIi8vXCIpID09PSAwKSB7XG5cdFx0ICBcdC8vVE9ETzogc2hvdWxkIHdlIGFkZCBwcm90b2NvbD9cblx0XHRcdG5ld1VybCA9IHVucXVvdGVkT3JpZ1VybDtcblx0XHR9IGVsc2UgaWYgKHVucXVvdGVkT3JpZ1VybC5pbmRleE9mKFwiL1wiKSA9PT0gMCkge1xuXHRcdFx0Ly8gcGF0aCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIGJhc2UgdXJsXG5cdFx0XHRuZXdVcmwgPSBiYXNlVXJsICsgdW5xdW90ZWRPcmlnVXJsOyAvLyBhbHJlYWR5IHN0YXJ0cyB3aXRoICcvJ1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBwYXRoIHNob3VsZCBiZSByZWxhdGl2ZSB0byBjdXJyZW50IGRpcmVjdG9yeVxuXHRcdFx0bmV3VXJsID0gY3VycmVudERpciArIHVucXVvdGVkT3JpZ1VybC5yZXBsYWNlKC9eXFwuXFwvLywgXCJcIik7IC8vIFN0cmlwIGxlYWRpbmcgJy4vJ1xuXHRcdH1cblxuXHRcdC8vIHNlbmQgYmFjayB0aGUgZml4ZWQgdXJsKC4uLilcblx0XHRyZXR1cm4gXCJ1cmwoXCIgKyBKU09OLnN0cmluZ2lmeShuZXdVcmwpICsgXCIpXCI7XG5cdH0pO1xuXG5cdC8vIHNlbmQgYmFjayB0aGUgZml4ZWQgY3NzXG5cdHJldHVybiBmaXhlZENzcztcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL3VybHMuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTEtMiEuL21haW4uY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHtcInNvdXJjZU1hcFwiOnRydWUsXCJobXJcIjp0cnVlfVxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMS0yIS4vbWFpbi5jc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTEtMiEuL21haW4uY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9tYWluLmNzc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHRydWUpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwic2VjdGlvbiB7XFxuICBjb2xvcjogI2E2ZGVmZjtcXG59XFxuaHRtbCB7aGVpZ2h0OiAxMDAlO31cXG5ib2R5IHtcXG4gIGZvbnQtZmFtaWx5OiAnV29yayBTYW5zJywgc2Fucy1zZXJpZjtcXG4gIGZvbnQtd2VpZ2h0OiA0MDA7XFxuICBjb2xvcjogI2ZmZmZmZjtcXG4gIG1pbi1oZWlnaHQ6IDEwMCU7XFxufVxcbnAge1xcbiAgbWFyZ2luLWJvdHRvbTogMS4zZW07XFxuICBsaW5lLWhlaWdodDogMS43O1xcbn1cXG4vKiBGb250IHNpemluZyBmcm9tIGh0dHA6Ly90eXBlLXNjYWxlLmNvbS8gKi9cXG5oMSwgaDIsIGgzLCBoNCB7XFxuICAvKiBtYXJnaW46IDFlbSAwIDAuNWVtOyAqL1xcbiAgbGluZS1oZWlnaHQ6IDEuMTtcXG4gIGxldHRlci1zcGFjaW5nOiAycHg7XFxuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xcbiAgcGFkZGluZzogMCAwIDFyZW0gMDtcXG4gIGNvbG9yOiAjZmZmZmZmO1xcbiAgZm9udC13ZWlnaHQ6IDcwMDtcXG4gIGZvbnQtZmFtaWx5OiAnVHJpcm9uZycsIHNlcmlmO1xcbn1cXG5oMSB7XFxuICBtYXJnaW4tdG9wOiAwO1xcbiAgZm9udC1zaXplOiAzLjU5OGVtO1xcbn1cXG5oMiB7Zm9udC1zaXplOiAyLjgyN2VtO31cXG5oMyB7Zm9udC1zaXplOiAxLjk5OWVtO31cXG5oNCB7Zm9udC1zaXplOiAxLjQxNGVtO31cXG5maWdjYXB0aW9uLCBzbWFsbCwgLmZvbnRfc21hbGwge2ZvbnQtc2l6ZTogMC44ZW07IHBhZGRpbmc6IDAgMCAycmVtOyBmb250LXdlaWdodDogNTAwO31cXG4vKiBoaWRlIHNjcmVlbi1yZWFkZXIgb25seSB0ZXh0LiBodHRwczovL3dlYmFpbS5vcmcvdGVjaG5pcXVlcy9jc3MvaW52aXNpYmxlY29udGVudC8gKi9cXG4uY2xpcCB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGUgIWltcG9ydGFudDtcXG4gIGNsaXA6IHJlY3QoMXB4IDFweCAxcHggMXB4KTsgLyogSUU2LCBJRTcgKi9cXG4gIGNsaXA6IHJlY3QoMXB4LCAxcHgsIDFweCwgMXB4KTtcXG59XFxuaW1nIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IGF1dG87XFxufVxcbmEge1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbiAgY29sb3I6ICNhNmRlZmY7XFxuICAtd2Via2l0LXRyYW5zaXRpb246IDAuM3MgZWFzZSBhbGw7XFxuICB0cmFuc2l0aW9uOiAwLjNzIGVhc2UgYWxsO1xcbiAgcGFkZGluZzogMCAwIDNweDtcXG4gIGJvcmRlci1ib3R0b206IDNweCBzb2xpZCAjMDAwMDAwO1xcbn1cXG5hOmhvdmVyIHtcXG4gIGNvbG9yOiAjYTZkZWZmO1xcbiAgYm9yZGVyLWJvdHRvbTogM3B4IHNvbGlkICNhNmRlZmY7XFxufVxcbi8qICAtLS0tLS0tLSBNZWRpYSBRdWVyaWVzIC0tLS0tLS0gKi9cXG4vKiBNb2JpbGUgKi9cXG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtaW4td2lkdGg6IDMyMHB4KSBhbmQgKG1heC13aWR0aDogNDgwcHgpIHtcXG4gIGgxIHtcXG4gICAgbWFyZ2luLXRvcDogMDtcXG4gICAgZm9udC1zaXplOiAyLjA3NGVtO1xcbiAgfVxcbiAgXFxuICBoMiB7XFxuICAgIGZvbnQtc2l6ZTogMS43MjhlbTtcXG4gIH1cXG4gIFxcbiAgaDMge1xcbiAgICBmb250LXNpemU6IDEuNDRlbTtcXG4gIH1cXG4gIFxcbiAgaDQge1xcbiAgICBmb250LXNpemU6IDEuMmVtO1xcbiAgfVxcbn1cXG4vKiBUYWJsZXQgKi9cXG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtaW4td2lkdGg6IDQ4MHB4KSBhbmQgKG1heC13aWR0aDogODAwcHgpIHtcXG4gIGgxIHtcXG4gICAgICBmb250LXNpemU6IDIuOTU3ZW07XFxuICB9XFxuXFxuICBoMiB7XFxuICAgICAgZm9udC1zaXplOiAyLjM2OWVtO1xcbiAgfVxcblxcbiAgaDMge1xcbiAgICAgIGZvbnQtc2l6ZTogMS43NzdlbTtcXG4gIH1cXG5cXG4gIGg0IHtcXG4gICAgICBmb250LXNpemU6IDEuMzMzZW07XFxuICB9XFxufVwiLCBcIlwiLCB7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCIvVXNlcnMvZW5kdXNlci9EZXNrdG9wL25hY2hvLzQwMS90cmF2ZWwtYXBwL2NvbXBvbmVudHMvdmFyaWFibGVzLmNzc1wiLFwiL1VzZXJzL2VuZHVzZXIvRGVza3RvcC9uYWNoby80MDEvdHJhdmVsLWFwcC9tYWluLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFZQTtFQUNFLGVBQWU7Q0FDaEI7QUNaRCxNQUFNLGFBQWEsQ0FBQztBQUVwQjtFQUNFLHFDQUFxQztFQUNyQyxpQkFBaUI7RUFDakIsZUFBYztFQUNkLGlCQUFpQjtDQUNsQjtBQUVEO0VBQ0UscUJBQXFCO0VBQ3JCLGlCQUFpQjtDQUNsQjtBQUVELDZDQUE2QztBQUM3QztFQUNFLDBCQUEwQjtFQUMxQixpQkFBaUI7RUFDakIsb0JBQW9CO0VBQ3BCLDBCQUEwQjtFQUMxQixvQkFBb0I7RUFDcEIsZUFBYztFQUNkLGlCQUFpQjtFQUNqQiw4QkFBOEI7Q0FDL0I7QUFFRDtFQUNFLGNBQWM7RUFDZCxtQkFBbUI7Q0FDcEI7QUFFRCxJQUFJLG1CQUFtQixDQUFDO0FBRXhCLElBQUksbUJBQW1CLENBQUM7QUFFeEIsSUFBSSxtQkFBbUIsQ0FBQztBQUV4QixnQ0FBZ0MsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsaUJBQWlCLENBQUM7QUFFdkYsdUZBQXVGO0FBQ3ZGO0VBQ0UsOEJBQThCO0VBQzlCLDRCQUE0QixDQUFDLGNBQWM7RUFDM0MsK0JBQStCO0NBQ2hDO0FBRUQ7RUFDRSxlQUFlO0VBQ2YsWUFBWTtFQUNaLGFBQWE7Q0FDZDtBQUVEO0VBQ0Usc0JBQXNCO0VBQ3RCLGVBQWE7RUFDYixrQ0FBMEI7RUFBMUIsMEJBQTBCO0VBQzFCLGlCQUFpQjtFQUNqQixpQ0FBZ0M7Q0FDakM7QUFFRDtFQUNFLGVBQWE7RUFDYixpQ0FBK0I7Q0FDaEM7QUFFRCxxQ0FBcUM7QUFFckMsWUFBWTtBQUNaO0VBQ0U7SUFDRSxjQUFjO0lBQ2QsbUJBQW1CO0dBQ3BCOztFQUVEO0lBQ0UsbUJBQW1CO0dBQ3BCOztFQUVEO0lBQ0Usa0JBQWtCO0dBQ25COztFQUVEO0lBQ0UsaUJBQWlCO0dBQ2xCO0NBQ0Y7QUFFRCxZQUFZO0FBQ1o7RUFDRTtNQUNJLG1CQUFtQjtHQUN0Qjs7RUFFRDtNQUNJLG1CQUFtQjtHQUN0Qjs7RUFFRDtNQUNJLG1CQUFtQjtHQUN0Qjs7RUFFRDtNQUNJLG1CQUFtQjtHQUN0QjtDQUNGXCIsXCJmaWxlXCI6XCJtYWluLmNzc1wiLFwic291cmNlc0NvbnRlbnRcIjpbXCIkYWNjZW50OiAjZmY4YzhjO1xcbiRsaW5rOiAjYTZkZWZmO1xcbiRkYXJrbGluazogIzAwN0JDMjtcXG4kbGlnaHRncmF5OiAjZWVlZWVlO1xcbiRkYXJrZ3JheTogIzQ0NDE0MDtcXG4kd2hpdGU6ICNmZmZmZmY7XFxuJGdyYXk6ICNFMEUwRTA7XFxuJGJsYWNrOiAjMDAwMDAwO1xcblxcbiRtYXhWaWV3cG9ydFNpemU6IDEyODBweDtcXG4kcGFkZGluZzogMnJlbTtcXG5cXG5zZWN0aW9uIHtcXG4gIGNvbG9yOiAjYTZkZWZmO1xcbn1cIixcIkBpbXBvcnQgJy4vY29tcG9uZW50cy92YXJpYWJsZXMuY3NzJztcXG5cXG5odG1sIHtoZWlnaHQ6IDEwMCU7fVxcblxcbmJvZHkge1xcbiAgZm9udC1mYW1pbHk6ICdXb3JrIFNhbnMnLCBzYW5zLXNlcmlmO1xcbiAgZm9udC13ZWlnaHQ6IDQwMDtcXG4gIGNvbG9yOiAkd2hpdGU7XFxuICBtaW4taGVpZ2h0OiAxMDAlO1xcbn1cXG5cXG5wIHtcXG4gIG1hcmdpbi1ib3R0b206IDEuM2VtO1xcbiAgbGluZS1oZWlnaHQ6IDEuNztcXG59XFxuXFxuLyogRm9udCBzaXppbmcgZnJvbSBodHRwOi8vdHlwZS1zY2FsZS5jb20vICovXFxuaDEsIGgyLCBoMywgaDQge1xcbiAgLyogbWFyZ2luOiAxZW0gMCAwLjVlbTsgKi9cXG4gIGxpbmUtaGVpZ2h0OiAxLjE7XFxuICBsZXR0ZXItc3BhY2luZzogMnB4O1xcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcXG4gIHBhZGRpbmc6IDAgMCAxcmVtIDA7XFxuICBjb2xvcjogJHdoaXRlO1xcbiAgZm9udC13ZWlnaHQ6IDcwMDtcXG4gIGZvbnQtZmFtaWx5OiAnVHJpcm9uZycsIHNlcmlmO1xcbn1cXG5cXG5oMSB7XFxuICBtYXJnaW4tdG9wOiAwO1xcbiAgZm9udC1zaXplOiAzLjU5OGVtO1xcbn1cXG5cXG5oMiB7Zm9udC1zaXplOiAyLjgyN2VtO31cXG5cXG5oMyB7Zm9udC1zaXplOiAxLjk5OWVtO31cXG5cXG5oNCB7Zm9udC1zaXplOiAxLjQxNGVtO31cXG5cXG5maWdjYXB0aW9uLCBzbWFsbCwgLmZvbnRfc21hbGwge2ZvbnQtc2l6ZTogMC44ZW07IHBhZGRpbmc6IDAgMCAycmVtOyBmb250LXdlaWdodDogNTAwO31cXG5cXG4vKiBoaWRlIHNjcmVlbi1yZWFkZXIgb25seSB0ZXh0LiBodHRwczovL3dlYmFpbS5vcmcvdGVjaG5pcXVlcy9jc3MvaW52aXNpYmxlY29udGVudC8gKi9cXG4uY2xpcCB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGUgIWltcG9ydGFudDtcXG4gIGNsaXA6IHJlY3QoMXB4IDFweCAxcHggMXB4KTsgLyogSUU2LCBJRTcgKi9cXG4gIGNsaXA6IHJlY3QoMXB4LCAxcHgsIDFweCwgMXB4KTtcXG59XFxuXFxuaW1nIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IGF1dG87XFxufVxcblxcbmEge1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbiAgY29sb3I6ICRsaW5rO1xcbiAgdHJhbnNpdGlvbjogMC4zcyBlYXNlIGFsbDtcXG4gIHBhZGRpbmc6IDAgMCAzcHg7XFxuICBib3JkZXItYm90dG9tOiAzcHggc29saWQgJGJsYWNrO1xcbn1cXG5cXG5hOmhvdmVyIHtcXG4gIGNvbG9yOiAkbGluaztcXG4gIGJvcmRlci1ib3R0b206IDNweCBzb2xpZCAkbGluaztcXG59XFxuXFxuLyogIC0tLS0tLS0tIE1lZGlhIFF1ZXJpZXMgLS0tLS0tLSAqL1xcblxcbi8qIE1vYmlsZSAqL1xcbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1pbi13aWR0aDogMzIwcHgpIGFuZCAobWF4LXdpZHRoOiA0ODBweCkge1xcbiAgaDEge1xcbiAgICBtYXJnaW4tdG9wOiAwO1xcbiAgICBmb250LXNpemU6IDIuMDc0ZW07XFxuICB9XFxuICBcXG4gIGgyIHtcXG4gICAgZm9udC1zaXplOiAxLjcyOGVtO1xcbiAgfVxcbiAgXFxuICBoMyB7XFxuICAgIGZvbnQtc2l6ZTogMS40NGVtO1xcbiAgfVxcbiAgXFxuICBoNCB7XFxuICAgIGZvbnQtc2l6ZTogMS4yZW07XFxuICB9XFxufVxcblxcbi8qIFRhYmxldCAqL1xcbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1pbi13aWR0aDogNDgwcHgpIGFuZCAobWF4LXdpZHRoOiA4MDBweCkge1xcbiAgaDEge1xcbiAgICAgIGZvbnQtc2l6ZTogMi45NTdlbTtcXG4gIH1cXG5cXG4gIGgyIHtcXG4gICAgICBmb250LXNpemU6IDIuMzY5ZW07XFxuICB9XFxuXFxuICBoMyB7XFxuICAgICAgZm9udC1zaXplOiAxLjc3N2VtO1xcbiAgfVxcblxcbiAgaDQge1xcbiAgICAgIGZvbnQtc2l6ZTogMS4zMzNlbTtcXG4gIH1cXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXI/e1wiaW1wb3J0TG9hZGVyc1wiOjEsXCJzb3VyY2VNYXBcIjp0cnVlfSEuL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWI/e1wic291cmNlTWFwXCI6dHJ1ZX0hLi9zcmMvbWFpbi5jc3Ncbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IFRlbXBsYXRlIGZyb20gJy4uL1RlbXBsYXRlJztcbmltcG9ydCBodG1sIGZyb20gJy4vYXBwLmh0bWwnO1xuaW1wb3J0ICcuL2FwcC5jc3MnO1xuaW1wb3J0IEhlYWRlciBmcm9tICcuLi9oZWFkZXIvSGVhZGVyJztcbmltcG9ydCBIb21lIGZyb20gJy4uL2hvbWUvSG9tZSc7XG5pbXBvcnQgUmVzb3VyY2VzIGZyb20gJy4uL3Jlc291cmNlcy9SZXNvdXJjZXMnO1xuaW1wb3J0IEZvb3RlciBmcm9tICcuLi9mb290ZXIvRm9vdGVyLmpzJztcbmltcG9ydCB7IHJlbW92ZUNoaWxkcmVuIH0gZnJvbSAnLi4vZG9tJztcblxuY29uc3QgdGVtcGxhdGUgPSBuZXcgVGVtcGxhdGUoaHRtbCk7XG5cbi8vIEhhc2ggTmF2aWdhdGlvblxuY29uc3QgbWFwID0gbmV3IE1hcCgpO1xubWFwLnNldCgnI2hvbWUnLCBIb21lKTtcbm1hcC5zZXQoJyNyZXNvdXJjZXMnLCBSZXNvdXJjZXMpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcHAge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHdpbmRvdy5vbmhhc2hjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICB0aGlzLnNldFBhZ2UoKTtcbiAgICB9O1xuICB9XG4gIFxuICBzZXRQYWdlKCkge1xuICAgIGNvbnN0IENvbXBvbmVudCA9IG1hcC5nZXQod2luZG93LmxvY2F0aW9uLmhhc2gpIHx8IEhvbWU7XG4gICAgY29uc3QgY29tcG9uZW50ID0gbmV3IENvbXBvbmVudCgpO1xuICAgIHJlbW92ZUNoaWxkcmVuKHRoaXMubWFpbik7XG4gICAgdGhpcy5tYWluLmFwcGVuZENoaWxkKGNvbXBvbmVudC5yZW5kZXIoKSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgZG9tID0gdGVtcGxhdGUuY2xvbmUoKTsgICBcbiAgICAgIFxuICAgIGRvbS5xdWVyeVNlbGVjdG9yKCdoZWFkZXInKS5hcHBlbmRDaGlsZChuZXcgSGVhZGVyKCkucmVuZGVyKCkpO1xuICAgIGRvbS5xdWVyeVNlbGVjdG9yKCdmb290ZXInKS5hcHBlbmRDaGlsZChuZXcgRm9vdGVyKCkucmVuZGVyKCkpO1xuXG4gICAgdGhpcy5tYWluID0gZG9tLnF1ZXJ5U2VsZWN0b3IoJ21haW4nKTtcbiAgICB0aGlzLnNldFBhZ2UoKTtcblxuICAgIHJldHVybiBkb207XG4gIH1cbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21wb25lbnRzL2FwcC9BcHAuanNcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxoZWFkZXIgcm9sZT1cXFwiYmFubmVyXFxcIiBpZD1cXFwiaGVhZGVyXFxcIj48L2hlYWRlcj5cXG5cXG48bWFpbiByb2xlPVxcXCJtYWluXFxcIiBpZD1cXFwibWFpblxcXCIgY2xhc3M9XFxcImNvbnRlbnRcXFwiPjwvbWFpbj5cXG5cXG48Zm9vdGVyIHJvbGU9XFxcImNvbnRlbnRpbmZvXFxcIiBpZD1cXFwiZm9vdGVyXFxcIj48L2Zvb3Rlcj5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21wb25lbnRzL2FwcC9hcHAuaHRtbFxuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTEtMiEuL2FwcC5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge1wic291cmNlTWFwXCI6dHJ1ZSxcImhtclwiOnRydWV9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0xLTIhLi9hcHAuY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0xLTIhLi9hcHAuY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21wb25lbnRzL2FwcC9hcHAuY3NzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHRydWUpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwic2VjdGlvbiB7XFxuICBjb2xvcjogI2E2ZGVmZjtcXG59XFxuI3Jvb3Qge1xcbiAgbWluLWhlaWdodDogMTAwdmg7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1hcmVhczpcXG4gIFxcXCJoZWFkZXJcXFwiXFxuICBcXFwiY29udGVudFxcXCJcXG4gIFxcXCJmb290ZXJcXFwiO1xcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiBhdXRvIDFmciBhdXRvO1xcbn1cXG4ubWF4d2lkdGgtd3JhcCB7XFxuICAvKiB3aWR0aDogMTAwJTsgKi9cXG4gIG1heC13aWR0aDogMTI4MHB4O1xcbiAgbWFyZ2luOiAwIGF1dG87XFxufVxcbiNoZWFkZXIge1xcbiAgZ3JpZC1hcmVhOiBoZWFkZXI7XFxuICBiYWNrZ3JvdW5kOiAjZmZmZmZmO1xcbiAgY29sb3I6ICMwMDAwMDA7XFxuICBwYWRkaW5nOiAycmVtO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG4jbWFpbiB7XFxuICBncmlkLWFyZWE6IGNvbnRlbnQ7XFxuICBiYWNrZ3JvdW5kOiAjMDAwMDAwO1xcbn1cXG4jZm9vdGVyIHtcXG4gIGdyaWQtYXJlYTogZm9vdGVyO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgcGFkZGluZzogMnJlbTtcXG4gIGJhY2tncm91bmQ6ICMwMDAwMDA7XFxufVwiLCBcIlwiLCB7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCIvVXNlcnMvZW5kdXNlci9EZXNrdG9wL25hY2hvLzQwMS92YXJpYWJsZXMuY3NzXCIsXCIvVXNlcnMvZW5kdXNlci9EZXNrdG9wL25hY2hvLzQwMS90cmF2ZWwtYXBwL2FwcC5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBWUE7RUFDRSxlQUFlO0NBQ2hCO0FDWkQ7RUFDRSxrQkFBa0I7RUFDbEIsY0FBYztFQUNkOzs7V0FHUztFQUNULGtDQUFrQztDQUNuQztBQUVEO0VBQ0Usa0JBQWtCO0VBQ2xCLGtCQUE0QjtFQUM1QixlQUFlO0NBQ2hCO0FBRUQ7RUFDRSxrQkFBa0I7RUFDbEIsb0JBQW1CO0VBQ25CLGVBQWM7RUFDZCxjQUFrQjtFQUNsQixtQkFBbUI7Q0FDcEI7QUFFRDtFQUNFLG1CQUFtQjtFQUNuQixvQkFBbUI7Q0FDcEI7QUFFRDtFQUNFLGtCQUFrQjtFQUNsQixtQkFBbUI7RUFDbkIsY0FBa0I7RUFDbEIsb0JBQW1CO0NBQ3BCXCIsXCJmaWxlXCI6XCJhcHAuY3NzXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIiRhY2NlbnQ6ICNmZjhjOGM7XFxuJGxpbms6ICNhNmRlZmY7XFxuJGRhcmtsaW5rOiAjMDA3QkMyO1xcbiRsaWdodGdyYXk6ICNlZWVlZWU7XFxuJGRhcmtncmF5OiAjNDQ0MTQwO1xcbiR3aGl0ZTogI2ZmZmZmZjtcXG4kZ3JheTogI0UwRTBFMDtcXG4kYmxhY2s6ICMwMDAwMDA7XFxuXFxuJG1heFZpZXdwb3J0U2l6ZTogMTI4MHB4O1xcbiRwYWRkaW5nOiAycmVtO1xcblxcbnNlY3Rpb24ge1xcbiAgY29sb3I6ICNhNmRlZmY7XFxufVwiLFwiQGltcG9ydCAnLi4vdmFyaWFibGVzLmNzcyc7XFxuXFxuI3Jvb3Qge1xcbiAgbWluLWhlaWdodDogMTAwdmg7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1hcmVhczpcXG4gIFxcXCJoZWFkZXJcXFwiXFxuICBcXFwiY29udGVudFxcXCJcXG4gIFxcXCJmb290ZXJcXFwiO1xcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiBhdXRvIDFmciBhdXRvO1xcbn1cXG5cXG4ubWF4d2lkdGgtd3JhcCB7XFxuICAvKiB3aWR0aDogMTAwJTsgKi9cXG4gIG1heC13aWR0aDogJG1heFZpZXdwb3J0U2l6ZTtcXG4gIG1hcmdpbjogMCBhdXRvO1xcbn1cXG5cXG4jaGVhZGVyIHtcXG4gIGdyaWQtYXJlYTogaGVhZGVyO1xcbiAgYmFja2dyb3VuZDogJHdoaXRlO1xcbiAgY29sb3I6ICRibGFjaztcXG4gIHBhZGRpbmc6ICRwYWRkaW5nO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5cXG4jbWFpbiB7XFxuICBncmlkLWFyZWE6IGNvbnRlbnQ7XFxuICBiYWNrZ3JvdW5kOiAkYmxhY2s7XFxufVxcblxcbiNmb290ZXIge1xcbiAgZ3JpZC1hcmVhOiBmb290ZXI7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBwYWRkaW5nOiAkcGFkZGluZztcXG4gIGJhY2tncm91bmQ6ICRibGFjaztcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXI/e1wiaW1wb3J0TG9hZGVyc1wiOjEsXCJzb3VyY2VNYXBcIjp0cnVlfSEuL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWI/e1wic291cmNlTWFwXCI6dHJ1ZX0hLi9zcmMvY29tcG9uZW50cy9hcHAvYXBwLmNzc1xuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IGh0bWwgZnJvbSAnLi9oZWFkZXIuaHRtbCc7XG5pbXBvcnQgJy4vaGVhZGVyLmNzcyc7XG5pbXBvcnQgVGVtcGxhdGUgZnJvbSAnLi4vVGVtcGxhdGUnO1xuXG5jb25zdCB0ZW1wbGF0ZSA9IG5ldyBUZW1wbGF0ZShodG1sKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVhZGVyIHtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgZG9tID0gdGVtcGxhdGUuY2xvbmUoKTtcblxuICAgIHJldHVybiBkb207XG4gIH1cbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21wb25lbnRzL2hlYWRlci9IZWFkZXIuanNcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCI8c2VjdGlvbiBjbGFzcz1cXFwibWF4d2lkdGgtd3JhcCBoZWFkZXItZmxleFxcXCI+XFxuICA8ZGl2PlxcbiAgICA8YSBocmVmPVxcXCIjaG9tZVxcXCIgY2xhc3M9XFxcImxvZ29cXFwiIGFsdD1cXFwiR28gdG8gSG9tZSBwYWdlXFxcIj48aW1nIGNsYXNzPVxcXCJsb2dvXFxcIiBzcmM9XFxcIlwiICsgcmVxdWlyZShcIi4uLy4uL2ltYWdlcy9jcm9zcy5zdmdcIikgKyBcIlxcXCIgYWx0PVxcXCJIb21lIGxvZ28gaW1hZ2VcXFwiPjwvYT5cXG4gIDwvZGl2PlxcbiAgPG5hdiByb2xlPVxcXCJuYXZpZ2F0aW9uXFxcIj5cXG4gICAgPHVsIGNsYXNzPVxcXCJ1bGlzdFxcXCI+XFxuICAgICAgPGxpPjxhIGhyZWY9XFxcIiNob21lXFxcIiBhbHQ9XFxcIkdvIHRvIEFib3V0IEljZWxhbmQgcGFnZVxcXCI+QWJvdXQgSWNlbGFuZDwvYT48L2xpPlxcbiAgICAgIDxsaT48YSBocmVmPVxcXCIjcmVzb3VyY2VzXFxcIiBhbHQ9XFxcIkdvIHRvIFJlc291cmNlcyBwYWdlXFxcIj5SZXNvdXJjZXM8L2E+PC9saT5cXG4gICAgPC91bD5cXG4gIDwvbmF2Plxcbjwvc2VjdGlvbj5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21wb25lbnRzL2hlYWRlci9oZWFkZXIuaHRtbFxuLy8gbW9kdWxlIGlkID0gMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEQ5NGJXd2dkbVZ5YzJsdmJqMGlNUzR3SWlCbGJtTnZaR2x1WnowaWRYUm1MVGdpUHo0S1BDRXRMU0JIWlc1bGNtRjBiM0k2SUVGa2IySmxJRWxzYkhWemRISmhkRzl5SURJeUxqQXVNU3dnVTFaSElFVjRjRzl5ZENCUWJIVm5MVWx1SUM0Z1UxWkhJRlpsY25OcGIyNDZJRFl1TURBZ1FuVnBiR1FnTUNrZ0lDMHRQZ284YzNabklIWmxjbk5wYjI0OUlqRXVNU0lnYVdROUlreGhlV1Z5WHpFaUlIaHRiRzV6UFNKb2RIUndPaTh2ZDNkM0xuY3pMbTl5Wnk4eU1EQXdMM04yWnlJZ2VHMXNibk02ZUd4cGJtczlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1RrdmVHeHBibXNpSUhnOUlqQndlQ0lnZVQwaU1IQjRJZ29KSUhacFpYZENiM2c5SWpBZ01DQTFNREF1TkNBek9DNDFJaUJ6ZEhsc1pUMGlaVzVoWW14bExXSmhZMnRuY205MWJtUTZibVYzSURBZ01DQTFNREF1TkNBek9DNDFPeUlnZUcxc09uTndZV05sUFNKd2NtVnpaWEoyWlNJK0NqeHpkSGxzWlNCMGVYQmxQU0owWlhoMEwyTnpjeUkrQ2drdWMzUXdlMlpwYkd3Nkl6azBSRFpHUmp0OUNna3VjM1F4ZTJadmJuUXRabUZ0YVd4NU9pZEVhV1J2ZEMxSmRHRnNhV01uTzMwS0NTNXpkREo3Wm05dWRDMXphWHBsT2pVd0xqUXpOak53ZUR0OUNqd3ZjM1I1YkdVK0NqeG5QZ29KUEdjK0Nna0pQSEpsWTNRZ2VEMGlNQzR5SWlCNVBTSXhNeTR6SWlCamJHRnpjejBpYzNRd0lpQjNhV1IwYUQwaU16WWlJR2hsYVdkb2REMGlNVElpTHo0S0NUd3ZaejRLQ1R4blBnb0pDVHh5WldOMElIZzlJakV5TGpJaUlIazlJakV1TkNJZ1kyeGhjM005SW5OME1DSWdkMmxrZEdnOUlqRXlJaUJvWldsbmFIUTlJak0ySWk4K0NnazhMMmMrQ2p3dlp6NEtQSFJsZUhRZ2RISmhibk5tYjNKdFBTSnRZWFJ5YVhnb01TQXdJREFnTVNBME5DNHlORGsxSURNM0xqTTFNVEVwSWlCamJHRnpjejBpYzNReElITjBNaUkrVkZKQlZrVk1JQ0JKUTBWTVFVNUVQQzkwWlhoMFBnbzhMM04yWno0S1wiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaW1hZ2VzL2Nyb3NzLnN2Z1xuLy8gbW9kdWxlIGlkID0gMTVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTEtMiEuL2hlYWRlci5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge1wic291cmNlTWFwXCI6dHJ1ZSxcImhtclwiOnRydWV9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0xLTIhLi9oZWFkZXIuY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0xLTIhLi9oZWFkZXIuY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21wb25lbnRzL2hlYWRlci9oZWFkZXIuY3NzXG4vLyBtb2R1bGUgaWQgPSAxNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHRydWUpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwic2VjdGlvbiB7XFxuICBjb2xvcjogI2E2ZGVmZjtcXG59XFxuLmhlYWRlci1mbGV4IHtcXG4gIGRpc3BsYXk6IC13ZWJraXQtYm94O1xcbiAgZGlzcGxheTogLW1zLWZsZXhib3g7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgLXdlYmtpdC1ib3gtcGFjazoganVzdGlmeTtcXG4gICAgICAtbXMtZmxleC1wYWNrOiBqdXN0aWZ5O1xcbiAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxuICAtd2Via2l0LWJveC1hbGlnbjogY2VudGVyO1xcbiAgICAgIC1tcy1mbGV4LWFsaWduOiBjZW50ZXI7XFxuICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcbi5sb2dvIHtcXG4gIG1heC13aWR0aDogMjFyZW07XFxufVxcbi5sb2dvLXRleHQge1xcbiAgZm9udC1zaXplOiAxLjVyZW07XFxufVxcbi51bGlzdCB7XFxuICBkaXNwbGF5OiAtd2Via2l0LWJveDtcXG4gIGRpc3BsYXk6IC1tcy1mbGV4Ym94O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIC13ZWJraXQtYm94LXBhY2s6IGNlbnRlcjtcXG4gICAgICAtbXMtZmxleC1wYWNrOiBjZW50ZXI7XFxuICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgbWFyZ2luOiAwO1xcbn1cXG4udWxpc3QgbGkge1xcbiAgICBwYWRkaW5nOiAwIDFyZW07XFxuICB9XFxuLnVsaXN0IGxpIGEge1xcbiAgICAgIGNvbG9yOiAjMDAwMDAwO1xcbiAgICAgIGJvcmRlci1ib3R0b206IDNweCBzb2xpZCAjZmZmZmZmO1xcbiAgICAgIC13ZWJraXQtdHJhbnNpdGlvbjogMC4zcyBlYXNlIGFsbDtcXG4gICAgICB0cmFuc2l0aW9uOiAwLjNzIGVhc2UgYWxsO1xcbiAgICB9XFxuLnVsaXN0IGxpIGE6aG92ZXIge1xcbiAgICAgIGJvcmRlci1ib3R0b20tY29sb3I6ICNhNmRlZmY7XFxuICAgIH1cXG5uYXYge1xcbiAgLXdlYmtpdC1ib3gtcGFjazogZW5kO1xcbiAgICAgIC1tcy1mbGV4LXBhY2s6IGVuZDtcXG4gICAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcXG59XFxuLyogIC0tLS0tLS0tIE1lZGlhIFF1ZXJpZXMgLS0tLS0tLSAqL1xcbi8qIE1vYmlsZSAqL1xcbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1pbi13aWR0aDogMzIwcHgpIGFuZCAobWF4LXdpZHRoOiA2NDBweCkge1xcbiAgLmhlYWRlci1mbGV4IHtcXG4gICAgLXdlYmtpdC1ib3gtb3JpZW50OiB2ZXJ0aWNhbDtcXG4gICAgLXdlYmtpdC1ib3gtZGlyZWN0aW9uOiBub3JtYWw7XFxuICAgICAgICAtbXMtZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgfVxcblxcbiAgLnVsaXN0IHtcXG4gICAgbWFyZ2luOiAxLjFyZW0gMCAwO1xcbiAgfVxcbn1cIiwgXCJcIiwge1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiL1VzZXJzL2VuZHVzZXIvRGVza3RvcC9uYWNoby80MDEvdmFyaWFibGVzLmNzc1wiLFwiL1VzZXJzL2VuZHVzZXIvRGVza3RvcC9uYWNoby80MDEvdHJhdmVsLWFwcC9oZWFkZXIuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQVlBO0VBQ0UsZUFBZTtDQUNoQjtBQ1pEO0VBQ0UscUJBQWM7RUFBZCxxQkFBYztFQUFkLGNBQWM7RUFDZCwwQkFBK0I7TUFBL0IsdUJBQStCO1VBQS9CLCtCQUErQjtFQUMvQiwwQkFBb0I7TUFBcEIsdUJBQW9CO1VBQXBCLG9CQUFvQjtDQUNyQjtBQUVEO0VBQ0UsaUJBQWlCO0NBQ2xCO0FBRUQ7RUFDRSxrQkFBa0I7Q0FDbkI7QUFFRDtFQUNFLHFCQUFjO0VBQWQscUJBQWM7RUFBZCxjQUFjO0VBQ2QseUJBQXdCO01BQXhCLHNCQUF3QjtVQUF4Qix3QkFBd0I7RUFDeEIsVUFBVTtDQVlYO0FBWEM7SUFDRSxnQkFBZ0I7R0FTakI7QUFSQztNQUNFLGVBQWM7TUFDZCxpQ0FBZ0M7TUFDaEMsa0NBQTBCO01BQTFCLDBCQUEwQjtLQUMzQjtBQUNEO01BQ0UsNkJBQTJCO0tBQzVCO0FBSUw7RUFDRSxzQkFBMEI7TUFBMUIsbUJBQTBCO1VBQTFCLDBCQUEwQjtDQUMzQjtBQUVELHFDQUFxQztBQUVyQyxZQUFZO0FBQ1o7RUFDRTtJQUNFLDZCQUF1QjtJQUF2Qiw4QkFBdUI7UUFBdkIsMkJBQXVCO1lBQXZCLHVCQUF1QjtHQUN4Qjs7RUFFRDtJQUNFLG1CQUFtQjtHQUNwQjtDQUNGXCIsXCJmaWxlXCI6XCJoZWFkZXIuY3NzXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIiRhY2NlbnQ6ICNmZjhjOGM7XFxuJGxpbms6ICNhNmRlZmY7XFxuJGRhcmtsaW5rOiAjMDA3QkMyO1xcbiRsaWdodGdyYXk6ICNlZWVlZWU7XFxuJGRhcmtncmF5OiAjNDQ0MTQwO1xcbiR3aGl0ZTogI2ZmZmZmZjtcXG4kZ3JheTogI0UwRTBFMDtcXG4kYmxhY2s6ICMwMDAwMDA7XFxuXFxuJG1heFZpZXdwb3J0U2l6ZTogMTI4MHB4O1xcbiRwYWRkaW5nOiAycmVtO1xcblxcbnNlY3Rpb24ge1xcbiAgY29sb3I6ICNhNmRlZmY7XFxufVwiLFwiQGltcG9ydCAnLi4vdmFyaWFibGVzLmNzcyc7XFxuXFxuLmhlYWRlci1mbGV4IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG4ubG9nbyB7XFxuICBtYXgtd2lkdGg6IDIxcmVtO1xcbn1cXG5cXG4ubG9nby10ZXh0IHtcXG4gIGZvbnQtc2l6ZTogMS41cmVtO1xcbn1cXG5cXG4udWxpc3Qge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgbWFyZ2luOiAwO1xcbiAgbGkge1xcbiAgICBwYWRkaW5nOiAwIDFyZW07XFxuICAgIGEge1xcbiAgICAgIGNvbG9yOiAkYmxhY2s7XFxuICAgICAgYm9yZGVyLWJvdHRvbTogM3B4IHNvbGlkICR3aGl0ZTtcXG4gICAgICB0cmFuc2l0aW9uOiAwLjNzIGVhc2UgYWxsO1xcbiAgICB9XFxuICAgIGE6aG92ZXIge1xcbiAgICAgIGJvcmRlci1ib3R0b20tY29sb3I6ICRsaW5rO1xcbiAgICB9XFxuICB9XFxufVxcblxcbm5hdiB7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xcbn1cXG5cXG4vKiAgLS0tLS0tLS0gTWVkaWEgUXVlcmllcyAtLS0tLS0tICovXFxuXFxuLyogTW9iaWxlICovXFxuQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWluLXdpZHRoOiAzMjBweCkgYW5kIChtYXgtd2lkdGg6IDY0MHB4KSB7XFxuICAuaGVhZGVyLWZsZXgge1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgfVxcblxcbiAgLnVsaXN0IHtcXG4gICAgbWFyZ2luOiAxLjFyZW0gMCAwO1xcbiAgfVxcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlcj97XCJpbXBvcnRMb2FkZXJzXCI6MSxcInNvdXJjZU1hcFwiOnRydWV9IS4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYj97XCJzb3VyY2VNYXBcIjp0cnVlfSEuL3NyYy9jb21wb25lbnRzL2hlYWRlci9oZWFkZXIuY3NzXG4vLyBtb2R1bGUgaWQgPSAxN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgaHRtbCBmcm9tICcuL2hvbWUuaHRtbCc7XG5pbXBvcnQgJy4vaG9tZS5jc3MnO1xuaW1wb3J0IFRlbXBsYXRlIGZyb20gJy4uL1RlbXBsYXRlJztcblxuY29uc3QgdGVtcGxhdGUgPSBuZXcgVGVtcGxhdGUoaHRtbCk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhvbWUge1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBkb20gPSB0ZW1wbGF0ZS5jbG9uZSgpO1xuXG4gICAgcmV0dXJuIGRvbTtcbiAgfVxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBvbmVudHMvaG9tZS9Ib21lLmpzXG4vLyBtb2R1bGUgaWQgPSAxOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPHBpY3R1cmU+XFxuICA8c291cmNlIG1lZGlhPVxcXCIobWluLXdpZHRoOiAxMDI0cHgpXFxcIiBzcmNzZXQ9XFxcIi4uLy4uL2ltYWdlcy9oZXJvLWxhcmdlLmpwZywgLi4vLi4vaW1hZ2VzL2hlcm8tbGFyZ2VAMnguanBnIDJ4XFxcIj5cXG4gIDxzb3VyY2UgbWVkaWE9XFxcIihtaW4td2lkdGg6IDcyMHB4KVxcXCIgc3Jjc2V0PVxcXCIuLi8uLi9pbWFnZXMvaGVyby1tZWRpdW0uanBnLCAuLi8uLi9pbWFnZXMvaGVyby1tZWRpdW1AMnguanBnIDJ4XFxcIj5cXG4gIDxzb3VyY2UgbWVkaWE9XFxcIihtaW4td2lkdGg6IDUwMHB4KVxcXCIgc3Jjc2V0PVxcXCIuLi8uLi9pbWFnZXMvaGVyby1zbWFsbC5qcGcsIC4uLy4uL2ltYWdlcy9oZXJvLXNtYWxsQDJ4LmpwZyAyeFxcXCI+XFxuICA8aW1nIHNyY3NldD1cXFwiLi4vLi4vaW1hZ2VzL2hlcm8teHNtYWxsLmpwZywgLi4vLi4vaW1hZ2VzL2hlcm8teHNtYWxsQDJ4LmpwZyAyeFxcXCIgYWx0PVxcXCJTaG9yZWxpbmUgaW4gSWNlbGFuZFxcXCI+XFxuPC9waWN0dXJlPlxcblxcbjxzZWN0aW9uIGNsYXNzPVxcXCJoZXJvLXRleHRcXFwiPlxcbiAgPGgxIGNsYXNzPVxcXCJ0aXRsZVxcXCI+PHNwYW4gY2xhc3M9XFxcInNtYWxsLXRpdGxlXFxcIj5XZWxjb21lIHRvPC9zcGFuPjxicj5JY2VsYW5kPGJyPjwvaDE+XFxuICA8cCBjbGFzcz1cXFwic21hbGwtdGl0bGVcXFwiPjY0Ljk2MzHCsCBOLCAxOS4wMjA4wrAgVzxicj5DYXBpdGFsOiBSZXlramF2w61rICB8ICBQb3B1bGF0aW9uOiAzMzgsMzQ5PC9wPlxcbjwvc2VjdGlvbj5cXG5cXG48YXJ0aWNsZSBjbGFzcz1cXFwibWF4d2lkdGgtd3JhcCBjb250ZW50LWdyaWRcXFwiPlxcblxcbiAgPGRpdj5cXG4gICAgPGRpdiBjbGFzcz1cXFwiaGVyby10ZXh0MVxcXCI+XFxuICAgICAgICA8aDEgY2xhc3M9XFxcInRpdGxlMVxcXCI+PHNwYW4gY2xhc3M9XFxcInNtYWxsLXRpdGxlMVxcXCI+V2VsY29tZSB0bzwvc3Bhbj48YnI+SWNlbGFuZDxicj48L2gxPlxcbiAgICAgICAgPHAgY2xhc3M9XFxcInNtYWxsLXRpdGxlMVxcXCI+NjQuOTYzMcKwIE4sIDE5LjAyMDjCsCBXPGJyPkNhcGl0YWw6IFJleWtqYXbDrWsgIHwgIFBvcHVsYXRpb246IDMzOCwzNDk8L3A+XFxuICAgIDwvZGl2PlxcbiAgICA8cGljdHVyZT5cXG4gICAgICA8c291cmNlIG1lZGlhPVxcXCIobWluLXdpZHRoOiA1MDBweClcXFwiIHNyY3NldD1cXFwiLi4vLi4vaW1hZ2VzL2ljZWxhbmQtbGFuZC1zbWFsbC5qcGcsIC4uLy4uL2ltYWdlcy9pY2VsYW5kLWxhbmQtc21hbGxAMnguanBnIDJ4XFxcIj5cXG4gICAgICA8aW1nIHNyY3NldD1cXFwiLi4vLi4vaW1hZ2VzL2ljZWxhbmQtbGFuZC14c21hbGwuanBnLCAuLi8uLi9pbWFnZXMvaWNlbGFuZC1sYW5kLXhzbWFsbEAyeC5qcGcgMnhcXFwiIGFsdD1cXFwiUnVnZ2VkIGxhbmRzY3BhZSBpbiBJY2VsYW5kXFxcIj5cXG4gICAgPC9waWN0dXJlPlxcbiAgPC9kaXY+XFxuICA8ZGl2PlxcbiAgICA8aDI+VGhlIExhbmRzY2FwZTwvaDI+XFxuICAgIDxwPkdlb2xvZ2ljYWxseSwgSWNlbGFuZCBpcyBwYXJ0IG9mIHRoZSBNaWQtQXRsYW50aWMgUmlkZ2UsIGEgcmlkZ2UgYWxvbmcgd2hpY2ggdGhlIG9jZWFuaWMgY3J1c3Qgc3ByZWFkcyBhbmQgZm9ybXMgbmV3IG9jZWFuaWMgY3J1c3QuIFRoaXMgcGFydCBvZiB0aGUgbWlkLW9jZWFuIHJpZGdlIGlzIGxvY2F0ZWQgYWJvdmUgYSBtYW50bGUgcGx1bWUsIGNhdXNpbmcgSWNlbGFuZCB0byBiZSBzdWJhZXJpYWwgKGFib3ZlIHRoZSBzdXJmYWNlIG9mIHRoZSBzZWEpLiBUaGUgcmlkZ2UgbWFya3MgdGhlIGJvdW5kYXJ5IGJldHdlZW4gdGhlIEV1cmFzaWFuIGFuZCBOb3J0aCBBbWVyaWNhbiBQbGF0ZXMsIGFuZCBJY2VsYW5kIHdhcyBjcmVhdGVkIGJ5IHJpZnRpbmcgYW5kIGFjY3JldGlvbiB0aHJvdWdoIHZvbGNhbmlzbSBhbG9uZyB0aGUgcmlkZ2UuPC9wPlxcbiAgICA8cD7igJQ8L3A+XFxuICA8L2Rpdj5cXG5cXG4gIDxkaXY+XFxuICAgIDxwaWN0dXJlPlxcbiAgICAgIDxzb3VyY2UgbWVkaWE9XFxcIihtaW4td2lkdGg6IDUwMHB4KVxcXCIgc3Jjc2V0PVxcXCIuLi8uLi9pbWFnZXMvaWNlbGFuZC1sYWdvb24tc21hbGwuanBnLCAuLi8uLi9pbWFnZXMvaWNlbGFuZC1sYWdvb24tc21hbGxAMnguanBnIDJ4XFxcIj5cXG4gICAgICA8aW1nIHNyY3NldD1cXFwiLi4vLi4vaW1hZ2VzL2ljZWxhbmQtbGFnb29uLXhzbWFsbC5qcGcsIC4uLy4uL2ltYWdlcy9pY2VsYW5kLWxhZ29vbi14c21hbGxAMnguanBnIDJ4XFxcIiBhbHQ9XFxcIkZhbW91cyBsYWdvb24gcG9vbCBpbiBJY2VsYW5kXFxcIj5cXG4gICAgPC9waWN0dXJlPlxcbiAgPC9kaXY+XFxuICA8ZGl2PlxcbiAgICA8aDI+R2VvdGhlcm1hbCBTcGE8L2gyPlxcbiAgICA8cD5UaGUgQmx1ZSBMYWdvb24gKEljZWxhbmRpYzogQmzDoWEgbMOzbmnDsCkgZ2VvdGhlcm1hbCBzcGEgaXMgb25lIG9mIHRoZSBtb3N0IHZpc2l0ZWQgYXR0cmFjdGlvbnMgaW4gSWNlbGFuZC4gVGhlIHNwYSBpcyBsb2NhdGVkIGluIGEgbGF2YSBmaWVsZCBpbiBHcmluZGF2w61rIG9uIHRoZSBSZXlramFuZXMgUGVuaW5zdWxhLCBzb3V0aHdlc3Rlcm4gSWNlbGFuZCBpbiBhIGxvY2F0aW9uIGZhdm91cmFibGUgZm9yIEdlb3RoZXJtYWwgcG93ZXIsIGFuZCBpcyBzdXBwbGllZCBieSB3YXRlciB1c2VkIGluIHRoZSBuZWFyYnkgU3ZhcnRzZW5naSBnZW90aGVybWFsIHBvd2VyIHN0YXRpb24uIEJsw6FhIGzDs25pw7AgaXMgc2l0dWF0ZWQgYXBwcm94aW1hdGVseSAyMCBrbSAoMTIgbWkpIGZyb20gdGhlIEtlZmxhdsOtayBJbnRlcm5hdGlvbmFsIEFpcnBvcnQgYW5kIDM5IGttICgyNCBtaSkgZnJvbSB0aGUgY2FwaXRhbCBjaXR5IG9mIFJleWtqYXbDrWssIHJvdWdobHkgYSAyMS1taW51dGUgZHJpdmUgZnJvbSB0aGUgYWlycG9ydCBhbmQgYSA1MC1taW51dGUgZHJpdmUgZnJvbSBSZXlramF2w61rLjwvcD4gICAgXFxuICAgIDxwPuKAlDwvcD5cXG4gIDwvZGl2PlxcblxcbiAgPGRpdj5cXG4gICAgPHBpY3R1cmU+XFxuICAgICAgPHNvdXJjZSBtZWRpYT1cXFwiKG1pbi13aWR0aDogNTAwcHgpXFxcIiBzcmNzZXQ9XFxcIi4uLy4uL2ltYWdlcy9pY2VsYW5kLWNpdHktc21hbGwuanBnLCAuLi8uLi9pbWFnZXMvaWNlbGFuZC1jaXR5LXNtYWxsQDJ4LmpwZyAyeFxcXCI+XFxuICAgICAgPGltZyBzcmNzZXQ9XFxcIi4uLy4uL2ltYWdlcy9pY2VsYW5kLWNpdHkteHNtYWxsLmpwZywgLi4vLi4vaW1hZ2VzL2ljZWxhbmQtY2l0eS14c21hbGxAMnguanBnIDJ4XFxcIiBhbHQ9XFxcIkNpdHkgaW4gSWNlbGFuZFxcXCI+XFxuICAgIDwvcGljdHVyZT5cXG4gIDwvZGl2PlxcbiAgPGRpdj5cXG4gICAgPGgyPkNpdGllczwvaDI+XFxuICAgIDxwPkdyZWF0ZXIgUmV5a2phdsOtayAoSWNlbGFuZGljOiBIw7ZmdcOwYm9yZ2Fyc3bDpsOwacOwLCBtZWFuaW5nIFxcXCJUaGUgQ2FwaXRhbCBSZWdpb25cXFwiKSBpcyBhIG5hbWUgdXNlZCBjb2xsZWN0aXZlbHkgZm9yIFJleWtqYXbDrWsgYW5kIHNpeCBtdW5pY2lwYWxpdGllcyBhcm91bmQgaXQuWzJdWzNdIFRoZSBhcmVhIGlzIGJ5IGZhciB0aGUgbGFyZ2VzdCB1cmJhbiBhcmVhIGluIEljZWxhbmQuWzRdIEVhY2ggbXVuaWNpcGFsaXR5IGhhcyBpdHMgb3duIGVsZWN0ZWQgY291bmNpbC4gR3JlYXRlciBSZXlramF2w61rJ3MgcG9wdWxhdGlvbiBvZiAyMTYgOTQwIGlzIG92ZXIgNjAlIG9mIHRoZSBwb3B1bGF0aW9uIG9mIEljZWxhbmQsIGluIGFuIGFyZWEgdGhhdCBpcyBvbmx5IGp1c3Qgb3ZlciAxJSBvZiB0aGUgdG90YWwgc2l6ZSBvZiB0aGUgY291bnRyeS4gVGhlIHNpemUgb2YgdGhlIGdyZWF0ZXIgUmV5a2phdsOtayBhcmVhIGlzIGNhbGN1bGF0ZWQgZnJvbSB0aGUgYXJlYSBvZiBpdHMgY29uc3RpdHVlbnQgbXVuaWNpcGFsaXRpZXMsIGluY2x1ZGluZyBsYXJnZSBhcmVhcyBvZiBoaW50ZXJsYW5kLCBub3QgdGhlIG11Y2ggc21hbGxlciB1cmJhbiBjb3JlIG9mIGFib3V0IDIwMCBrbTIgKDc3IHNxIG1pKS48L3A+XFxuICAgIDxwPuKAlDwvcD5cXG4gIDwvZGl2PlxcblxcbjwvYXJ0aWNsZT5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21wb25lbnRzL2hvbWUvaG9tZS5odG1sXG4vLyBtb2R1bGUgaWQgPSAxOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMS0yIS4vaG9tZS5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge1wic291cmNlTWFwXCI6dHJ1ZSxcImhtclwiOnRydWV9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0xLTIhLi9ob21lLmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMS0yIS4vaG9tZS5jc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBvbmVudHMvaG9tZS9ob21lLmNzc1xuLy8gbW9kdWxlIGlkID0gMjBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh0cnVlKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcInNlY3Rpb24ge1xcbiAgY29sb3I6ICNhNmRlZmY7XFxufVxcbi5jb250ZW50LWdyaWQge1xcbiAgLyogZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47ICovXFxuICBwYWRkaW5nOiAycmVtO1xcbn1cXG4uY29udGVudC1ncmlkIGgyIHtcXG4gICAgY29sb3I6ICNhNmRlZmY7XFxuICAgIHBhZGRpbmc6IDEuNXJlbSAwIDFyZW07XFxuICB9XFxuLmNvbnRlbnQtZ3JpZCBpbWcge1xcbiAgICBwYWRkaW5nOiA0cmVtIDAgMDtcXG4gIH1cXG4uaGVyby10ZXh0IHtcXG4gIHRleHQtYWxpZ246IHJpZ2h0O1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiAxMHJlbTtcXG4gIHJpZ2h0OiAxMHJlbTtcXG4gIHotaW5kZXg6IDEwMDA7XFxufVxcbi50aXRsZSB7XFxuICBjb2xvcjogIzAwMDAwMDtcXG4gIGZvbnQtc2l6ZTogNXJlbTtcXG59XFxuLnNtYWxsLXRpdGxlIHtcXG4gIGZvbnQtc2l6ZTogMXJlbTtcXG4gIHBhZGRpbmc6IDAgMC41cmVtIDAgMDtcXG4gIGNvbG9yOiAjMDAwMDAwO1xcbn1cXG4udGl0bGUxIHtcXG4gIGZvbnQtc2l6ZTogMy41cmVtO1xcbn1cXG4uc21hbGwtdGl0bGUxe1xcbiAgZm9udC1zaXplOiAxcmVtO1xcbn1cXG4uY29udGVudC1ncmlkID4gZGl2Om50aC1jaGlsZCgxKSB7LXdlYmtpdC1ib3gtb3JkaW5hbC1ncm91cDogMjstbXMtZmxleC1vcmRlcjogMTtvcmRlcjogMTt9XFxuLmNvbnRlbnQtZ3JpZCA+IGRpdjpudGgtY2hpbGQoMikgey13ZWJraXQtYm94LW9yZGluYWwtZ3JvdXA6IDM7LW1zLWZsZXgtb3JkZXI6IDI7b3JkZXI6IDI7fVxcbi5jb250ZW50LWdyaWQgPiBkaXY6bnRoLWNoaWxkKDMpIHstd2Via2l0LWJveC1vcmRpbmFsLWdyb3VwOiA0Oy1tcy1mbGV4LW9yZGVyOiAzO29yZGVyOiAzO31cXG4uY29udGVudC1ncmlkID4gZGl2Om50aC1jaGlsZCg0KSB7LXdlYmtpdC1ib3gtb3JkaW5hbC1ncm91cDogNTstbXMtZmxleC1vcmRlcjogNDtvcmRlcjogNDt9XFxuLmNvbnRlbnQtZ3JpZCA+IGRpdjpudGgtY2hpbGQoNSkgey13ZWJraXQtYm94LW9yZGluYWwtZ3JvdXA6IDY7LW1zLWZsZXgtb3JkZXI6IDU7b3JkZXI6IDU7fVxcbi5jb250ZW50LWdyaWQgPiBkaXY6bnRoLWNoaWxkKDYpIHstd2Via2l0LWJveC1vcmRpbmFsLWdyb3VwOiA3Oy1tcy1mbGV4LW9yZGVyOiA2O29yZGVyOiA2O31cXG4uY29udGVudC1ncmlkID4gKiB7cGFkZGluZzogMXJlbTt9XFxuLyogLS0tLS0tIE1lZGlhIFF1ZXJpZXMgLS0tLS0tLSAqL1xcbkBtZWRpYSBzY3JlZW4gYW5kIChtaW4td2lkdGg6IDEwMDBweCkge1xcbiAgXFxuICAuY29udGVudC1ncmlkID4gZGl2Om50aC1jaGlsZCgxKSB7Z3JpZC1hcmVhOiBhO31cXG4gIC5jb250ZW50LWdyaWQgPiBkaXY6bnRoLWNoaWxkKDIpIHtncmlkLWFyZWE6IGI7fVxcbiAgLmNvbnRlbnQtZ3JpZCA+IGRpdjpudGgtY2hpbGQoMykge2dyaWQtYXJlYTogYzt9XFxuICAuY29udGVudC1ncmlkID4gZGl2Om50aC1jaGlsZCg0KSB7Z3JpZC1hcmVhOiBkO31cXG4gIC5jb250ZW50LWdyaWQgPiBkaXY6bnRoLWNoaWxkKDUpIHtncmlkLWFyZWE6IGU7fVxcbiAgLmNvbnRlbnQtZ3JpZCA+IGRpdjpudGgtY2hpbGQoNikge2dyaWQtYXJlYTogZjt9XFxuICBcXG4gIC5jb250ZW50LWdyaWQge1xcbiAgICBkaXNwbGF5OiBncmlkO1xcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgzLCAxZnIpO1xcbiAgICBncmlkLXRlbXBsYXRlLWFyZWFzOlxcbiAgICBcXFwiYSBhIGJcXFwiXFxuICAgIFxcXCJkIGMgY1xcXCJcXG4gICAgXFxcImUgZSBmXFxcIjtcXG4gICAgLXdlYmtpdC1ib3gtYWxpZ246IHN0YXJ0O1xcbiAgICAgICAgLW1zLWZsZXgtYWxpZ246IHN0YXJ0O1xcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xcbiAgICBncmlkLWdhcDogMnJlbTtcXG4gIH1cXG4gICAgLmNvbnRlbnQtZ3JpZCBpbWcge1xcbiAgICAgIHBhZGRpbmc6IDEuOHJlbSAwIDA7XFxuICAgIH1cXG59XFxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDo3NjBweCkge1xcbiAgLmhlcm8tdGV4dCB7XFxuICAgIGRpc3BsYXk6IG5vbmU7XFxuICB9XFxuXFxuICAudGl0bGUxIHtcXG4gICAgbWFyZ2luOiAtNHJlbSAwIDA7XFxuICB9XFxufVxcbkBtZWRpYSBzY3JlZW4gYW5kIChtaW4td2lkdGg6NzYwcHgpIGFuZCAobWF4LXdpZHRoOjEwODBweCkge1xcbiAgXFxuICAuaGVyby10ZXh0IHtcXG4gICAgdG9wOiAxMHJlbTtcXG4gICAgcmlnaHQ6IDVyZW07XFxuICB9XFxuICBcXG4gIC50aXRsZSB7XFxuICAgIGZvbnQtc2l6ZTogM3JlbTtcXG4gIH1cXG5cXG4gIC5oZXJvLXRleHQxIHtcXG4gICAgZGlzcGxheTogbm9uZTtcXG4gIH1cXG5cXG59XFxuQG1lZGlhIHNjcmVlbiBhbmQgKG1pbi13aWR0aDoxMDgwcHgpIHtcXG4gIC5oZXJvLXRleHQxIHtcXG4gICAgZGlzcGxheTogbm9uZTtcXG4gIH1cXG59XCIsIFwiXCIsIHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIi9Vc2Vycy9lbmR1c2VyL0Rlc2t0b3AvbmFjaG8vNDAxL3ZhcmlhYmxlcy5jc3NcIixcIi9Vc2Vycy9lbmR1c2VyL0Rlc2t0b3AvbmFjaG8vNDAxL3RyYXZlbC1hcHAvaG9tZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBWUE7RUFDRSxlQUFlO0NBQ2hCO0FDWkQ7RUFDRTs0QkFDMEI7RUFDMUIsY0FBa0I7Q0FRbkI7QUFQQztJQUNFLGVBQWE7SUFDYix1QkFBdUI7R0FDeEI7QUFDRDtJQUNFLGtCQUFrQjtHQUNuQjtBQUdIO0VBQ0Usa0JBQWtCO0VBQ2xCLG1CQUFtQjtFQUNuQixXQUFXO0VBQ1gsYUFBYTtFQUNiLGNBQWM7Q0FDZjtBQUVEO0VBQ0UsZUFBYztFQUNkLGdCQUFnQjtDQUNqQjtBQUVEO0VBQ0UsZ0JBQWdCO0VBQ2hCLHNCQUFzQjtFQUN0QixlQUFjO0NBQ2Y7QUFFRDtFQUNFLGtCQUFrQjtDQUNuQjtBQUVEO0VBQ0UsZ0JBQWdCO0NBQ2pCO0FBRUQsa0NBQWtDLDZCQUFBLGtCQUFBLFNBQVMsQ0FBQztBQUM1QyxrQ0FBa0MsNkJBQUEsa0JBQUEsU0FBUyxDQUFDO0FBQzVDLGtDQUFrQyw2QkFBQSxrQkFBQSxTQUFTLENBQUM7QUFDNUMsa0NBQWtDLDZCQUFBLGtCQUFBLFNBQVMsQ0FBQztBQUM1QyxrQ0FBa0MsNkJBQUEsa0JBQUEsU0FBUyxDQUFDO0FBQzVDLGtDQUFrQyw2QkFBQSxrQkFBQSxTQUFTLENBQUM7QUFDNUMsbUJBQW1CLGNBQWMsQ0FBQztBQUdsQyxrQ0FBa0M7QUFFbEM7O0VBRUUsa0NBQWtDLGFBQWEsQ0FBQztFQUNoRCxrQ0FBa0MsYUFBYSxDQUFDO0VBQ2hELGtDQUFrQyxhQUFhLENBQUM7RUFDaEQsa0NBQWtDLGFBQWEsQ0FBQztFQUNoRCxrQ0FBa0MsYUFBYSxDQUFDO0VBQ2hELGtDQUFrQyxhQUFhLENBQUM7O0VBRWhEO0lBQ0UsY0FBYztJQUNkLHNDQUFzQztJQUN0Qzs7O1lBR1E7SUFDUix5QkFBd0I7UUFBeEIsc0JBQXdCO1lBQXhCLHdCQUF3QjtJQUN4QixlQUFlO0dBQ2hCO0lBR0M7TUFDRSxvQkFBb0I7S0FDckI7Q0FFSjtBQUVEO0VBQ0U7SUFDRSxjQUFjO0dBQ2Y7O0VBRUQ7SUFDRSxrQkFBa0I7R0FDbkI7Q0FDRjtBQUVEOztFQUVFO0lBQ0UsV0FBVztJQUNYLFlBQVk7R0FDYjs7RUFFRDtJQUNFLGdCQUFnQjtHQUNqQjs7RUFFRDtJQUNFLGNBQWM7R0FDZjs7Q0FFRjtBQUVEO0VBQ0U7SUFDRSxjQUFjO0dBQ2Y7Q0FDRlwiLFwiZmlsZVwiOlwiaG9tZS5jc3NcIixcInNvdXJjZXNDb250ZW50XCI6W1wiJGFjY2VudDogI2ZmOGM4YztcXG4kbGluazogI2E2ZGVmZjtcXG4kZGFya2xpbms6ICMwMDdCQzI7XFxuJGxpZ2h0Z3JheTogI2VlZWVlZTtcXG4kZGFya2dyYXk6ICM0NDQxNDA7XFxuJHdoaXRlOiAjZmZmZmZmO1xcbiRncmF5OiAjRTBFMEUwO1xcbiRibGFjazogIzAwMDAwMDtcXG5cXG4kbWF4Vmlld3BvcnRTaXplOiAxMjgwcHg7XFxuJHBhZGRpbmc6IDJyZW07XFxuXFxuc2VjdGlvbiB7XFxuICBjb2xvcjogI2E2ZGVmZjtcXG59XCIsXCJAaW1wb3J0ICcuLi92YXJpYWJsZXMuY3NzJztcXG5cXG4uY29udGVudC1ncmlkIHtcXG4gIC8qIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyAqL1xcbiAgcGFkZGluZzogJHBhZGRpbmc7XFxuICBoMiB7XFxuICAgIGNvbG9yOiAkbGluaztcXG4gICAgcGFkZGluZzogMS41cmVtIDAgMXJlbTtcXG4gIH1cXG4gIGltZyB7XFxuICAgIHBhZGRpbmc6IDRyZW0gMCAwO1xcbiAgfVxcbn1cXG5cXG4uaGVyby10ZXh0IHtcXG4gIHRleHQtYWxpZ246IHJpZ2h0O1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiAxMHJlbTtcXG4gIHJpZ2h0OiAxMHJlbTtcXG4gIHotaW5kZXg6IDEwMDA7XFxufVxcblxcbi50aXRsZSB7XFxuICBjb2xvcjogJGJsYWNrO1xcbiAgZm9udC1zaXplOiA1cmVtO1xcbn1cXG5cXG4uc21hbGwtdGl0bGUge1xcbiAgZm9udC1zaXplOiAxcmVtO1xcbiAgcGFkZGluZzogMCAwLjVyZW0gMCAwO1xcbiAgY29sb3I6ICRibGFjaztcXG59XFxuXFxuLnRpdGxlMSB7XFxuICBmb250LXNpemU6IDMuNXJlbTtcXG59XFxuXFxuLnNtYWxsLXRpdGxlMXtcXG4gIGZvbnQtc2l6ZTogMXJlbTtcXG59XFxuXFxuLmNvbnRlbnQtZ3JpZCA+IGRpdjpudGgtY2hpbGQoMSkge29yZGVyOiAxO31cXG4uY29udGVudC1ncmlkID4gZGl2Om50aC1jaGlsZCgyKSB7b3JkZXI6IDI7fVxcbi5jb250ZW50LWdyaWQgPiBkaXY6bnRoLWNoaWxkKDMpIHtvcmRlcjogMzt9XFxuLmNvbnRlbnQtZ3JpZCA+IGRpdjpudGgtY2hpbGQoNCkge29yZGVyOiA0O31cXG4uY29udGVudC1ncmlkID4gZGl2Om50aC1jaGlsZCg1KSB7b3JkZXI6IDU7fVxcbi5jb250ZW50LWdyaWQgPiBkaXY6bnRoLWNoaWxkKDYpIHtvcmRlcjogNjt9XFxuLmNvbnRlbnQtZ3JpZCA+ICoge3BhZGRpbmc6IDFyZW07fVxcblxcblxcbi8qIC0tLS0tLSBNZWRpYSBRdWVyaWVzIC0tLS0tLS0gKi9cXG5cXG5AbWVkaWEgc2NyZWVuIGFuZCAobWluLXdpZHRoOiAxMDAwcHgpIHtcXG4gIFxcbiAgLmNvbnRlbnQtZ3JpZCA+IGRpdjpudGgtY2hpbGQoMSkge2dyaWQtYXJlYTogYTt9XFxuICAuY29udGVudC1ncmlkID4gZGl2Om50aC1jaGlsZCgyKSB7Z3JpZC1hcmVhOiBiO31cXG4gIC5jb250ZW50LWdyaWQgPiBkaXY6bnRoLWNoaWxkKDMpIHtncmlkLWFyZWE6IGM7fVxcbiAgLmNvbnRlbnQtZ3JpZCA+IGRpdjpudGgtY2hpbGQoNCkge2dyaWQtYXJlYTogZDt9XFxuICAuY29udGVudC1ncmlkID4gZGl2Om50aC1jaGlsZCg1KSB7Z3JpZC1hcmVhOiBlO31cXG4gIC5jb250ZW50LWdyaWQgPiBkaXY6bnRoLWNoaWxkKDYpIHtncmlkLWFyZWE6IGY7fVxcbiAgXFxuICAuY29udGVudC1ncmlkIHtcXG4gICAgZGlzcGxheTogZ3JpZDtcXG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMywgMWZyKTtcXG4gICAgZ3JpZC10ZW1wbGF0ZS1hcmVhczpcXG4gICAgXFxcImEgYSBiXFxcIlxcbiAgICBcXFwiZCBjIGNcXFwiXFxuICAgIFxcXCJlIGUgZlxcXCI7XFxuICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xcbiAgICBncmlkLWdhcDogMnJlbTtcXG4gIH1cXG5cXG4gIC5jb250ZW50LWdyaWQge1xcbiAgICBpbWcge1xcbiAgICAgIHBhZGRpbmc6IDEuOHJlbSAwIDA7XFxuICAgIH1cXG4gIH1cXG59XFxuXFxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDo3NjBweCkge1xcbiAgLmhlcm8tdGV4dCB7XFxuICAgIGRpc3BsYXk6IG5vbmU7XFxuICB9XFxuXFxuICAudGl0bGUxIHtcXG4gICAgbWFyZ2luOiAtNHJlbSAwIDA7XFxuICB9XFxufVxcblxcbkBtZWRpYSBzY3JlZW4gYW5kIChtaW4td2lkdGg6NzYwcHgpIGFuZCAobWF4LXdpZHRoOjEwODBweCkge1xcbiAgXFxuICAuaGVyby10ZXh0IHtcXG4gICAgdG9wOiAxMHJlbTtcXG4gICAgcmlnaHQ6IDVyZW07XFxuICB9XFxuICBcXG4gIC50aXRsZSB7XFxuICAgIGZvbnQtc2l6ZTogM3JlbTtcXG4gIH1cXG5cXG4gIC5oZXJvLXRleHQxIHtcXG4gICAgZGlzcGxheTogbm9uZTtcXG4gIH1cXG5cXG59XFxuXFxuQG1lZGlhIHNjcmVlbiBhbmQgKG1pbi13aWR0aDoxMDgwcHgpIHtcXG4gIC5oZXJvLXRleHQxIHtcXG4gICAgZGlzcGxheTogbm9uZTtcXG4gIH1cXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXI/e1wiaW1wb3J0TG9hZGVyc1wiOjEsXCJzb3VyY2VNYXBcIjp0cnVlfSEuL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWI/e1wic291cmNlTWFwXCI6dHJ1ZX0hLi9zcmMvY29tcG9uZW50cy9ob21lL2hvbWUuY3NzXG4vLyBtb2R1bGUgaWQgPSAyMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgaHRtbCBmcm9tICcuL3Jlc291cmNlcy5odG1sJztcbmltcG9ydCAnLi9yZXNvdXJjZXMuY3NzJztcbmltcG9ydCBUZW1wbGF0ZSBmcm9tICcuLi9UZW1wbGF0ZSc7XG5cbmNvbnN0IHRlbXBsYXRlID0gbmV3IFRlbXBsYXRlKGh0bWwpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXNvdXJjZXMge1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBkb20gPSB0ZW1wbGF0ZS5jbG9uZSgpO1xuXG4gICAgcmV0dXJuIGRvbTtcbiAgfVxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBvbmVudHMvcmVzb3VyY2VzL1Jlc291cmNlcy5qc1xuLy8gbW9kdWxlIGlkID0gMjJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxwaWN0dXJlPlxcbiAgPHNvdXJjZSBtZWRpYT1cXFwiKG1pbi13aWR0aDogMTAyNHB4KVxcXCIgc3Jjc2V0PVxcXCIuLi8uLi9pbWFnZXMvaGVybzEtbGFyZ2UuanBnLCAuLi8uLi9pbWFnZXMvaGVybzEtbGFyZ2VAMnguanBnIDJ4XFxcIj5cXG4gIDxzb3VyY2UgbWVkaWE9XFxcIihtaW4td2lkdGg6IDcyMHB4KVxcXCIgc3Jjc2V0PVxcXCIuLi8uLi9pbWFnZXMvaGVybzEtbWVkaXVtLmpwZywgLi4vLi4vaW1hZ2VzL2hlcm8xLW1lZGl1bUAyeC5qcGcgMnhcXFwiPlxcbiAgPHNvdXJjZSBtZWRpYT1cXFwiKG1pbi13aWR0aDogNTAwcHgpXFxcIiBzcmNzZXQ9XFxcIi4uLy4uL2ltYWdlcy9oZXJvMS1zbWFsbC5qcGcsIC4uLy4uL2ltYWdlcy9oZXJvMS1zbWFsbEAyeC5qcGcgMnhcXFwiPlxcbiAgPGltZyBzcmNzZXQ9XFxcIi4uLy4uL2ltYWdlcy9oZXJvMS14c21hbGwuanBnLCAuLi8uLi9pbWFnZXMvaGVybzEteHNtYWxsQDJ4LmpwZyAyeFxcXCIgYWx0PVxcXCJNb3VudGFpbiBpbiBJY2VsYW5kXFxcIj5cXG48L3BpY3R1cmU+XFxuXFxuPHNlY3Rpb24gY2xhc3M9XFxcImhlcm8tcmVzb3VyY2VcXFwiPlxcbiAgPGgxIGNsYXNzPVxcXCJ0aXRsZS1yZXNvdXJjZVxcXCI+PHNwYW4gY2xhc3M9XFxcInNtYWxsLXRpdGxlLXJlc291cmNlXFxcIj5JY2VsYW5kIFRyYXZlbDwvc3Bhbj48YnI+UmVzb3VyY2VzPGJyPjwvaDE+XFxuICA8cCBjbGFzcz1cXFwic21hbGwtdGl0bGUtcmVzb3VyY2VcXFwiPkZsaWdodHMgfCBFYXQgfCBFeHBsb3JlPC9wPlxcbjwvc2VjdGlvbj5cXG5cXG48YXJ0aWNsZSBjbGFzcz1cXFwibWF4d2lkdGgtd3JhcCByZXNvdXJjZS1ncmlkXFxcIj5cXG4gIDxkaXY+XFxuICAgIDxzZWN0aW9uIGNsYXNzPVxcXCJoZXJvLXJlc291cmNlMVxcXCI+XFxuICAgICAgPGgxIGNsYXNzPVxcXCJ0aXRsZS1yZXNvdXJjZVxcXCI+PHNwYW4gY2xhc3M9XFxcInNtYWxsLXRpdGxlLXJlc291cmNlXFxcIj5JY2VsYW5kIFRyYXZlbDwvc3Bhbj48YnI+UmVzb3VyY2VzPGJyPjwvaDE+XFxuICAgICAgPHAgY2xhc3M9XFxcInNtYWxsLXRpdGxlLXJlc291cmNlXFxcIj5GbGlnaHRzIHwgRWF0IHwgRXhwbG9yZTwvcD5cXG4gICAgPC9zZWN0aW9uPlxcbiAgPC9kaXY+XFxuXFxuICA8ZGl2PlxcbiAgICA8aDM+RmxpZ2h0czwvaDM+XFxuICAgIDx1bCBjbGFzcz1cXFwidWwtcmVzb3VyY2VcXFwiPlxcbiAgICAgIDxsaT48YSBocmVmPVxcXCJodHRwczovL3d3dy50cmlwYWR2aXNvci5jb20vRmxpZ2h0cy1nMTg5OTUyLUljZWxhbmQtQ2hlYXBfRGlzY291bnRfQWlyZmFyZXMuaHRtbFxcXCIgYWx0PVxcXCJMaW5rIHRvIFRyaXBBZHZpc29yIEZsaWdodHMgdG8gSWNlbGFuZFxcXCIgdGFyZ2V0PVxcXCJfYmxhbmtcXFwiIHJlbFxcXCJhdXRob3Igbm9vcGVuZXIgbm9yZWZlcnJlclxcXCI+VHJpcEFkdmlzb3IgLSBGbGlnaHQgdG8gSWNlbGFuZDwvYT48L2xpPlxcbiAgICAgIDxsaT48YSBocmVmPVxcXCJodHRwczovL2d1aWRldG9pY2VsYW5kLmlzL3RyYXZlbC1pbmZvL2ZsaWdodHMtdG8taWNlbGFuZFxcXCIgYWx0PVxcXCJMaW5rIHRvIEd1aWRlIHRvIEljZWxhbmRcXFwiIHRhcmdldD1cXFwiX2JsYW5rXFxcIiByZWxcXFwiYXV0aG9yIG5vb3BlbmVyIG5vcmVmZXJyZXJcXFwiPkd1aWRlIHRvIEljZWxhbmQ8L2E+PC9saT5cXG4gICAgICA8bGk+PGEgaHJlZj1cXFwiaHR0cDovL3d3dy5pY2VsYW5kYWlyLnVzL2Rlc3RpbmF0aW9ucy9mbGlnaHRzLXRvLXJleWtqYXZpay8/Z2NsaWQ9RUFJYUlRb2JDaE1Jbl9udjJ1cnoyQUlWU2lPQkNoMnRKd3BnRUFBWUFTQUJFZ0xPQVBEX0J3RVxcXCIgYWx0PVxcXCJMaW5rIHRvIEljZWxhbmRBaXJcXFwiIHRhcmdldD1cXFwiX2JsYW5rXFxcIiByZWxcXFwiYXV0aG9yIG5vb3BlbmVyIG5vcmVmZXJyZXJcXFwiPkljZWxhbmRBaXI8L2E+PC9saT5cXG4gICAgPC91bD5cXG4gIDwvZGl2PlxcblxcbiAgPGRpdj5cXG4gICAgPGgzPkVhdDwvaDM+XFxuICAgIDx1bCBjbGFzcz1cXFwidWwtcmVzb3VyY2VcXFwiPlxcbiAgICAgICAgPGxpPjxhIGhyZWY9XFxcImh0dHBzOi8vd3d3LnRyaXBhZHZpc29yLmNvbS9SZXN0YXVyYW50X1Jldmlldy1nMTg5OTcwLWQzMzcyMDc2LVJldmlld3MtQmVyZ3Nzb25fTWF0aHVzLVJleWtqYXZpa19DYXBpdGFsX1JlZ2lvbi5odG1sXFxcIiBhbHQ9XFxcIkxpbmsgdG8gVHJpcCBBZHZpc29yIEJlcmdzb29uIE1hdGh1c1xcXCIgdGFyZ2V0PVxcXCJfYmxhbmtcXFwiIHJlbFxcXCJhdXRob3Igbm9vcGVuZXIgbm9yZWZlcnJlclxcXCI+QmVyZ3Nzb24gTWF0aHVzPC9hPjwvbGk+XFxuICAgICAgICA8bGk+PGEgaHJlZj1cXFwiaHR0cHM6Ly93d3cudHJpcGFkdmlzb3IuY29tL1Jlc3RhdXJhbnRfUmV2aWV3LWcxODk5NzAtZDEwMzAzMTU4LVJldmlld3MtTWF0YXJramFsbGFyaW5uX0Zvb2RjZWxsYXItUmV5a2phdmlrX0NhcGl0YWxfUmVnaW9uLmh0bWxcXFwiIGFsdD1cXFwiTGluayB0byBUcmlwIEFkdmlzb3IgTWF0YXJramFsbGFyaW5uXFxcIiB0YXJnZXQ9XFxcIl9ibGFua1xcXCIgcmVsXFxcImF1dGhvciBub29wZW5lciBub3JlZmVycmVyXFxcIj5NYXRhcmtqYWxsYXJpbm48L2E+PC9saT5cXG4gICAgICAgIDxsaT48YSBocmVmPVxcXCJodHRwczovL3d3dy50cmlwYWR2aXNvci5jb20vUmVzdGF1cmFudF9SZXZpZXctZzE4OTk3MC1kNDEwNjU4Ny1SZXZpZXdzLUthZmZpdmFnbmlubi1SZXlramF2aWtfQ2FwaXRhbF9SZWdpb24uaHRtbFxcXCIgYWx0PVxcXCJMaW5rIHRvIFRyaXAgQWR2aXNvciBLYWZmaXZhZ25pbm5cXFwiIHRhcmdldD1cXFwiX2JsYW5rXFxcIiByZWxcXFwiYXV0aG9yIG5vb3BlbmVyIG5vcmVmZXJyZXJcXFwiPkthZmZpdmFnbmlubjwvYT48L2xpPlxcbiAgICAgIDwvdWw+XFxuICA8L2Rpdj5cXG5cXG4gIDxkaXY+XFxuICAgIDxoMz5FeHBsb3JlPC9oMz5cXG4gICAgPHVsIGNsYXNzPVxcXCJ1bC1yZXNvdXJjZVxcXCI+XFxuICAgICAgICA8bGk+PGEgaHJlZj1cXFwiaHR0cDovL3d3dy5ibHVlbGFnb29uLmNvbS9cXFwiIGFsdD1cXFwiTGluayB0byBCbHVlIExhZ29vblxcXCIgdGFyZ2V0PVxcXCJfYmxhbmtcXFwiIHJlbFxcXCJhdXRob3Igbm9vcGVuZXIgbm9yZWZlcnJlclxcXCI+Qmx1ZSBMYWdvb248L2E+PC9saT5cXG4gICAgICAgIDxsaT48YSBocmVmPVxcXCJodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9UaCVDMyVCM3JzbSVDMyVCNnJrXFxcIiBhbHQ9XFxcIkxpbmsgdG8gV2lraXBlZGlhIFRow7Nyc23DtnJrXFxcIiB0YXJnZXQ9XFxcIl9ibGFua1xcXCIgcmVsXFxcImF1dGhvciBub29wZW5lciBub3JlZmVycmVyXFxcIj5UaMOzcnNtw7ZyazwvYT48L2xpPlxcbiAgICAgICAgPGxpPjxhIGhyZWY9XFxcImh0dHA6Ly9pY2VsYWdvb24uaXMvXFxcIiBhbHQ9XFxcIkxpbmsgdG8gSsO2a3Vsc8OhcmzDs24gR2xhY2llciBMYWdvb25cXFwiIHRhcmdldD1cXFwiX2JsYW5rXFxcIiByZWxcXFwiYXV0aG9yIG5vb3BlbmVyIG5vcmVmZXJyZXJcXFwiPkrDtmt1bHPDoXJsw7NuIC0gR2xhY2llciBMYWdvb248L2E+PC9saT5cXG4gICAgICA8L3VsPlxcbiAgPC9kaXY+XFxuICBcXG48L2FydGljbGU+XCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcG9uZW50cy9yZXNvdXJjZXMvcmVzb3VyY2VzLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDIzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0xLTIhLi9yZXNvdXJjZXMuY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHtcInNvdXJjZU1hcFwiOnRydWUsXCJobXJcIjp0cnVlfVxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMS0yIS4vcmVzb3VyY2VzLmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMS0yIS4vcmVzb3VyY2VzLmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcG9uZW50cy9yZXNvdXJjZXMvcmVzb3VyY2VzLmNzc1xuLy8gbW9kdWxlIGlkID0gMjRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh0cnVlKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcInNlY3Rpb24ge1xcbiAgY29sb3I6ICNhNmRlZmY7XFxufVxcbi5oZXJvLXJlc291cmNlIHtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogMTByZW07XFxuICBsZWZ0OiA1MCU7XFxuICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKTtcXG4gICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC01MCUpO1xcbiAgbWFyZ2luOiAwIGF1dG87XFxuICB6LWluZGV4OiAxMDAwO1xcbn1cXG4udGl0bGUtcmVzb3VyY2Uge1xcbiAgY29sb3I6ICMwMDAwMDA7XFxuICBmb250LXNpemU6IDRyZW07XFxufVxcbi5zbWFsbC10aXRsZS1yZXNvdXJjZSB7XFxuICBmb250LXNpemU6IDFyZW07XFxuICBwYWRkaW5nOiAwIDAuNXJlbSAwIDA7XFxuICBjb2xvcjogIzAwMDAwMDtcXG59XFxuLnVsLXJlc291cmNlIHtcXG4gIG1hcmdpbjogMCAwIDAgMXJlbTtcXG59XFxuLnVsLXJlc291cmNlIGxpIHtcXG4gICAgcGFkZGluZzogMC44cmVtIDA7XFxuICAgIGxpc3Qtc3R5bGUtdHlwZTogY2lyY2xlO1xcbiAgICBcXG4gIH1cXG4udWwtcmVzb3VyY2UgbGkgYSB7XFxuICAgICAgY29sb3I6ICNmZmZmZmY7XFxuICAgICAgLXdlYmtpdC10cmFuc2l0aW9uOiAwLjNzIGVhc2UgYWxsO1xcbiAgICAgIHRyYW5zaXRpb246IDAuM3MgZWFzZSBhbGxcXG4gICAgfVxcbi51bC1yZXNvdXJjZSBsaSBhOmhvdmVyIHtcXG4gIGNvbG9yOiAjYTZkZWZmO1xcbiAgbWFyZ2luOiAwIDAgMCAwLjVyZW07XFxufVxcbi5yZXNvdXJjZS1ncmlkIHtcXG4gIHBhZGRpbmc6IDJyZW07XFxufVxcbi5yZXNvdXJjZS1ncmlkIGgzIHtcXG4gICAgY29sb3I6ICNhNmRlZmY7XFxuICAgIHBhZGRpbmc6IDEuNXJlbSAwIDFyZW07XFxuICB9XFxuLnJlc291cmNlLWdyaWQgaW1nIHtcXG4gICAgcGFkZGluZzogNHJlbSAwIDA7XFxuICB9XFxuLnJlc291cmNlLWdyaWQgPiBkaXY6bnRoLWNoaWxkKDEpIHstd2Via2l0LWJveC1vcmRpbmFsLWdyb3VwOiAyOy1tcy1mbGV4LW9yZGVyOiAxO29yZGVyOiAxO31cXG4ucmVzb3VyY2UtZ3JpZCA+IGRpdjpudGgtY2hpbGQoMikgey13ZWJraXQtYm94LW9yZGluYWwtZ3JvdXA6IDM7LW1zLWZsZXgtb3JkZXI6IDI7b3JkZXI6IDI7fVxcbi5yZXNvdXJjZS1ncmlkID4gZGl2Om50aC1jaGlsZCgzKSB7LXdlYmtpdC1ib3gtb3JkaW5hbC1ncm91cDogNDstbXMtZmxleC1vcmRlcjogMztvcmRlcjogMzt9XFxuLnJlc291cmNlLWdyaWQgPiBkaXY6bnRoLWNoaWxkKDQpIHstd2Via2l0LWJveC1vcmRpbmFsLWdyb3VwOiA1Oy1tcy1mbGV4LW9yZGVyOiA0O29yZGVyOiA0O31cXG4ucmVzb3VyY2UtZ3JpZCA+ICoge3BhZGRpbmc6IDFyZW07fVxcbkBtZWRpYSBzY3JlZW4gYW5kIChtaW4td2lkdGg6IDEwMDBweCkge1xcbiAgLnJlc291cmNlLWdyaWQgPiBkaXY6bnRoLWNoaWxkKDEpIHtncmlkLWFyZWE6IGE7fVxcbiAgLnJlc291cmNlLWdyaWQgPiBkaXY6bnRoLWNoaWxkKDIpIHtncmlkLWFyZWE6IGI7fVxcbiAgLnJlc291cmNlLWdyaWQgPiBkaXY6bnRoLWNoaWxkKDMpIHtncmlkLWFyZWE6IGM7fVxcbiAgLnJlc291cmNlLWdyaWQgPiBkaXY6bnRoLWNoaWxkKDQpIHtncmlkLWFyZWE6IGQ7fVxcbiAgXFxuICAucmVzb3VyY2UtZ3JpZCB7XFxuICAgIGRpc3BsYXk6IGdyaWQ7XFxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDMsIDFmcik7XFxuICAgIGdyaWQtdGVtcGxhdGUtYXJlYXM6XFxuICAgIFxcXCJhIGEgYVxcXCJcXG4gICAgXFxcImIgYyBkXFxcIjtcXG4gICAgLXdlYmtpdC1ib3gtYWxpZ246IHN0YXJ0O1xcbiAgICAgICAgLW1zLWZsZXgtYWxpZ246IHN0YXJ0O1xcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xcbiAgICBncmlkLWdhcDogMnJlbTtcXG4gIH1cXG59XFxuQG1lZGlhIHNjcmVlbiBhbmQgKG1pbi13aWR0aDogODAwcHgpIHtcXG4gIC5oZXJvLXJlc291cmNlMSB7XFxuICAgIGRpc3BsYXk6IG5vbmU7XFxuICB9XFxufVxcbkBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDEyMDBweCkge1xcbiAgLmhlcm8tcmVzb3VyY2Uge1xcbiAgICB0b3A6IDdyZW07XFxuICB9XFxuICAgIC5oZXJvLXJlc291cmNlIC50aXRsZS1yZXNvdXJjZSB7XFxuICAgICAgZm9udC1zaXplOiAzcmVtO1xcbiAgICB9XFxufVxcbkBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDgwMHB4KSB7XFxuICAuaGVyby1yZXNvdXJjZSB7XFxuICAgIGRpc3BsYXk6IG5vbmU7XFxuICB9XFxuICAgIC5oZXJvLXJlc291cmNlMSAudGl0bGUtcmVzb3VyY2Uge1xcbiAgICAgIGNvbG9yOiAjZmZmZmZmO1xcbiAgICAgIGZvbnQtc2l6ZTogM3JlbTtcXG4gICAgfVxcbiAgICAuaGVyby1yZXNvdXJjZTEgLnNtYWxsLXRpdGxlLXJlc291cmNlIHtcXG4gICAgICBjb2xvcjogI2ZmZmZmZjtcXG4gICAgfVxcbn1cIiwgXCJcIiwge1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiL1VzZXJzL2VuZHVzZXIvRGVza3RvcC9uYWNoby80MDEvdmFyaWFibGVzLmNzc1wiLFwiL1VzZXJzL2VuZHVzZXIvRGVza3RvcC9uYWNoby80MDEvdHJhdmVsLWFwcC9yZXNvdXJjZXMuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQVlBO0VBQ0UsZUFBZTtDQUNoQjtBQ1pEO0VBQ0UsbUJBQW1CO0VBQ25CLG1CQUFtQjtFQUNuQixXQUFXO0VBQ1gsVUFBVTtFQUNWLG9DQUE0QjtVQUE1Qiw0QkFBNEI7RUFDNUIsZUFBZTtFQUNmLGNBQWM7Q0FDZjtBQUVEO0VBQ0UsZUFBYztFQUNkLGdCQUFnQjtDQUNqQjtBQUVEO0VBQ0UsZ0JBQWdCO0VBQ2hCLHNCQUFzQjtFQUN0QixlQUFjO0NBQ2Y7QUFFRDtFQUNFLG1CQUFtQjtDQWNwQjtBQWJDO0lBQ0Usa0JBQWtCO0lBQ2xCLHdCQUF3Qjs7R0FVekI7QUFUQztNQUNFLGVBQWM7TUFDZCxrQ0FBMEI7TUFBMUIseUJBQTBCO0tBSzNCO0FBSkM7RUFDRSxlQUFhO0VBQ2IscUJBQXFCO0NBQ3RCO0FBTVA7RUFDRSxjQUFrQjtDQVFuQjtBQVBDO0lBQ0UsZUFBYTtJQUNiLHVCQUF1QjtHQUN4QjtBQUNEO0lBQ0Usa0JBQWtCO0dBQ25CO0FBR0gsbUNBQW1DLDZCQUFBLGtCQUFBLFNBQVMsQ0FBQztBQUM3QyxtQ0FBbUMsNkJBQUEsa0JBQUEsU0FBUyxDQUFDO0FBQzdDLG1DQUFtQyw2QkFBQSxrQkFBQSxTQUFTLENBQUM7QUFDN0MsbUNBQW1DLDZCQUFBLGtCQUFBLFNBQVMsQ0FBQztBQUM3QyxvQkFBb0IsY0FBYyxDQUFDO0FBRW5DO0VBQ0UsbUNBQW1DLGFBQWEsQ0FBQztFQUNqRCxtQ0FBbUMsYUFBYSxDQUFDO0VBQ2pELG1DQUFtQyxhQUFhLENBQUM7RUFDakQsbUNBQW1DLGFBQWEsQ0FBQzs7RUFFakQ7SUFDRSxjQUFjO0lBQ2Qsc0NBQXNDO0lBQ3RDOztZQUVRO0lBQ1IseUJBQXdCO1FBQXhCLHNCQUF3QjtZQUF4Qix3QkFBd0I7SUFDeEIsZUFBZTtHQUNoQjtDQUNGO0FBRUQ7RUFDRTtJQUNFLGNBQWM7R0FDZjtDQUNGO0FBRUQ7RUFDRTtJQUNFLFVBQVU7R0FJWDtJQUhDO01BQ0UsZ0JBQWdCO0tBQ2pCO0NBRUo7QUFFRDtFQUNFO0lBQ0UsY0FBYztHQUNmO0lBR0M7TUFDRSxlQUFjO01BQ2QsZ0JBQWdCO0tBQ2pCO0lBQ0Q7TUFDRSxlQUFjO0tBQ2Y7Q0FFSlwiLFwiZmlsZVwiOlwicmVzb3VyY2VzLmNzc1wiLFwic291cmNlc0NvbnRlbnRcIjpbXCIkYWNjZW50OiAjZmY4YzhjO1xcbiRsaW5rOiAjYTZkZWZmO1xcbiRkYXJrbGluazogIzAwN0JDMjtcXG4kbGlnaHRncmF5OiAjZWVlZWVlO1xcbiRkYXJrZ3JheTogIzQ0NDE0MDtcXG4kd2hpdGU6ICNmZmZmZmY7XFxuJGdyYXk6ICNFMEUwRTA7XFxuJGJsYWNrOiAjMDAwMDAwO1xcblxcbiRtYXhWaWV3cG9ydFNpemU6IDEyODBweDtcXG4kcGFkZGluZzogMnJlbTtcXG5cXG5zZWN0aW9uIHtcXG4gIGNvbG9yOiAjYTZkZWZmO1xcbn1cIixcIkBpbXBvcnQgJy4uL3ZhcmlhYmxlcy5jc3MnO1xcblxcbi5oZXJvLXJlc291cmNlIHtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogMTByZW07XFxuICBsZWZ0OiA1MCU7XFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTUwJSk7XFxuICBtYXJnaW46IDAgYXV0bztcXG4gIHotaW5kZXg6IDEwMDA7XFxufVxcblxcbi50aXRsZS1yZXNvdXJjZSB7XFxuICBjb2xvcjogJGJsYWNrO1xcbiAgZm9udC1zaXplOiA0cmVtO1xcbn1cXG5cXG4uc21hbGwtdGl0bGUtcmVzb3VyY2Uge1xcbiAgZm9udC1zaXplOiAxcmVtO1xcbiAgcGFkZGluZzogMCAwLjVyZW0gMCAwO1xcbiAgY29sb3I6ICRibGFjaztcXG59XFxuXFxuLnVsLXJlc291cmNlIHtcXG4gIG1hcmdpbjogMCAwIDAgMXJlbTtcXG4gIGxpIHtcXG4gICAgcGFkZGluZzogMC44cmVtIDA7XFxuICAgIGxpc3Qtc3R5bGUtdHlwZTogY2lyY2xlO1xcbiAgICBhIHtcXG4gICAgICBjb2xvcjogJHdoaXRlO1xcbiAgICAgIHRyYW5zaXRpb246IDAuM3MgZWFzZSBhbGw7XFxuICAgICAgJjpob3ZlciB7XFxuICAgICAgICBjb2xvcjogJGxpbms7XFxuICAgICAgICBtYXJnaW46IDAgMCAwIDAuNXJlbTtcXG4gICAgICB9XFxuICAgIH1cXG4gICAgXFxuICB9XFxufVxcblxcbi5yZXNvdXJjZS1ncmlkIHtcXG4gIHBhZGRpbmc6ICRwYWRkaW5nO1xcbiAgaDMge1xcbiAgICBjb2xvcjogJGxpbms7XFxuICAgIHBhZGRpbmc6IDEuNXJlbSAwIDFyZW07XFxuICB9XFxuICBpbWcge1xcbiAgICBwYWRkaW5nOiA0cmVtIDAgMDtcXG4gIH1cXG59XFxuXFxuLnJlc291cmNlLWdyaWQgPiBkaXY6bnRoLWNoaWxkKDEpIHtvcmRlcjogMTt9XFxuLnJlc291cmNlLWdyaWQgPiBkaXY6bnRoLWNoaWxkKDIpIHtvcmRlcjogMjt9XFxuLnJlc291cmNlLWdyaWQgPiBkaXY6bnRoLWNoaWxkKDMpIHtvcmRlcjogMzt9XFxuLnJlc291cmNlLWdyaWQgPiBkaXY6bnRoLWNoaWxkKDQpIHtvcmRlcjogNDt9XFxuLnJlc291cmNlLWdyaWQgPiAqIHtwYWRkaW5nOiAxcmVtO31cXG5cXG5AbWVkaWEgc2NyZWVuIGFuZCAobWluLXdpZHRoOiAxMDAwcHgpIHtcXG4gIC5yZXNvdXJjZS1ncmlkID4gZGl2Om50aC1jaGlsZCgxKSB7Z3JpZC1hcmVhOiBhO31cXG4gIC5yZXNvdXJjZS1ncmlkID4gZGl2Om50aC1jaGlsZCgyKSB7Z3JpZC1hcmVhOiBiO31cXG4gIC5yZXNvdXJjZS1ncmlkID4gZGl2Om50aC1jaGlsZCgzKSB7Z3JpZC1hcmVhOiBjO31cXG4gIC5yZXNvdXJjZS1ncmlkID4gZGl2Om50aC1jaGlsZCg0KSB7Z3JpZC1hcmVhOiBkO31cXG4gIFxcbiAgLnJlc291cmNlLWdyaWQge1xcbiAgICBkaXNwbGF5OiBncmlkO1xcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgzLCAxZnIpO1xcbiAgICBncmlkLXRlbXBsYXRlLWFyZWFzOlxcbiAgICBcXFwiYSBhIGFcXFwiXFxuICAgIFxcXCJiIGMgZFxcXCI7XFxuICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xcbiAgICBncmlkLWdhcDogMnJlbTtcXG4gIH1cXG59XFxuXFxuQG1lZGlhIHNjcmVlbiBhbmQgKG1pbi13aWR0aDogODAwcHgpIHtcXG4gIC5oZXJvLXJlc291cmNlMSB7XFxuICAgIGRpc3BsYXk6IG5vbmU7XFxuICB9XFxufVxcblxcbkBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDEyMDBweCkge1xcbiAgLmhlcm8tcmVzb3VyY2Uge1xcbiAgICB0b3A6IDdyZW07XFxuICAgIC50aXRsZS1yZXNvdXJjZSB7XFxuICAgICAgZm9udC1zaXplOiAzcmVtO1xcbiAgICB9XFxuICB9XFxufVxcblxcbkBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDgwMHB4KSB7XFxuICAuaGVyby1yZXNvdXJjZSB7XFxuICAgIGRpc3BsYXk6IG5vbmU7XFxuICB9XFxuXFxuICAuaGVyby1yZXNvdXJjZTEge1xcbiAgICAudGl0bGUtcmVzb3VyY2Uge1xcbiAgICAgIGNvbG9yOiAkd2hpdGU7XFxuICAgICAgZm9udC1zaXplOiAzcmVtO1xcbiAgICB9XFxuICAgIC5zbWFsbC10aXRsZS1yZXNvdXJjZSB7XFxuICAgICAgY29sb3I6ICR3aGl0ZTtcXG4gICAgfVxcbiAgfVxcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlcj97XCJpbXBvcnRMb2FkZXJzXCI6MSxcInNvdXJjZU1hcFwiOnRydWV9IS4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYj97XCJzb3VyY2VNYXBcIjp0cnVlfSEuL3NyYy9jb21wb25lbnRzL3Jlc291cmNlcy9yZXNvdXJjZXMuY3NzXG4vLyBtb2R1bGUgaWQgPSAyNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgaHRtbCBmcm9tICcuL2Zvb3Rlci5odG1sJztcbmltcG9ydCAnLi9mb290ZXIuY3NzJztcbmltcG9ydCBUZW1wbGF0ZSBmcm9tICcuLi9UZW1wbGF0ZSc7XG5cbmNvbnN0IHRlbXBsYXRlID0gbmV3IFRlbXBsYXRlKGh0bWwpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGb290ZXIge1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBkb20gPSB0ZW1wbGF0ZS5jbG9uZSgpO1xuXG4gICAgcmV0dXJuIGRvbTtcbiAgfVxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBvbmVudHMvZm9vdGVyL0Zvb3Rlci5qc1xuLy8gbW9kdWxlIGlkID0gMjZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxwPihjKSBUcmF2ZWwgSWNlbGFuZCDigJQgPGEgaHJlZj1cXFwiaHR0cHM6Ly9naXRodWIuY29tL2xpbW9uZ29vL3RyYXZlbC1hcHBcXFwiIHRhcmdldD1cXFwiX2JsYW5rXFxcIiByZWxcXFwiYXV0aG9yIG5vb3BlbmVyIG5vcmVmZXJyZXJcXFwiPkl2YW4gTGltb25nYW48L2E+PC9wPlxcblwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBvbmVudHMvZm9vdGVyL2Zvb3Rlci5odG1sXG4vLyBtb2R1bGUgaWQgPSAyN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMS0yIS4vZm9vdGVyLmNzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gUHJlcGFyZSBjc3NUcmFuc2Zvcm1hdGlvblxudmFyIHRyYW5zZm9ybTtcblxudmFyIG9wdGlvbnMgPSB7XCJzb3VyY2VNYXBcIjp0cnVlLFwiaG1yXCI6dHJ1ZX1cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTEtMiEuL2Zvb3Rlci5jc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTEtMiEuL2Zvb3Rlci5jc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBvbmVudHMvZm9vdGVyL2Zvb3Rlci5jc3Ncbi8vIG1vZHVsZSBpZCA9IDI4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodHJ1ZSk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJcIiwgXCJcIiwge1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W10sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIlwiLFwiZmlsZVwiOlwiZm9vdGVyLmNzc1wiLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXI/e1wiaW1wb3J0TG9hZGVyc1wiOjEsXCJzb3VyY2VNYXBcIjp0cnVlfSEuL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWI/e1wic291cmNlTWFwXCI6dHJ1ZX0hLi9zcmMvY29tcG9uZW50cy9mb290ZXIvZm9vdGVyLmNzc1xuLy8gbW9kdWxlIGlkID0gMjlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGNvbnN0IHJlbW92ZUNoaWxkcmVuID0gbm9kZSA9PiB7XG4gIHdoaWxlKG5vZGUuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgbm9kZS5yZW1vdmVDaGlsZChub2RlLmxhc3RDaGlsZCk7XG4gIH1cbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcG9uZW50cy9kb20uanNcbi8vIG1vZHVsZSBpZCA9IDMwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=