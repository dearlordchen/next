# next 前端工作流
> 美的前端团队基于webpack，结合自己业务情况打造的前端工作流，主要用来解决js、css、图片相关的前端工程化问题

## 如何使用
1.  fork & clone
2. `npm install`
3. 如果是普通js项目，copy`/src/demo` 重命名为你的项目目录假设为demo1，如果是vuejs项目，copy`/src/vue`重命名为你的项目目录。
4. 进入`/src/demo1` 运行`gulp hot --page=a`（假设你项目的pages目录下有一个入口叫a.js,可以多个入口同时运行，用逗号隔开比如--page=a,b,c）,在浏览器打开http://localhost:8081/a.html，然后就可以愉快的写代码了（es6、自定义ui组件、功能组件、scss等都可以在demo中找到，建议参考和理解），开发过程是hot-reload，无需刷新，修改代码自动生效（还不是太稳定，遇到生效缓慢手动刷新下）
5. 运行 `gulp dev --page=a`，即可在`/dist/dev`下看到生成的开发模式文件（这里主要用来结合后台框架，比如我们就通过ssi结合php实现前后端整合)
6. 运行`gulp build --page=a` 即可在`/dist/build` 下看到生成的发布模式文件（这里生成的文件也是我们最终用于生产环境的文件，具体怎么结合）

## 目录结构
整个next框架一级目录结构如下图，简单说明一下：
* config下是webpack相关配置，区分开发和生产环境
* dist目录是gulp dev和gulp build后生成的文件，可以结合node express或者php框架等实现统一的开发框架
* node_modules，项目依赖的所有node模块，包括前端代码中用到的模块
* src这个是项目目录，也是实际工作中主要修改的目录，common下主要是公共模块，demo是普通js项目模板，vue是vuejs是项目模板，大家可以复制模板后基于模板进行业务开发。

![next一级目录](https://img.mdcdn.cn/h5/pic/201609/Snip20160912_22.png)

项目目录结构如下图：
* pages目录是入口目录，可以理解这个目录下的每一个js文件对应一个页面
* tpl目录对应pages的入口，都会有一个对应html文件作为页面模板
* module目录里面放项目组件，用来实现项目内组件共享
* gulpfile.js里就是调用webpack的工作流
* mustache是.ma结尾的mustache模板，img是图片目录，css是样式目录(支持sass、less等)

![项目代码目录结构](https://img.mdcdn.cn/h5/pic/201609/Snip20160912_24.png)
