#### 内置函数range()
- 生成一个整数序列
- 创建range对象的三种方式
1. range(stop),创建[0,stop]之间步长为1整数序列
2. range(start,stop),创建[start,stop]之间步长为1的整数序列
3. range(start,stop,step),创建[start,stop]之间步长为step的整数序列
- 返回值是一个迭代器函数
- range类型优点：
不管range对象的整数序列有多长，所有range对象占用的内存空间都是相同的，仅仅只存储start,stop,step三个参数，只有用到range对象时才会计算序列中的相关元素
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202303092244654.png)


### for循环练习
```py
'''计算1-100之间的偶数和'''

a = 0
sum = 0
#使用while循环
while a<=100:
    if not bool(a % 2):
        sum+=a
    a+=1
print('偶数和为',sum)

sum2 = 0
#使用for循环
for i in range(1,101):
    if i%2 == 0:
        sum2+=i
print('偶数和为',sum2)
```

```py
'''输出100到999的水仙花数
153=1*1*1+5*5*5+3*3*3
'''

for item in range(100,1000):
    ge = item%10
    shi = (item//10)%10
    bai = item//100
    if ge**3+shi**3+bai**3 == item:
        print(item)

```

### 嵌套循环
```py
'''输出一个三行四列的矩形'''

for i in range(3):
    for j in range(4):
        print('*',end='\t')
    print(end='\n')
```
```py
'''输出99乘法表'''
for i in range(1,10):
    for j in range(1,i+1):
        print(i,'*',j,'=',i*j,end='\t')
    print('\n')
```