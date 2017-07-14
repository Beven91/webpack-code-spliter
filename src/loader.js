/**
 * 名称：代码拆分 webpack-loader
 * 日期：2017-07-05
 * 描述：用于根据配置拆分指定代码
 */

var loaderUtils = require("loader-utils");
var REPLACEMENT = require('./plugin.js').REPLACEMENT;

function CodeSplitLoader() {

}

CodeSplitLoader.pitch = function (remainingRequest) {
  this.cacheable && this.cacheable();
  var file = remainingRequest.indexOf("!") > -1 ? remainingRequest.split('!')[1] : remainingRequest;
  var options = loaderUtils.getOptions(this) || {};
  var splitPoints = options.points;
  var splitHandle = options.splitHandle;
  var chunkNameParam = '';
  var name = splitPoints[(file || '').replace(/\\/g, '/').toLowerCase()];
  splitHandle = typeof splitHandle === 'function' ? splitHandle : defaultHandle;
  if (name) {
    var myOptions = {
      context: options.context || this.options.context,
      regExp: options.regExp
    };
    chunkNameParam = ", " + JSON.stringify(loaderUtils.interpolateName(this, name, myOptions));
  }
  var ensure = [
    "function(cb) {",
    "	  require.ensure([], function(require) {",
    "		  cb(require(", loaderUtils.stringifyRequest(this, "!!" + remainingRequest), "));",
    "	  }" + chunkNameParam + ");",
    " }",
  ];
  return [
    "if(__webpack_require__.m[" + REPLACEMENT + "]){",
    " module.exports = __webpack_require__(" + REPLACEMENT + ");",
    "}else{",
    "module.exports=" + splitHandle(ensure.join(''),file),
    "}"
  ].join('\n')
}

function defaultHandle(code) {
  return code;
}

module.exports = CodeSplitLoader;