<template>
  <a-layout-sider :trigger="null" collapsible v-model="IsOpen">
    <div class="logo" />
    <a-menu theme="dark" :selectedKeys="[initKey]" mode="inline">
      <!-- {{initKey}} -->
      <a-menu-item v-for="item in menuList" :key="item.code" @click="selectItem(item.code)">
        <router-link :to="item.linkUrl">
          <a-icon :type="item.iconName" />
          <span>{{item.name}}</span>
        </router-link>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script src='../../js/Index/Menu.js'></script>
