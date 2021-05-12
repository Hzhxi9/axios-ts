### Axios 特点

- 在浏览器端使用 XMLHttpRequest 对象通讯

- 支持 Promise API

- 支持请求和响应的拦截器

- 支持请求数据和响应数据的转换

- 支持请求的取消

- JSON 数据的自动转换

- 客户端防止 XSRF

- Axios 本质上就是发送一个请求拿到响应结果中途可以去对配置参数、请求数据和响应数据处理同时也支持一些拦截器的调用

### Axios 实现流程

- 处理 GET 请求 url 参数

- 处理 POST 请求参数

- 处理请求 Header

- 获取响应数据

- 处理响应 Header

- 处理响应 data

- 异常处理

- 接口扩展，混合 Axios

- 增加参数判断

- 让响应数据支持泛型

- 实现拦截器

- 设置默认配置

- 请求和响应数据配置化

- 增加 Axios.create

- 请求取消功能总体思路

#### 处理 GET 请求 url 参数

Axios 处理 GET 请求参数 是将参数拼接到 url

##### 需求分析

1. 参数为普通参数拼接到 url，`"/api/handleRequestURL/get?a=1&b=2"`
2. 参数为数组参数拼接到 url， `/api/handleRequestURL/get?foo[]=bar&foo[]=baz`
3. 参数为对象参数拼接到 url， `/api/handleRequestURL/get?foo=%7B%22bar%22:%22baz%22%7D`,foo 后面拼接的是 `{"bar":"baz"}`encode 后的结果
4. 参数为 Date 参数拼接到 url， `/api/handleRequestURL/get?date=2019-07-24T04:46:41.05190Z`
5. 参数包含特殊字符参数拼接到 url， `/api/handleRequestURL/get?foo=@:$+`，**注意，空格 会被转换成 +**
6. 参数为 null 或者 undefined 参数拼接到 url， `/api/handleRequestURL/get?foo=bar,`对于值为 null 或者 undefined 的属性，会被丢弃。
7. 参数存在哈希#标记参数拼接到 url，`/api/handleRequestURL/get`,当原始 url 中存在哈希标记（#）时，所携带的所有参数 params 会被忽略，并且请求的 url 不包含#之后的东西
8. 参数已存在参数参数拼接到 url， `/api/handleRequestURL/get?foo=bar&bar=baz`，会把携带的参数拼接到已存在参数的后面。

##### 实现过程

1.  `buildURL`函数处理原始 URL，拼接参数
2.  `encode`函数对 URL 进行解码处理

#### 处理 POST

POST 请求携带的参数存在于请求体 body

##### 需求分析

1.  POST 通过`xhr.send`方法发送请求，支持参数 `Document `和 `BodyInit` 类型， `BodyInit` 类型包括 `Blob`、`BufferSource`、`FormData`、`URLSearchParams`、`USVString`，当没有数据的时候还可以传入 `null`

2.  传入一个普通对象时需要转换为 `JSON` 字符串

##### 实现过程

1.  `transformRequest`工具函数对`data`进行转换

#### 处理请求 Header

发送`POST`请求时，服务端不能正确解析发送的数据。因为执行`send`把普通对象转换为`JSON`字符串，但是请求的`Header`的`Content-Type`是`text/plain;charset=UTF-8`，导致服务端接受到请求不能正确解析数据

##### 需求分析

1.  在发送请求时候，需要支持配置`headers`属性

    ```
    axios({
        method: 'post',
        url: '/api/handleRequestHeader/post',
        headers: {
          'content-type': 'application/json;charset=utf-8'
        },
        data: {
          a: 1,
          b: 2
        }
    })
    ```

2.  当传入`data`为普通对象时候，`headers`如果没有配置`Content-Type`属性，需要自动设置请求头`Content-Type`为`application/json;charset=utf-8`

##### 实现过程

1.  `processHeaders`工具函数对`headers`进行一层加工
    - 判断是不是普通对象
    - 是否传入`headers`以及`headers`里面是否有`Content-Type`字段，没有默认添加`headers['Content-Type'] = "application/json;charset=utf-8"`
2.  `headers`里面的字段名是不区分大小写的，但是标准规定是首字母是大写的，所以需要添加`headers`规范化函数`normalizeHeaderName`
    - 函数支持传入`headers`和一个字段规范化的目的格式，例如把`headers`中的`Content-Type`字段统一规范化成`Content-Type`，直接调用`normalizeHeaderName(headers, 'Content-Type')`，函数内容会遍历传入`headers`所有字段名，通过判断字段名如果与目的格式不同，并且转换成大写相同时，那么表明该字段是要规范化的字段，那么就向传入的`headers`里面新增目的格式的字段，并且字段值为原字段值，然后删除不规划的字段名。

#### 获取响应数据

##### 需求分析
获取服务端响应的数据，并且支持`Promise`链式调用

##### 实现过程

1.  完成一个完整的AJAX
    - 创建XMLHttpRequest异步对象
    - 配置请求参数
    - 发生请求
    - 注册事件，获取响应数据
2.  判断如果`config`配置了`responseType`，将它设置到`request.responseType`中
3.  当`responseType`没有设置或者设置为`text`时响应数据存在于`request.responseText`,其余情况响应数据存在于`request.response
4.  在`onreadystatechange`事件函数中，构造`AxiosPromise`类型的`response`对象，并把它`resolve`出去
5. 对应修改`axios`函数


#### 异常处理

异常出现时，需要在`reject`回调函数去中捕获

##### 需求分析

1.  网络异常，当网络不通时抛出异常
2.  请求超时，当请求发出去后在指定时间内没有收到响应时候抛出异常
3.  状态码非200-300异常，当请求的状态码不在200-300之前时，判断出现为异常

##### 实现流程

1.  网络出现异常时（比如不通）发送请求会触发`XMLHttpRequest`对象实例的`error`事件，来捕获此类错误
2.  请求超时，允许用户在发请求是配置请求的超时事件`timeout`，也就是当请求发送后超过某个事件仍然没有收到响应，则请求自动停止，并触发`XMLHttpRequest`对象实例的`ontimeout`事件
    -   在请求参数接口类型`AxiosRequestConfig`添加`timeout`选项
    -   在`src/xhr.ts`中的`xhr`函数中获取用户配置的`timeout`，如果该参数不为空，则将其设置到`XMLHttpRequest`对象实例`request`中
    -   通过注册`XMLHttpRequest`对象实例`timeout`事件来捕获请求超时异常
3.  先在`xhr`函数中的`onreadystatechange`的回调函数中,添加了对`request.status`的判断，因为当出现网络错误时或者超时错误的时候该值都为0，然后我们在判断状态码是否在200-300之间，来决定是否抛出异常

#####  扩展完善

需要在请求发生异常的时候获取到该请求的对象配置`config`，错误代码`code`，对象实例`XMLHttpRequest`以及响应对象`response`。

1.  定义异常信息的接口类型`AxiosError`

2.  创建一个`AxiosError`类，继承内置的`Error`类，`AxiosError`类添加了一些自己的属性`config`,`code`,`request`,`response`,并创建一个用于快速创建`AxiosError`类实例的工厂方法`createError`，可以直接调用，传入相关的参数来创建`AxiosError`类实例。

3. `/scr/xhr`抛出异常的地方的`new Error()`改成`createError`。

#### 接口扩展，混合 Axios

##### 需求分析
官方Axios提供了很多接口
1.  `axios.request(config)`
2.  `axios.get(url,config)`
3.  `axios.delete(url,config)`
4.  `axios.head(url,config)`
5.  `axios.options(url,config)`
6.  `axios.post(url,data, config)`
7.  `axios.put(url,data,config)`
8.  `axios.patch(url,data,config)`

##### 实现思路

1.  先创建一个`Axios`类，在类的内部实现我们要的所有接口包括`request`,`get`,`post`,`delete`等等。

2.  然后创建`getAxios`函数

3.  在`getAxios`函数内部给之前创建的`axios`挂载需要的接口，然后把`axios`返回

#####  实现流程

1.  定义`Axios`类之前，我们先在`src/types/index`定义类型接口

2.  将`AxiosRequestConfig`中的`url`改为可选

3.  定义混合对象的类型接口`AxiosInstance`

4.  创建`Axios`类，在内部实现所有对外接口

5.  `Axios`类的`request`方法其实就是调用`dispatchRequest`方法,`get`，`post`等方法在调用内部的`request`,调用前先合并`method``url`到`config`中

6.  提取两个公共函数对内部方法进行简化

7.  创建`getAxios`函数，返回最终的混合函数`axios`,类型为`AxiosInstance`

8.  创建`axios`函数，其实就是`Axios`类中的`request`方法，这里需要把`Axios`类的实例对象绑定给上下文`this`，因为混合对象在`axios.get`使用时其实时调用了`Axios`类中`get`方法,而`get`方法内部又调用了`_requestMethodWithoutData`。

9.  挂载所有接口

10.  执行`getAxios`函数，返回混合对象`axios`

11.  创建`extend`工具函数继承所有方法和属性，减少代码量

#### 增加参数判断

官方`Axios`不仅能接收一个参数，也支持接收两个参数

#####  需求分析

一个函数在调用时既可以传一个参数也可以传两个参数，这就是函数的重载

```
函数重载：在相同的声明域中的函数名相同，而参数数表不同，即通过函数的参数表做唯一标识来区分函数的一种特殊函数
```
#####  实现流程

1.  在`Axios`类的`request`方法实现函数的重载
    -   `request`方法增加`url`参数，并把`url`和`config`参数类型都设置为`any`；
    -   然后判断传入的`url`是否为`string`类型,如果是，表明用户传入第一个参数传入了`url`，接着判断是否传入了`config`，如果没有传则赋值给默认值空对象`{}`，然后在将传入的`url`赋给`config`中的`url`上
    -   如果传入的`url`不是`string`类型，则我们认为只传了一个参数，并且该参数就是请求的配置的对象`config`
    -   最后调用`dispatchRequest(config)将请求发送出去`
2.  需要给混合对象的`axios`接口类型上添加重载的函数类型
#### 让响应数据支持泛型

#####  需求分析

希望能细化到返回来的数据`data`上，由于每个请求期望返回的`data`不尽相同，那么我们就应该在发出请示是带上我们想要的`data`类型接口，当数据返回时去匹配我们所携带的接口是发匹配得上，进而确定是我们想要的数据

#####  实现流程

1.  在定义的`AxiosResponse`接收一个泛型参数`T`,`T=any`表示泛型的类型参数默认值为`any

2.  之前定义好的所有接口`AxiosPromise Axios AxiosInstance`都接上泛型参数

#### 实现拦截器

请求拦截器就是可以在每个请求发送之前为请求做一些额外的东西，例如可以在请求拦截器中为所有的请求头添加`token`认证等信息，添加后再将请求发出去。

响应拦截器就是当每个请求的响应回来之后我们可以先对其进行一道预处理，处理后再将响应返回给真正的请求

在`Axios`对象有一个`interceptor`对象属性，该对象有`request`和`response`两个属性，他们都有一个`use`方法，`use`方法支持两个参数，第一个参数类似`Promise`的`resolve`函数，第二个参数类似`Promise`的`reject`函数。我们可以在`resolve`和`reject`函数中执行同步代码或者异步代码。

还有一个`eject`函数来删除某个拦截器。

#####   需求分析

假设有一个拦截器类，该类上有个两个实例方法，分别是添加拦截器和`use`方法和删除拦截器方法`eject`方法，而请求拦截器和响应拦截器都是该类的实例。
当我们在实例化`axios`时，我们给`axios`的实例绑定了`interceptor.request`和`interceptor.response`属性，同时这两个属性分别实例化了拦截器类，这样我们就可以通过`axios.interceptors.request.use`来为`axios`添加拦截器，或通过`axios.interceptors.request.eject`来删除拦截器。
#### 设置默认配置

#### 请求和响应数据配置化

#### 增加 Axios.create

#### 请求取消功能总体思路

```
├─.gitignore
├─index.html
├─package.json
├─README.md
├─tsconfig.json // TypeScript 编译配置文件
├─tslint.json // TypeScript lint 文件
├─examples // 每个功能点的 demo
├─server // 服务端源码
└─src // 源码目录
├─axios.ts
├─defaulted.ts
 ├─cancel
 ├─core
 ├─helpers
 └─types

```
