
var fs = require('fs');
var path  =require('path');

var CONFIGFILE = path.resolve('spliter.json');
var Cache = null;

function CodeSplitRouter() {

}

/**
 * 保存拆分配置
 */
CodeSplitRouter.save = function () {
    fse.writeFileSync(CONFIGFILE, JSON.stringify(this.routes, null, 4));
}

/**
 * 读取拆分配置
 */
Configure.read = function () {
    fse.existsSync(CONFIGFILE) ? require(CONFIGFILE) : {};
}

/**
 * 获取配置
 */
Configure.get = function () {
    return Cache ? Cache : Cache = this.read();
}

/**
 * 获取当前路由对应的routejs
 */
CodeSplitRouter.getRoutejs = function (pathname, publicPath) {
    var routes = this.get();
    var name = (pathname || '').replace(/(^\/|\/$)/g, '').toLowerCase();
    var js = routes[name];
    return js ? (publicPath || '') + js : null;
}

module.exports = CodeSplitRouter;