# T0001 - 工程初始化

工程初始化命令可以帮你生成一个Zero UI的脚手架，生成脚手架过后则可以直接使用IDE打开进行开发，主命令：

```shell
ai zero
```

## 1.示例

```shell
> ai zero -o mbcloud-demo

[Zero AI] Zero AI 代码生成器, GitHub : https://github.com/silentbalanceyh/vertx-ui
[Zero AI] 当前版本: 0.2.10  确认您的Node版本 ( >= 10.x ) 支持ES6.
[Zero AI] Zero AI 系统启动......
[Zero AI] 命令参数：
{
    "out": "mbcloud-demo"
}
[Zero AI] 初始化项目：Cloning into 'mbcloud-demo'...

[Zero AI] 删除文件：mbcloud-demo/CNAME
[Zero AI] 删除文件：mbcloud-demo/LICENSE
[Zero AI] 删除文件：mbcloud-demo/_config.yml
[Zero AI] 删除文件：mbcloud-demo/yarn.lock
[Zero AI] 删除文件：mbcloud-demo/.git/HEAD
[Zero AI] 删除文件：mbcloud-demo/.git/config
[Zero AI] 删除文件：mbcloud-demo/.git/description
[Zero AI] 删除文件：mbcloud-demo/.git/hooks/applypatch-msg.sample
[Zero AI] 删除文件：mbcloud-demo/.git/hooks/commit-msg.sample
[Zero AI] 删除文件：mbcloud-demo/.git/hooks/post-update.sample
[Zero AI] 删除文件：mbcloud-demo/.git/hooks/pre-applypatch.sample
[Zero AI] 删除文件：mbcloud-demo/.git/hooks/pre-commit.sample
[Zero AI] 删除文件：mbcloud-demo/.git/hooks/pre-push.sample
[Zero AI] 删除文件：mbcloud-demo/.git/hooks/pre-rebase.sample
[Zero AI] 删除文件：mbcloud-demo/.git/hooks/pre-receive.sample
[Zero AI] 删除文件：mbcloud-demo/.git/hooks/prepare-commit-msg.sample
[Zero AI] 删除文件：mbcloud-demo/.git/hooks/update.sample
[Zero AI] 删除文件：mbcloud-demo/.git/index
[Zero AI] 删除文件：mbcloud-demo/.git/info/exclude
[Zero AI] 删除文件：mbcloud-demo/.git/logs/HEAD
[Zero AI] 删除文件：mbcloud-demo/.git/logs/refs/heads/master
[Zero AI] 删除文件：mbcloud-demo/.git/logs/refs/remotes/origin/HEAD
[Zero AI] 删除文件：mbcloud-demo/.git/objects/pack/pack-077a35cc7176a8e2464412df565471737f22028b.idx
[Zero AI] 删除文件：mbcloud-demo/.git/objects/pack/pack-077a35cc7176a8e2464412df565471737f22028b.pack
[Zero AI] 删除文件：mbcloud-demo/.git/packed-refs
[Zero AI] 删除文件：mbcloud-demo/.git/refs/heads/master
[Zero AI] 删除文件：mbcloud-demo/.git/refs/remotes/origin/HEAD
[Zero AI] 初始化完成，项目地址：mbcloud-demo
```

## 2.命令说明

```shell
ai zero -h                                                                                      
[Zero AI] Zero AI 代码生成器, GitHub : https://github.com/silentbalanceyh/vertx-ui
[Zero AI] 当前版本: 0.2.10  确认您的Node版本 ( >= 10.x ) 支持ES6.
[Zero AI] Zero AI 系统启动......

  Usage: zero [options] [-o, --out]

  初始化Zero项目专用命令

  Options:

    -o, --out   【.】输出到当前目录
    -h, --help  output usage information
```

## 3.参数说明

| 参数格式 | 说明 | 限制 |
| :--- | :--- | :--- |
| -o, --out | 初始化项目的输出目录地址 | 输出目录必须存在，而且输出目录必须为空目录，包括点操作符打头的目录都视为不合法目录。 |

## 4.错误表

```shell
# 目录不存在
[Zero AI] ERR : [AI-10009] The path 'mbcloud-x' does not exist.

# 目录不为空
[Zero AI] ERR : [AI-10023] Initialized folder must be empty, current mbcloud-demo is invalid
```



