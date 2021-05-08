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

#### 异常处理

#### 接口扩展，混合 Axios

#### 增加参数判断

#### 让响应数据支持泛型

#### 实现拦截器

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
