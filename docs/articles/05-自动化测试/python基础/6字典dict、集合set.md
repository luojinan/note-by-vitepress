## 字典dict
### 一、字典概念
   - python的数据结构之一，与列表一样是可变序列
   - 以键值对方式存储数据，必须根据key找到vaule的位置
    - 字典是一个无序的序列

### 二、字典的创建
  - 使用花括号
  ```py
    scores = {'张三':98,'李四':100,'王五':77}
  ```
   - 使用内置函数dict()
   ```py
    dict(name='jack',age=25)
  ```
### 三、字典的常用操作
 - 字典的元素获取
 ```PY
  scores = {'张三':95,'李四':100,'王五':77}
  scores['张三']
  scores.get('张三')
 ```
 
  []和get()取值区别：
  （1）[]取值时如果字典中不存在指定的key会抛出keyError异常
  （2）get()取值取值时如果字典中不存在指定的key并不会抛出异常，而是返回None，可以设置默认的value指定当key不存在时返回
  scores.get('小六',88)
 
  - key的判断
  ```PY
  scores = {'张三':95,'李四':100,'王五':77}
  print('张三' in scores) #True
  print('张三' not in scores)  #False
  ```
  - 字典元素的新增
  ```PY
  scores = {'张三':95,'李四':100,'王五':77}
  scores['小六'] = 88  #  新增
  scores['小六'] = 99  #修改
  print(scores)   #{'张三': 95, '李四': 100, '王五': 77, '小六': 99}
  ```

  - 字典元素的删除
  ```PY
  scores = {'张三':95,'李四':100,'王五':77}
  del scores['张三']  #删除指定的键值对
  print(scores)  #{'李四': 100, '王五': 77}

  scores.clear()  #清空列表元素
  print(scores)  #{}
  ```     
### 四、获取字典的视图
  keys()获取字典里所有的key
  valuse()获取字典里所有的valuse
  items()获取字典里所有的键值对
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202303212211576.png)
### 五、字典的遍历
  ```py
    scores = {'张三':95,'李四':100,'王五':77}
    for item in scores:
        print(item,scores[item]) 
  ```
### 六、字典的特点
  1. 字典的所有元素都是以键值对形式存储，键不可以重复，值可以重复
  2. 字典的元素是无序的
  3. 字典的key必须是不可变的对象
  4. 字典也可以根据需要动态的伸缩（在使用之前无需分配空间，会根据元素的增加而增加）
  5. 字典会浪费较大的内存，是一种使用空间换时间的数据结构
### 七、字典生成式
```py
items = ['Fruits','Books','Others']
prices = [96,78,85]

a = {item.upper() : price  for item,price in zip(items,prices)}
print(a)  #{'FRUITS': 96, 'BOOKS': 78, 'OTHERS': 85}
```

## 集合set
### 一、集合概念
- 是python语言的内置数据结构
- 与列表、字典一样都属于可变类型的序列
- 集合相当于是没有value的字典
### 二、集合的创建
- 使用{}
```py
s = {'python','hello',90,90} #集合元素不允许重复
print(s)  #{'hello', 90, 'python'}
```
- 使用内置函数set()
```py
print(set(range(6)))  #{0, 1, 2, 3, 4, 5}
print(set([1, 2, 3, 4, 5, 5, 6, 6]))  #{1, 2, 3, 4, 5, 6}
print(set({1, 2, 3, 4, 4, 5}))  #{1, 2, 3, 4, 5}
print(set('python'))  #{'y', 'n', 'p', 'o', 't', 'h'}
print(set())  #空集合
```
### 三、集合的操作
 1. 判断操作
    - not或in
 2. 新增操作
    - 调用add()方法，一次添加一个元素
    - 调用undate()方法至少添加一个元素
 3. 删除操作
    - 调用remove()方法，一次删除一个指定元素，如果指定元素不存在则抛出KeyError
    - 调用discard()方法，一次删除一个指定元素，，如果指定元素不存在不抛出异常
    - 调用pop()方法，一次只删除任意一个元素
    - 调用clear()方法，清空集合
### 四、集合间的关系
1. 通过运算符==或!=判断两个集合是否相等
```py
s1 = {10,20,40,30,50}
s2 = {50,10,30,40,20}
print(s1 == s2)  #True
print(s1 != s2)  #False
```

2. 通过issubset方法判断一个集合是否是另一个集合的子集
通过issuperset方法判断一个集合是否是另一个集合的超集
```py
s1 = {10,20,30,40,50}
s2 = {10,20,30}
s3 = {10,20,90}
print(s2.issubset(s1))  #True
print(s3.issubset(s1))  #False

print(s1.issuperset(s2))  #True
```
3. 通过isdisjoint方法判断两个几个是否有交集
```py
s1 = {10,20,30,40,50}
s2 = {10,20,30}
s3 = {60,70,90}
print(s1.isdisjoint(s2))  #False
print(s1.isdisjoint(s3))  #True
```

### 五、集合的数学操作
```py
s1 = {10,30,40,50,60}
s2 = {20,30,40,50,80}
'''交集操作'''
print(s1.intersection(s2))  #{40, 50, 30}
print(s1 & s2)  #{40, 50, 30}

'''并集操作'''
print(s1.union(s2))  #{40, 10, 80, 50, 20, 60, 30}
print(s1 | s2)  #{40, 10, 80, 50, 20, 60, 30}

'''差集操作'''
print(s1.difference(s2))  #{10, 60}
print(s1 - s2)  #{10, 60}

'''对称差集'''
print(s1.symmetric_difference(s2))  #{80, 20, 10, 60}
print(s1 ^ s2)  #{80, 20, 10, 60}
```


