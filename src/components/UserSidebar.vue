<template>
  <div class="layout__sidebar sidebar" style="margin-top: 61px">
    <a
      class="layout__link"
      :class="{ 'layout__link--active': currentRoute === 'PurchaseHistory' }"
      style="cursor: pointer"
      @click="router.push({ name: 'History' })"
    >
      История заказов
    </a>
    <a
      class="layout__link"
      :class="{ 'layout__link--active': currentRoute === 'UserProfile' }"
      style="cursor: pointer"
      @click="router.push({ name: 'Profile' })"
    >
      Мои данные
    </a>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const currentRoute = computed(() => route.name);
</script>
<style scoped lang="scss">
@import "@assets/scss/layout/layout.scss";
</style>
