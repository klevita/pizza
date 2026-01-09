import { apiClient } from "@/api/http-client";

export class MainService {
  //{
  //   "id": 0,
  //   "name": "string",
  //   "userId": "string",
  //   "street": "string",
  //   "building": "string",
  //   "flat": "string",
  //   "comment": "string"
  // }
  static changeAdress(newAdress) {
    return apiClient.put(`/addresses/${newAdress.id}`);
  }
  static deleteAdress(id) {
    return apiClient.post(`/addresses/${id}`);
  }
  static addAdress(newAdress) {
    return apiClient.post(`/addresses`, newAdress);
  }
  static getAdresses() {
    return apiClient.get(`/addresses`);
  }
  //[
  //   {
  //     "id": 0,
  //     "name": "string",
  //     "image": "string",
  //     "description": "string",
  //     "price": 0
  //   }
  // ]
  static getDough() {
    return apiClient.get(`/dough`);
  }
  //[
  //   {
  //     "id": 0,
  //     "name": "string",
  //     "image": "string",
  //     "price": 0
  //   }
  // ]
  static getIngredients() {
    return apiClient.get(`/ingredients`);
  }
  //{
  //   "email": "user@example.com",
  //   "password": "string"
  // }
  //{
  //   "token": "string"
  // }
  static login(data) {
    return apiClient.post(`/login`, data);
  }
  static logout() {
    return apiClient.delete(`/logout`);
  }
  //{
  //   "id": "string",
  //   "name": "string",
  //   "email": "string",
  //   "avatar": "string",
  //   "phone": "string"
  // }
  static whoAmI() {
    return apiClient.get(`/whoAmI`);
  }
  //[
  //   {
  //     "id": 0,
  //     "name": "string",
  //     "image": "string",
  //     "price": 0
  //   }
  // ]
  static getMisc() {
    return apiClient.get(`/misc`);
  }
  static deleteOrder(id) {
    return apiClient.delete(`/orders/${id}`);
  }
  static createOrder(newOrder) {
    return apiClient.post(`/orders`, newOrder);
  }
  //[
  //   {
  //     "id": 0,
  //     "userId": "string",
  //     "addressId": 0,
  //     "orderPizzas": [
  //       {
  //         "id": 0,
  //         "name": "string",
  //         "sauceId": 0,
  //         "doughId": 0,
  //         "sizeId": 0,
  //         "quantity": 0,
  //         "orderId": 0,
  //         "ingredients": [
  //           {
  //             "id": 0,
  //             "pizzaId": 0,
  //             "ingredientId": 0,
  //             "quantity": 0
  //           }
  //         ]
  //       }
  //     ],
  //     "orderMisc": [
  //       {
  //         "id": 0,
  //         "orderId": 0,
  //         "miscId": 0,
  //         "quantity": 0
  //       }
  //     ],
  //     "orderAddress": {
  //       "id": 0,
  //       "name": "string",
  //       "street": "string",
  //       "building": "string",
  //       "flat": "string",
  //       "comment": "string",
  //       "userId": "string"
  //     }
  //   }
  // ]
  static getOrders() {
    return apiClient.get(`/orders`);
  }
  //[
  //   {
  //     "id": 0,
  //     "name": "string",
  //     "price": 0
  //   }
  // ]
  static getSauces() {
    return apiClient.get(`/sauces`);
  }
  //[
  //   {
  //     "id": 0,
  //     "name": "string",
  //     "image": "string",
  //     "multiplier": 0
  //   }
  // ]
  static getSizes() {
    return apiClient.get(`/sizes`);
  }
}
