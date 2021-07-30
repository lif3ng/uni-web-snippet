import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup";
import { StateField } from "@codemirror/state";

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
  const extensions = [handleChange(onChange || (() => {})), basicSetup];
  if (lang === "html") {
    const { html } = await import(
      "@codemirror/lang-html" /* webpackChunkName: 'lang-html' */
    );
    extensions.push(html());
  } else if (lang === "css") {
    const { css } = await import(
      "@codemirror/lang-css" /* webpackChunkName: 'lang-css' */
    );
    extensions.push(css());
  }
  return EditorState.create({ doc: code || "", extensions });
};
