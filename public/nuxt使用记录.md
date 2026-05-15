#### 一. nuxt执行流程
默认SSR渲染下分为：
 1. 服务端执行(首次请求)
	- Nitro服务启动初始化（仅执行一次，全局）
		- 初始化并执行 `/server/plugins` 目录下的插件（服务启动时执行一次，不是每个请求）。
		- 注册所有 server 路由、中间件、任务等
		- 初始化数据库连接、日志系统等全局资源
	- 单个请求到达 Nitro 引擎
		- 执行服务器的中间件(`server/middleware/`目录下)。
		- 作用：全局日志、CORS 处理、请求头修改、身份认证（如 JWT 校验）。
	- Nuxt 应用实例创建
		- 创建 Vue 和 Nuxt 实例。
		- 执行 `app/plugins/` 目录下的**无后缀插件**和 **`.server.ts`后缀插件 （每个请求的服务端阶段执行一次）。
	- 路由解析与权限验证
		- 根据`app/pages/`目录匹配目标路由。
		- 执行**全局 Nuxt 中间件**（`app/middleware/`下无后缀和`.server.ts`后缀）。
		- 执行**页面级中间件**（`definePageMeta.middleware`）。
		- **最后执行路由验证**（`definePageMeta.validate`）。
		- 若验证失败，返回 404 页面；若中间件返回重定向，直接终止后续流程。
	- 获取数据并进行渲染：
		- 用户首次访问页面，Nitro引擎在服务端执行setup函数。
		- 通过请求API($fetch、useAsyncData、useFetch或自定义的请求方法等)获取页面数据并序列化到**payload**(\__NUXT\__.payload对象)。
		- 渲染纯服务端组件（`.server.vue`）：仅服务端执行 setup，生成静态HTML，不发送任何 JS 到客户端。
		- 与unhead的配置相结合，生成完整的HTML文档。
	- 最后将HTML文档、序列化后的数据(**payload**)、客户端 JS/CSS 资源链接一起发送给客户端。
 2. 客户端执行
	- 客户端初始化
		- 浏览器解析 HTML，先显示静态内容（首屏可见）。
		- 下载并执行客户端入口 JS（`/_nuxt/entry.*.js`）。
		- 执行 `app/plugins/` 目录下的无后缀的插件（如 `myPlugin.ts`）和带 `.client` 后缀的插件（如 `myClientPlugin.client.ts`）**（仅客户端首次加载时执行一次）。
	- 路由验证
		- 客户端会再次执行`definePageMeta.validate`方法。
		- 目的：防止用户直接修改 URL 绕过服务端验证，保证前后端验证一致性
	- 客户端水合(Hydration)
		- 再次执行目标页面及其所有父组件的`setup`函数
		- 从`window.__NUXT__.payload`中恢复服务端获取的数据，**不会重新发起网络请求（除非使用了$fetch发送请求）**。
		- Vue 重建虚拟 DOM 树，与服务端生成的真实 DOM 进行对比。
		- 绑定事件监听器、激活响应式系统。
		- 调用 `app.mount('#__nuxt')` 将 Vue 应用程序挂载到 DOM，页面变为可交互 SPA，支持路由跳转、动态更新。
#### 二.nuxt数据请求流程
1. 服务端发送请求 
	- 页面组件setup()
	- $fetch('/api/posts')
	- Nitro检测
		- 同项目API -> 直接调用 server/api/posts.get.ts 函数
		- 外部API -> 服务端发起HTTP请求
	- 返回原始JS对象
	- 序列化到 \__NUXT\___.payload
	- 嵌入HTML返回给浏览器
2. 客户端请求
	- 客户端组件 setup/事件
	- $fetch('/api/posts')
	- 浏览器发起HTTP请求
	- Nitro服务器接收请求
	- 执行 server/api/posts.get.ts
	- 返回JSON响应
	- 浏览器解析JSON
	- 存入客户端内存
#### 三.Nuxt上下文的有效执行范围
当用户访问Nuxt应用时:
1. **服务端**：为**每个用户的每个请求**创建一个**完全独立**的上下文对象
2. **客户端**：整个应用生命周期只有**一个全局上下文**
**范围：**
3. 组件的`<script setup>` **顶层**
4. 组件的setup()函数
5. Nuxt中间件(app/middleware)
6. Nuxt插件(app/plugins)
7. definePageMeta中的middleware、validate方法
8. useAsyncData/useFetch的回调函数
9. 纯服务端组件(.server.vue)的`<script setup>` 
#### 四.在Nuxt上下文中执行的API(非全部)

| API                  | 作用                          |
| -------------------- | --------------------------- |
| useNuxtApp()         | 获取当前 Nuxt 应用实例              |
| useRuntimeConfig()   | 获取当前环境的配置变量（区分服务端 / 客户端）    |
| useRequestEvent()    | 获取当前请求的 Nitro 事件对象（仅服务端）    |
| useRequestHeaders()  | 获取当前请求的请求头                  |
| useRequestURL()      | 获取当前请求的完整 URL               |
| useFetch()           | 自动序列化数据到 payload、跨端缓存、状态管理  |
| useAsyncData()       | 同上                          |
| useLazyFetch()       | 同上                          |
| `useLazyAsyncData()` | 同上                          |
| `useRoute()`         | 获取当前路由对象                    |
| useRouter()          | 获取路由实例，进行导航                 |
| navigateTo()         | 执行导航跳转                      |
| abortNavigation()    | 中止当前导航                      |
| useError()           | 获取当前错误对象                    |
| createError()        | 创建错误对象                      |
| useState()           | 创建跨端共享的响应式状态                |
| useHead()            | 管理页面头部（title、meta、link 等）   |
| useSeoMeta()         | 管理 SEO 相关的 meta 标签          |
| `defineNuxtPlugin()` | 定义 Nuxt 插件                  |
| usePinia()           | 获取 Pinia 状态管理实例（如果使用 Pinia） |
#### 五.cookie的使用和注意事项
1. useCookie
```js
const cookie = useCookie('my-cookie', 
	{ 
		// 过期时间（秒） 
		maxAge: 60 * 60 * 24 * 7, // 7天 
		// 过期日期（优先级高于 maxAge） 
		expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
		// Cookie 可用路径 
		path: '/', 
		// Cookie 可用域名 
		domain: 'example.com', 
		// 是否仅通过 HTTPS 传输 
		secure: process.env.NODE_ENV === 'production', 
		// 是否禁止 JavaScript 访问 
		httpOnly: false, 
		// 跨站请求保护 
		sameSite: 'lax', // 'strict' | 'lax' | 'none' 
		// 是否对 Cookie 值进行编码 
		encode: (value) => btoa(JSON.stringify(value)), 
		// 是否对 Cookie 值进行解码 
		decode: (value) => JSON.parse(atob(value)) 
	}
)
```
2. 注意事项
 - 不要在 Store 顶层调用 useCookie
	 - `useCookie` 必须绑定到当前Nuxt上下文
	 -  当 Store 在服务端预初始化时，可能不在任何Nuxt上下文中，导致 "nuxt instance unavailable" 错误
 - 服务端和客户端都能访问 Cookie
 - 服务端请求不会自动携带 Cookie
	 - 浏览器 → Nuxt 服务端：自动携带 Cookie
	 - Nuxt 服务端 → 后端 API：**不会自动携带 Cookie**
#### 六.Pinia实例持久化
1. 在`app/plugins`定义一个插件，导入store进行初始化操作
```js
// app/plugins/init-user.js
import { userStore } from "~/store/user";
export default defineNuxtPlugin((nuxtApp) => {
    const userInfo = userStore();
    userInfo.initUser();
})
```
2. 在定义store时使用`useCookie`和`localStorage`进行持久化操作
```js
const user = ref(null);
const cookieOptons = {
	path: '/',
	maxAge: 60 * 60 * 24 * 30,
	sameSite: 'Lax',
	secure: false
}
function setUser(data) {
	user.value = data;
	const cookie = useCookie('user', cookieOptons);
	cookie.value = JSON.stringify(data);
}
function initUserCookie() {
	const cookie = useCookie('user', cookieOptons);
	user.value = safeParseCookie(cookie.value);
}
function initUserStorage() {
	if (!import.meta.client) {
		return;
	}
	try {
		const userInfo = localStorage.getItem('user');
		user.value = JSON.parse(userInfo);
	} catch (error) {
		console.log('本地初始化失败', error);
	}
}

function initUser() {
	initUserStorage();
	initUserCookie();
}
```
