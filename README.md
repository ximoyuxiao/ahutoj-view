
# AhutOj 前端部分

这是Ahut的Oj平台项目的前端部分。


## 技术选型

**框架:** Vue3

**技术周边:** TypeScript、Pinia、VueRouter、Axios、Scss……

**UI:** Element-Plus、Animate （可能会引入GSAP）

**Plugin:** Ace-builds、md-editor-v3、qs、compressorjs、xlsx……

**构建工具：** Vite


## 环境配置
### 1 node、npm准备
升级nodejs和npm到最新稳定版本。
注意如果单独安装或者升级，一定要先升级nodejs再升级npm，否则npm就会报错。

Ubuntu具体操作方法在下方链接，Windows也可以去搜一下，这里不多说↓  
[Ubuntu系统安装nodejs、npm方法链接](https://blog.csdn.net/Elford/article/details/123337667)

### 2 安装Vite构建工具
```command
npm install vite
```

### 3 创建工程
```command
npm init vite 
```
接下来会提示 “? Project name: › ”，那么你只需要输入项目名称（随意）就可以了。

再接下来会出现一些选项，让你选择React、Vue……，直接选择Vue。

最后会让你选择Js框架，你选择TypeScript。

那么就初始化完成了。

### 4 最后准备工作
为什么不直接clone仓库，然后再安装依赖呢？

-> 因为考虑到项目会越来越复杂化，组件会越来越多，依赖也会很多，
所以对于刚刚初始化的同学，你要先试试能不能把这个初始化代码先跑起来。

那么进入目录，输入以下命令
```
npm install  #或者 npm i
```

在安装完毕后，输入
```
npm run dev
```

那么你就成功启动开发环境了，下面终端会出现一个URL地址，直接Ctrl + 鼠标
点击跳转到浏览器就能看到效果。到此准备工作结束。

### 5 拉取项目代码
让终端cd 到刚刚创建的新项目目录的根目录位置，同时删除所有文件（除了node_modules文件夹、
以及你的IDE的配置文件比如.vscode），删除完了以后，你要在电脑上配置git环境，
这个可以上网上查查就能解决。然后使用以下指令。
```
git clone https://github.com/cz2542079957/AhutOjVue.git
```

那么项目代码就到你的目录下面了。

不过别急，这时候还没结束，你还需要最后再安装项目的依赖。
同时你还要稍微修改一下代码，因为有初始创建的代码在里面，你得先改掉。
```
npm install   #或者 npm i
```
等待安装结束，使用
```
npm run dev
```
就可以跑起来了，记得开启后端进程
有疑问请联系QQ：2542079957 （13东月关）