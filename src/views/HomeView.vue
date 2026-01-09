<template>
  <main class="content">
    <form action="#" method="post">
      <div class="content__wrapper">
        <h1 class="title title--big">Конструктор пиццы</h1>

        <div class="content__dough">
          <div class="sheet">
            <h2 class="title title--small sheet__title">Выберите тесто</h2>

            <div class="sheet__content dough">
              <label
                v-for="{ id, name, description, image } in pizzaStore.doughs"
                :key="id"
                class="dough__input"
              >
                <div
                  class="pizza-dough-border-image"
                  :style="{
                    backgroundImage: `url(${image})`,
                  }"
                ></div>
                <input
                  v-model="pizzaStore.currentPizza.doughId"
                  type="radio"
                  name="dought"
                  :value="id"
                  class="visually-hidden"
                />
                <b>{{ name }}</b>
                <span>{{ description }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="content__diameter">
          <div class="sheet">
            <h2 class="title title--small sheet__title">Выберите размер</h2>

            <div class="sheet__content diameter">
              <label
                v-for="{ id, name, image } in pizzaStore.sizes"
                :key="id"
                class="diameter__input"
              >
                <div
                  class="pizza-dough-border-image"
                  :style="{
                    backgroundImage: `url(${image})`,
                    backgroundSize: `${(parseInt(name) / 45) * 100}% ${
                      (parseInt(name) / 45) * 100
                    }%`,
                  }"
                ></div>
                <input
                  v-model="pizzaStore.currentPizza.sizeId"
                  type="radio"
                  name="diameter"
                  :value="id"
                  class="visually-hidden"
                />
                <span>{{ name }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="content__ingredients">
          <div class="sheet">
            <h2 class="title title--small sheet__title">
              Выберите ингредиенты
            </h2>

            <div class="sheet__content ingredients">
              <div class="ingredients__sauce">
                <p>Основной соус:</p>

                <label
                  v-for="{ id, name } in pizzaStore.sauces"
                  :key="id"
                  class="radio ingredients__input"
                >
                  <input
                    v-model="pizzaStore.currentPizza.sauceId"
                    type="radio"
                    name="sauce"
                    :value="id"
                  />
                  <span>{{ name }}</span>
                </label>
              </div>

              <div class="ingredients__filling">
                <p>Начинка:</p>

                <ul class="ingredients__list">
                  <li
                    v-for="ingredient in pizzaStore.ingridients"
                    :key="ingredient.id"
                    class="ingredients__item"
                  >
                    <div
                      class="pizza-ingredient-image"
                      :style="{
                        backgroundImage: `url(${ingredient.image})`,
                      }"
                    ></div>
                    <span class="filling">{{ ingredient.name }}</span>

                    <div class="counter counter--orange ingredients__counter">
                      <button
                        type="button"
                        class="counter__button counter__button--minus"
                        :disabled="countIngredientsByPizza(ingredient.id) === 0"
                        @click="pizzaStore.removeIngredientById(ingredient.id)"
                      >
                        <span class="visually-hidden">Меньше</span>
                      </button>
                      <input
                        type="text"
                        name="counter"
                        class="counter__input"
                        :value="countIngredientsByPizza(ingredient.id)"
                      />
                      <button
                        type="button"
                        class="counter__button counter__button--plus"
                        :disabled="countIngredientsByPizza(ingredient.id) > 2"
                        @click="pizzaStore.addIngredient(ingredient)"
                      >
                        <span class="visually-hidden">Больше</span>
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="content__pizza">
          <label class="input">
            <span class="visually-hidden">Название пиццы</span>
            <input
              v-model="pizzaStore.currentPizza.name"
              type="text"
              name="pizza_name"
              placeholder="Введите название пиццы"
            />
          </label>
          <div class="content__constructor">
            <div
              class="pizza"
              :class="foundationClassesMap[pizzaStore.currentSauce?.name]"
            >
              <div class="pizza__wrapper">
                <TransitionGroup name="appear">
                  <div
                    v-for="ingredientClass in ingredientsClasses"
                    :key="ingredientClass"
                    class="pizza__filling"
                    :class="ingredientClass"
                  ></div>
                </TransitionGroup>
              </div>
            </div>
          </div>

          <div class="content__result">
            <p>Итого: {{ pizzaStore.currentPrice }} ₽</p>
            <button
              type="button"
              class="button"
              :disabled="!pizzaStore.currentPizza.name"
              @click="pizzaStore.pushPizzaToBin()"
            >
              Готовьте!
            </button>
          </div>
        </div>
      </div>
    </form>
  </main>
</template>
<script setup>
import { usePizzaStore } from "@/stores/pizza";
import { computed } from "vue";

const pizzaStore = usePizzaStore();

const foundationClassesMap = {
  Томатный: "pizza--foundation--big-tomato",
  Сливочный: "pizza--foundation--big-creamy",
};

const ingredientsClasses = computed(() => {
  const ingredientNameToClassMap = {
    Ананас: "pizza__filling--ananas",
    Бекон: "pizza__filling--bacon",
    Чеддер: "pizza__filling--cheddar",
    Чили: "pizza__filling--chile",
    Ветчина: "pizza__filling--ham",
    Халапеньо: "pizza__filling--jalapeno",
    Моцарелла: "pizza__filling--mozzarella",
    Грибы: "pizza__filling--mushrooms",
    Маслины: "pizza__filling--olives",
    Лук: "pizza__filling--onion",
    Пармезан: "pizza__filling--parmesan",
    Салями: "pizza__filling--salami",
    Лосось: "pizza__filling--salmon",
    Томаты: "pizza__filling--tomatoes",
    "Блю чиз": "pizza__filling--blue_cheese",
  };
  const ingredientsClassesMap = {
    "pizza__filling--ananas": 0,
    "pizza__filling--bacon": 0,
    "pizza__filling--blue_cheese": 0,
    "pizza__filling--cheddar": 0,
    "pizza__filling--chile": 0,
    "pizza__filling--ham": 0,
    "pizza__filling--jalapeno": 0,
    "pizza__filling--mozzarella": 0,
    "pizza__filling--mushrooms": 0,
    "pizza__filling--olives": 0,
    "pizza__filling--onion": 0,
    "pizza__filling--parmesan": 0,
    "pizza__filling--salami": 0,
    "pizza__filling--salmon": 0,
    "pizza__filling--tomatoes": 0,
  };
  const countAddonsMap = {
    1: "",
    2: "pizza__filling--second",
    3: "pizza__filling--third",
  };

  pizzaStore.currentPizza.ingredients.forEach((ingredient) => {
    const ingredientClass = ingredientNameToClassMap[ingredient.name];
    ingredientsClassesMap[ingredientClass] += 1;
  });

  const filteredIngredientsClasses = Object.entries(
    ingredientsClassesMap,
  ).filter((x) => x[1] !== 0);

  return filteredIngredientsClasses.map(
    ([ingredientsClass, ingredientsCount]) => [
      ingredientsClass,
      countAddonsMap[ingredientsCount],
    ],
  );
});

function countIngredientsByPizza(id) {
  return pizzaStore.currentPizza.ingredients.reduce(
    (acc, curr) => (curr.id === id ? acc + 1 : acc),
    0,
  );
}
</script>
<style scoped lang="scss">
@import "@assets/scss/ds-system/ds-typography";
@import "@assets/scss/blocks/ingredients";
@import "@assets/scss/blocks/diameter";
@import "@assets/scss/blocks/pizza";
@import "@assets/scss/layout/sheet";

.content {
  padding-top: 20px;
}

.content__wrapper {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;

  width: 920px;
  margin: 0 auto;
  padding-right: 2.12%;
  padding-bottom: 30px;
  padding-left: 2.12%;
}

.content__dough {
  width: 527px;
  margin-top: 15px;
  margin-right: auto;
  margin-bottom: 15px;
}

.content__diameter {
  width: 373px;
  margin-top: 15px;
  margin-bottom: 15px;
}

.content__ingredients {
  width: 527px;
  margin-top: 15px;
  margin-right: auto;
  margin-bottom: 15px;
}

.content__pizza {
  width: 373px;
  margin-top: 15px;
  margin-bottom: 15px;
}

.content__constructor {
  width: 315px;
  margin-top: 25px;
  margin-right: auto;
  margin-left: auto;
}

.content__result {
  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 25px;

  p {
    @include b-s24-h28;

    margin: 0;
  }

  button {
    margin-left: 12px;
    padding: 16px 45px;
  }
}

.pizza-ingredient-image {
  position: absolute;
  top: -8px;
  height: 32px;
  width: 32px;
  z-index: 1;
  background-size: 80%;
  background-repeat: no-repeat;
  background-position: center;
}
.pizza-dough-border-image {
  border-radius: 100px;
  width: 36px;
  height: 36px;
  position: absolute;
  left: 0;
  top: -2px;
  z-index: 1;
  background-position: center;
  background-repeat: no-repeat;
}
.pizza-filling-image {
  border-radius: 100px;
  width: 36px;
  height: 36px;
  position: absolute;
  left: 0;
  top: -2px;
}

.appear-enter-active {
  transition: all 0.5s ease;
}

.appear-enter-from {
  transform: scale(1.2);
}
</style>
