<template>
  <div class="hello">
    <router-link to="/hw">Hw</router-link>
    <br />
    <router-link to="/etab">Etab</router-link>
  </div>
</template>
<script>
import { store, mutations } from "../store";
export default {
  name: "Hello",
  created() {
    console.log("created>Hello");
    console.log(
      "mutations,store.name,store.message，store.socket:",
      mutations,
      store.name,
      store.message,
      store.socket
    );
  },
};
</script>
