---
title: 在deepin 25 Alpha上安装fish Shell
date: 2025-04-13 00:41:00
tags: Linux
---

`fish`就不多介绍了，一个原生支持命令高亮和Autosuggestion的Shell。deepin 25默认源中没有 `fish`,需要自己编译安装。

<!-- more -->

## Part 1：提前准备

首先去[fish官网](https://fishshell.com/index.html)的source版块下一份源码（[找不到点这个GitHub直链也行](https://github.com/fish-shell/fish-shell/releases/download/4.0.1/fish-4.0.1.tar.xz)），用tar或者系统自带归档管理器解压后备用。

然后在终端中执行如下命令：

```bash
sudo deepin-immutable-ctl disable-system-protect enable //关闭磐石系统（系统保护）
sudo apt install cmake cargo //安装编译依赖项
sudo apt install gedit //习惯vim、nano的忽略
```

## Part 2：编译安装

在终端中执行如下命令：

```bash
cd ~/fish_src //记得把"～/fish_src"换成fish源码实际存放的路径
cmake .
make
sudo make install //默认安装到"/usr/local/bin/fish"
```

## Part 3：基础配置

终端中输入 `fish`即可进入fish。如果你和我一样用的是deepin自带的终端，那么肯定会看见>后面跟着`5u`两个字符，输入命令的时候还会莫名其妙地出现一些神秘符号。其实这是因为deepin终端没有适配fish 4.x更新的Bind Notation功能，fish官方也给出了解决方案：

```bash
fish //进入fish
set -Ua fish_features no-keyboard-protocols //直接Ctrl+Shift+V粘贴然后打回车
```

解决了这个问题以后把fish设置成当前用户的默认Shell（设成登录Shell也可以，但风险太大）：

```bash
echo /usr/local/bin/fish | sudo tee -a /etc/shells
sudo chsh --shell /usr/local/bin/fish <你的用户名>
```

如果只想更换deepin终端的默认Shell，那么请前往 `菜单栏->设置->高级设置->Shell`自行更换。

执行 `fish_config`可以进入Web端配置页面，那边可以换样式、删历史记录啥啥啥的。

## Part 4：进阶配置

默认配置下的fish只会在deepin终端标题栏上显示当前路径，如果要改成和bash下一致的 `用户名@主机名: 当前路径`那就需要修改 ` ~/.config/fish/`路径下的 `config.fish`文件：

首先打开这个文件：

```bash
sudo gedit ~/.config/fish/config.fish //gedit可以换成其他的文本编辑器
```

然后在文件后面换行增补以下内容，保存后即时生效。

```yaml
function fish_title
    echo $USER@$hostname: (prompt_pwd)
end
```

另外fish在启动时会显示一条欢迎消息，如果要去掉，直接在fish中执行 `set -U fish_greeting`即可，也可以参考fish的manual自行修改。

最终效果参考如下：

![image.png](https://storage.deepin.org/thread/202504121651285860_image.png)