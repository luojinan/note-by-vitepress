# selenium
- selenium是一个用于web应用程序自动化测试工具。三剑客含WebDriver，IDE和Grip

- Selenium WebDriver是一个客户端 API。
  1. 通过调用接口来访问浏览器驱动，浏览器驱动再访问浏览器
  2. 通过Selenium Server或者RemoteWebDriver实现远程通信，RemoteWebDriver和驱动程序和浏览器在一个系统里运行
  3. 通过Selenium Server或者Selenium Grid进行分布式测试


- webdriver运行原理：每发一个se脚本，一个hppt协议就会被创建出来并发送给浏览器驱动，这个驱动包含了一个http server，会用来接收请求，接到请求后发送给浏览器，浏览器执行步骤，浏览器执行完步骤之后会返回一个结果给到http server，http server再将结果返回给se脚本


- webdriver里的浏览器驱动只有一个，为什么既可以接收java请求，也可以接收 python 的请求？
答：webdriver里有一个公共的协议，Json Wire Protocol，它们之间遵循的是一种协议，类似于是一个封装好的http协议，就是在http协议之上封装了一层公共的协议，传输的格式也是json



- WebDriver常用属性
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202302181358196.png)

- WebDriver常用方法
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202302181440447.png)

- WebElement常用属性
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202302181442254.png)

- 获取本地文件的目录
  ![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202302181737700.png)
- selenium操作表单中chackbox和radio
  >1. chackbox要注意判断如果未选中则选中
      checkbox = self.driver.find_element(by=By.NAME,value='checkbox')
        if not checkbox.is_selected():
          checkbox.click()
  >2. radio要注意获取到的元素是负数，用下标去点击
      lst = self.driver.find_elements(by=By.NAME,value='gender')
          lst[0].click()


- selenium操作下拉列表
  1.selenium提供了一个Select工具类，Select工具类常用方法
  ![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202302181724091.png)

 - PyAutoGUI是一个图形用户界面自动化工具，通过屏幕xy坐标系统确定目标位置，控制鼠标和键盘发送虚拟击键和鼠标点击，完成点击按钮、填写表单等操作（常规方法元素无法获取时使用）
 ![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202302191736619.png)