import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "Home",
      component: async () => await import("@/layouts/AppLayout.vue"),
      children: [
        {
          path: "home",
          name: "Home",
          component: async () => await import("@/views/HomeView.vue"),
        },
        {
          path: "login",
          name: "Login",
          component: async () => await import("@/views/LoginView.vue"),
          meta: { noHeader: true },
        },
        {
          path: "history",
          name: "History",
          component: async () => await import("@/views/PurchaseHistory.vue"),
        },
        {
          path: "bin",
          name: "Bin",
          component: async () => await import("@/views/UserBin.vue"),
        },
        {
          path: "profile",
          name: "Profile",
          component: async () => await import("@/views/UserProfile.vue"),
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  if (to.name === from.name) {
    return next();
  }
  if (!userStore.isAuthorized && to.name !== "Login") {
    return next({ name: "Login" });
  }

  next();
});

export default router;
