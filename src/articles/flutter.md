---
title: 'Flutter'
date: '2026-04-14'
tags: ['Flutter', 'Dart']
excerpt: 'Flutter环境的安装编译，Dart的基础语法，Flutter组件框架的学习，暂时只学了基础以后如果感兴趣有时间了可能会学的更深入'
coverImage: ''
---

##  安装配置
## Windows
### Flutter SDK
#### 下载
镜像：[https://mirrors.tuna.tsinghua.edu.cn/flutter/flutter_infra_release/releases/stable/](https://mirrors.tuna.tsinghua.edu.cn/flutter/flutter_infra_release/releases/stable/)

官方：[https://docs.flutter.dev/install/archive](https://docs.flutter.dev/install/archive)

环境变量：配置下载解压的 sdk 的 bin 目录

用户变量：编辑 `FLUTTER_STORAGE_BASE_URL` 变量值为：[https://storage.flutter-io.cn](https://storage.flutter-io.cn)

`PUB_HOSTED_URL` 变量值为：[https://pub-web.flutter-io.cn/](https://pub-web.flutter-io.cn/)或[https://mirrors.tuna.tsinghua.edu.cn/dart-pub/](https://mirrors.tuna.tsinghua.edu.cn/dart-pub/)



#### 验证
```bash
flutter --version
```

#### 更新
```bash
flutter upgrade
```

### Android SDK
下载命令行工具

[https://developer.android.google.cn/studio?hl=zh-cn#command-tools](https://developer.android.google.cn/studio?hl=zh-cn#command-tools)

解压到文件夹，在 cmdline-tools 下新建 latest 文件夹并把 <font style="color:rgb(38, 38, 38);">cmdline-tools 内所有的文件都移动到 latest 下</font>

<font style="color:rgb(38, 38, 38);">设置清华镜像源</font>

```bash
# 设置国内镜像（当前会话）
setx ANDROID_SDK_ROOT "D:\Tools\SDK\AndroidSDK"
setx PUB_HOSTED_URL "https://mirrors.tuna.tsinghua.edu.cn/dart-pub"
setx FLUTTER_STORAGE_BASE_URL "https://mirrors.tuna.tsinghua.edu.cn/flutter"
```

在 bin 目录下执行更新组件

```bash
./sdkmanager.bat --install "platform-tools" "platforms;android-34" "build-tools;34.0.0" ^ --sdk_root=D:\Tools\SDK\AndroidSDK
```

下载完后应该有

```bash
D:\Tools\SDK\AndroidSDK\cmdline-tools\latest\bin\sdkmanager.bat
D:\Tools\SDK\AndroidSDK\platform-tools\adb.exe
D:\Tools\SDK\AndroidSDK\build-tools\34.0.0\aapt.exe
```

添加环境变量

```bash
D:\Tools\SDK\AndroidSDK\cmdline-tools\latest\bin
D:\Tools\SDK\AndroidSDK\platform-tools
```

设置 Flutter 的 Android SDK 目录

```bash
flutter config --android-sdk D:\Tools\SDK\AndroidSDK
```

接受许可

```bash
flutter doctor --android-licenses
```

### <font style="color:rgb(25, 25, 25);">Visual Studio 2022 生成工具</font>
[https://visualstudio.microsoft.com/zh-hans/downloads/](https://visualstudio.microsoft.com/zh-hans/downloads/)

勾选**使用C++的桌面开发**安装

### 浏览器
设置 chrome 环境变量

```bash
setx CHROME_EXECUTABLE "C:\Program Files\Google\Chrome\Application\chrome.exe"
```

设置 edge

```bash
setx CHROME_EXECUTABLE "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
```

## 验证环境
重开终端执行

```bash
flutter doctor
```

## VS Code
下载插件



## 开始
## 新建项目
```bash
flutter create my_app
cd my_app
```

## 运行
### windows
项目目录下

```bash
flutter run -d windows
```

### 安卓
连接 MUMU 模拟器

```bash
adb connect 127.0.0.1:5555
```

运行

```bash
flutter run -d 127.0.0.1:5555
```

---

下载 gradle 失败手动配置

[https://mirrors.aliyun.com/gradle/distributions/](https://mirrors.aliyun.com/gradle/distributions/?spm=a2c6h.25603864.0.0.3c73133apbP5Z0)

运行 `android\gradlew.bat`

查看 gradle 最低支持版本下载

放到任意文件夹，修改 `android\gradle\wrapper\gradle-wrapper.properties` 配置

```bash
distributionUrl=file\:///D:/Project/code/gradle/gradle-9.0.0-bin.zip
```

## 打包
### windows
```bash
flutter build windows --release
```

如果报错打开设置中的开发者模式再尝试

### 安卓
```dart
# 清理项目
flutter clean
flutter pub get

# 构建优化的APK文件
flutter build apk --split-per-abi --tree-shake-icons --obfuscate --split-debug-info=debug-info

# 重命名APK文件为项目名
$date = Get-Date -Format "yyyyMMdd"
Get-ChildItem -Path build\app\outputs\flutter-apk\ -Filter "app-*.apk" | Where-Object { $_.LastWriteTime -gt (Get-Date).AddMinutes(-10) } | ForEach-Object {
    $arch = $_.Name -replace 'app-', '' -replace '-release.apk', ''
    $newName = "relaunch-$arch-$date.apk"
    Copy-Item $_.FullName "build\app\outputs\flutter-apk\$newName"
    Write-Output "已创建: $newName ($([math]::Round($_.Length / 1MB, 2)) MB)"
}
```

## Dart
[https://dart.cn/language](https://dart.cn/language)

## 变量
```dart
var a = 1;
```

## 常量
**const**

编译时常量

```dart
const a = 1;
```

**final**

运行时常量

```dart
final a = 1;
```

## 常用类型
### String
+ 模板字符串

```dart
String text = "我要在${DateTime.now()}吃早饭";
String name = "食堂";
String text = "我要在$name吃早饭";
```

### 数字类型
+ int
+ num
+ double

### 布尔类型
+ bool

表示 true 或 false

### 列表类型
+ List

```dart
List list = [1, 2, 3];
```

+ 常用方法和属性

```dart
list.add(4);
list.addAll([5, 6, 7]);
list.remove(4);
list.removeLast();
list.removeRange(0, 2);
```

```dart
list.forEach((item) {
  print(item);
});
// 是否都满足条件
list.every((item) {
  return item < 5;
});
// 是否有满足条件的
list.where((item) {
  return item < 5;
});
// 常用属性
list.length;
list.last;
list.first;
list.isEmpty;
```

### 字典类型
+ Map

```dart
Map map = {"name": "张三", "age": 18};
map["name"] = "李四";
print(map["name"]);
```

+ 常用方法

```dart
map.forEach((key, value) {
  print(key + ":" + value);
});
map.addAll({"sex": "男"});
print(map.containsKey("name"));
print(map.containsValue("张三"));
map.remove("name");
map.clear();
```

### 动态类型
+ dynamic

```dart
dynamic a = 1;
a = "1";
a = true;
a = [1, 2, 3];
a = {"a": 1};
```

+ 与 var 的区别
    1. dynamic：无编译检查，所有方法和属性可以直接调用
    2. var：有编译检查，仅限调用推断的属性和方法

## 空安全机制
+ 通过编辑静态检查将运行时空指针提前暴露
+ 常见空安全操作符

|  操作符  |  符号  |  作用  |  实例  |
| --- | --- | --- | --- |
| 可空类型 | ? | 声明可空变量 | String?<br/>允许 String 为 null |
| 安全访问 | ?. | 对象为 null 跳过操作直接返回 null | user?.name<br/>若 user 为 null 返回 null |
| 非空断言 | !. | 主观保证变量非空（否则崩溃） | name!.length<br/>断言 name 非空 |
| 空合并 | ?? | 左侧为 null 返回右侧默认值 | name ?? "无名氏"<br/>name 为 null 返回"无名氏" |


## 算术运算符
+ ~/：整除

## 函数
### 可选位置参数
+ 可选参数必须位于必传参数后面
+ 传递时按照顺序传递
+ 可以设置默认值

```dart
void main(List<String> args) {
  print(func("a"));
  print(func("a", "b"));
  print(func("a", "b", "c"));
}

String func(String a, [String? b, String? c = "c"]) {
  return a + (b ?? "默认值b") + (c ?? "默认值c");
}

// 输出：
a默认值bc
abc
abc
```

### 可选命名参数
+ 可选参数必须位于必传参数后面
+ 按照 ` 参数名: 值 `传递，无需关注顺序
+ 可以设置默认值

```dart
void main(List<String> args) {
  print(func("张三"));
  print(func("张三", age: 18));
  print(func("张三", age: 18, sex: "男"));
}

String func(String name, {int? age = 10, String? sex = "未知"}) {
  return "name: $name, age: $age, sex: $sex";
}

// 输出
name: 张三, age: 10, sex: 未知
name: 张三, age: 18, sex: 未知
name: 张三, age: 18, sex: 男
```

### 匿名函数
```dart
void main(List<String> args) {
  test2(test);
}

Function test = () {
  print("test");
};

void test2(Function f) {
  f();
}
```

### 箭头函数
```dart
void main(List<String> args) {
  test2(test);
}

Function test = () {
  print("test");
};

void test2(Function f) => f();
```

## 类
### 命名构造函数和构造函数语法糖
```dart
void main(List<String> args) {
  Person p = Person("张三", 18, "男");
  Person p1 = Person.create("张三", 18, "男");
  p.show();
  p1.show();
}

class Person {
  String? name;
  int? age;
  String? sex;
  Person(this.name, this.age, this.sex);
  Person.create(this.name, this.age, this.sex);
  void show() {
    print("姓名：$name");
    print("年龄：$age");
    print("性别：$sex");
  }
}
```

### 公有属性和私有属性
+ 私有属性用下划线 `_`区分
+ 私有属性不可用构造函数语法糖赋值

```dart
void main(List<String> args) {
  Person p = Person.create("张三", age: 18, sex: "男");
  p.show();
}

class Person {
  String? name;
  int? _age;
  String? _sex;
  Person(this.name);
  Person.create(this.name, {int? age, String? sex}) {
    this._age = age;
    this._sex = sex;
  }
  void show() {
    print("姓名：$name");
    print("年龄：$_age");
    print("性别：$_sex");
  }
}
```

### 继承和重写
+ dart 属于单继承，一个类只能拥有一个父类
+ 子类不会继承父类构造函数，必须通过 `super`调用父类构造函数确保父类正确初始化

```dart
void main(List<String> args) {
  Child child = Child("张三", 18, "男");
  child.show();
}

class Person {
  String? name;
  int? age;
  Person(this.name, this.age);
  void show() {
    print("姓名：$name");
    print("年龄：$age");
  }
}

class Child extends Person {
  String? sex;
  Child(String name, int age, this.sex) : super(name, age);
  @override
  void show() {
    print("姓名：$name");
    print("年龄：$age");
    print("性别：$sex");
  }
}
```

```dart
void main(List<String> args) {
  Child child = Child(name: "张三", age: 18, sex: "男");
  child.show();
}

class Person {
  String? name;
  int? age;
  Person({this.name, this.age});
  void show() {
    print("姓名：$name");
    print("年龄：$age");
  }
}

class Child extends Person {
  String? sex;
  Child({String? name, int? age, this.sex}) : super(name: name, age: age);
  @override
  void show() {
    print("姓名：$name");
    print("年龄：$age");
    print("性别：$sex");
  }
}
```

### 抽象类和接口
```dart
void main(List<String> args) {
  PayBase wxPay = WxPay();
  wxPay.pay();
  PayBase aliPay = AliPay();
  aliPay.pay();
}

abstract class PayBase {
  void pay();
}

class WxPay implements PayBase {
  @override
  void pay() {
    print("微信支付");
  }
}

class AliPay implements PayBase {
  @override
  void pay() {
    print("支付宝支付");
  }
}
```

### 类的混入
+ 不用传统继承的情况下，向类中添加新的功能
+ mixmin 定义一个对象
+ with 将定义的对象混入当前对象
+ 一个类支持 with 多个 mixin，优先级遵循“后来居上”原则，即后混入的会覆盖先混入的同名方法

```dart
void main(List<String> args) {
  Student student = Student(name: "小明");
  student.song(student.name!);
  Teacher teacher = Teacher(name: "老张");
  teacher.song(teacher.name!);
}

mixin Base {
  void song(String name) {
    print("${name}会唱歌");
  }
}

class Student with Base {
  String? name;
  int? age;
  Student({this.name, this.age});
}

class Teacher with Base {
  String? name;
  int? age;
  Teacher({this.name, this.age});
}
```

## 泛型
```dart
void main(List<String> args) {
  Teacher teacher1 = Teacher(students: ["小王", "小明"], name: "老张", age: 35);
  Teacher teacher2 = Teacher(students: ["小李", "小丽"], name: "老赵", age: 43);
  if (swapTeacher(teacher1, teacher2)) {
    print(teacher1);
    print(teacher2);
  }
}

class Teacher<T> {
  List<String>? students;
  T? name;
  int? age;
  Teacher({this.students, this.name, this.age});

  @override
  String toString() => 'Teacher(students: $students, name: $name, age: $age)';
}

bool swapTeacher<T>(Teacher<T> teacher1, Teacher<T> teacher2) {
  if (teacher1.students != null && teacher2.students != null) {
    List<String> students = teacher1.students!;
    teacher1.students = teacher2.students;
    teacher2.students = students;
    return true;
  }
  return false;
}
```

## 异步编程
### 事件循环
+ dart 是单线程语言
+ dart 采用单线程+时间循环机制完成耗时任务的处理
+ 耗时任务：
    - 执行同步代码 => 执行微任务队列 => 执行任务队列 => 结束
+ 微任务队列：`Future.microtask()`
+ 事件队列：`Future``Future.delayed()``I/O 操作（文件，网络）`等

### Future-then/catchError
+ Future 代表一个异步操作的最终结果
+ 状态：Uncompleted（等待），Completed with a value（成功），Completed with a error（失败）
+ 创建：`Future(() {})`

```dart
void main(List<String> args) {
  Future<String> f = Future(() {
    throw Exception("错误");
  });
  f.then((value) {
    print(value);
  });
  f.catchError((error) {
    print(error);
  });
}
```

**链式调用**

```dart
void main(List<String> args) {
  Future(() => "Hello World")
      .then((value) => Future(() => "task1"))
      .then((value) => Future(() => "task2"))
      .then((value) => Future(() => "task3"))
      .then((value) {
        print(value);
        throw Exception("错误");
      })
      .catchError((error) => print(error.toString()));
}

// 输出：
task3
Exception: 错误
```

### Future-async/await
+ 除了 then/catchError 还可以通过 async/await 实现异步编程
+ await 总是等到 Future 执行成功才继续执行，async 和 await 是必须配套的

```dart
void main(List<String> args) {
  func();
}

void func() async {
  try {
    await Future(() {
      // Future 执行成功才执行
      throw Exception();
    });
  } catch (e) {
    print("执行失败逻辑");
  }
}
```

**推荐使用 async/await**

## Flutter
[https://docs.flutter.cn/get-started/fundamentals/widgets](https://docs.flutter.cn/get-started/fundamentals/widgets)

## 组件
### 路由
```dart
home: HomePage(),
routes: {
  '/homepage': (context) => HomePage(),
  '/settingpage': (context) => SettingPage(),
},
```

外部文件路由

```dart

```

### 侧边栏
```dart
drawer: Drawer(
  child: Column(
    children: [
      DrawerHeader(child: Icon(Icons.favorite, size: 48)),
      ListTile(
        leading: Icon(Icons.home),
        title: Text('H O M E'),
        onTap: () {
          Navigator.pop(context);
          Navigator.pushNamed(context, '/homepage');
        },
      ),
      ListTile(
        leading: Icon(Icons.settings),
        title: Text('S E T T I N G S'),
        onTap: () {
          Navigator.pop(context);
          Navigator.pushNamed(context, '/settingpage');
        },
      ),
    ],
  ),
),
```

### 底部导航栏


### 侧边抽屉


## 工具控件
### 按钮
```dart
import 'package:flutter/material.dart';

class MyButton extends StatelessWidget {
  final String buttonName;
  VoidCallback onPressed;

  MyButton({super.key, required this.buttonName, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return MaterialButton(
      onPressed: onPressed,
      color: Theme.of(context).primaryColor,
      child: Text(buttonName, style: TextStyle(color: Colors.white)),
    );
  }
}
```

调用

```dart
MyButton(buttonName: "Save", onPressed: onSave),
```

### 弹窗
```dart
import 'package:flutter/material.dart';
import 'package:todo_app/core/utils/my_button.dart';

class DialogBox extends StatelessWidget {
  final TextEditingController controller;
  final VoidCallback onSave;
  final VoidCallback onCancel;

  DialogBox({
    super.key,
    required this.controller,
    required this.onSave,
    required this.onCancel,
  });

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      content: Container(
        height: 120,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            TextField(
              controller: controller,
              decoration: InputDecoration(
                border: OutlineInputBorder(),
                hintText: "Add a new todo",
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                MyButton(buttonName: "Save", onPressed: onSave),
                const SizedBox(width: 8),
                MyButton(buttonName: "Cancel", onPressed: onCancel),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

```

调用

```dart
showDialog(
  context: context,
  builder: (context) {
    return DialogBox(
      controller: _controller,
      onSave: saveNewTodo,
      onCancel: () => Navigator.of(context).pop(),
    );
  },
);
```



## Hive
### 依赖
```yaml
dependencies:
  hive: ^2.2.3
  hive_flutter: ^1.1.0
dev_dependencies:
  hive_generator: ^2.0.0
  build_runner: ^2.4.0
```



## 常用依赖
## Hive


## Google 底部导航栏
```yaml
google_nav_bar: ^5.0.7
```

```dart
import 'package:flutter/material.dart';
import 'package:google_nav_bar/google_nav_bar.dart';

class BottomNavBar extends StatelessWidget {
  void Function(int)? onTabChange;

  BottomNavBar({super.key, required this.onTabChange});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(vertical: 20),
      child: GNav(
        color: Colors.grey[400],
        activeColor: Colors.grey.shade700,
        tabActiveBorder: Border.all(color: Colors.white),
        tabBackgroundColor: Colors.grey.shade100,
        mainAxisAlignment: MainAxisAlignment.center,
        tabBorderRadius: 16,
        onTabChange: (value) => onTabChange!(value),
        tabs: const [
          GButton(icon: Icons.home, text: 'Shop'),
          GButton(icon: Icons.shopping_bag_rounded, text: 'Cart'),
        ],
      ),
    );
  }
}

```

```dart
import 'package:flutter/material.dart';
import 'package:sneaker_shopping_cart/components/bottom_nav_bar.dart';
import 'package:sneaker_shopping_cart/pages/cart_page.dart';
import 'package:sneaker_shopping_cart/pages/shop_page.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;

  void navigateBottomBar(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  final List<Widget> _pages = [const ShopPage(), const CartPage()];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      bottomNavigationBar: BottomNavBar(
        onTabChange: (index) => navigateBottomBar(index),
      ),
      body: _pages[_selectedIndex],
    );
  }
}
```
