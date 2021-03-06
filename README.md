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


##### 需求分析

官方提供了默认配置对象`axios.defaults`，我们可以把所有的相同的配置字段都写入该默认配置对象，那么这个配置字段将会在所有的请求中都生效。

提供一个默认配置对象，只需要将用户配置对象与默认配置对象进行合并，然后发出请求即可。
##### 实现思路

1.  创建出默认对象`defaults`，暂时为默认配置对象`defaults`中只添加默认请求超时事件`timeout`和请求头`headers`，并且在`headers`中设置`common`属性，用于存放所有请求都需要的请求头字段，另外于`common`同级下还创建了每个请求方式属性，用于存放不同请求所特有的请求头字段。例如像需要数据的请求方式`post`,`put`,`patch`我们为其默认添加`Content-Type`字段，而不需要数据的请求方式`delete`，`get`，`head`，`options`则为其留空。

2.  将创建好的默认配置对象添加到`Axios`类中，从而可以在实例`axios`对象上点出来

3.  将创建的默认设置对象通过`Axios`类的构造函数传进来

4.  在创建`axios`实例的地方接收该配置对象，在执行`getAxios`创建`axios`对象的时候，把默认配置传入。

5.  给`Axios`类的类型接口定义中添加该字段

6.  定义一个对象合并函数`merge`函数合并用户配置和默认配置
    -   对于`timeout`，`responseType`等这些常规操作，合并起来比较容易，即如果用户配置了就用户配置的，如果用户没配置，则用默认配置的
    -   对于一些属性如`url`，`method`，`params`，`data`这些属性都是跟每个请求息息相关的，请求不同从而千变万化，所以像这四个属性我们在合并的时候不管默认配置对象里面有没有，我们只取用户配置的
    -   对于`header`、`auth`等这些属性就比较复杂了，需要要将默认配置的与用户配置的做一次深度合并，如在`headers`中，字段不相同的要拷贝合并在一起，字段相同的，内容不同的也要拷贝合并在一起。

    -  复杂对象上深度合并，
        -   如果在用户配置对象中配置了`headers`属性，并且该属性是个对象，那么调用`deepMerge`函数把默认配置对象`defaultConfig`中的`headers`和用户配置对象`userConfig`的`headers`进行合并，最后把合并结果放入最终返回的`config`对象中`headers`
        -   如果`userConfig`的`headers`不是对象，并且不为空，那么直接就把它放入最终返回的`config`对象的`headers`
        -   如果`userConfig`中的`headers`为空，表示用户没有配置该属性，并且如果`defaultConfig`中的`headers`是跟对象，那就直接把`defaultConfig`中的`headers`深拷贝一份放入最终返回的`config`对象的`headers`
        -   如果`userConfig`中的`headers`为空，并且`defaultConfig`中的`headers`也不是对象，也不为空，那直接就把它放入最终返回`config`对象的`headers`
    -   深度合并的工具`deepMerge`
        -   函数内部先创建了一个空对象`result`，作为最终返回的结果对象
        -   然后遍历传进来的所以对象，每个对象在遍历所有的属性，调用`assignValue`子函数将当前遍历的对象中的每个属性都拷贝到`result`中
        -   把所有传进来的对象遍历完毕后，即把所有的对象的所有属性都拷贝到了`result`，最终将`result`返回
    -   在`Axios`类的`request`方法中将默认配置对象与用户配置对象进行合并
    -   扁平化合并后的`headers`,即把所有的属性提取出来放入`headers`下，对于`common`中定义的`headers`字段，我们都要提取，而且对于`post`,`get`这类提取，需要和该次请求的方法对应。
        -   `flattenHeaders`函数对合并后的`headers`进行扁平化

        -   通过`deepMerge`的方式把`common`、`post`的属性拷贝到`headers`这一级,然后删除`common`,`post`这些属性，最后返回的`headers`就是我们想要的扁平化的`headers`
#### 请求和响应数据配置化


##### 需求分析
在官方`axios`中，默认配置对象里面还提供了`transformRequest`和`transformResponse`这两个属性，它们的值可以是一个函数或者是一个由多个函数组成的函数

`transformRequest`允许你在将请求数据发送到服务器之前对其进行修改，这适用与请求方法`put`、`post`、`patch`，如果值是数组，则数组中的最后一个函数必须返回一个字符串或者`FormData`、`URLSearchParams`、`Blob`等类型作为`xhr.send`方法的参数，而且在`transform`过程中可以修改`headers`对象。

`transformResponse`允许你在把响应数据传递给`then`或者`catch`之前对它们进行修改

当值为数组的时候，数组的每一个函数都是一个转换函数，数组中的函数就像管道一个一次执行，前者的输出作为后者的输入。

##### 实现流程

1.  修改之前创建的默认配置对象`defaults`，为其添加`transformRequest`和`transformResponse`这两个属性，并且把之前封装在`dispatchRequest`函数时请求的`data`、`headers`和响应的`data`做的转换分别抽离到这两个属性内
2.  修改`defaults`之前修改`AxiosRequestConfig`接口类型定义，因为`defaults`的类型是`AxiosRequestConfig`，我们要在`AxiosRequestConfig`接口定义中添加`transformRequest`和`transformResponse`这两个属性。
3.  定义转换函数函数接口类型`AxiosTransformer`，他的值要么是一个转换函数，要么是一个由转换函数组成的数组
4.  修改创建好的默认配置对象，把`dispatchRequest`函数和`processConfig`函数时对请求的`data`、`headers`和响应的`data`做的转换分别抽离到这两个属性内，然后在`dispatchRequest`函数和`processConfig`函数内调用默认配置里的`transformRequest`和`transformResponse`。

5.  用于`transformRequest`和`transformResponse`这两个属性值有可能是多个转换函数构成的数组，而且当执行这些转换函数的时候，前一个转换函数的返回输出值是最后一个转换函数的输入值

6.  创建`transform`函数，在函数内部遍历执行所有的转换函数，并且把前一个转换函数的返回值作为参数传给后一个转换函数，在外层我们只需要调用`transform`函数即可

    -   该函数接收三个参数，待转换的数据`data`，待转换的`headers`以及所有的转换函数
    -   首先判断转换函数是否为空，若为空表示不进行任何转换，则直接把`data`返回
    -   然后在判断转换函数是否为数组，若不为数组，则将其强制变成一个长度为1的数组，这是为了下面可以同源遍历
    -   遍历所有的转换函数并执行，执行的时候每个转换函数返回的`data`会作为下一个转换函数的参数`data`传入

#### 增加 Axios.create

##### 需求分析

调用`Axios.create`静态接口，可以创建一个新的实例对象，该对象接收一个`AxiosRequestConfig`类型的参数作为该实例的默认配置对象，也可以不传入参数表示没有默认配置，返回一个实例对象，可以像之前使用`axios`对象那样使用返回的这个实例对象，并且会对他做一些自定配置。
##### 实现流程

1.  要给`axios`混合对象扩展一个静态接口，修改`AxiosInstance`接口类型，新建`AxiosStatic`接口类型，继承自`AxiosInstance`

2.  `create`函数可以接收一个`AxiosRequestConfig`类型的配置，作为一个默认配置的扩展，也可以接受不传参数。把该配置对象和全局的默认配置对象进行合并，作为将来返回的新`axios`实例对象的默认配置，最后使用`getAxios`创建出一个新的实例对象返回即可。

#### 请求取消功能总体思路

##### 取消请求的两种方式

1.  用`CancelToken.source`工厂创建取消令牌

2.  通过将取消函数传递给`CancelToken`的构造函数来创建取消令牌

所谓的取消令牌`cancelToken`其实就是请求配置对象种的一个属性，该属性对应一个取消请求的触发函数，例如第一种方式种`source.cancel()`，第二种方式中的`cancel()`

当在请求外部调用了该触发函数，表示此时需要取消请求了，那么此时调用`XMLHttpRequest`对象中`abort`方法将请求取消即可

##### 代码分析

1.  `axios`混合对象上又多一个静态接口`CancelToken`
2.  `CancelToken`接口是一个类
3.  `CancelToken`类的构造函数接收一个函数作为参数，并且这个参数函数也接收一个函数也接收一个取消函数作为参数
4.  `CancelToken`类上有一个静态方法`source`
5.  `source`方法返回一个对象，`token`和`cancel`
6.  `source.token`其实就是`CancelToken`类的实例，`source.cancel`就是取消请求触发函数
7.  `axios`混合对象增加一个静态接口`isCancel`
8.  `isCancel`接口接收错误对象`e`作为参数，用来判断该错误是不是由取消请求导致的

##### 小结

两种使用方式都是用`CancelToken`类的实例作为取消令牌，不同之处在于

1.  第一种是把变量`cancel`定义在了静态方法`source`内部，并且在`source`内部`CancelToken`类实例好，最后一并返回，这样我们就不用显示的实例化`CancelToken`类和定义`cancel`变量,取而代之的是使用`source.token`对应实例化`CancelToken`类，`source.cancel`对应触发函数`cancel`。

2.  第二种我们需要显式的定义一个`cancel`变量和显示的实例化`Cancel`类,并且把取消请求的触发函数赋给`cancel`，然后通过调用`cancel`来取消请求。

3.  `isCancel`接口接收一个异常对象`e`作为参数，用来判断该异常是否由取消请求导致的，如果是的话该异常对象就应该是请求取消的原因。
    -   创建一个取消原因`Cancel`类，而把请求取消的原因作为该类的实例，这样我们在捕获异常的时候只需要判断异常对象是不是`Cancel`类的实例，如果是的话，那么他就是请求取消的原因，否则就是其他异常。



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
