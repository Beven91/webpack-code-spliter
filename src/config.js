/**
 * 名称：代码拆分loader配置
 * 日期: 2017-07-04
 * 描述：用于配置webpack进行代码拆分的工具，实现拆分后不影响react同构
 */

var path = require('path');
var fse = require('fs-extra');
var url = require('url');
var querystring = require('querystring');

var CONFIGFILE = path.resolve('spliter.json');
var Cache = null;

function Configure(name, rootDir, points) {
    this.rootDir = rootDir;
    this.points = points || [];
    this.routes = {};
    this.name = name;
    this.options = {};
    this.includes = [];
    this.split();
    this.save();
}

/**
 * 获取所有拆分点
 */
Configure.prototype.split = function () {
    this.points.forEach(this.iterator.bind(this));
}

/**
 * 遍历拆分点配置
 */
Configure.prototype.iterator = function (point) {
    var route = querystring.parse(url.parse(point).query);
    var src = (point.split('?')[0] || '').trim();
    var name = (route.name || '').replace(/\//, '.');
    if (src.indexOf('index=') === 0) {
        return this.index = src.split('index=')[1];
    }
    var file = path.isAbsolute(src) ? src : path.join(this.rootDir, src)
    name = name ? name : file.split(path.sep).slice(-3).join('.');
    name = this.name +'/'+ name.toLowerCase() + '.js';
    if (route.name) {
        this.routes[route.name.replace(/(^\/|\/$)/g, '')] = name;
    }
    this.options[file.toLowerCase().replace(/\\/g, '/')] = name;
    this.includes.push(file);
}

/**
 * 保存拆分配置
 */
Configure.prototype.save = function () {
    if (this.index) {
        this.routes[''] = this.routes[this.index];
    }
    fse.writeJSONSync(CONFIGFILE, this.routes);
}

/**
 * 读取拆分配置
 */
Configure.read = function () {
    fse.existsSync(CONFIGFILE) ? fse.readJSONSync(CONFIGFILE) : {};
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
Configure.getRoutejs = function (pathname, publicPath) {
    var routes = this.get();
    var name = (pathname || '').replace(/(^\/|\/$)/g, '').toLowerCase();
    var js = routes[name];
    return js ? (publicPath || '') + js : null;
}

module.exports = Configure;
