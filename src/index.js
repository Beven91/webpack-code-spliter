var CodeSpliterPlugin = require('./plugin.js');
var Configure = require('./config.js');

module.exports = {
    CodeSpliterPlugin: CodeSpliterPlugin,
    getRoutejs: Configure.getRoutejs.bind(Configure)
}