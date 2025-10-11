import axios from "axios";
import { Domain } from "./Domain";

// USER ==============================
async function GetUserByID(id) {
  return (await axios.get(`${Domain}/api/users/${id}`));
}
async function PutUser(id, newData) {
  return (await axios.put(`${Domain}/api/users/${id}`, newData));
}
async function PostBanUser(id) {
  return (await axios.post(`${Domain}/api/users/${id}/ban`));
}
async function PostUnbanUser(id) {
  return (await axios.post(`${Domain}/api/users/${id}/unban`));
}
async function PostRegister(account) {
  return (await axios.post(`${Domain}/api/users/register`, account));
}
async function GetUserList() {
  return (await axios.get(`${Domain}/api/users`));
}

// PRODUCT ============================
async function GetProductByID(id) {
  return (await axios.get(`${Domain}/api/products/${id}`));
}
async function PutProduct(id, newData) {
  return (await axios.put(`${Domain}/api/products/${id}`, newData, {
    headers: { "Content-Type": "application/json" }
  }));
}
async function PutProductActive(id, active ) {
  return await axios.put(`${Domain}/api/products/${id}/active`, active, {
    headers: { "Content-Type": "application/json" }
  });
}
async function DeleteProduct(id) {
  return (await axios.delete(`${Domain}/api/products/${id}`));
}
async function GetProductList() {
  return (await axios.get(`${Domain}/api/products`));
}
async function PostProduct(newData) {
  return (await axios.post(`${Domain}/api/products`, newData));
}
async function GetProductByCategoryID(id) {
  return (await axios.get(`${Domain}/api/products/category/${id}`));
}
async function GetActiveProductList() {
  return (await axios.get(`${Domain}/api/products/active`)).data;
}

// IMAGE ==============================
async function PutImage(id, data) {
  return (await axios.put(`${Domain}/api/images/${id}`, data)).data;
}
async function DeleteImage(id) {
  return (await axios.delete(`${Domain}/api/images/${id}`));
}
async function GetImageList() {
  return (await axios.get(`${Domain}/api/images`));
}
async function PostImage(data) {
  return (await axios.post(`${Domain}/api/images`, data));
}
async function GetImageByProductId(productId) {
  return (await axios.get(`${Domain}/api/images/product/${productId}`));
}

// CATEGORY ============================
async function GetCategoryByID(id) {
   return (await axios.get(`${Domain}/api/categories/${id}`));
}
async function PutCategory(id, data) {
  return (await axios.put(`${Domain}/api/categories/${id}`, data));
}
async function DeleteCategory(id) {
  return (await axios.delete(`${Domain}/api/categories/${id}`)).data;
}
async function GetCategoryList() {
  return (await axios.get(`${Domain}/api/categories`)).data;
}
async function PostCategory(data) {
  return (await axios.post(`${Domain}/api/categories`, data));
}

// ORDER ===============================
async function GetAllOrders() {
  return (await axios.get(`${Domain}/api/Order/GetOrderList`)).data;
}
// async function GetOrdersByUserID(userId) {
//   return (await axios.get(`${Domain}/api/Order/GetOrderListByUserId/${userId}`)).data;
// }
async function GetOrdersByUserID(userId) {
  const res = await axios.get(`${Domain}/api/Order/GetOrderListByUserId/${userId}`);
  return Array.isArray(res.data?.data) ? res.data.data : [];  
}
async function GetOrderByID(orderId) {
  return (await axios.get(`${Domain}/api/Order/GetOrder/${orderId}`)).data;
}
async function PostOrder(data) {
  return (await axios.post(`${Domain}/api/Order/AddOrder`, data)).data;
}
async function PutOrder(id, data) {
  return (await axios.put(`${Domain}/api/Order/UpdateOrder/${id}`, data)).data;
}
async function PutOrderStatus(id, status) {
  return (await axios.put(`${Domain}/api/Order/UpdateStatusOrder/${id}`, status, {
    headers: { "Content-Type": "application/json" }
  })).data;
}
async function CheckOrderProduct(userId, productId) {
  return (await axios.get(`${Domain}/api/Order/checkOrderProduct/${userId}/${productId}`)).data;
}

// PAYMENT ===============================
async function PutPaymentStatus(orderId, status) {
  return (await axios.put(`${Domain}/api/Payment/UpdateStatusPayment/${orderId}`, status, {
    headers: { "Content-Type": "application/json" }
  })).data;
}
async function PostPayment(data) {
  return (await axios.post(`${Domain}/api/Payment/AddPayment`, data)).data;
}
async function GetPaymentList() {
  return (await axios.get(`${Domain}/api/Payment/GetPaymentList`)).data;
}
async function GetPaymentByOrderId(orderId) {
  return (await axios.get(`${Domain}/api/Payment/GetPaymentByOrderId/${orderId}`)).data;
}

// AUTH ================================
async function PostLogin(data) {
  return (await axios.post(`${Domain}/api/auth/login`, data));
}
async function PostLogout() {
  return (await axios.post(`${Domain}/api/auth/logout`));
}

async function PostOrderDetail(data) {
  return (await axios.post(`${Domain}/api/OrderDetail/AddOrderDetail`,data));
}
async function GetOrderDetailList() {
  return (await axios.get(`${Domain}/api/OrderDeTail/GetOrderDetailList`));
}
async function GetDetailListByOrder(orderId) {
  return (await axios.get(`${Domain}/api/OrderDeTail/GetDetailListByOrder/${orderId}`)).data;
}
// Password update
async function PutPassword(userId, newPassword) {
  return await axios.put(`${Domain}/api/users/${userId}/password`, {
    password: newPassword,
  });
}
async function PutProductStatus(userId, newPassword) {
  return await axios.put(`${Domain}/api/users/${userId}/password`, {
    password: newPassword,
  });
}

export {
  // USER
  GetUserByID,
  PutUser,
  PostBanUser,
  PostUnbanUser,
  PostRegister,
  GetUserList,

  // PRODUCT
  GetProductByID,
  PutProduct,
  DeleteProduct,
  GetProductList,
  PostProduct,
  GetProductByCategoryID,
  GetActiveProductList,
  PutProductActive,
  PutProductStatus,

  // IMAGE
  PutImage,
  DeleteImage,
  GetImageList,
  PostImage,
  GetImageByProductId,

  // CATEGORY
  GetCategoryByID,
  PutCategory,
  DeleteCategory,
  GetCategoryList,
  PostCategory,

  // ORDER
  GetAllOrders,
  GetOrdersByUserID,
  GetOrderByID,
  PostOrder,
  PutOrder,
  PutOrderStatus,
  CheckOrderProduct,
  PostOrderDetail,
  GetDetailListByOrder,

  // PAYMENT
  PutPaymentStatus,
  PostPayment,
  GetPaymentList,
  GetPaymentByOrderId,

  // AUTH
  PostLogin,
  PostLogout,
  GetOrderDetailList,
  PutPassword,
};
