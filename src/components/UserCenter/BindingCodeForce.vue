
<template>
  <div class="BingdingCodeForce">
    {{test.name}}
  </div>
</template>
<script lang="ts" setup>
import { useStore } from "vuex";
import { getCurrentInstance } from "vue";
import { useTestStore } from "../../pinia/test";
const { proxy } = getCurrentInstance() as any;
const store = useStore();

const test = useTestStore();
</script>

<style lang="scss" scoped>
</style>