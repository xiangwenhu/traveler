
<template>
    <slot ></slot>
</template>

<script setup lang="ts">
import { isNotReadonlyUser } from "@/store/quick";
const editable = isNotReadonlyUser();

</script>