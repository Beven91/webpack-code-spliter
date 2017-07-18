
var fs = require('fs');
var path = require('path');

var NAME = 'spliter.json';
var CONFIGFILE = path.resolve(NAME);
var Cache = null;

function CodeSplitRouter(targetRoot) {
    
}

/**
 * 保存拆分配置
 * @param routes 生成的配置
 * @param targetRoot 目标目录 
 */
CodeSplitRouter.save = function (routes, targetRoot) {
    targetRoot = targetRoot ? path.join(targetRoot, NAME) : CONFIGFILE;
    fs.writeFileSync(targetRoot, JSON.stringify(routes, null, 4));
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