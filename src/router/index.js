import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  },

  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "控制台", icon: "dashboard", affix: true }
      }
    ]
  },
  {
    path: "/system",
    component: Layout,
    redirect: "/system/setting",
    name: "系统管理",
    meta: { title: "系统管理", icon: "setting" },
    children: [
      {
        path: "setting",
        name: "setting",
        component: () => import("@/views/system/setting"),
        meta: { title: "系统配置", icon: "form" }
      },
      {
        path: "admin",
        name: "admin",
        component: () => import("@/views/system/admin"),
        meta: { title: "管理员管理", icon: "user-1" }
      },
      {
        path: "cate",
        name: "cate",
        component: () => import("@/views/system/cate"),
        meta: { title: "栏目管理", icon: "table" }
      },
      {
        path: "payment",
        name: "payment",
        component: () => import("@/views/system/payment"),
        meta: { title: "支付接口", icon: "money" }
      },
      {
        path: "chatroom",
        name: "chatroom",
        component: () => import("@/views/system/chatroom"),
        meta: { title: "聊天室管理", icon: "chat" }
      },
      {
        path: "log",
        name: "log",
        component: () => import("@/views/system/log"),
        meta: { title: "系统日志", icon: "bug" }
      }
    ]
  },
  {
    path: "/user",
    component: Layout,
    redirect: "/user/list",
    name: "会员管理",
    meta: { title: "会员管理", icon: "peoples" },
    children: [
      {
        path: "list",
        name: "list",
        component: () => import("@/views/user/list"),
        meta: { title: "会员列表", icon: "user" }
      },
      {
        path: "userauth",
        name: "userauth",
        component: () => import("@/views/user/userauth"),
        meta: { title: "身份认证", icon: "auth" }
      },
      {
        path: "merchant",
        name: "merchant",
        component: () => import("@/views/user/merchant"),
        meta: { title: "商户管理", icon: "shop" }
      },
      {
        path: "level",
        name: "level",
        component: () => import("@/views/user/level"),
        meta: { title: "会员等级", icon: "level" }
      },
      {
        path: "white",
        name: "white",
        component: () => import("@/views/user/white"),
        meta: { title: "手机白名单", icon: "phone" }
      },
      {
        path: "change",
        name: "change",
        component: () => import("@/views/user/change"),
        meta: { title: "账变记录", icon: "list" }
      },
      {
        path: "usercoin",
        name: "usercoin",
        component: () => import("@/views/user/usercoin"),
        meta: { title: "虚拟资产", icon: "coin" }
      },
      {
        path: "coinchange",
        name: "coinchange",
        component: () => import("@/views/user/coinchange"),
        meta: { title: "虚拟币账变", icon: "coin1" }
      }
    ]
  },
  {
    path: "/coin",
    component: Layout,
    redirect: "/coin/list",
    name: " 虚拟币管理",
    meta: { title: "虚拟币管理", icon: "coin1" },
    children: [
      {
        path: "list",
        name: "list",
        component: () => import("@/views/coin/list"),
        meta: { title: "币种管理", icon: "coin" }
      },
      /*{
        path: 'recharge',
        name: 'recharge',
        component: () => import('@/views/finance/recharge'),
        meta: { title: '充值记录', icon: 'recharge1' }
      },*/
      {
        path: "contract",
        name: "contract",
        component: () => import("@/views/coin/contract"),
        meta: { title: "合约管理", icon: "list" }
      },
      {
        path: "grid",
        name: "grid",
        component: () => import("@/views/coin/grid"),
        meta: { title: "网格策略", icon: "grid" }
      },
      {
        path: "licai",
        name: "licai",
        component: () => import("@/views/coin/licai"),
        meta: { title: "理财产品", icon: "product" }
      },
      {
        path: "shop",
        name: "shop",
        component: () => import("@/views/coin/shop"),
        meta: { title: "虚拟商户", icon: "shop" }
      }
    ]
  },
  {
    path: "/finance",
    component: Layout,
    redirect: "/finance/wallet",
    name: "账务管理",
    meta: { title: "账务管理", icon: "recharge" },
    children: [
      {
        path: "wallet",
        name: "wallet",
        component: () => import("@/views/finance/wallet"),
        meta: { title: "钱包地址", icon: "wallet" }
      },
      {
        path: "recharge",
        name: "recharge",
        component: () => import("@/views/finance/recharge"),
        meta: { title: "充值记录", icon: "recharge1" }
      },
      {
        path: "out",
        name: "out",
        component: () => import("@/views/finance/out"),
        meta: { title: "提币记录", icon: "out1" }
      },
      {
        path: "bank",
        name: "bank",
        component: () => import("@/views/money/bank"),
        meta: { title: "银行管理", icon: "bank" }
      },
      {
        path: "cny_recharge",
        name: "recharge",
        component: () => import("@/views/money/recharge"),
        meta: { title: "人民币充值", icon: "recharge" }
      },
      {
        path: "money_out",
        name: "out",
        component: () => import("@/views/money/out"),
        meta: { title: "人民币提现", icon: "money_out" }
      }
    ]
  },
  {
    path: "/miner",
    component: Layout,
    redirect: "/miner/list",
    name: "矿机管理",
    meta: { title: "矿机管理", icon: "miner" },
    children: [
      {
        path: "list",
        name: "list",
        component: () => import("@/views/miner/list"),
        meta: { title: "矿机列表", icon: "miner_list" }
      },
      {
        path: "order",
        name: "order",
        component: () => import("@/views/miner/order"),
        meta: { title: "矿机订单", icon: "list" }
      }
    ]
  },
  {
    path: "/trade",
    component: Layout,
    redirect: "/trade/paidian",
    name: " 交易管理",
    meta: { title: "交易管理", icon: "trade" },
    children: [
      /* {
        path: 'contract_order',
        name: 'contract_order',
        component: () => import('@/views/trade/contract_order'),
        meta: { title: '合约订单', icon: 'list' }
      },
      {
        path: 'paidian',
        name: 'paidian',
        component: () => import('@/views/trade/paidian'),
        meta: { title: '排点订单', icon: 'paidian' }
      },
      {
        path: 'coin',
        name: 'coin_trade',
        component: () => import('@/views/trade/coin'),
        meta: { title: '币种交易', icon: 'trade1' }
      }, */
      {
        path: "grid_order",
        name: "grid_order",
        component: () => import("@/views/trade/grid_order"),
        meta: { title: "网格交易", icon: "trade1" }
      },
      {
        path: "grid_contract",
        name: "grid_contract",
        component: () => import("@/views/trade/grid_contract"),
        meta: { title: "合约网格", icon: "trade1" }
      },
      {
        path: "grid_infinite",
        name: "grid_infinite",
        component: () => import("@/views/trade/grid_infinite"),
        meta: { title: "无限网格", icon: "trade1" }
      },
      {
        path: "ai_contract",
        name: "ai_contract",
        component: () => import("@/views/trade/ai_contract"),
        meta: { title: "AI智能合约", icon: "trade1" }
      },
      {
        path: "transfer",
        name: "transfer",
        component: () => import("@/views/trade/transfer"),
        meta: { title: "转币记录", icon: "transfer" }
      },
      {
        path: "otcorder",
        name: "otcorder",
        component: () => import("@/views/trade/otcorder"),
        meta: { title: "OTC交易", icon: "trade2" }
      },
      {
        path: "otcsuborder",
        name: "otcsuborder",
        component: () => import("@/views/trade/otcsuborder"),
        meta: { title: "OTC订单", icon: "order" }
      },
      {
        path: "coin_trade",
        name: "coin_trade",
        component: () => import("@/views/trade/coin_trade"),
        meta: { title: "现货订单", icon: "trade2" }
      },
      {
        path: "borrow",
        name: "borrow",
        component: () => import("@/views/trade/borrow"),
        meta: { title: "借贷订单", icon: "trade1" }
      } /*,
      {
        path: 'exchange',
        name: 'exchange',
        component: () => import('@/views/trade/exchange'),
        meta: { title: '兑换记录', icon: 'exchange' }
      }*/
    ]
  },
  /*{
    path: '/money',
    component: Layout,
    redirect: '/money/bank',
    name: '财务管理',
    meta: { title: '财务管理', icon: 'caiwu' },
    children: [
      {
        path: 'bank',
        name: 'bank',
        component: () => import('@/views/money/bank'),
        meta: { title: '银行管理', icon: 'bank' }
      },
      {
        path: 'recharge',
        name: 'recharge',
        component: () => import('@/views/money/recharge'),
        meta: { title: '充值记录', icon: 'recharge' }
      },
      {
        path: 'out',
        name: 'out',
        component: () => import('@/views/money/out'),
        meta: { title: '提现申请', icon: 'money_out' }
      }
    ]
  },*/
  {
    path: "/profit",
    component: Layout,
    redirect: "/report/profit",
    name: "数据报表",
    meta: { title: "数据报表", icon: "report2" },
    children: [
      {
        path: "profit",
        name: "profit",
        component: () => import("@/views/report/profit"),
        meta: { title: "统计报表", icon: "report4" }
      },
      {
        path: "team",
        name: "team",
        component: () => import("@/views/report/team"),
        meta: { title: "团队报表", icon: "team" }
      }
    ]
  },
  {
    path: "/market",
    component: Layout,
    redirect: "/market/notice",
    name: "market",
    meta: { title: "营销管理", icon: "market" },
    children: [
      {
        path: "notice",
        name: "notice",
        component: () => import("@/views/market/notice"),
        meta: { title: "系统公告", icon: "notice" }
      },
      {
        path: "lunbo",
        name: "lunbo",
        component: () => import("@/views/market/lunbo"),
        meta: { title: "图片广告", icon: "ad" }
      },
      {
        path: "pupop",
        name: "pupop",
        component: () => import("@/views/market/pupop"),
        meta: { title: "弹窗广告", icon: "ad" }
      },
      {
        path: "activity",
        name: "activity",
        component: () => import("@/views/market/activity"),
        meta: { title: "红包活动", icon: "redpacket" }
      },
      {
        path: "choujiang",
        name: "choujiang",
        component: () => import("@/views/market/choujiang"),
        meta: { title: "抽奖活动", icon: "redpacket" }
      },
      {
        path: "zhekou",
        name: "zhekou",
        component: () => import("@/views/market/zhekou"),
        meta: { title: "折扣活动", icon: "redpacket" }
      },
      {
        path: "article",
        name: "myarticle",
        component: () => import("@/views/market/article"),
        meta: { title: "文章管理", icon: "article" }
      },
      {
        path: "editArticle",
        name: "editArticle",
        hidden: true,
        component: () => import("@/views/market/editArticle"),
        meta: { title: "编辑文章", icon: "article" }
      },
      {
        path: "link",
        name: "flink",
        component: () => import("@/views/market/link"),
        meta: { title: "友情链接", icon: "links" }
      },
      {
        path: "app",
        name: "app",
        component: () => import("@/views/market/app"),
        meta: { title: "App管理", icon: "app" }
      }
    ]
  },
  /*{
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },*/
  {
    path: "/safe",
    component: Layout,
    redirect: "/safe/info",
    name: "安全设置",
    meta: { title: "安全设置", icon: "anquan" },
    children: [
      {
        path: "info",
        name: "info",
        component: () => import("@/views/safe/info"),
        meta: { title: "修改资料", icon: "documentation" }
      },
      {
        path: "password",
        name: "password",
        component: () => import("@/views/safe/password"),
        meta: { title: "修改密码", icon: "password" }
      }
    ]
  },

  {
    path: "/strategy",
    component: Layout,
    redirect: "/strategy/config",
    name: "策略管理",
    meta: { title: "策略管理", icon: "component" },
    children: [
      {
        path: "config",
        name: "StrategyConfig",
        component: () => import("@/views/strategy/config"),
        meta: { title: "策略配置", icon: "list" }
      },
      {
        path: "order",
        name: "StrategyOrder",
        component: () => import("@/views/strategy/order"),
        meta: { title: "策略订单", icon: "list" }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true }
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
