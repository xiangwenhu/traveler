<template>

</template>


<script setup lang="ts">
import store from "@/store";
store.dispatch("user/loginOut");
</script>