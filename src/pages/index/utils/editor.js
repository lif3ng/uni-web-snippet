import { EditorState, basicSetup } from "@codemirror/basic-setup";
import { StateField } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { defaultTabBinding } from "@codemirror/commands";

const handleChange = (onChange) =>
  StateField.define({
    create() {
      return 0;
    },
    update(v, tr) {
      if (tr.docChanged) {
        onChange(tr.newDoc.toString());
      }
    },
  });
export const getEditorState = async (lang, onChange, code) => {
  const extensions = [handleChange(onChange || (() => {})), basicSetup, keymap.of([defaultTabBinding])];
  if (lang === "html") {
    const { html } = await import(
      /* webpackChunkName: "lang-html" */
	   "@codemirror/lang-html"
    );
    extensions.push(html());
  } else if (lang === "css") {
    const { css } = await import(
      "@codemirror/lang-css" /* webpackChunkName: "lang-css" */
    );
    extensions.push(css());
  }
  console.log(code || "");
  return EditorState.create({ doc: code || "", extensions });
};
