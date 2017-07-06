
var fs = require('fs');
var path  =require('path');

var CONFIGFILE = path.resolve('spliter.json');
var Cache = null;

function CodeSplitRouter() {

}

/**
 * 保存拆分配置
 */
CodeSplitRouter.save = function (routes) {
    fs.writeFileSync(CONFIGFILE, JSON.stringify(routes, null, 4));
}

/**
 * 读取拆分配置
 */
CodeSplitRouter.read = function () {
   return fs.existsSync(CONFIGFILE) ? require(CONFIGFILE) : {};
}

/**
 * 获取配置
 */
CodeSplitRouter.get = function () {
    return Cache ? Cache : Cache = this.read();
}

/**
 * 获取当前路由对应的routejs
 */
CodeSplitRouter.getRoutejs = function (pathname, publicPath) {
    var routes = CodeSplitRouter.get();
    var name = (pathname || '').replace(/(^\/|\/$)/g, '').toLowerCase();
    var js = routes[name];
    return js ? (publicPath || '') + js : null;
}

module.exports = CodeSplitRouter;