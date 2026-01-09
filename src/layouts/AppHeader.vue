<template>
  <header class="header">
    <div class="header__logo">
      <a class="logo" @click="router.push({ name: 'Home' })">
        <img :src="logo" alt="V!U!E! Pizza logo" width="90" height="40" />
      </a>
    </div>
    <div class="header__cart">
      <a @click="router.push({ name: 'Bin' })"
        >{{ pizzaStore.currentFullPrice }} ₽</a
      >
    </div>
    <div class="header__user">
      <a @click="router.push({ name: 'Profile' })">
        <span v-if="userData">{{ userData.name }}</span>
        <span v-else>Загрузка...</span>
      </a>
    </div>
  </header>
</template>
<script setup>
import logo from "@assets/img/logo.svg";
import { usePizzaStore } from "@/stores/pizza";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { MainService } from "@/api/main-service";

const pizzaStore = usePizzaStore();
const router = useRouter();
const userData = ref(null);

onMounted(async () => {
  userData.value = await MainService.whoAmI();
});
</script>
<style scoped lang="scss">
@import "@assets/scss/ds-system/ds-typography";

.header {
  position: relative;
  z-index: 2;

  display: flex;

  padding: 0 2.12%;

  background-color: $green-500;
  box-shadow: $shadow-light;
}

.header__logo {
  padding-top: 10px;
  padding-bottom: 10px;
}

.header__cart {
  margin-right: 10px;
  margin-left: auto;

  a {
    @include b-s16-h19;

    display: block;

    padding-top: 21px;
    padding-right: 15px;
    padding-bottom: 21px;
    padding-left: 58px;

    transition: 0.3s;

    color: $white;
    background-color: $green-500;
    background-image: url("@assets/img/cart.svg");
    background-repeat: no-repeat;
    background-position: 20px center;
    background-size: 29px 27px;

    &:hover:not(:active) {
      background-color: $green-400;
    }

    &:active {
      background-color: $green-600;
    }

    &:focus {
      opacity: 0.5;
    }
  }
}

.header__user {
  display: flex;
  align-items: center;

  a {
    display: block;

    padding-top: 14px;
    padding-right: 20px;
    padding-bottom: 14px;
    padding-left: 20px;

    transition: 0.3s;

    background-color: $green-500;

    &:hover:not(:active) {
      background-color: $green-400;
    }

    &:active {
      background-color: $green-600;
    }

    &:focus {
      opacity: 0.5;
    }
  }

  img {
    display: inline-block;

    width: 32px;
    height: 32px;
    margin-right: 8px;

    vertical-align: middle;

    border-radius: 50%;
  }

  span {
    @include r-s14-h16;

    display: inline-block;

    vertical-align: middle;

    color: $white;
  }
}

.header__logout {
  &::before {
    display: inline-block;

    width: 32px;
    height: 32px;
    margin-right: 8px;

    content: "";
    vertical-align: middle;

    background: url(@assets/img/login.svg) no-repeat center;
    background-size: auto 50%;
  }
}
</style>
