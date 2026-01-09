<template>
  <UserSidebar />

  <div class="layout__content">
    <div class="layout__title">
      <h1 class="title title--big">Мои данные</h1>
    </div>

    <div v-if="userData" class="user">
      <picture>
        <source
          type="image/webp"
          srcset="
            @assets/img/users/user5@2x.webp 1x,
            @assets/img/users/user5@4x.webp 2x
          "
        />
        <img
          src="@assets/img/users/user5@2x.jpg"
          srcset="@assets/img/users/user5@4x.jpg"
          :alt="userData.name"
          width="72"
          height="72"
        />
      </picture>
      <div class="user__name">
        <span>{{ userData.name }}</span>
      </div>
      <p class="user__phone">
        Контактный телефон: <span>{{ userData.phone || "Не указан" }}</span>
      </p>
    </div>

    <div v-for="address in addresses" :key="address.id" class="layout__address">
      <div v-if="editingAddressId !== address.id" class="sheet address-form">
        <div class="address-form__header">
          <b>{{ address.name }}</b>
          <div class="address-form__edit">
            <button
              type="button"
              class="icon"
              @click="startEditAddress(address)"
            >
              <span class="visually-hidden">Изменить адрес</span>
            </button>
          </div>
        </div>
        <p>{{ formatAddressShort(address) }}</p>
        <small v-if="address.comment">{{ address.comment }}</small>
      </div>

      <form
        v-else
        class="address-form address-form--opened sheet"
        @submit.prevent="saveAddress"
      >
        <div class="address-form__header">
          <b>{{ address.name }}</b>
        </div>

        <div class="address-form__wrapper">
          <div class="address-form__input">
            <label class="input">
              <span>Название адреса*</span>
              <input
                v-model="editingAddress.name"
                type="text"
                name="addr-name"
                placeholder="Введите название адреса"
                required
              />
            </label>
          </div>
          <div class="address-form__input address-form__input--size--normal">
            <label class="input">
              <span>Улица*</span>
              <input
                v-model="editingAddress.street"
                type="text"
                name="addr-street"
                placeholder="Введите название улицы"
                required
              />
            </label>
          </div>
          <div class="address-form__input address-form__input--size--small">
            <label class="input">
              <span>Дом*</span>
              <input
                v-model="editingAddress.building"
                type="text"
                name="addr-house"
                placeholder="Введите номер дома"
                required
              />
            </label>
          </div>
          <div class="address-form__input address-form__input--size--small">
            <label class="input">
              <span>Квартира</span>
              <input
                v-model="editingAddress.flat"
                type="text"
                name="addr-apartment"
                placeholder="Введите № квартиры"
              />
            </label>
          </div>
          <div class="address-form__input">
            <label class="input">
              <span>Комментарий</span>
              <input
                v-model="editingAddress.comment"
                type="text"
                name="addr-comment"
                placeholder="Введите комментарий"
              />
            </label>
          </div>
        </div>

        <div class="address-form__buttons">
          <button
            type="button"
            class="button button--transparent"
            @click="deleteAddress(address.id)"
          >
            Удалить
          </button>
          <button type="button" class="button" @click="cancelEdit">
            Отмена
          </button>
          <button type="submit" class="button">Сохранить</button>
        </div>
      </form>
    </div>

    <div v-if="showNewAddressForm" class="layout__address">
      <form
        class="address-form address-form--opened sheet"
        @submit.prevent="addNewAddress"
      >
        <div class="address-form__header">
          <b>Новый адрес</b>
        </div>

        <div class="address-form__wrapper">
          <div class="address-form__input">
            <label class="input">
              <span>Название адреса*</span>
              <input
                v-model="newAddress.name"
                type="text"
                name="addr-name"
                placeholder="Введите название адреса"
                required
              />
            </label>
          </div>
          <div class="address-form__input address-form__input--size--normal">
            <label class="input">
              <span>Улица*</span>
              <input
                v-model="newAddress.street"
                type="text"
                name="addr-street"
                placeholder="Введите название улицы"
                required
              />
            </label>
          </div>
          <div class="address-form__input address-form__input--size--small">
            <label class="input">
              <span>Дом*</span>
              <input
                v-model="newAddress.building"
                type="text"
                name="addr-house"
                placeholder="Введите номер дома"
                required
              />
            </label>
          </div>
          <div class="address-form__input address-form__input--size--small">
            <label class="input">
              <span>Квартира</span>
              <input
                v-model="newAddress.flat"
                type="text"
                name="addr-apartment"
                placeholder="Введите № квартиры"
              />
            </label>
          </div>
          <div class="address-form__input">
            <label class="input">
              <span>Комментарий</span>
              <input
                v-model="newAddress.comment"
                type="text"
                name="addr-comment"
                placeholder="Введите комментарий"
              />
            </label>
          </div>
        </div>

        <div class="address-form__buttons">
          <button
            type="button"
            class="button button--transparent"
            @click="cancelNewAddress"
          >
            Отмена
          </button>
          <button type="submit" class="button">Сохранить</button>
        </div>
      </form>
    </div>

    <div class="layout__button">
      <button
        type="button"
        class="button button--border"
        @click="showAddNewAddress"
      >
        Добавить новый адрес
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { MainService } from "@/api/main-service";
import { toast } from "vue3-toastify";
import UserSidebar from "@/components/UserSidebar.vue";

const userData = ref(null);
const addresses = ref([]);
const editingAddressId = ref(null);
const showNewAddressForm = ref(false);

const newAddress = ref({
  name: "",
  street: "",
  building: "",
  flat: "",
  comment: "",
});

const editingAddress = ref({
  id: null,
  name: "",
  street: "",
  building: "",
  flat: "",
  comment: "",
});

onMounted(async () => {
  userData.value = await MainService.whoAmI();
  addresses.value = await MainService.getAdresses();
});

function startEditAddress(address) {
  editingAddressId.value = address.id;
  editingAddress.value = { ...address };
}

function cancelEdit() {
  editingAddressId.value = null;
  editingAddress.value = {
    id: null,
    name: "",
    street: "",
    building: "",
    flat: "",
    comment: "",
  };
}

async function saveAddress() {
  if (!editingAddress.value.street || !editingAddress.value.building) {
    toast("Заполните обязательные поля", { type: "error" });
    return;
  }

  await MainService.changeAdress(editingAddress.value);
  addresses.value = await MainService.getAdresses();
  cancelEdit();
  toast("Адрес сохранен", { type: "success" });
}

async function deleteAddress(id) {
  await MainService.deleteAdress(id);
  addresses.value = addresses.value.filter((addr) => addr.id !== id);
  toast("Адрес удален", { type: "success" });
}

function showAddNewAddress() {
  showNewAddressForm.value = true;
  newAddress.value = {
    name: "",
    street: "",
    building: "",
    flat: "",
    comment: "",
  };
}

function cancelNewAddress() {
  showNewAddressForm.value = false;
  newAddress.value = {
    name: "",
    street: "",
    building: "",
    flat: "",
    comment: "",
  };
}

async function addNewAddress() {
  if (!newAddress.value.street || !newAddress.value.building) {
    toast("Заполните обязательные поля", { type: "error" });
    return;
  }

  await MainService.addAdress({
    ...newAddress.value,
    userId: userData.value?.id,
  });
  addresses.value = await MainService.getAdresses();
  cancelNewAddress();
  toast("Адрес добавлен", { type: "success" });
}

function formatAddressShort(address) {
  return `${address.street}, д. ${address.building}${
    address.flat ? `, кв. ${address.flat}` : ""
  }`;
}
</script>
<style scoped lang="scss">
@import "@assets/scss/blocks/address-form.scss";
@import "@assets/scss/layout/layout.scss";
@import "@assets/scss/layout/sheet";
</style>
