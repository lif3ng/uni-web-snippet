<template>
  <view>
    <view class="space-x-1">
      <view
        v-for="{ key, label } in _tabs"
        :key="key"
        style="display: inline-block"
        :class="[
          'px-2 rounded-md rounded-b-none',
          key === active
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer',
        ]"
        @click="$emit('update:active', key)"
        >{{ label }}</view
      >
    </view>
  </view>
</template>

<script>
export default {
  name: "file-tabs",
  props: {
    active: {
      type: String,
      default: "",
    },
    tabs: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    _tabs() {
      return this.tabs.map((tab) => {
        if (typeof tab === "string") {
          return {
            key: tab.toLowerCase(),
            label: tab,
          };
        }
        return tab;
      });
    },
  },
  data() {
    return {};
  },
};
</script>

<style>
</style>
