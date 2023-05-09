## 列表list
#### 一、声明列表元素的两个方法
```py
lst = ['hello','world',98,'hello']
print(lst[0],lst[-4])  #都是输出hello

lst2 = list(['hello','world',98])
```
#### 二、列表的特点
 1. 列表元素按照有序顺序排序
 2. 索引映射唯一数据
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202303132148913.png)
3. 列表可以存储重复数据
4. 任意数据类型混存
5. 根据需要动态分配和回收内存
#### 三、获取指定元素的索引index方法
 如果列表存在N个相同元素，只返回相同元素中第一个元素的索引
 ```py
lst = ['hello','world',98,'hello']
print(lst.index('hello'))  #输出0
print(lst.index('hello',1,4))  #输出3（指定索引1到3寻找hello元素的索引，不包含4）
 ```
#### 四、列表的切片（获取列表多个元素）
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202303132227729.png)
```py
lst = [10,20,30,40,50,60,70,80]
print(lst[1:6:1],lst[1:6],lst[1:6:])  #输出[20,30,40,50,60]

print(lst[::-1])  #输出[80, 70, 60, 50, 40, 30, 20, 10]
print(lst[7::-2],lst[:0:-2])  #输出[80, 60, 40, 20]
```
 
#### 五、列表的增加操作
  ![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202303132225301.png)
  ```py
  lst = [10,20,30]
  print('原列表',lst)  #原列表 [10, 20, 30]
  lst.append(40)
  print('append添加后列表',lst)  #append添加后列表 [10, 20, 30, 40]
  lst2 = ['hello','world']
  lst.extend(lst2)
  print('extend添加后列表',lst)  #extend添加后列表 [10, 20, 30, 40, 'hello', 'world']
  lst.insert(1,100)
  print('insert添加后列表',lst)  #insert添加后列表 [10, 100, 20, 30, 40, 'hello', 'world']
  lst3 = [True,False,'hello']
  lst[1::] = lst3
  print('切片后替换列表',lst)  #切片后替换列表 [10, True, False, 'hello']
  ```
#### 六、列表的删除操作
  ![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202303162204685.png)
  ```py
  lst = [10,20,30,40,50,60,30]
  lst.remove(30)  #从列表移除一个元素，若列表有重复元素只移除第一个元素
  print(lst)  #输出[10, 20, 40, 50, 60, 30]
  # lst.remove(100)   ValueError: list.remove(x): x not in list

  lst.pop(1)  #移除索引为1的元素
  print(lst)  #[10, 40, 50, 60, 30]
  lst.pop()   #移除最后一个元素
  print(lst)  #[10, 40, 50, 60]
  # lst.pop(4)   IndexError: pop index out of range

  new_lst = lst[1:3]   #切片-至少删除一个元素，会产生新的列表对象
  print('原列表',lst)   #原列表 [10, 40, 50, 60]
  print('新列表',new_lst)   #新列表 [40, 50]

  lst[1:3] = []  #不产生新列表对象的切片删除
  print(lst)  #[10, 60]

  lst.clear()  #清空列表元素
  print(lst)

  del lst  #删除列表对象
  ```
#### 七、列表的修改操作
 ```py
 lst1 = [10,20,30,40,50]
lst1[2] = 100  #修改索引为2的值
print(lst1)  #[10, 20, 100, 40, 50]

lst1[1:3] = [100,200,300]  #切片替换列表
print(lst1)  #[10, 100, 200, 300, 40, 50]
 ```

#### 八、列表的排序操作
 常用两种方式
 1. 调用sort()方法，默认按照从小到大排序，可指定reverse=True进行降序排序
 ```py
  lst = [30,12,56,35,97,54]
  lst.sort()
  print('升序排序后列表',lst)  #升序排序后列表 [12, 30, 35, 54, 56, 97]
  lst.sort(reverse=True)
  print('降序排序后列表',lst)  #降序排序后列表 [97, 56, 54, 35, 30, 12]
 ```
 2. 调用内置函数sorted()，指定reverse=True进行降序排序，原列表不发生变化，会产生新的列表对象
  ```py
  lst = [30,12,56,35,97,54]
 
  asc_lst = sorted(lst)
  print('升序排序后列表',asc_lst)  #升序排序后列表 [12, 30, 35, 54, 56, 97]

  desc_lst = sorted(lst,reverse=True)
  print('降序排序后列表',desc_lst)  #降序排序后列表 [97, 56, 54, 35, 30, 12]
  ```
#### 九、列表生成式
 语法结构
 ![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202303162251299.png)
 示例：
 ```py
  lst = [i for i in range(1,10)]
  print(lst)  #[1, 2, 3, 4, 5, 6, 7, 8, 9]
 ```


## 元组
#### 一、元组的创建方式
```py
  '''元组创建方式'''
a = ('hello','world',98)
a2 = tuple(('hello','world',98))

aa = 'hello','world',98  #可省略括号
bb = 'hello',  #只有一个元素时，逗号不可省略

  '''空元组'''
a3 = ()
a4 = tuple()
```
- 元组中存储的是对象的引用
1. 如果元组中对象本身是不可变对象，则不能再引用其他对象
2. 如果元组中对象本身是可变对象，这可变对象的引用不可改变，当数据可以改变
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202303232220750.png)
- 元组设计成不可变序列原因
在多任务环境下，同时操作对象时不需要加锁
```py
t = (10,[20,30],40)
# t[1] = 100  元组不允许修改元素
t[1].append(100)
print(t)
```

#### 二、元组的遍历
```py
t = ('hello','world',98)
for item in t:
    print(item)
```

#### 区别
不可变序列（没有增删改操作）：字符串、元祖

可变序列（可增删改操作，对象地址不改变）：列表、字典
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202303242215196.png)
