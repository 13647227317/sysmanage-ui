# sysmanage-ui

> 这是一个极简的管理后台。它只包含了 Element UI & axios & iconfont & permission control & lint，这些搭建后台必要的东西。


目前版本为 `v4.0+` 基于 `vue-cli` 进行构建。

## Extra

## 相关项目

- [sysmanage后台代码地址](https://github.com/13647227317/sysmanage.git)



## Build Setup

```bash
# 克隆项目
git clone https://github.com/13647227317/sysmanage-ui.git

# 进入项目目录
cd sysmanage-ui

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 [http://localhost:9528](http://localhost:9528)

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

## Browsers support

Modern browsers and Internet Explorer 10+.

后端模块地址：
https://github.com/13647227317/sysmanage.git

已完成功能：
登录、菜单树展示、标签导航、用户管理、角色管理
