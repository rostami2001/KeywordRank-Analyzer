<template>
  <div class="header">
    <h1 class="header__title">رتبه بندی سایت ها</h1>
    <nav class="header__navbar">
      <router-link class="header__navbar-item" :to="{ name: 'dashboard' }">داشبورد</router-link>
      <router-link class="header__navbar-item" :to="{ name: 'websites' }">وب سایت ها</router-link>
      <router-link class="header__navbar-item" :to="{ name: 'keywords' }">کلمات کلیدی</router-link>
    </nav>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped lang="scss">
.header {
  position: fixed;
  top: 0;
  display: flex;
  gap: 36px;
  align-items: center;
  padding: 20px 68px;

  &__navbar {
    display: flex;
    gap: 24px;
  }

  &__navbar-item {
    text-decoration: none;
    color: #333;
    font-size: 18px;
  }
}

.router-link-active {
  color: var(--palette-primary);
}
</style>
