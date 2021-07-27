<template>
	<view>
		file tabs 2
		<view v-for="(type,index) in tabs" :key="index" style="display:inline-block" class="px-2">{{type}}</view>
	</view>
</template>

<script>
	export default {
		name: "file-tabs",
		props: {
			tabs: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style>

</style>
