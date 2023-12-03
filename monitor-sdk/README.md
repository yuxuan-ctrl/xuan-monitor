# Dpd Auth Sdk

### 一、引入方法

在 package.json 中配置

```json
"@frontends/dpd-auth-sdk":"git+ssh://git@gitlab.dg.com:10086/dmd/dev2/self/dg-bigdata-platform/frontends/dpd-auth-sdk.git"
```

在 main.ts,使用

```javascript
import dpdAuthSDK from "@frontends/dpd-auth-sdk";

// 传入router和pinia的实例
dpdAuthSDK(router, store, { constantRoutes });

//config 解读
type configuration = {
  API?: string,
  defaultRoles?: Array<string>,
  open?: boolean,
  whileList?: Array<string>,
  noCodeList?: Array<string>,
  tokenName?: string,
  constantRoutes: Array<Routes>, // 静态路由，必填
  currentApplication:string // 当前应用名称
};
```

### 二、文件解读

#### 1、引入入口文件 router/permission.ts

进入 main.ts

```javascript
import "@/router/permission";
```

#### 2、在 router/permission.ts 编写拦截器

该拦截器，从 UserStore 和 permissionStore 中获取菜单和角色信息，动态地将用户权限范围内可视的菜单，添加到路由（Router）内。

```javascript
  const userStore = useUserStoreHook();
  const permissionStore = usePermissionStoreHook();
	...
    // 检查用户是否已获得其权限角色
      if (userStore.roles.length === 0) {
        try {
          await userStore.getInfo();
          const { roles } = userStore;
          if (asyncRouteSettings.open) {
            const menus = userStore.menus || [];
            // 根据角色生成可访问的 Routes（可访问路由 = 常驻路由 + 有访问权限的动态路由）
            userStore.setRoles(roles);
            // 假如后端接口menu返回为空，跳到登录页，而不是404
            !menus.length && next("/login");
            // 将动态的路由塞入Router
            permissionStore.setRoutes(cloneDeep(menus));
          } else {
            // 没有开启动态路由功能，则启用默认角色
            userStore.setRoles(asyncRouteSettings.defaultRoles);
          }
          // 将'有访问权限的动态路由' 添加到 Router 中
          if (permissionStore.dynamicRoutes.length) {
            permissionStore.dynamicRoutes.forEach((route) => {
              router.addRoute(route);
            });
          }
          // 确保添加路由已完成
          // 设置 replace: true, 因此导航将不会留下历史记录
          next({ ...to, replace: true });
        } catch (err: any) {
          // 过程中发生任何错误，都直接重置 Token，并重定向到登录页面
          userStore.resetToken();
          ElMessage.error(err.message || "路由守卫过程发生错误");
          next("/login");
          NProgress.done();
        }
      }
```

#### 3、 封装 userStore 和 permissionStore 和 routeStore。

userStore 职责：请求用户基本信息接口，持久化保存用户基本信息，暴露相对应的字段。

```javascript
/** 获取用户详情 */
const getInfo = () => {
  return new Promise((resolve, reject) => {
    fetch(asyncRouteSettings.API, {
      method: "GET",
      headers: {
        Authorization: getToken() ? "Bearer " + getToken() : "",
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        const { data } = await res.json();
        console.log("🚀 ~ file: users.ts:41 ~ .then ~ data:", data);
        username.value = data?.username || "";
        userId.value = data?.userId || "";
        registerType.value = data?.registerType || "";
        // 验证返回的 roles 是否是一个非空数组
        if (data?.roleCodeSet && data?.roleCodeSet.length > 0) {
          roles.value = data.roleCodeSet || [];
        } else {
          // 塞入一个没有任何作用的默认角色，不然路由守卫逻辑会无限循环
          roles.value = asyncRouteSettings.defaultRoles;
        }
        //ToDo menus暂用
        menus.value = data.menuSet || data || [];
        //保存用户信息
        resolve(data);
      })
      .catch((error) => {
        console.log("🚀 ~ file: users.ts:56 ~ returnnewPromise ~ error:", error);
        reject(error);
      });
  });
};
```

permissionStore 职责：读取 userStore 信息，并通过 convert 方法，转化成 vue-router 需要的格式。

```javascript
export const usePermissionStore = defineStore("permission", () => {
  const routes = ref<RouteRecordRaw[]>([]);
  const dynamicRoutes = ref<RouteRecordRaw[]>([]);

  const setRoutes = (menus) => {
    let accessedRoutes;
    if (!asyncRouteSettings.open) {
      accessedRoutes = asyncRoutes;
    } else {
      const treeMenus = listToTree(cloneDeep(menus));
      accessedRoutes = convert(treeMenus);
    }
    routes.value = constantRoutes.concat(accessedRoutes);
    // 采用动态路由
    dynamicRoutes.value = routes.value;
    window.dynamicRoutes = dynamicRoutes.value;
  };

  return {routes, dynamicRoutes, setRoutes};
});
```

routeStore 职责：返回菜单或者按钮的 meta 信息。

```javascript
 const getCurrentRouteMeta = computed(() => {
    //name 指的是传入的当前路由的名字
    return function (name) {
      // 存放当前路由的按钮信息
      const buttons = routeMeta.value[name]?.meta.buttons || [];
      routeMeta.value[name].meta.buttonList = buttons
        .map((btn: {meta: string; routeAdress: string}) => {
          try {
            btn = {
              ...btn,
              ...JSON.parse(btn!.meta),
            };
          } catch (err) {}
          return btn;
        })
        .filter((btn: {meta: string; routeAdress: string}) => {
          if (btn!.routeAdress === "add")
            routeMeta.value[name].meta.addBtn = btn;
          // 服务管理，授权记录导出按钮
          else if (btn!.routeAdress === "export")
            routeMeta.value[name].meta.exportBtn = btn;
          return !["add", "export"].includes(btn!.routeAdress);
        });

      return routeMeta.value[name]?.meta || {};
    };
  });
```

#### 4、定义配置文件, config/async-route.ts, config/white-list.ts

async-route.ts 职责：用于定义动态路由的配置项，例如

- 动态路由开关
- 默认角色
- 请求 API 接口

```javascript
/** 动态路由配置 */
interface IAsyncRouteSettings {
  /**
   * 是否开启动态路由功能？
   * 1. 开启后需要后端配合，在查询用户详情接口返回当前用户可以用来判断并加载动态路由的字段（该项目用的是角色 roles 字段）
   * 2. 假如项目不需要根据不同的用户来显示不同的页面，则应该将 open: false
   */
  open: boolean;
  /** 当动态路由功能关闭时：
   * 1. 应该将所有路由都写到常驻路由里面（表明所有登陆的用户能访问的页面都是一样的）
   * 2. 系统自动给当前登录用户赋值一个没有任何作用的默认角色
   */
  defaultRoles: Array<string>;
  API: string;
}

const asyncRouteSettings: IAsyncRouteSettings = {
  open: true,
  defaultRoles: ["admin"],
  API: `${import.meta.env.VITE_BASE_API}/menu/_qryList`,
};

export default asyncRouteSettings;
```

white-list.ts 职责：白名单集合，包括免登陆的路由页面，无须权限校验的接口等。

#### 5、配置常量数据 src/constants/cacheKey.ts

**用户中心配 users,其他模块配 access**

```javascript
const SYSTEM_NAME = "users";

/** 缓存数据时用到的 Key */
class CacheKey {
  static TOKEN = `${SYSTEM_NAME}-token`;
}

export default CacheKey;
```

#### 6、配置 utils 文件夹，对于 cookie 等持久化缓存的通用方法

```javascript
import Cookies from "js-cookie";
import CacheKey from "@/constants/cacheKey";

export const getToken = () => {
  return Cookies.get(CacheKey.TOKEN);
};
export const setToken = (token: string) => {
  Cookies.set(CacheKey.TOKEN, token, { expires: 36400 });
};
export const removeToken = () => {
  Cookies.remove(CacheKey.TOKEN);
};
```

#### 7、安装进度条组件 nprogress

pnpm add nprogress

#### 8、新增 window.d.ts

增加 dynamicRoutes 与 getCurrentRouteMeta 类型，解决 window 下报错问题
