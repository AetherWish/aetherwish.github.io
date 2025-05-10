---
title: 国产Linux系统合集
date: 2025-05-10 16:43:13
tags: Linux
---
本文收录由国内团队主导开发的Linux发行版。

<!-- more -->

## 仍在活跃开发的发行版

### 开放欧拉（openEuler）

主导方：开放原子开源基金会
基于发行版：根社区（CentOS）
支持架构：x86_64/ARM64[^1]/ARM32/龙架构[^2]/RISC-V
桌面环境：无，可自行安装
最新版本： **25.03** （2025年3月）| 24.03 LTS SP1（2024年12月）
官方网站：https://www.openeuler.org/
基本介绍：华为捐赠，开放原子开源基金会孵化及运营，主要开发面向服务器用的操作系统。多家公司基于openEuler开发商业发行版。

### 中兴新支点（NewStart）

主导方：**广东中兴新支点技术有限公司**
基于发行版：Fedora
支持架构：x86_64/ARM64/MIPS/龙架构[^2]
桌面环境：MATE
最新版本： **4.5.2** （桌面版）| 6/7（服务器版）
官方网站：https://www.gd-linux.com/

### 银河麒麟（KylinOS）

主导方：**麒麟软件有限公司**
基于发行版：Ubuntu
支持架构：x86_64
桌面环境：UKUI（基于MATE）
最新版本：V10 SP1（桌面版）|V10 SP3（服务器版）
官方网站：https://www.kylinos.cn/
基本介绍：主要针对政企用户以及国家重大发展项目开发的操作系统。
许可证说明：需要激活；可以通过提交试用申请来获得镜像。

### 优麒麟（Ubuntu Kylin）

主导方：**麒麟软件有限公司**
基于发行版：Ubuntu
支持架构：x86_64
桌面环境：UKUI（基于MATE）
最新版本：**25.04** （2025年4月18日）
官方网站：https://www.ubuntukylin.com/
基本介绍：为中国用户设计的Ubuntu Flavor，社区目前发展中心转向openKylin。

### 统信UOS（UnionTech OS）

主导方：**统信技术有限公司**
基于发行版：Debian
支持架构：x86_64（家庭版唯一支持架构）/ARM64/龙架构/SW64[^5]/MIPS64el（仅专业版）
桌面环境：DDE（KWin）
最新版本：22.0（家庭版，2023年5月31日）| V20-1070u3（ 专业版，2024年5月11日发布/2025年3月5日更新）
官方网站：[https://www.uniontech.com/](https://www.uniontech.com/)（生态社区：[https://www.chinauos.com/](https://www.chinauos.com/)）
基本介绍：Deepin的商业版本，面向政企机关以及商业客户的Linux发行版。
**使用说明：本系统默认不开放超级管理员权限、不支持非商店签名应用安装，需要登录账号打开开发者模式操作。家庭版需通过加入社群获取相关下载链接。**
**许可证说明：所有版本均需要激活。家庭版可通过官方问卷星链接免费自助获取激活码。服务器版可使用不包含增值服务的免费授权，可通过购买授权或订阅升级到商业版。专业版需另行购买。**

### 深度操作系统（Deepin）

主导方：深度技术有限公司
基于发行版：根社区（dpkg+玲珑双包管）
支持架构：x86_64/ARM/龙架构[^2]/RISC-V（后两者仅23）
桌面环境：DDE（X11+Treeland<开发中>）
最新版本： **23.1** （2025年4月16日）| **25 Alpha** （2025年3月19日）
官方网站：https://www.deepin.org/
基本介绍：在国内外均有一定名气的Linux发行版，其桌面环境被移植到许多发行版上，部分被官方所接纳成为官方flavor之一（尤见于15.x时期）。Deepin开发商还主导了武汉Linux用户组的建立。从23版本开始，Deepin开始自行建立并维护软件源，并开始建立基于容器技术的“如意玲珑（Linyaps）”应用生态。从25版本开始，Deepin引入磐石系统与类Timeshift的系统还原特性。

### 红旗Linux（RedFlag Linux）

主导方：中科红旗（北京）信息科技有限公司
基于发行版：Debian（桌面版）/openEuler（服务器）
支持架构：x86_64/ARM64/mips64el
桌面环境：KDE Plasma
最新版本：11（桌面版）|8.1（Asianux服务器）|8.0（InWise）
官方网站：[https://www.chinaredflag.cn/](https://www.chinaredflag.cn/)（原[www.linuxsir.cn](https://www.linuxsir.cn)重新演变为社区）
基本介绍：名字历史悠久，但现在的版本是别家接盘后挂名开发，本家已于2014年前后破产。**官网疑似不再提供镜像下载。**

### 铜豌豆 Linux（AtzLinux）

主导方：社区
基于发行版：Debian
支持架构：x86/ARM64
桌面环境：Xfce/KDE/gnome/mate
最新版本： **12.10.2** （2025年4月18日）
官方网站：https://www.atzlinux.com/
基本介绍：一个“开箱即用”的系统，在原版Debian的基础上内建国内软件源配置并提供国内常用软件；其收录国内常用软件的“铜豌豆软件生态”开放给所有Debian系的Linux发行版使用；其团队深度参与Debian上游贡献。

### 微器人（veket）

主导方：可能为个人
最新版本：**22/24/26 Beta**
基于发行版：Puppy/Debian
支持架构：x86/RISC-V
桌面环境：Xfce
官方网站：http://www.lucky8k.com/
多说几句：以Puppy系一贯的占用空间小和资源要求低而出名，使用门槛不算高，但本地化（主要是翻译）和美观程度并不佳。建议用作PE（LiveCD）使用。

### 开放鸿蒙（openHarmony）

主导方：开放原子开源基金会（华为为重要成员[^4]）
基于内核：Hongmeng Kernel/Linux
支持架构：多架构，需自行编译
桌面环境：openHarmony
最新版本： **5.1.0** （2025年4月30日）
官方网站：https://www.openharmony.cn/
基本介绍及鸿蒙相关说明：

- HarmonyOS：提供部分openHarmony特性与HMS的Android固件包。
- HarmonyOS Next：面向消费者设备与开发者的“纯血鸿蒙”。
- openHarmony：华为家的跨平台和万物互联试验区，提供给其它公司开发商业产品。

### 龙蜥（Anolis）

主导方：龙蜥社区（阿里巴巴为重要成员[^4]）
基于发行版：CentOS
支持架构：x86_64/ARM64/RISCV/龙架构
桌面环境：未知
最新版本： **8.10GA** （2025年4月16日）|23.2 GA（2025年1月7日）
官方网站：https://openanolis.cn/
基本介绍：面向服务器的操作系统，国内CentOS替代品/分生社区之一。

### 开放麒麟（openKylin）

主导方：openKylin社区/麒麟软件
基于发行版：根社区（dpkg单包管）
支持架构：x86_64/RISC-V/ARM64/龙架构[^2]
桌面环境：UKUI
最新版本： 2.0 SP1（2024年12月20日）
官方网站：https://openkylin.top
基本介绍：宣传“中国首个桌面操作系统根社区”（但比deepin晚），其桌面环境支持Wayland协议；2.0引入“不可变操作系统”特性；提供部分开源的安卓轻量虚拟机KMRE，被[GXDE OS](#gxde-os)移植到多个发行版。

### NOI Linux/Ubuntu-NOI

主导方：**NOI（全国青少年信息学奥林匹克竞赛）**科学委员会
基于发行版：Ubuntu
支持架构：x86_64
桌面环境：GNOME
最新版本： **Stable 2.0** （2021年7月16日）
官方网站：https://www.noi.cn/gynoi/jsgz/2021-07-16/732450.shtml
基本介绍：NOI系列比赛和CSP-J/S等活动的标准环境，实际使用时一般采用虚拟机安装

### 鸥栖OS（openCloudOS）

主导方：鸥栖社区（腾讯云为重要成员 [^4] ），由开放原子开源基金会托管
基于发行版：根社区（9/Stream 23）/CentOS（8/7）
支持架构：x86_64/ARM64
最新版本： 9.2 | Stream 23
官方网站：https://www.opencloudos.org/
基本介绍：面向服务器的操作系统，官方称社区立志“提供安全可靠、高性能的下一代云原生操作系统”。

### 灵墨操作系统（Lingmo OS）

主导方：Lingmo OS Organization/cute-dev
基于发行版：Debian/CutefishOS
支持架构：x86_64
桌面环境：FishUI
最新版本：3.0-rc10 （2025年4月5日）
官方网站：https://lingmo.org/
基本介绍：CutefishOS分支，曾用名“CuteOS”/“SwiftOS”。集成常用软件及社区应用商店“星火应用商店”。

### 中科方德（NFS China）

主导方：中科方德软件有限公司
官方网站：https://www.nfschina.com/
官网仅提供产品介绍，需要其他信息来源

### 安同 OS（AOSC OS）

主导方：安同开源社区
官方网站：https://aosc.io/
基于发行版：Debian
桌面环境：KDE Plasma
基本介绍：内建由该社区开发的 APT 软件包管理界面“小熊猫包管理 (oma)"，可通用于多个内建 APT 包管理的发行版。

### GXDE OS

主导方：gfdgd_xi/神末shenmo/星火应用商店
官方网站：https://www.gxde.top/
基于发行版：Debian
桌面环境：GXDE/DDE KWin 15
基本介绍：该团队接手维护了Deepin 15.x版本采用的DDE KWin桌面环境，内置星火应用商店与Wine运行器，并借由KMRE实现了安卓应用支持。

## 已停止维护的发行版

### CutefishOS

主导方：重庆可爱鱼科技有限公司（**已注销**）
桌面环境：FishUI
基于发行版：Debian
终版：0.8
代码仓库：https://github.com/cutefishos

### 起点操作系统（StartOS）

主导方：广东爱瓦力科技股份有限公司（**已转型**）
基于发行版：根社区（ypk包管理）
支持架构：x86（32位）
桌面环境：GNOME2
终版：**5.1**
官方网站：http://www.startos.org/
基本介绍：采用自建包管理格式的Linux发行版，据说前身为盗版Windows社区转型而来的ylmf os。

### 鲸鲮（JingOS）

主导方：北京鲸鲮信息系统技术有限公司（股东出事）
基于发行版：未知（可能为Debian）
支持架构：x86_64/ARM64
桌面环境：未知
终版：0.9 beta（x86，2021年5月31日，原官网版本）|1.1.1（ARM64，2021年12月16日，面向JingPad版本）
基本介绍：面向平板的操作系统，与自家产品JingPad深度绑定

### Yoyo OS

主导方：柚子（在一定程度上受到星火应用商店社区的支持）
基于发行版：Ubuntu/CutefishOS
支持架构：x86_64
桌面环境：FishUI（又称CutefishDE）
终版：Alpha 2 Fixed（“Kokomi”）/0.9
官方网站：https://www.yzzi.icu
作者间歇性维护。本发行版版本号体系较为混乱，此处取二。

---

2021年1月28日初版于 Deepin 20（哔哩哔哩创作中心） | 2025年5月10日更新于 Debian trixie/sid（GitHub Pages)

---

[^5]: 申威具有自主知识产权架构的指令集，基于Alpha架构。
    
[^4]: 这些企业/个人一般是社区的建立者（之一），且一般深入参与操作系统开发与运营。该项仅为方便大众理解，可能并非实际情况。
    
[^3]: 指Quality Updates（优选更新）。据官方称，**在 OpenAnolis 社区评估认为有必要的前提下，Anolis OS 会推送优选更新(Quality Updates)版本，该版本是基于特定小版本发布的增量更新版本。**
    
[^2]: 即LoongArch（Loongson Architecture），龙芯开发的自主指令系统架构（指令集），支持虚拟化与二进制翻译扩展。据龙芯中科官网，其**从 2020 年起新研的 CPU（如3A5000） 均支持LoongArch。**
    
[^1]: 即AArch64。请注意，部分发行版支持ARM架构，但并未写明支持ARM32还是ARM64，您可通过下载得到的镜像文件名称判读。（如：openkylin-0.9.5-raspi- **arm64**.img.tar.gz）
