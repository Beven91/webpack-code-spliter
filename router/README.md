# code-spliter-router

### 一、简介

    用于读取webpack-code-spliter 代码拆分配置，并且返回对应的js访问路径


### 二、安装

    npm install code-spliter-router --save
    
     
### 三、使用
express react split isormophic

```js

    import ReactDOMServer from 'react-dom/server';
    import ApplicationComponent from './src/app/index.js';
    import CodeSpliterRouter from 'code-spliter-router';

    //app =  express()
    app.use('/react',(req,resp,next)=>{
        let initialHTML = ReactDOMServer.renderToString(ApplicationComponent)
        let routejs = CodeSpliterRouter.getRoutejs(req);
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