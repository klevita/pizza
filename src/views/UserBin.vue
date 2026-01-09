<template>
  <form class="layout-form" @submit.prevent="handleSubmit">
    <main class="content cart">
      <div class="container">
        <div class="cart__title">
          <h1 class="title title--big">Корзина</h1>
        </div>
        <template v-if="pizzaStore.currentFullPrice > 0">
          <ul class="cart-list sheet">
            <li
              v-for="pizza in pizzaStore.pizzas"
              :key="pizza.name"
              class="cart-list__item"
            >
              <div class="product cart-list__product">
                <img
                  src="@assets/img/product.svg"
                  class="product__img"
                  width="56"
                  height="56"
                  alt="Капричоза"
                />
                <div class="product__text">
                  <h2>{{ pizza.name }}</h2>
                  <ul>
                    <li>
                      Диаметр:
                      {{ pizzaStore.getPizzaSizeByName(pizza.name).name }}
                    </li>
                    <li>
                      Тесто:
                      {{ pizzaStore.getPizzaDoughByName(pizza.name).name }}
                    </li>
                    <li>
                      Соус:
                      {{ pizzaStore.getPizzaSauceByName(pizza.name).name }}
                    </li>
                    <li>
                      Начинка:
                      {{ pizza.ingredients.map(({ name }) => name).join(", ") }}
                    </li>
                  </ul>
                </div>
              </div>

              <div class="counter cart-list__counter">
                <button
                  type="button"
                  class="counter__button counter__button--minus"
                  @click="pizzaStore.decrementPizzaByName(pizza.name)"
                >
                  <span class="visually-hidden">Меньше</span>
                </button>
                <input
                  type="text"
                  name="counter"
                  class="counter__input"
                  :value="pizza.quantity"
                />
                <button
                  type="button"
                  class="counter__button counter__button--plus counter__button--orange"
                  @click="pizza.quantity++"
                >
                  <span class="visually-hidden">Больше</span>
                </button>
              </div>

              <div class="cart-list__price">
                <b>{{ pizzaStore.calculatePizzaPrice(pizza) }} ₽</b>
              </div>

              <div class="cart-list__button">
                <button type="button" class="cart-list__edit">Изменить</button>
              </div>
            </li>
          </ul>

          <div class="cart__additional">
            <ul class="additional-list">
              <li
                v-for="miscItem in pizzaStore.misc"
                :key="miscItem.id"
                class="additional-list__item sheet"
              >
                <p class="additional-list__description">
                  <img
                    :src="miscItem.image"
                    width="39"
                    height="60"
                    alt="Coca-Cola 0,5 литра"
                  />
                  <span>{{ miscItem.name }}</span>
                </p>

                <div class="additional-list__wrapper">
                  <div class="counter additional-list__counter">
                    <button
                      type="button"
                      class="counter__button counter__button--minus"
                      @click="pizzaStore.removeMisc(miscItem)"
                    >
                      <span class="visually-hidden">Меньше</span>
                    </button>
                    <input
                      type="text"
                      name="counter"
                      class="counter__input"
                      :value="pizzaStore.countMisc(miscItem)"
                    />
                    <button
                      type="button"
                      class="counter__button counter__button--plus counter__button--orange"
                      @click="pizzaStore.pushMisc(miscItem)"
                    >
                      <span class="visually-hidden">Больше</span>
                    </button>
                  </div>

                  <div class="additional-list__price">
                    <b>× {{ miscItem.price }} ₽</b>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div class="cart__form">
            <div class="cart-form">
              <label class="cart-form__select">
                <span class="cart-form__label">Получение заказа:</span>

                <select
                  v-model="selectedDeliveryType"
                  name="delivery"
                  class="select"
                  @change="handleAddressChange"
                >
                  <option :value="PICKUP">Заберу сам</option>
                  <option :value="NEW_ADDRESS">Новый адрес</option>
                  <option
                    v-for="address in addresses"
                    :key="address.id"
                    :value="address.id"
                  >
                    {{
                      address.name || `${address.street}, ${address.building}`
                    }}
                  </option>
                </select>
              </label>

              <label class="input input--big-label">
                <span>Контактный телефон:</span>
                <input
                  v-model="phone"
                  type="text"
                  name="tel"
                  placeholder="+7 999-999-99-99"
                />
              </label>

              <div v-if="showNewAddressForm" class="cart-form__address">
                <span class="cart-form__label">Новый адрес:</span>

                <div class="cart-form__input">
                  <label class="input">
                    <span>Улица*</span>
                    <input
                      v-model="newAddress.street"
                      type="text"
                      name="street"
                    />
                  </label>
                </div>

                <div class="cart-form__input cart-form__input--small">
                  <label class="input">
                    <span>Дом*</span>
                    <input
                      v-model="newAddress.building"
                      type="text"
                      name="house"
                    />
                  </label>
                </div>

                <div class="cart-form__input cart-form__input--small">
                  <label class="input">
                    <span>Квартира</span>
                    <input
                      v-model="newAddress.flat"
                      type="text"
                      name="apartment"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div v-else class="sheet cart__empty">
          <p>В корзине нет ни одного товара :{{ "<" }}</p>
        </div>
      </div>
    </main>
    <section v-if="pizzaStore.currentFullPrice > 0" class="footer">
      <div class="footer__more">
        <a
          style="cursor: pointer"
          class="button button--border button--arrow"
          @click="router.push({ name: 'Home' })"
          >Хочу еще одну</a
        >
      </div>
      <p class="footer__text">
        Перейти к конструктору<br />чтоб собрать ещё одну пиццу
      </p>
      <div class="footer__price">
        <b>Итого: {{ pizzaStore.currentFullPrice }} ₽</b>
      </div>

      <div class="footer__submit">
        <button type="submit" class="button">Оформить заказ</button>
      </div>
    </section>
  </form>
</template>
<script setup>
import { usePizzaStore } from "@/stores/pizza";
import { useRouter } from "vue-router";
import { onMounted, ref, computed } from "vue";
import { MainService } from "@/api/main-service";
import { toast } from "vue3-toastify";

const PICKUP = "pickup";
const NEW_ADDRESS = "new";

const router = useRouter();
const pizzaStore = usePizzaStore();

const addresses = ref([]);
const userData = ref(null);

const selectedDeliveryType = ref(PICKUP);
const selectedAddressId = ref(null);
const phone = ref("");
const newAddress = ref({
  name: "",
  street: "",
  building: "",
  flat: "",
  comment: "",
});

const showNewAddressForm = computed(
  () => selectedDeliveryType.value === NEW_ADDRESS,
);

const isPickup = computed(() => selectedDeliveryType.value === PICKUP);

onMounted(async () => {
  addresses.value = await MainService.getAdresses();
  userData.value = await MainService.whoAmI();
  phone.value = userData.value?.phone || "";

  if (addresses.value.length > 0 && !selectedAddressId.value) {
    selectedAddressId.value = addresses.value[0].id;
    selectedDeliveryType.value = addresses.value[0].id;
  }
});

function validateForm() {
  if (!phone.value.trim()) {
    toast("Укажите контактный телефон", { type: "error" });
    return false;
  }

  if (selectedDeliveryType.value === NEW_ADDRESS) {
    if (!newAddress.value.street.trim()) {
      toast("Укажите улицу", { type: "error" });
      return false;
    }
    if (!newAddress.value.building.trim()) {
      toast("Укажите дом", { type: "error" });
      return false;
    }
  }

  if (
    !isPickup.value &&
    !selectedAddressId.value &&
    selectedDeliveryType.value !== NEW_ADDRESS
  ) {
    toast("Выберите адрес доставки", { type: "error" });
    return false;
  }

  return true;
}

async function handleSubmit() {
  if (!validateForm()) {
    return;
  }

  let address = null;

  if (selectedDeliveryType.value === NEW_ADDRESS) {
    address = {
      street: newAddress.value.street,
      building: newAddress.value.building,
      flat: newAddress.value.flat,
      comment: newAddress.value.comment,
    };
  } else if (!isPickup.value) {
    const selectedAddress = addresses.value.find(
      (addr) => addr.id === parseInt(selectedDeliveryType.value),
    );
    if (selectedAddress) {
      address = { id: selectedAddress.id };
    }
  }

  const orderData = {
    userId: userData.value?.id,
    phone: phone.value,
    pizzas: pizzaStore.pizzas.map((pizza) => ({
      name: pizza.name,
      sauceId: pizza.sauceId,
      doughId: pizza.doughId,
      sizeId: pizza.sizeId,
      quantity: pizza.quantity,
      ingredients: pizza.ingredients.map((ing) => ({
        ingredientId: ing.id,
        quantity: 1,
      })),
    })),
    misc: pizzaStore.selectedMisc
      .filter((item) => item.quantity > 0)
      .map((item) => ({
        miscId: item.id,
        quantity: item.quantity,
      })),
  };

  if (address) {
    orderData.address = address;
  }

  await MainService.createOrder(orderData);

  toast("Заказ успешно оформлен!", { type: "success" });

  pizzaStore.clearCart();

  router.push({ name: "Home" });
}

function handleAddressChange() {
  if (selectedDeliveryType.value === NEW_ADDRESS) {
    selectedAddressId.value = null;
  } else if (selectedDeliveryType.value !== PICKUP) {
    selectedAddressId.value = parseInt(selectedDeliveryType.value);
  } else {
    selectedAddressId.value = null;
  }
}
</script>
<style scoped lang="scss">
.layout-form {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  align-items: center;
}

.cart-list {
  @include clear-list;

  padding: 15px 0;
}

.cart-list__item {
  display: flex;
  align-items: flex-start;

  margin-bottom: 15px;
  padding-right: 15px;
  padding-bottom: 15px;
  padding-left: 15px;

  border-bottom: 1px solid rgba($green-500, 0.1);

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;

    border-bottom: none;
  }
}

.cart-list__product {
  flex-grow: 1;

  margin-right: auto;
}

.cart-list__counter {
  width: 54px;
  margin-right: auto;
  margin-left: 20px;
}

.cart-list__price {
  min-width: 100px;
  margin-right: 36px;
  margin-left: 10px;

  text-align: right;

  b {
    @include b-s16-h19;
  }
}

.cart-list__edit {
  @include l-s11-h13;

  cursor: pointer;
  transition: 0.3s;

  border: none;
  outline: none;
  background-color: transparent;

  &:hover {
    color: $green-500;
  }

  &:active {
    color: $green-600;
  }

  &:focus {
    color: $green-400;
  }
}

.cart-form {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.cart-form__select {
  display: flex;
  align-items: center;

  margin-right: auto;

  span {
    margin-right: 16px;
  }
}

.cart-form__label {
  @include b-s16-h19;

  white-space: nowrap;
}

.cart-form__address {
  display: flex;
  align-items: center;

  width: 100%;
  margin-top: 20px;
}

.cart-form__input {
  flex-grow: 1;

  margin-bottom: 20px;
  margin-left: 16px;

  &--small {
    max-width: 120px;
  }
}

.content.cart {
  padding-top: 20px;
  width: 770px;
  padding-bottom: 86px;
}
.footer {
  position: absolute;
  bottom: 0;
  width: calc(100% - 32px);
  padding: 16px;
}
</style>
