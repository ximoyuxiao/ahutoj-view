<template>
  <div class="input">
    <input
      :value="props.vModel"
      @change="onValueChange"
      :placeholder="props.placeholder"
      @keydown.enter="props.onAction ? props.onAction : null"
      :type="props.type"
    />
  </div>
</template>

<script lang='ts' setup>
const props = defineProps(["vModel", "placeholder", "type", "onAction"]);
var emit = defineEmits(["change"]);
function onValueChange(e: any) {
  emit("change", e.target.value);
}
</script>

<style lang='scss' scoped>
.input {
  width: 100%;
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