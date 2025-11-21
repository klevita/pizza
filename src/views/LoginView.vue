<template>
  <div class="sign-form">
    <a href="#" class="close close--white">
      <span class="visually-hidden">Закрыть форму авторизации</span>
    </a>
    <div class="sign-form__title">
      <h1 class="title title--small">Авторизуйтесь на сайте</h1>
    </div>
    <form @submit.prevent="login">
      <div class="sign-form__input">
        <label class="input">
          <span>E-mail</span>
          <input
            v-model="form.email"
            type="email"
            name="email"
            placeholder="example@mail.ru"
          />
        </label>
      </div>
      <div class="sign-form__input">
        <label class="input">
          <span>Пароль</span>
          <input
            v-model="form.password"
            type="password"
            name="pass"
            placeholder="***********"
          />
        </label>
      </div>
      <button type="submit" class="button">Авторизоваться</button>
    </form>
  </div>
</template>
<script setup>
import { MainService } from "@/api/main-service";
import { reactive } from "vue";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const router = useRouter();

const form = reactive({
  email: "",
  password: "",
});

function validateForm() {
  const commonEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!commonEmailRegex.test(form.email)) {
    toast("Невалидный Email", { type: "error" });
    return;
  }
  if (form.password.length < 8) {
    toast("Длина пароля должна быть как минимум 8 знаков", { type: "error" });
    return;
  }
  return true;
}

async function login() {
  const userStore = useUserStore();
  if (validateForm()) {
    const resp = await MainService.login(form);
    userStore.setToken(resp.token);
    router.push({ name: "Home" });
  }
}
</script>
<style scoped lang="scss">
@import "@assets/scss/mixins/m_center";

.sign-form {
  @include pf_center-all;

  z-index: 10;

  display: block;

  box-sizing: border-box;
  width: 455px;
  padding-top: 146px;
  padding-right: 32px;
  padding-bottom: 32px;
  padding-left: 32px;

  background: $white url("@assets/img/popup.svg") no-repeat center top;
  box-shadow: $shadow-light;

  button {
    margin: 0 auto;
    padding: 16px 14px;
  }
}

.sign-form__title {
  margin-bottom: 24px;

  text-align: center;
}

.sign-form__input {
  margin-bottom: 16px;
}
</style>
