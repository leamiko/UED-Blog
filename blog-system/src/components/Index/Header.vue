<template>
  <a-layout-header class="layout_header">
    <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="toggleCollapse" />
    <div class="ued-user">
      <ul>
        <li class="user-item">
          <a>
            <a-icon type="user" />iris
          </a>
        </li>
        <li class="user-item">
          <a>注销</a>
        </li>
      </ul>
    </div>
  </a-layout-header>
</template>

<script src='../../js/Index/Header.js'></script>
