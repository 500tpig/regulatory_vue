<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-header elevated class="bg-white text-primary q-pt-sm">
      <q-toolbar class="GNL__toolbar">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
          class="q-mr-sm"
        />
        <!-- 头部标题 -->
        <q-img
          :src="titleIcon"
          spinner-color="white"
          style="height: 24px; width: 24px"
        />
        <q-toolbar-title
          v-if="$q.screen.gt.xs"
          shrink
          class="row items-center no-wrap"
          style="padding:0 0 0 8px;"
        >
          <span class="text-primary text-weight-bolder" style="font-size:18px"
            >医保大数据分析与检测系统</span
          >
        </q-toolbar-title>
        <!-- 头部标题 -->
        <!-- 面包屑 -->
        <q-breadcrumbs
          class="text-weight-medium text-grey-9 breadcrumbs q-ml-sm q-pl-md"
        >
          <!-- <template v-slot:separator>
            <q-icon
              size="1.5em"
              name="chevron_right"
              color="accent"
              class="text-weight-medium"
            />
          </template> -->
          <q-breadcrumbs-el
            v-for="(item, index) in breadcrumbs"
            :key="index"
            :label="item.label"
            :icon="item.icon"
          />
        </q-breadcrumbs>

        <q-space />
        <!-- 头像 -->
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn dense flat no-wrap>
            <q-avatar rounded size="30px">
              <img :src="portrait" />
            </q-avatar>
            <q-icon name="arrow_drop_down" size="16px" />

            <q-menu auto-close>
              <q-list dense style="min-width:160px;">
                <q-item class="GL__menu-link-signed-in">
                  <q-item-section>
                    <span>Signed in as <strong>admin</strong></span>
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable class="GL__menu-link" @click="logout">
                  <q-item-section>Sign out</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <!-- 侧边栏 -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      content-class="bg-white q-pt-xs"
      :width="260"
      elevated
    >
      <q-scroll-area class="fit">
        <q-list>
          <!-- 首页 -->
          <q-item
            class="GNL__drawer-item q-my-sm"
            v-ripple
            v-for="link in drawers.homeDrawer"
            :key="link.text"
            clickable
            :class="{ selectItem: link.select }"
            @click="toHome()"
          >
            <q-item-section avatar>
              <q-icon
                :class="{ 'text-white': link.select }"
                :name="link.icon"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label :class="{ 'text-white': link.select }">{{
                link.text
              }}</q-item-label>
            </q-item-section>
          </q-item>
          <!-- <q-separator inset class="q-my-sm" /> -->
          <!-- 下拉 -->
          <!--  -->
          <q-expansion-item
            expand-separator
            v-model="expanded[0]"
            icon="icon-neibujijin"
            label="基金使用概况"
            :content-inset-level="0.2"
          >
            <q-item
              class="GNL__drawer-item"
              v-ripple
              v-for="(link, index) in cuttingArr(drawers.fundUseDrawer)"
              :key="index"
              clickable
              @click="toPage(drawers.fundUseDrawer, index + 1)"
              :class="{ selectItem: link.select }"
            >
              <q-item-section avatar>
                <q-icon
                  :class="{ 'text-white': link.select }"
                  :name="link.icon"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label :class="{ 'text-white': link.select }">{{
                  link.text
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <div style="height:4px;"></div>
          </q-expansion-item>
          <!-- 下拉 -->
          <!--  -->
          <!-- 参保人画像 -->
          <!--  -->
          <q-item
            class="GNL__drawer-item q-my-sm"
            v-ripple
            v-for="link in drawers.portrait"
            :key="link.text"
            clickable
            :class="{ selectItem: link.select }"
            @click="toPage(drawers.portrait, 0)"
          >
            <q-item-section avatar>
              <q-icon
                :class="{ 'text-white': link.select }"
                :name="link.icon"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label :class="{ 'text-white': link.select }">{{
                link.text
              }}</q-item-label>
            </q-item-section>
          </q-item>
          <!-- 参保人画像 -->
          <!--  -->
          <!-- 就医时间轴 -->
          <!--  -->
          <q-item
            class="GNL__drawer-item q-my-sm"
            v-ripple
            v-for="link in drawers.timeLine"
            :key="link.text"
            clickable
            :class="{ selectItem: link.select }"
            @click="toPage(drawers.timeLine, 0)"
          >
            <q-item-section avatar>
              <q-icon
                :class="{ 'text-white': link.select }"
                :name="link.icon"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label :class="{ 'text-white': link.select }">{{
                link.text
              }}</q-item-label>
            </q-item-section>
          </q-item>
          <!-- 就医时间轴 -->
          <!--  -->
          <!-- 就医轨迹 -->
          <!--  -->
          <q-item
            class="GNL__drawer-item q-my-sm"
            v-ripple
            v-for="link in drawers.knowledgeGraph"
            :key="link.text"
            clickable
            :class="{ selectItem: link.select }"
            @click="toPage(drawers.knowledgeGraph, 0)"
          >
            <q-item-section avatar>
              <q-icon
                :class="{ 'text-white': link.select }"
                :name="link.icon"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label :class="{ 'text-white': link.select }">{{
                link.text
              }}</q-item-label>
            </q-item-section>
          </q-item>
          <!--  -->
          <!-- 就医轨迹 -->
          <!-- 审核反馈 -->
          <!--  -->
          <q-expansion-item
            expand-separator
            v-model="expanded[1]"
            icon="icon-jiaohusuijichaxun"
            label="审核反馈"
            :content-inset-level="0.2"
          >
            <q-item
              class="GNL__drawer-item"
              v-ripple
              v-for="(link, index) in cuttingArr(
                drawers.auditingFeedbackDrawer
              )"
              :key="index"
              clickable
              @click="toPage(drawers.auditingFeedbackDrawer, index + 1)"
              :class="{ selectItem: link.select }"
            >
              <q-item-section avatar>
                <q-icon
                  :class="{ 'text-white': link.select }"
                  :name="link.icon"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label :class="{ 'text-white': link.select }">{{
                  link.text
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <div style="height:4px;"></div>
          </q-expansion-item>
          <!--  -->
          <!-- 审核反馈 -->
          <!-- <div class="q-mt-md">
            <div class="flex flex-center q-gutter-xs">
              <a
                class="GNL__drawer-footer-link"
                href="javascript:void(0)"
                aria-label="Privacy"
                >Privacy</a
              >
              <span> · </span>
              <a
                class="GNL__drawer-footer-link"
                href="javascript:void(0)"
                aria-label="Terms"
                >Terms</a
              >
              <span> · </span>
              <a
                class="GNL__drawer-footer-link"
                href="javascript:void(0)"
                aria-label="About"
                >About Us</a
              >
            </div>
          </div> -->
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <!-- <q-tabs
        v-model="currentTab"
        inline-label
        align="left"
        dense
        indicator-color="primary"
        active-color="white"
        class="text-grey-5 bg-primary"
      >
        <q-tab
          v-for="(item, index) in tabs"
          :key="index"
          :name="item.name"
          :icon="item.icon"
          :label="item.label"
        >
          <q-btn
            v-if="item.name !== '/home'"
            @click.stop="closeTab(item.name)"
            icon="close"
            flat
            size="8px"
            round
          />
        </q-tab>
      </q-tabs> -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { fasGlobeAmericas, fasFlask } from "@quasar/extras/fontawesome-v5";
export default {
  name: "Layout",
  data() {
    return {
      currentTab: "/home",
      leftDrawerOpen: true,
      expanded: [false, false],
      drawers: {
        homeDrawer: [
          { icon: "home", text: "首页", url: "/home", select: false }
        ],
        auditingFeedbackDrawer: [
          {
            text: "审核反馈",
            icon: "icon-jiaohusuijichaxun"
          },
          {
            text: "数据导入",
            url: "/auditingFeedback/ImportData",
            select: false,
            icon: "icon-shangchuan2"
          },
          {
            text: "审核处理",
            url: "/auditingFeedback/Audit",
            select: false,
            icon: "icon-wj-djjl"
          }
        ],
        fundUseDrawer: [
          {
            text: "基金使用概况",
            icon: "icon-neibujijin"
          },
          {
            icon: "icon-zonglanbeifen",
            text: "基金使用总览",
            url: "/foundation/overview",
            select: false
          },
          {
            icon: "icon-rili",
            text: "按时间分析",
            url: "/foundation/by_time",
            select: false
          },
          {
            icon: "icon-keshi",
            text: "按科室分析",
            select: false,
            url: "/foundation/by_department"
          },
          {
            icon: "icon-yiliaohangyedeICON-",
            text: "按疾病分析",
            select: false,
            url: "/foundation/by_disease"
          },
          {
            icon: "icon-nianlingguangfan-02",
            text: "按年龄分析",
            select: false,
            url: "/foundation/by_ageGroup"
          },
          {
            icon: "icon-tubiaozhizuomoban_canbaorenshenfenleibie",
            text: "按参保人分析",
            select: false,
            url: "/foundation/by_insured"
          }
        ],
        portrait: [
          {
            icon: "icon-huaxiangduibifenxi",
            text: "参保人画像",
            url: "/portrait",
            select: false
          }
        ],
        timeLine: [
          {
            icon: "icon-shijianzhou",
            text: "就医时间轴",
            url: "/timeLine",
            select: false
          }
        ],
        knowledgeGraph: [
          {
            icon: "icon-guanxitu",
            text: "就医轨迹",
            url: "/knowledgeGraph",
            select: false
          }
        ]
      },
      titleIcon: require("../../public/icons/HFRS-256x256.png"),
      portrait: require("assets/image/pp.png"),
      breadcrumbs: [
        {
          label: "Home",
          icon: "home"
        }
      ]
    };
  },

  mounted() {
    let currentPath = this.$route.path;
    let that = this;
    if (currentPath === "/home") {
      this.drawers.homeDrawer[0].select = true;
    }
    if (currentPath === "/portrait") {
      this.breadcrumbs.push({
        label: "参保人画像",
        icon: "icon-huaxiangduibifenxi"
      });
      this.drawers.portrait[0].select = true;
    }
    if (currentPath === "/timeLine") {
      this.breadcrumbs.push({
        label: "就医时间轴",
        icon: "icon-shijianzhou"
      });
      this.drawers.timeLine[0].select = true;
    }
    if (currentPath === "/knowledgeGraph") {
      this.breadcrumbs.push({
        label: "就医轨迹",
        icon: "icon-guanxitu"
      });
      this.drawers.knowledgeGraph[0].select = true;
    }
    if (currentPath.startsWith("/foundation")) {
      this.expanded[0] = true;
      this.drawers.fundUseDrawer.map(item => {
        if (currentPath === item.url) {
          item.select = true;
          that.breadcrumbs.push({
            label: "基金使用概况",
            icon: "icon-jiaohusuijichaxun"
          });
          that.breadcrumbs.push({
            label: item.text,
            icon: item.icon
          });
        }
      });
    }
    if (currentPath.startsWith("/auditingFeedback")) {
      this.expanded[1] = true;
      this.drawers.auditingFeedbackDrawer.map(item => {
        if (currentPath === item.url) {
          item.select = true;
          that.breadcrumbs.push({
            label: "审核反馈",
            icon: "icon-jiaohusuijichaxun"
          });
          that.breadcrumbs.push({
            label: item.text,
            icon: item.icon
          });
        }
      });
    }
  },
  watch: {
    $route(to, from) {
      this.breadcrumbs = [
        {
          label: "Home",
          icon: "home"
        }
      ];
      for (let key in this.drawers) {
        this.drawers[key].map(item => {
          item.select = false;
        });
      }
      let currentPath = this.$route.path;
      let that = this;
      if (currentPath === "/home") {
        this.drawers.homeDrawer[0].select = true;
      }
      if (currentPath === "/portrait") {
        this.breadcrumbs.push({
          label: "参保人画像",
          icon: "icon-huaxiangduibifenxi"
        });
        this.drawers.portrait[0].select = true;
      }
      if (currentPath === "/timeLine") {
        this.breadcrumbs.push({
          label: "就医时间轴",
          icon: "icon-shijianzhou"
        });
        this.drawers.timeLine[0].select = true;
      }
      if (currentPath === "/knowledgeGraph") {
        this.breadcrumbs.push({
          label: "就医轨迹",
          icon: "icon-guanxitu"
        });
        this.drawers.knowledgeGraph[0].select = true;
      }
      if (currentPath.startsWith("/foundation")) {
        this.expanded[0] = true;
        this.drawers.fundUseDrawer.map(item => {
          if (currentPath === item.url) {
            item.select = true;
            that.breadcrumbs.push({
              label: "基金使用概况",
              icon: "icon-jiaohusuijichaxun"
            });
            that.breadcrumbs.push({
              label: item.text,
              icon: item.icon
            });
          }
        });
      }
      if (currentPath.startsWith("/auditingFeedback")) {
        this.expanded[1] = true;
        this.drawers.auditingFeedbackDrawer.map(item => {
          if (currentPath === item.url) {
            item.select = true;
            that.breadcrumbs.push({
              label: "审核反馈",
              icon: "icon-jiaohusuijichaxun"
            });
            that.breadcrumbs.push({
              label: item.text,
              icon: item.icon
            });
          }
        });
      }
    }
  },
  methods: {
    toHome() {
      let currentUrl = this.$route.path;
      if (currentUrl === this.drawers.homeDrawer[0].url) return;
      this.breadcrumbs = [
        {
          label: "Home",
          icon: "home"
        }
      ];
      for (let key in this.drawers) {
        this.drawers[key].map(item => {
          item.select = false;
        });
      }
      this.drawers.homeDrawer[0].select = true;
      this.$router.push(this.drawers.homeDrawer[0].url).catch(err => {
        console.log("输出报错", err);
      });
    },
    toPage(arr, index) {
      let currentUrl = this.$route.path;
      if (currentUrl === arr[index].url) return;
      for (let key in this.drawers) {
        this.drawers[key].map(item => {
          item.select = false;
        });
      }
      arr[index].select = true;
      this.breadcrumbs = [
        {
          label: "Home",
          icon: "home"
        }
      ];
      if (arr.length > 1) {
        this.breadcrumbs.push(
          {
            label: arr[0].text,
            icon: arr[0].icon
          },
          {
            label: arr[index].text,
            icon: arr[index].icon
          }
        );
      } else {
        this.breadcrumbs.push({
          label: arr[0].text,
          icon: arr[0].icon
        });
      }
      this.$router.push(arr[index].url).catch(err => {
        console.log("输出报错", err);
      });
    },
    logout() {
      this.$store.dispatch("user/userLogout");
      this.$router.push("/login");
    },
    cuttingArr(arr) {
      return arr.slice(1, arr.length);
    }
  }
};
</script>
<style lang="scss" scoped>
.breadcrumbs {
  font-size: 15px;
}

.selectItem {
  background-clip: content-box;
  background: linear-gradient(118deg, $primary, rgba(1, 141, 167, 0.7));
  box-shadow: 0 0 10px 1px rgba(1, 141, 167, 0.7);
  color: #ffffff;
  border-radius: 4px;
  margin: 8px 15px 8px;
}
</style>
<style lang="sass">
.GNL
  &__drawer-item
    line-height: 24px
    // border-radius: 0 24px 24px 0
    // margin-right: 12px
    .q-item__section--avatar
      .q-icon
        color: #5f6368
    .q-item__label
      color: #3c4043
      letter-spacing: .01785714em
      font-size: .9rem
      font-weight: 500
      line-height: 1.25rem
  &__drawer-footer-link
    color: inherit
    text-decoration: none
    font-weight: 500
    font-size: .75rem
    &:hover
      color: #000
</style>
