# 一富财经移动网站（支持微信）

一富财经移动端支持微信公众号，基于微信jssdk开发的系统，同时也支持非微信客户端使用（移动网站），在非微信客户端，部分依赖微信jssdk的功能将会失去，包括：微信支付、图片上传预览、使用微信快捷登陆等

该系统基于AmazeUIReact，使用React、AmazeUI（React组件）、react-router 及 gulp 开发的 SPA（single page application）。

本系统目前维护3个分支，
1. 官方默认版 master
2. 揭幕完整版 jm
3. 揭幕精简版 pre

## 目录结构

项目文件放在 `app` 目录下：

```
app
├── fonts		   // 自定义字体图标
├── humans.txt
├── i              // 图片
├── index.html     // 入口 HTML
├── code.html      // 微信授权验证单页跳转 HTML
├── js             // 主要业务代码（下面会详细说明）
├── less           // Less样式
├── manifest.json
├── manifest.webapp
└── robots.txt
```

主要业务代码在 `app\js` 目录下面
```
app\js
├── components	   // 自定义组件
├── models		   // 数据模型
├── pages          // React 页面
├── utils	       // 工具类
└── app.js         // 入口文件
```

## 使用说明

### 全局安装 gulp：

```
npm install gulp -g
```

### 安装开发依赖

1. 克隆或下载本项目；
2. 进入项目目录，执行 `npm install`；

### 开发

```
npm start
```

### 生产环境构建

设置 Node 环境变量为 `production` 后，HTML 中引用的 CSS 和 JS 会替换为 minify 的版本。

```
npm run build
```
