<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-header elevated class="bg-white text-grey-8" height-hint="64">
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

        <q-toolbar-title
          v-if="$q.screen.gt.xs"
          shrink
          class="row items-center no-wrap"
        >
          <span class="q-ml-sm text-primary">医保基金监管系统</span>
        </q-toolbar-title>

        <q-space />

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
        <q-list padding class="text-grey-8">
          <q-item
            class="GNL__drawer-item"
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
          <q-separator inset class="q-my-sm" />
          <!-- 下拉 -->
          <q-expansion-item
            expand-separator
            icon="icon-neibujijin"
            label="基金使用概况"
          >
            <q-item
              class="GNL__drawer-item"
              v-ripple
              v-for="(link, index) in links2"
              :key="index"
              clickable
              @click="toPage(index)"
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
          <!-- <q-separator inset class="q-my-sm" /> -->

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
      leftDrawerOpen: false,
      expanded: ["Satisfied customers (with avatar)", "Good food (with icon)"],
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
          url: "/foundation/by_time"
        },
        {
          icon: "search",
          text: "Saved searches",
          select: false,
          url: "/foundation/by_time"
        }
      ]
    };
  },
  mounted() {
    this.links1[0].select = true;
  },
  methods: {
    logout() {
      this.$store.dispatch("user/userLogout");
      this.$router.push("/login");
    },
    toHome() {
      for (let i = 0; i < this.links2.length; i++)
        this.links2[i].select = false;
      this.links1[0].select = true;
      this.$router.push(this.links1[0].url).catch(err => {
        console.log("输出报错", err);
      });
    },
    toPage(index) {
      this.links1[0].select = false;
      for (let i = 0; i < this.links2.length; i++)
        this.links2[i].select = false;
      this.links2[index].select = true;
      this.$router.push(this.links2[index].url).catch(err => {
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
