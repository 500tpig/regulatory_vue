<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-header elevated class="bg-primary text-white" height-hint="64">
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
        <q-toolbar-title
          v-if="$q.screen.gt.xs"
          shrink
          class="row items-center no-wrap"
        >
          <span class="q-ml-sm text-white text-weight-bolder"
            >医保基金监管系统</span
          >
        </q-toolbar-title>
        <!-- 面包屑 -->
        <q-breadcrumbs
          active-color="white"
          style="font-size: 15px"
          class="q-ml-xl text-weight-medium"
        >
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
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
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
      <!-- tab栏 -->
      <q-tabs
        align="left"
        dense
        inline-label
        indicator-color="primary"
        active-color="white"
        class="text-grey-5"
      >
        <q-route-tab
          v-for="(item, index) in tabs"
          :key="index"
          :icon="item.icon"
          :to="item.to"
          :label="item.label"
          @click="switchTab(item.to)"
        >
        </q-route-tab>
      </q-tabs>
    </q-header>
    <!-- 侧边栏 -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-white"
      :width="280"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item
            class="GNL__drawer-item q-mb-xs"
            v-ripple
            v-for="link in links1"
            :key="link.text"
            clickable
            @click="toHome()"
            :class="{ 'bg-primary': links1[0].select }"
          >
            <q-item-section avatar>
              <q-icon
                :class="{ 'text-white': links1[0].select }"
                :name="link.icon"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label :class="{ 'text-white': links1[0].select }">{{
                link.text
              }}</q-item-label>
            </q-item-section>
          </q-item>
          <!-- <q-separator inset class="q-my-sm" /> -->
          <!-- 下拉 -->
          <q-expansion-item
            expand-separator
            v-model="expanded[0]"
            icon="icon-neibujijin"
            label="基金使用概况"
          >
            <q-item
              class="GNL__drawer-item"
              v-ripple
              v-for="(link, index) in links2"
              :key="index"
              clickable
              @click="toPage(links2, index)"
              :class="{ 'bg-primary': link.select }"
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
          </q-expansion-item>
          <div class="q-mt-md">
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
          </div>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- <q-header>
      <div class="Tabs q-pa-sm">
        <q-chip square removable color="primary" text-color="white" icon="cake">
          Eclair
        </q-chip>
      </div>
    </q-header> -->
    <q-page-container>
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
      tabs: [
        {
          icon: "home",
          to: "/home",
          label: "Home"
        },
        {
          icon: "icon-riqi1",
          to: "/foundation/by_time",
          label: "按时间分析"
        }
      ],
      leftDrawerOpen: false,
      expanded: [false],
      links1: [{ icon: "home", text: "首页", url: "/home", select: false }],
      links2: [
        {
          icon: "icon-riqi1",
          text: "按时间分析",
          url: "/foundation/by_time",
          select: false
        },
        {
          icon: "star_border",
          text: "Favourites",
          select: false,
          url: "/foundation/by_time1"
        },
        {
          icon: "search",
          text: "Saved searches",
          select: false,
          url: "/foundation/by_time2"
        }
      ],
      breadcrumbs: []
    };
  },
  mounted() {
    if (this.$route.path === "/home") {
      this.links1[0].select = true;
      this.breadcrumbs = [
        {
          label: "Home",
          icon: "home"
        }
      ];
    } else {
      // 路径是按基金使用
      if (this.$route.path.startsWith("/foundation")) {
        this.expanded[0] = true;
        for (let i = 0; i < this.links2.length; i++) {
          if (this.$route.path === this.links2[i].url)
            this.links2[i].select = true;
          this.breadcrumbs = [
            {
              label: "Home",
              icon: "home"
            },
            {
              label: "基金使用概况",
              icon: "icon-neibujijin"
            },
            {
              label: this.links2[i].text,
              icon: this.links2[i].icon
            }
          ];
          break;
        }
      }
    }
  },
  methods: {
    switchTab(url) {
      this.links1[0].select = false;
      for (let i = 0; i < this.links2.length; i++) {
        if (this.links2[i].url === url) this.links2[i].select = true;
        else this.links2[i].select = false;
      }
      if (url === "/home") {
        this.links1[0].select = true;
        return;
      }
    },
    logout() {
      this.$store.dispatch("user/userLogout");
      this.$router.push("/login");
    },
    toHome() {
      let currentUrl = this.$route.path;
      if (currentUrl === this.links1[0].url) return;
      this.breadcrumbs = [
        {
          label: "Home",
          icon: "home"
        }
      ];
      for (let i = 0; i < this.links2.length; i++)
        this.links2[i].select = false;
      this.links1[0].select = true;
      this.$router.push(this.links1[0].url).catch(err => {
        console.log("输出报错", err);
      });
    },
    toPage(arr, index) {
      let currentUrl = this.$route.path;
      if (currentUrl === arr[index].url) return;
      this.links1[0].select = false;
      for (let i = 0; i < arr.length; i++) arr[i].select = false;
      arr[index].select = true;
      this.breadcrumbs = [
        {
          label: "Home",
          icon: "home"
        },
        {
          label: "基金使用概况",
          icon: "icon-neibujijin"
        },
        {
          label: arr[index].text,
          icon: arr[index].icon
        }
      ];
      this.$router.push(arr[index].url).catch(err => {
        console.log("输出报错", err);
      });
    }
  }
};
</script>
<style lang="sass">
.GNL
  &__toolbar
    height: 64px
  &__toolbar-input
    width: 55%
  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px
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
