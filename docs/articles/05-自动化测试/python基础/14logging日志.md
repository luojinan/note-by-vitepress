## logging日志应用


### logging的四大组件
1. **logger记录器**：提供基本的能够被程序直接调用的接口

2. **handler处理器**：提供记录器的内容发送到指定位置（控制台或文件）

3. **filter过滤器**：提供更好的粒度来进行内容的控制

4. **formatter格式化器**：设置日志所有内容的格式
```py
import logging
from email.mime.text import MIMEText

# 创建一个logging记录器，用来做日志的记录
logger = logging.getLogger()
# 设置记录器的等级
logger.setLevel(logging.DEBUG)
# 设置记录器格式
logger_format = logging.Formatter('%(asctime)s %(levelname)s %(filename)s %(lineno)s: %(message)s')

# 创建处理器，让记录器的内容输出到指定地点：控制台输出
stream_handler = logging.StreamHandler()
stream_handler.setLevel(logging.INFO)  # 控制台输出等级
stream_handler.setFormatter(logger_format)  # 控制台输出格式

# 创建文件输出处理器
file_handler = logging.FileHandler(filename='./logfile/log1.log')
file_handler.setLevel(logging.INFO)  # 设置等级
file_handler.setFormatter(logger_format)  # 设置格式

# 将handler添加到记录器中
logger.addHandler(stream_handler)
logger.addHandler(file_handler)

logging.debug('debug')
logging.info('info')
logging.critical('critical')

```

### 配置文件设置与读取
在logging库的配置中，所有的配置项都是固定的，不需要进行任何的修改，要获取配置项需要通过logging.config.fileConfig（配置文件）的方式来实现获取
**log_config.ini配置文件**
```py
[loggers]
keys = root

[handlers]
keys = FileHandler,StreamHandler

[formatters]
keys = simpleFormatter

[logger_root]
level = DEBUG
handlers = FileHandler,StreamHandler

[handler_FileHandler]
class = FileHandler
level = DEBUG
formatter = simpleFormatter
args = ('logfile.log','a+','utf-8')

[handler_StreamHandler]
class = StreamHandler
level = DEBUG
formatter = simpleFormatter

[formatter_simpleFormatter]
format = '%(levelname)s %(asctime)s %(filename)s %(module)s %(funcName)s %(lineno)s: %(message)s'
```
**读取log_config.ini配置文件函数**
```py
def get_Logger():
    # 获取配置文件路径
    filepath = pathlib.Path(__file__).parents[0].resolve() / 'log_config.ini'
    # 读取日志配置文件
    logging.config.fileConfig(filepath, encoding='utf-8')

    # 获取记录器
    logger = logging.getLogger()
    # logger.info('读取ini文件的info信息')
    return logger
```