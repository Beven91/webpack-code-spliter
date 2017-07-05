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
    var chunkNameParam = '';
    var name = options[(file || '').replace(/\\/g, '/').toLowerCase()];
    if (name) {
        var options = {
            context: options.context || this.options.context,
            regExp: options.regExp
        };
        chunkNameParam = ", " + JSON.stringify(loaderUtils.interpolateName(this, name, options));
    }
    return [
        "if(__webpack_require__.m[" + REPLACEMENT + "]){",
        " module.exports = __webpack_require__(" + REPLACEMENT + ");",
        "}else{",
        " module.exports = function(cb) {",
        "	  require.ensure([], function(require) {",
        "		  cb(require(", loaderUtils.stringifyRequest(this, "!!" + remainingRequest), "));",
        "	  }" + chunkNameParam + ");",
        " }",
        "}"
    ].join('\n')
}

module.exports = CodeSplitLoader;