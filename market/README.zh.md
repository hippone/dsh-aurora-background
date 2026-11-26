# 插件索引（DSH 社区分发）

这个目录是给 DSH 的**插件市场索引**用的：一个格式 1 的 JSON 文件，加上它的图标。把它和图标放到任意静态 https 主机上，别人就能在
**插件 → 发现 → 添加索引源** 里填这个 URL，然后像装官方插件一样安装。

DSH 不内置任何公共索引源，"发社区"就是：**把包发出去 + 自己托管这个索引 + 把 URL 分享给别人**。

## 当前发布位置

| 用途 | URL |
|---|---|
| 源码仓库 | https://github.com/hippone/dsh-aurora-background |
| 索引（别人填这个） | `https://raw.githubusercontent.com/hippone/dsh-aurora-background/main/market/index.json` |
| 图标 | `market/icons/aurora-background.svg`（相对索引 URL 解析） |

索引里这一版指向仓库里固定的提交，所以即使以后 main 分支继续更新，这一版安装的内容也不会变。

## 别人怎么安装

1. **插件** 页 → 实验性插件里打开 **自定义插件索引**（Discover 标签页出现）。
2. **发现** → **添加索引源** → 粘贴上面的索引 URL。
3. 在卡片上点 **安装**，确认框里核对来源后安装。

## 发新版本

索引里的 `source.commit` 必须指向**包含这一版代码**的提交，所以顺序是"先提交代码，再生成索引，再提交索引"：

```sh
# 1. 改 package.json 的 version，提交代码
git commit -am "release 1.1.0"

# 2. 用这个提交生成索引
node market/build-index.mjs --commit "$(git rev-parse HEAD)"

# 3. 提交索引并推送
git commit -am "index: 1.1.0" && git push
```

`build-index.mjs` 从 `package.json` 读名称、版本、关键词、`engines.dsh`、仓库地址和描述，不需要别的输入。可选参数：

| 参数 | 默认 | 含义 |
|---|---|---|
| `--source git\|npm` | `git` | 来源类型；`npm` 写 `{ "type": "npm" }` |
| `--commit <sha>` | `git rev-parse HEAD` | Git 来源固定的提交 |
| `--published <unix>` | 当前时间 | 该版本的发布时间 |
| `--out <file>` | `market/index.json` | 输出文件 |

## 走 npm 公共包（同一份索引也能切换）

```sh
npm login                       # 当前 npm 登录态已失效，需要重新登录
npm publish --access public     # 包名未占用：dsh-aurora-background
node market/build-index.mjs --source npm
git commit -am "index: npm source" && git push
```

## 校验

DSH 读索引时用 `@deepseek-ai/dsh-plugin-market-index` 校验，第一条不合规的规则会让整个索引被拒，并在**管理索引源…**里显示原因和出错的 JSON 路径。
本仓库生成索引时已用它验过，输出为：

```
index ok: hippone 的 DSH 插件 | plugins: 1
  plugin: dsh-aurora-background | 极光动态背景
    1.0.0 | install: git+https://github.com/hippone/dsh-aurora-background.git#<commit>
```

## 托管在别处

索引是 UTF-8 JSON，2xx 返回、不重定向即可，默认上限 128 MiB。GitHub Pages、GitLab Pages、对象存储都行：把 `index.json` 和 `icons/` 并排发布，
`"icon": "icons/aurora-background.svg"` 会按相对索引 URL 解析，不用改文件。指向其他主机的绝对图标 URL 必须用 `https:`。

格式全部规则见 DSH 安装目录里的用户指南 `docs/user/guide/plugin-market.zh.md`。
