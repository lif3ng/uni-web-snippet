<template>
	<view class="content">
		<file-tabs :tabs="tabs" />
		html
		<textarea v-model="htmlText" />
		css
		<textarea v-model="cssText" />
		<div><button @click="handleSave">save</button>
			<div v-if="id">id:{{id}}</div>
			<a :href="linkById" target="_blank">{{linkById}}</a>
		</div>
		preview
		<iframe ref="preview" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: ['html', 'css'],
				id: '',
				htmlText: '',
				cssText: ''
			}
		},
		onLoad() {
			const id = window.location.pathname.substr(1)
			if (id) {
				const db = uniCloud.database();
				db.collection('snippets').doc(id).get().then(({
					result: {
						affectedDocs,
						data: [item]
					}
				}) => {
					if (affectedDocs === 1) {
						console.log(item)
						this.htmlText = item.html
						this.cssText = item.css
					}
				})
			}
		},
		watch: {
			htmlText(html) {
				console.log({
					html
				})
				this.generatePreview()
			},
			cssText(css) {
				console.log({
					css
				})
				this.generatePreview()
			}
		},
		computed: {
			linkById() {
				if (!this.id) return ''
				return `/${this.id}`
			}
		},
		methods: {
			handleSave() {
				const db = uniCloud.database();
				db.collection('snippets').add({
					html: this.htmlText,
					css: this.cssText
				}).then(({
					result: {
						id
					}
				}) => {
					this.id = id
				})
			},
			generatePreview() {
				this.$refs.preview.contentDocument.body.innerHTML = `${this.htmlText}
				<style>${this.cssText}</style>`
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		/* align-items: center;
		justify-content: center; */
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
