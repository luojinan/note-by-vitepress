## 反射机制
反射机制是一种基于字符串的形式来驱动代码，通过字符串查找对应模块中的函数、属性
反射机制主要有是个不同的方法
1. getattr()
即通过指定的字符串获取指模块的属性和方法，相当于另一种对象调用属性和方法的形式。只能获取到指定对象已存在的属性
```py
student = Student('张三', 20)

print(getattr(student, 'native_pace'))  # 反射机制获取Student类的native_pace属性
getattr(student, 'set')()  # 反射机制调用Student类的set方法

print(getattr(Student('张三', 20), 'native_pace'))
getattr(Student('张三', 20), 'set')()
```
2. setattr()
通过此函数来对目标对象的属性进行新值的设置，也可以增加新的属性
3. hasattr()
判断属性或方式是否在对象之中，返回布尔类型的值
4. delattr()
用于删除指定类之中的指定属性

## Yield关键字
 - python的迭代：
 1. 可迭代对象：能通过循环来输出的对象就是可迭代对象。字符串和列表都是可迭代对象
 2. 迭代器：是可迭代对象，一次自取一个值，直到全部取出为止。（前提--循环没有被中止）
 比如文件操作中readline()方法，每次只读一行，光标到下一行，再调用则读下一行
 讲可迭代对象转换为迭代器：
 ```py
li = [1, 2, 3, 4, 5]  # 定义一个列表
it = iter(li)  # 将可迭代对象转换为迭代器
print(type(li), type(it))  #  <class 'list'> <class 'list_iterator'>

 # 获取迭代器的值，调用一次就输出一个值
print(next(it))  # 1
print(next(it))  # 2
print(next(it))  # 3
print(next(it))  # 4
print(next(it))  # 5
 ```
 3. 生成器：是可迭代对象，通过关键字Yield来是实现声明，yield只能用于函数中，相当于声明了Yield的函数就是一个生成器
 yield关键字在函数中与return用法一样，都可以返回数据，但区别在于return后函数会终止，而yield不会使函数终止
 ```py
'''实例1'''
def fun(num):
    while True:
        if num < 10:
            break
        else:
            num -= 1
            yield num


f = fun(14)  # f是一个生成器，需要用for循环打印
for i in f:
    print(i)  # 13、12、11、10、9


'''实例2'''
def fun():
    for i in range(0,5):
        print(i)
        if i == 3:
            yield i


a = fun()
for b in a:
    print('这是生成器：{}'.format(b))

 # 输出结果：0、1、2、3、这是生成器：3、4
 ```
