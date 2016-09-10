# next 前端工作流
> 美的前端团队基于webpack，结合自己业务情况打造的前端工作流，主要用来解决js、css、图片相关的前端工程化问题

## 如何使用
1. fork & clone
2. `npm install`
3. copy`/src/demo` 重命名为你的项目目录假设为demo1，并且在pages目录下有入口a.js
4. 进入`/src/demo1` 运行`gulp hot --page=a`,看到下面界面，就可以愉快的写代码了（es6、自定义ui组件、功能组件、scss等都可以在demo中找到，建议参考和理解）
![alt](http://km.midea.com/uploads/imgs/900c51096077.png)
页面url是http://localhost:8081/a.html开发过程是hot-reload，无需刷新，修改代码自动生效
5. 运行 `gulp dev --page=a`，即可在`/dist/dev`下看到生成的开发模式文件（这里主要用来结合后台框架，比如我们就通过ssi结合php实现前后端整合）
6. 运行`gulp build --page=a` 即可在`/dist/build` 下看到生成的发布模式文件（这里主要用来结合后台框架，比如我们就通过ssi结合php实现前后端整合）
