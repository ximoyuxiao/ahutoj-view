<template>
  <div class="iconInput">
    <input
      v-model="vModel"
      @input="onValueChange"
      :placeholder="props.placeholder"
      @keydown.enter="onClick"
      :type="props.type"
    />
    <div
      class="icon cursor_pointer"
      @click="onClick"
    >
      <slot name="icon"></slot>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { onMounted, ref } from "vue";

const props = defineProps(["modelValue", "placeholder", "type"]);
var emit = defineEmits(["update:modelValue", "click"]);
//代理数据
var vModel = ref(null);

function onValueChange(e: any) {
  emit("update:modelValue", e.target.value);
}

function onClick(e: any) {
  emit("click", e);
}

onMounted(() => {
  //初始化
  if (props.modelValue) vModel.value = props.modelValue;
});
</script>

<style lang='scss' scoped>
.iconInput {
  width: 94%;
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover > div {
    @include border_color("fill12");
    @include font_color("fill12");
  }

  .icon {
    height: 30px;
    width: 30px;
    @include fill_color("fill4");
    box-sizing: border-box;
    border: 2px solid;
    @include border_color("font2");
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  input {
    box-sizing: border-box;
    height: 30px;
    width: calc(100% - 32px);
    padding: 2px 10px;
    border-radius: 8px;
    font-size: $fontSize5;
    @include font_color("font1");
    @include fill_color("fill4");

    &:focus,
    &:hover + div,
    &:focus + div {
      outline: none;
      border: 2px solid;
      @include border_color("fill12");
      @include font_color("fill12");
    }

    &::placeholder {
      @include font_color("font3");
    }
  }
}
</style>