import Vue from "vue";

// 通过Vue.observable创建一个可响应的对象
export const store = Vue.observable({
  socket: {},
  name: "fgy",
  message:[1,"111"],
});

// 定义 mutations, 修改属性
export const mutations = {
  setSocket(socket) {
    store.socket = socket;
  },
  setName(name) {
    store.name = name;
  },
  setMessage(message) {
    console.log("store.message:",store.message,"message:",message)
    store.message.push(message);
  }
};

export default {
  store,
  mutations,
};
