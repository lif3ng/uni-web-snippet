<template>
  <view class="content">
    <view class="relative">
      <file-tabs :tabs="tabs" :active.sync="activeTab" />
      <select class="absolute right-0 bottom-0" v-model="preset">
        <option v-for="preset in presetList" :key="preset">{{ preset }}</option>
      </select>
      <button
        class="inline-block leading-tight absolute right-20 bottom-0"
        v-if="showRunBtn"
        @click="doPreview"
      >
        run
      </button>
    </view>
    <p>{{ activeTab }}</p>
    <div ref="editor" class="" />
    <!-- html
    <textarea v-model="htmlText" />
    css
    <textarea v-model="cssText" /> -->
    <div>
      <button @click="handleSave">save</button>
      <div v-if="id">id:{{ id }}</div>
      <a :href="linkById" target="_blank">{{ linkById }}</a>
    </div>
    preview
    <iframe ref="preview" />
  </view>
</template>

<script>
import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup";
import { getEditorState } from "./utils/editor";
import generatePreview from "./utils/generatePreview";
const presetConfigMap = {
  CSS: {
    tabs: ["HTML", "CSS"],
    liveUpdate: true,
  },
  DOM: {
    tabs: ["HTML", "JS"],
  },
};
export default {
  data() {
    return {
      presetList: Object.keys(presetConfigMap),
      preset: "CSS",
      // tabs: ["HTML", "CSS"],
      // activeTab: "html",
      activeTab: "",
      id: "",
      code: {},
    };
  },
  mounted() {
    // 	import {html} from "@codemirror/lang-html"

    this._view = new EditorView({
      // state: await getEditorState("css", this.onCodeChange),
      parent: this.$refs.editor,
    });
  },
  onLoad() {
    console.log("onload", this.$el);
    const id = window.location.pathname.substr(1);
    if (id) {
      const db = uniCloud.database();
      db.collection("snippets")
        .doc(id)
        .get()
        .then(
          ({
            result: {
              affectedDocs,
              data: [item],
            },
          }) => {
            if (affectedDocs === 1) {
              console.log(item);
              this.code = item.code;
              this.preset = item.preset;
              this.refreshEditorAndPreview();
            }
          }
        );
    }
  },
  watch: {
    preset: {
      immediate: true,
      handler(preset) {
        const presetItem = presetConfigMap[preset];
        // set active lang tab
        this.activeTab = presetItem.tabs[0].toLowerCase();
        // set code watch (if necessary)
        // console.log(this.langWatchList);
        // if (this.langWatchList) {
        //   this.langWatchList.forEach((unwatch) => {
        //     unwatch();
        //   });
        // }
        // this.langWatchList = [];
        // if (presetItem.liveUpdate) {
        //   presetItem.tabs.forEach((tab) => {
        //     const lang = tab.toLowerCase();
        //     console.log(this);
        //     this.onCodeChange("");
        //     this.langWatchList.push(
        //       this.$watch(
        //         `code.${lang}`,
        //         function (x) {
        //           console.log(x);
        //         },
        //         {
        //           immediate: true,
        //           deep: true,
        //         }
        //       )
        //     );
        //   });
        // }
      },
    },

    activeTab: {
      immediate: true,
      async handler(lang) {
        const code = this.code[lang] || "";
        const newState = await getEditorState(lang, this.onCodeChange, code);
        this._view.setState(newState);
      },
    },
    // code: {
    //   deep: true,
    //   handler(...args) {
    //     console.log("code change", args);
    //   },
    // },
    // htmlText(html) {
    //   console.log({
    //     html,
    //   });
    //   this.generatePreview();
    // },
    // cssText(css) {
    //   console.log({
    //     css,
    //   });
    //   this.generatePreview();
    // },
  },
  computed: {
    tabs() {
      return presetConfigMap[this.preset].tabs;
    },
    linkById() {
      if (!this.id) return "";
      return `/${this.id}`;
    },
    showRunBtn() {
      return !presetConfigMap[this.preset].liveUpdate;
    },
  },
  methods: {
    async refreshEditorAndPreview() {
      const newState = await getEditorState(
        this.activeTab,
        this.onCodeChange,
        this.code[this.activeTab]
      );
      this._view.setState(newState);
      this.doPreview();
    },
    doPreview() {
      // this.$refs.preview.contentDocument.body.innerHTML = generatePreview(
      //   this.preset,
      //   this.code
      // );
      this.$refs.preview.setAttribute('srcdoc', generatePreview(
        this.preset,
        this.code
      ))
    },
    onCodeChange(code) {
      console.log(this.activeTab, { code });
      this.code[this.activeTab] = code;
      if (presetConfigMap[this.preset].liveUpdate) {
        this.doPreview();
      }
    },

    handleSave() {
      const db = uniCloud.database();
      db.collection("snippets")
        .add({
          preset: this.preset,
          code: this.code,
        })
        .then(({ result: { id } }) => {
          this.id = id;
        });
    },
  },
};
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
