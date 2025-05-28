# Selenium基础

## Selenium介绍

目前市场最主流的WebUI自动化测试技术。Appium也是继承于Selenium来实现的。现在市场的主流版本是Selenium4.x，Selenium4也是从2022年10月份左右开始正式提供开放下载和使用的。现在找相关资料一定要关注到Selenium的版本是否为4的版本。Selenium的核心就是JS

Selenium历代版本：

1. Selenium1是最开始的版本。是基于FireFox浏览器的一个插件，全称叫做Selenium IDE，支持录制以及回放脚本的形态来实现自动化。
2. Selenium2的版本，由google公司的技术团队领头研发出来。为了更好地支持多种浏览器，所以诞生了Selenium+WebDriver的技术体系
3. Selenium3的版本，只有Selenium+WebDriver，也是现存时间最长的一个版本
4. Selenium4的版本，优化了Selenium3中的底层代码，增加了新的操作方式，摒弃掉了不常用的一些操作行为。同时又新增了Selenium IDE4的版本，可以支持多种不同的浏览器的插件形态，用于实现录制和回放的功能

做分布式测试框架部署的组件叫做Selenium Grid，用于解决特殊的复杂业务自动化，不是特别常用，但是装个逼还是可以的。

Selenium本身是一个跨平台的开源技术，支持多种不同的语言开发。

## Selenium+WebDriver

- 环境部署：
  - 安装python3.7以上版本，才能够支持Selenium4
  - 指令：pip install selenium	如果觉得下载太慢可以添加国内源
  - 安装webdriver，一定要确保webdriver与浏览器类别一致，以及版本一致
    - chrome与ChromeDriver
    - Firefox与geckodriver
    - edge与edgedriver
    - Safari与safaridriver
  - 将下载好的chromedriver解压exe文件到python的安装路径下即可
  - 核心关键，你的浏览器一定要安装在默认路径下才可以。如果不在默认路径下，则会要配置其他的内容。
- WebDriver运行原理
  - 每发一个se脚本，就会有一个http协议被创建出来并发送给浏览器驱动，这个渠道包含一个httpsever，会用来接收请求，接到请求后发送给浏览器，浏览器执行步骤，浏览器执行完步骤之后会返回一个接口给到httpsever，httpsever再将结果返回给se脚本

