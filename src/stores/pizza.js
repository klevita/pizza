import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { MainService } from "@/api/main-service";

const makeEmptyPizza = () => ({
  name: "",
  sauceId: 0,
  doughId: 0,
  sizeId: 0,
  quantity: 0,
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
    return pizzas.value.reduce(
      (acc, pizza) => calculatePizzaPrice(pizza) + acc,
      0,
    );
  });
  const currentSauce = computed(() =>
    sauces.value.find(({ id }) => id === currentPizza.value.sauceId),
  );

  const pizzas = ref([]);

  const sauces = ref([]);
  const doughs = ref([]);
  const sizes = ref([]);
  const ingridients = ref([]);

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

    return (saucePrice + doughPrice + ingredientsPrice) * sizeMult;
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
    const [doughsResp, ingridientsResp, saucesResp, sizesResp] =
      await Promise.all([
        MainService.getDough(),
        MainService.getIngredients(),
        MainService.getSauces(),
        MainService.getSizes(),
      ]);

    doughs.value = doughsResp;
    ingridients.value = ingridientsResp;
    sauces.value = saucesResp;
    sizes.value = sizesResp.toSorted(
      ({ name: name1 }, { name: name2 }) => parseInt(name1) - parseInt(name2),
    );
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
    pizzas.value.push(currentPizza.value);
    currentPizza.value = makeEmptyPizza();
    setIds();
  }

  return {
    currentPizza,
    currentPrice,
    currentFullPrice,
    doughs,
    ingridients,
    sauces,
    sizes,
    currentSauce,
    pushPizzaToBin,
    removeIngredientById,
    addIngredient,
  };
});
