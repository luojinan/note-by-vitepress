# SMTP库实现邮件发送

## SMTPLIB服务配置

自动化邮件发送，首先需要将邮箱的配置存放在代码之中，才可以实现通过代码访问邮箱，来进行邮件的发送功能。

不同的邮箱有不同的配置，对应邮箱的设置，建议百度搜索一下，课程中会以QQ邮箱为例。

QQ邮箱的授权流程：

1. 进入QQ邮箱
2. 进入设置页
3. 找到第三方服务选项
4. 将IMAP/SMTP服务启动（需要验证码进行启动校验）
5. 生成授权码（需要严重，但是在第一次开启时会默认生成授权码）
6. 保存授权码到本地即可

邮箱的授权码不是你的邮箱登录密码，这是两个完全不同的东西。在代码实现中需要的是授权码，不是登录密码。

##  各类邮件发送实现

SMTPLIB库是python官方自带的库，所以不需要安装。可以实现邮件的发送。可以对邮件的内容进行各种类型的定义。

### 文本邮件发送

最常规的邮件发送形态，邮件内容全部是文本的形式。也是smtp库最基本的邮件发送形态。
```py
import smtplib
from email.header import Header
from email.mime.text import MIMEText

# 定义邮箱相关信息
sender = '1026260455@qq.com'  # 发件人
receiver = '1026260455@qq.com'  # 收件人
pass_code = 'akbbytiioguqbbjg'  # 授权码

# 邮箱服务连接
conn = smtplib.SMTP('smtp.qq.com', 25)

# 邮件内容定义
text = '这是一封文本邮件，基于SMTP来实现的邮件发送'  # 邮件正文
context = MIMEText(text, 'plain', 'utf-8')

# 定义收件人和发件人
context['From'] = sender
context['To'] = receiver

# 定义邮件主题
email_theme = '这是邮件主题'
context['Subject'] = Header(email_theme, 'utf-8')

# 发送邮件
conn.login(sender, pass_code)  # 登录smtp服务，用帐号和授权码登录
conn.sendmail(sender, receiver, context.as_string())  # 邮件发送

# 关闭服务
conn.close()
```

### HTML格式的邮件发送

发送HTML格式的邮件其实与文本邮件的发送是差不多的。唯一需要注意的就是要将邮件内容定义为HTML格式。让SMTPLIB支持这种格式。

```py
import smtplib
from email.header import Header
from email.mime.text import MIMEText

sender = '1026260455@qq.com'
receiver = '1026260455@qq.com'
pass_code = 'akbbytiioguqbbjg'

conn = smtplib.SMTP('smtp.qq.com',25)

text = '''
    <html>
        <p>
            <a href="www.baidu.com.cn">这是html链接</a>
        </p>
    </html>
'''

contect = MIMEText(text,'html','utf-8')

contect['From'] = sender
contect['To'] = receiver

mail_temet = '这是邮件主题'
contect['Subject'] = Header(mail_temet,'utf-8')

conn.login(sender,pass_code)
conn.sendmail(sender,receiver,contect.as_string())

conn.close()

```

### 带有附件的邮件发送

发送带有附件的邮件，最大的不同在于附件本身。因为附件的调用方法和内容，与普通邮件的发送有区别。其余内容基本没有太大差别。

```py
import smtplib
from email.header import Header
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# 定义邮箱相关信息
sender = '1026260455@qq.com'  # 发件人
receiver = '1026260455@qq.com'  # 收件人
pass_code = 'akbbytiioguqbbjg'  # 授权码

# 邮箱服务连接
conn = smtplib.SMTP('smtp.qq.com', 25)

# 邮件内容定义
text = '这是一封文本邮件，基于SMTP来实现的邮件发送'  # 邮件正文
content = MIMEText(text, 'plain', 'utf-8')

email = MIMEMultipart()

# 附件1
att = MIMEText(open('./attach/timg.gif', 'rb').read(), 'base64', 'utf-8')
att.add_header('Content-Type', 'octet-stream')
att.add_header('Content-Disposition', 'attachment', filename='attach_first.gif')
email.attach(att)

# 附件2
with open('./attach/timg.jpg', 'rb') as file:
    att1 = MIMEText(file.read(), 'base64', 'utf-8')
att1.add_header('Content-Type', 'octet-stream')
att1.add_header('Content-Disposition', 'attachment', filename='attach_first.jpg')

email.attach(att1)
email.attach(content)

# 定义收件人和发件人
email['From'] = sender
email['To'] = receiver

# 定义邮件主题
email_theme = '这是邮件主题'
email['Subject'] = Header(email_theme, 'utf-8')

# 发送邮件
conn.login(sender, pass_code)  # 登录smtp服务，用帐号和授权码登录
conn.sendmail(sender, receiver, email.as_string())  # 邮件发送

# 关闭服务
conn.close()


```

## 配置项设置

在实际邮件发送的时候，不同的项目组会有不同的项目组成员，一般组员都是固定的。所以我们有更好的方式来实现邮件的发送，就是通过配置项的定义，让邮件发送的时候直接通过读取配置项，来完成对收件人的配置。

**收发件人配置文件email_conf.ini**
```py
[email_project_a]
sender = 1026260455@qq.com
receiver = 1026260455@qq.com,1017386624@qq.com
pass_code = akbbytiioguqbbjg
```

**邮件内容配置文件email_text.ini**
```py
[email_text]
theme = 这是邮件的主题哦
text = 这是一封邮件正文哈哈哈哈哈
html = <html>
            <p>
                <t>点击一下跳转百度</t>
                <a href="www.baidu.com">这是html链接</a>
            </p>
        </html>

```

**发送邮件**
```py
import smtplib
from email.header import Header
from email.mime.text import MIMEText

from step4.mail.read_conf import read_conf
from step4.mail.smtp_demo.read_text_conf import read_text_conf

# 定义邮件发件人、收件人、授权码
data = read_conf()
sender = data['sender']
receivers = []
for r in data['receiver'].split(','):
    receivers.append(r)

receiver = receivers
pass_code = data['pass_code']

# 邮件服务连接
conn = smtplib.SMTP('smtp.qq.com', 25)

# 定义邮件正文
data_text = read_text_conf()
text = data_text['text']
# print(text)

# 定义邮件超链接内容
html = data_text['html']

content = MIMEText(html, 'html', 'utf-8')

content['From'] = sender
content['To'] = data['receiver']

# 定义邮件主题
theme = data_text['theme']
# print(theme)
content['Subject'] = Header(theme, 'utf-8')

# 登录
conn.login(sender, pass_code)
# 发送邮件
conn.sendmail(sender, receiver, content.as_string())

# 关闭邮件
conn.close()

```