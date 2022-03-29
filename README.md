# yui-btn

### 介绍 
这是供插件开发者参考的简易版插件

This is a simple plugin for developers to refer to

看完这篇文章，你会对插件的封装有新的认识：

  1. 如何单独封装插件并发布
  
  2. 如何开发一套适合团队的组件库

## 为啥需要搭建组件库？

在此我简单举个身边的例子：

`同事甲`：小乙，你有封装过这个xxx组件吗？

`同事乙`：是的，我之前封装过了，你去yyy项目中找下吧。

乙给了甲项目的远程仓库地址，甲拉取了整个项目，然后找到了小乙封装的xxx组件并使用了起来。但是呢，很快啊，同事甲就对小乙说，我想要的效果和你封装稍微有点不一样，但我对你的代码又很陌生。你能再帮我再封装下嘛....

于是，小乙陷入了沉默...

作为小乙，他肯定就在想了为啥公司有那么多类似的项目，居然没有一套完整独立的组件库。如果有这么一套组件库，那么团队开发的时候，不就可以通过组件库查找所需的组件了嘛，这对团队开发的效率不就是一个质的起飞了嘛。


## 插件和组件

在我看来，插件的范围包括了组件，可以理解为组件就是插件的子集。

一般来说插件是全局引入的（按需引入除外，这更多是对引入组件库所做的性能优化方面的事），组件的引入既包含全局又包含局部。

拿element-ui为例， 它就是插件同时也是我们说的`组件库`，但是它里面的每个小模块就是一个个组件，例如Checkbox多选框组件、Table表格组件等等。

它们必须对具体的功能有着更多使用和开发方面的考虑，无非以下三个大方面：

`样式`: 指的就是这个组件在不同使用场景的状态以及大小、颜色等等

`功能`: 满足当前业务的同时考虑可能会有的新需求 

`性能`: 代码既要干净又要质量，尽量不使用多层for循环等容易引起性能开销大的语法糖

## 如何封装并分布自己的插件

为了更简洁直观地介绍，我会用封装一个按钮插件并发布。（单纯就是个按钮，只是为了理解起来更轻松,实际开发基本上没有这种要求...）

首先你需要创建一个单文件btn.vue，

```
<template>
    <div class='yuiBtn' :style="computedStyle" @click="sayHi(hi)">
        {{btnName}}
    </div>
</template>

<script>
export default {
    name:'yuiBtn',
    data () {
        return {
        }
    },
    props:{
        btnName:{
            type: String,
            default: 'YuiBtn'
        },
        btnWidth:{
            type: Number,
            default: 60
        },
        btnHeight:{
            type: Number,
            default: 20,
        },
        hi:{
            type: String,
            default: '余大帅'
        }
    },
    computed:{
        computedStyle(){
            return { 
                height: this.btnHeight +'px', 
                lineHeight:this.btnHeight +'px', 
                width: this.btnWidth + 'px'
            }
        }
    },
    methods:{
        sayHi(name) {
            alert(`hi,${name}~`)
        }
    }
}
</script>

<style lang='scss' scoped>
    .yuiBtn{
        text-align: center;
        border: 1px solid #000000;
    }
</style>
```

然后你需要给它增加一个install方法。

以下是vue官网给出的插件install方法的模板，满足了多种需求。

```js
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或 property
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }
  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })
  // 3. 注入组件选项
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })
  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (methodOptions) {
    // 逻辑...
  }
}
```

但是上述install方法中的功能并不合适我们现在想要的具象的UI组件。

因此需要以下写法，通过`Vue.component()`全局注册即可：

```js
// index.js
import YuiBtn from './btn.vue'

const myPlugin = {    
    install(Vue) {
        Vue.component('YuiBtn', YuiBtn) 
    }
}

export default myPlugin

```

没错开发插件到这就完事了，但是为了发布插件，你还得初始化一个npm包,并将我们刚刚写的插件放入其中。基本步骤如下：

1.  初始化包 

`npm init` 

2. 修改package.json中的入口文件信息：  

`"main": "index.js", ` 

3. 执行发包脚本

`npm publish`

如果你没有npm官网账号，还得事先注册奥；未登录 npm 账号的情况下，会要求你进行登录。

展示下，这个简单的插件的目录结构：


![](https://files.mdnice.com/user/8429/74288448-d855-49df-9ec9-a7bbf0deb367.PNG)

发布成功后呢，那我就得恭喜你成为了一名插件开发者了。

关于使用的话，很简单咯：

先安装，我以目前的简易按钮插件为例(`你现在就可以在项目中测试这个按钮的功能`)：

`npm install yui-btn`

再引入：
```
// main.js
import yuibtn from 'yui-btn'
Vue.use(yuibtn)
```
最后使用
```
// xx.vue
<YuiBtn />
```

如果还是有疑问的，可以看下github地址： 

`https://github.com/1842347744/button-plugin.git`


补充一下发布插件的一些看法，有一些文章中会通过vue-cli初始化一个项目，然后开发插件，再发布。但是这会有个问题，你发布的插件的package.josn中的依赖信息将会是当前这个项目的依赖信息，显然这是不妥的。因此我的操作就是新建一个npm包，再移植插件代码，最后发布。

但是从另一个角度看的话，也是可以接受的--那就是开发组件库。如果当前项目就是针对于要开发的组件库而言的，那么依赖信息便不会显得过于累赘，当然这还仅限于vue2.0的项目，毕竟2.0的项目可以通过vue-cli快速搭建的。
