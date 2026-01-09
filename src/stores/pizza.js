import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { MainService } from "@/api/main-service";
import { toast } from "vue3-toastify";

const makeEmptyPizza = () => ({
  name: "",
  sauceId: 0,
  doughId: 0,
  sizeId: 0,
  quantity: 1,
  orderId: 0,
  ingredients: [
    // {
    //   id: 0,
    //   pizzaId: 0,
    //   ingredientId: 0,
    //   quantity: 0,
    // },
  ],
});

export const usePizzaStore = defineStore("pizza-store", () => {
  const currentPizza = ref(makeEmptyPizza());
  const currentPrice = computed(() => calculatePizzaPrice(currentPizza.value));
  const currentFullPrice = computed(() => {
    const dopsPrice = selectedMisc.value.reduce(
      (acc, { price, quantity }) => acc + price * quantity,
      0,
    );
    const pizzasPrice = pizzas.value.reduce(
      (acc, pizza) => calculatePizzaPrice(pizza) + acc,
      0,
    );
    return pizzasPrice + dopsPrice;
  });
  const currentSauce = computed(() =>
    sauces.value.find(({ id }) => id === currentPizza.value.sauceId),
  );

  const pizzas = ref([]);
  const selectedMisc = ref([]);

  const sauces = ref([]);
  const doughs = ref([]);
  const sizes = ref([]);
  const ingridients = ref([]);
  const misc = ref([]);

  fetchPizzaData();

  function calculatePizzaPrice(pizza) {
    const saucePrice =
      sauces.value.find(({ id }) => id === pizza.sauceId)?.price || 0;
    const doughPrice =
      doughs.value.find(({ id }) => id === pizza.doughId)?.price || 0;
    const sizeMult =
      sizes.value.find(({ id }) => id === pizza.sizeId)?.multiplier || 0;
    const ingredientsPrice = pizza.ingredients.reduce(
      (acc, ingredient) => acc + ingredient.price,
      0,
    );

    return (
      (saucePrice + doughPrice + ingredientsPrice) * sizeMult * pizza.quantity
    );
  }

  function removeIngredientById(_id) {
    const index = currentPizza.value.ingredients.findIndex(
      ({ id }) => id === _id,
    );
    if (index >= 0) {
      currentPizza.value.ingredients.splice(index, 1);
    }
  }

  async function fetchPizzaData() {
    const [doughsResp, ingridientsResp, saucesResp, sizesResp, miscResp] =
      await Promise.all([
        MainService.getDough(),
        MainService.getIngredients(),
        MainService.getSauces(),
        MainService.getSizes(),
        MainService.getMisc(),
      ]);

    doughs.value = doughsResp;
    ingridients.value = ingridientsResp;
    sauces.value = saucesResp;
    sizes.value = sizesResp.toSorted(
      ({ name: name1 }, { name: name2 }) => parseInt(name1) - parseInt(name2),
    );
    misc.value = miscResp.map((item) => ({ ...item, quantity: 0 }));
    setIds();
  }

  function setIds() {
    if (!currentPizza.value.doughId) {
      currentPizza.value.doughId = doughs.value.at(0)?.id || 0;
    }
    if (!currentPizza.value.sauceId) {
      currentPizza.value.sauceId = sauces.value.at(0)?.id || 0;
    }
    if (!currentPizza.value.sizeId) {
      currentPizza.value.sizeId = sizes.value.at(0)?.id || 0;
    }
  }

  function addIngredient(ingredient) {
    currentPizza.value.ingredients.push(ingredient);
  }

  function pushPizzaToBin() {
    if (pizzas.value.find(({ name }) => name === currentPizza.value.name)) {
      toast("Такая название пиццы уже используется", { type: "error" });
      return;
    }
    pizzas.value.push(currentPizza.value);
    currentPizza.value = makeEmptyPizza();
    setIds();
  }

  function removePizzaFromBinByName(name_) {
    const pizzaIndex = pizzas.value.findIndex(({ name }) => name === name_);
    pizzas.value.splice(pizzaIndex, 1);
  }

  function getPizzaSauceByName(name_) {
    const sauceId = pizzas.value.find(({ name }) => name === name_)?.sauceId;
    if (sauceId) {
      return sauces.value.find(({ id }) => id === sauceId);
    }
  }
  function getPizzaDoughByName(name_) {
    const doughId = pizzas.value.find(({ name }) => name === name_)?.doughId;
    if (doughId) {
      return doughs.value.find(({ id }) => id === doughId);
    }
  }
  function getPizzaSizeByName(name_) {
    const sizeId = pizzas.value.find(({ name }) => name === name_)?.sizeId;
    if (sizeId) {
      return sizes.value.find(({ id }) => id === sizeId);
    }
  }

  function decrementPizzaByName(name_) {
    const pizza = pizzas.value.find(({ name }) => name === name_);
    if (pizza.quantity === 0) {
      removePizzaFromBinByName(pizza.name);
      return;
    }
    pizza.quantity -= 1;
  }

  function pushMisc(miscItem_) {
    const foundMiscItem = selectedMisc.value.find(
      (miscItem) => miscItem.id === miscItem_.id,
    );
    if (foundMiscItem) {
      foundMiscItem.quantity += 1;
      return;
    }
    miscItem_.quantity += 1;
    selectedMisc.value.push(miscItem_);
  }
  function removeMisc(miscItem_) {
    const foundMiscItem = selectedMisc.value.find(
      (miscItem) => miscItem.id === miscItem_.id,
    );
    if (foundMiscItem && foundMiscItem.quantity > 0) {
      foundMiscItem.quantity -= 1;
    }
  }
  function countMisc(miscItem_) {
    const foundMiscItem = selectedMisc.value.find(
      (miscItem) => miscItem.id === miscItem_.id,
    );
    console.log(foundMiscItem);
    if (foundMiscItem) {
      return foundMiscItem.quantity;
    }
    return 0;
  }

  function clearCart() {
    pizzas.value = [];
    selectedMisc.value = [];
  }

  return {
    currentPizza,
    currentPrice,
    currentFullPrice,
    doughs,
    misc,
    ingridients,
    sauces,
    sizes,
    currentSauce,
    pizzas,
    selectedMisc,
    pushMisc,
    removeMisc,
    countMisc,
    calculatePizzaPrice,
    decrementPizzaByName,
    pushPizzaToBin,
    removeIngredientById,
    addIngredient,
    getPizzaSauceByName,
    getPizzaDoughByName,
    getPizzaSizeByName,
    clearCart,
  };
});
