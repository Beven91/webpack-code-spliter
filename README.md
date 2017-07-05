# webpack-code-spliter

### 一、简介

    用于实现webpack代码拆分，主要用于异步加载模块，
    但是在react同构模式下，异步加载会导致checksum不一致问题，
    所以使用此工具，用于解决react同构模式下的代码拆分
    原理：
        当浏览器访问同构页面时服务端返回页面中引用拆分后的对应的js
        例如拆分后文件如下：
            app.js
            common.js
            pages/index.split.js
            pages/user.split.js
            pages/login.split.js

        当浏览器访问user页面时服务端返回:
        common.js
        pages/user.split.js
        app.js


### 二、安装

    npm install webpack-code-spliter --save
    
     
### 三、使用

Webpack config example:

```js
    var CodeSpliterPlugin  = require('webpack-code-spliter').CodeSpliterPlugin;
    /* 格式:  要拆分的js路径?name=路由路径
    *  例如:  ./routers/user/login.js?name=user/login
    *  目的： ?name=user/login 解决代码拆分造成同构checksum问题
    *  原理:  当路由匹配到?name的值，会在同构时同步加载对应拆分的js 如果是客户端pushstate则异步加载
    *  [
    *    'index=user/login', //特殊项 用于配置/对应的路由
    *    './routers/user/login.js?name=user/login'
    */
    var spliter = CodeSpliterPlugin.configure([
        './user/login.jsx?name=user/login',
        './user/register.jsx?name=user/register',
    ])

    module.exports = {
        output: {
            chunkFilename: '[name]',
        },
        plugins:[
            new CodeSpliterPlugin()
        ],
        module:{
            loaders:[
                {
                    test: /\.js$|\.jsx$/,
                    include: spliter.includes,
                    loader: [
                        {
                            loader:spliter.loader,
                            options:spliter.options
                        },
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: babelRc.presets,
                                plugins: babelRc.plugins
                            }
                        }
                    ]
                }
            ]
        }
    }

```

express react split isormophic

```js

    import ReactDOMServer from 'react-dom/server';
    import ApplicationComponent from './src/app/index.js';
    import CodeSpliter from 'webpack-code-spliter';

    //app =  express()
    app.use('/react',(req,resp,next)=>{
        let initialHTML = ReactDOMServer.renderToString(ApplicationComponent)
        let routejs = CodeSpliter.getRoutejs(req);
        let options = {
            title: '页面标题',
            routejs:routejs
            initialHTML: initialHTML,
        };
        resp.render('react', options);
    })

    /* 
        react.hbs:
        <html>
            <head>
                <title>{{title}}</title>
                ....
            </head>
            <body>
                <div id="app">{{{initialHTML}}}</div>
                <script type="text/javascript"  src="/app/common.js"></script>
                {{#if pagejs}}
                <script type="text/javascript"  src="/app/{{routejs}}"></script>
                {{/if}}
                <script type="text/javascript"  src="/app/app.js"></script>
            </body>
        </html>

    */

```

### 四、开源许可
基于 [MIT License](http://zh.wikipedia.org/wiki/MIT_License) 开源，使用代码只需说明来源，或者引用 [license.txt](https://github.com/sofish/typo.css/blob/master/license.txt) 即可。