## PyMysql库实现数据库操作
### 数据库操作

**步骤**

1. 准备数据库配置信息

2. 连接数据库

3. 创建游标
 - sql在执行过程中生成的结果，都需要通过游标来控制
 - 查询操作不会修改数据库的数据，仅仅是将数据库的数据获取
 - 增删改操作执行完后需要添加**conn.commit()**操作将修改提交，否则不生效
 - 数据库操作结束时，需要关闭游标和连接，释放资源

**查询操作**

```py
import pymysql

# 1、连接数据库
# 定义数据库相关信息
db_info = {
    'host': '127.0.0.1',  # 数据库安装ip地址
    'port': 3306,  # 端口
    'user': 'root',  # 帐号
    'password': '123456',  # 密码
    'database': 'ccas'  # 指定数据库的名称
}
# 连接数据库
conn = pymysql.connect(**db_info)
print(conn)

# 2、创建游标
cursor = conn.cursor(cursor=pymysql.cursors.DictCursor)  # 将数据结果指定为dict返回

# 3、执行sql
try:
  sql = 'select * from t_city where parent_id=3'
  cursor.execute(sql)  # 获取sql并执行

  # 获取执行结果
  results = cursor.fetchall()  # fetchall表示获取本次执行的所有结果
  for result in results:
      print(result)

  # 获取指定条数执行结果
  result_many = cursor.fetchmany(3)
  print(result_many)



  # 获取一条执行结果，每次执行后游标会向下移动一位
  result_one = cursor.fetchone()
  print(result_one)

  result_two = cursor.fetchone()
  print(result_two)


  # 移动游标的位置
  cursor.scroll(1, 'relative')  # 1表示移动位数，relative表示基于当前游标位置向下移动
  cursor.scroll(3, 'absolute')  # 1表示移动位数，absolut表示只会基于第一行向下移动
  cursor.scroll(-1)  # -1表示向上移动一位，当输出最后一行数据时，此时游标在最后一行下一位，若传入-1向上移动一位，则输出的仍然是最后一行数据
except:
  traceback.print_exc()

# 关闭游标和连接
finally:
  cursor.close()
  conn.close()
```
**修改操作**(增加和删除同理)

```py
import pymysql

# 1、连接数据库
# 定义数据库相关信息
db_info = {
    'host': '127.0.0.1',  # 数据库安装ip地址
    'port': 3306,  # 端口号，一定是整型
    'user': 'root',  # 帐号
    'password': '123456',  # 密码
    'database': 'ccas'  # 指定数据库的名称
}
# 连接数据库
# conn = pymysql.connect(**db_info) 
conn = pymysql.connect(**sql_conn('devs_conf')) # 调用sql_conn函数获取数据库相关信息
print(conn)

# 2、创建游标
cursor = conn.cursor(cursor=pymysql.cursors.DictCursor)  # 将数据结果指定为dict返回


try:
# 3、执行sql
  sql = 'update user_info set password=%s where username=%s'
  cursor.excute(sql,(123456,'admin'))
  conn.commit()
except:
  conn.rollback()  # 事物回滚：将之前操作撤销
  traceback.print_exc()
```

### 拓展sql注入

```py
p_code = input('请输入：')
sql = f'select * from t_city where parent_id="{p_code}"'
cursor.execute(sql)  # 获取sql并执行

# 当输入【1" or 1=1 #】时此sql结果将会输出所有数据


# 为防止sql注入应改为占位符形式
p_code = input('请输入：')
sql = 'select * from t_city where parent_id="%s"'
cursor.execute(sql,(p_code)) # 参数可以用元组形式传入，单个参数可以直接传入

```

### PyMysql配置文件的设置

mysql_conf.ini文件内容：
 * option为大写时表示常量
```py
[devs_conf]
HOST = 127.0.0.1
PORT = 3306
USER = root
PASSWORD = 123456
DATABASE = ccas
```
读取配置文件函数：
```py
import configparser
import pathlib


# 定义数据库连接函数
def sql_conn(env):
    conf = configparser.ConfigParser()
    # 获取配置文件绝对路径（当前文件路径的上一级的配置文件路径）
    file = pathlib.Path(__file__).parents[0].resolve() / 'mysql_conf.ini'

    # 读取配置文件
    conf.read(file)
    # 将配置文件内容转换为字典格式，conf.items('devs_conf')是元祖类型
    values = dict(conf.items(env))

    # 将post的值3306改为整型
    for key in values.keys():
        if key == 'port':
            values[key] = int(values[key])

    return values

```

