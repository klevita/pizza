<template>
  <div>
    <app-header v-if="!route.meta.noHeader" />
    <main class="layout">
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" :key="route.name" />
        </transition>
      </router-view>
    </main>
  </div>
</template>
<script setup lang="ts">
import AppHeader from "@/layouts/AppHeader.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>
<style lang="scss">
@import "@/assets/scss/app.scss";
@import "@assets/scss/mixins/m_clear-list";
@import "@assets/scss/blocks/cart";
body {
  justify-content: center;
  align-items: center;
}
.main__wrapper {
  padding-bottom: 30px;

  background-color: $white;
  box-shadow: $shadow-light;

  h1 {
    margin-bottom: 0;
    padding: 0 95px;

    text-align: center;

    @include b-s36-h42;
  }

  p {
    padding: 0 95px;

    text-align: center;

    font-size: 20px;
    line-height: 30px;
  }

  b {
    font-size: 1.2em;
  }
}

.main__header {
  margin-bottom: 30px;
  padding: 20px 0;

  background-color: $green-600;

  img {
    display: block;

    margin: 0 auto;
  }
}

.fade-enter-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
