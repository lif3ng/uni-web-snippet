export default (presetName, code) => {
  if (presetName === "CSS") {
    const { css, html } = code;
    console.log({ css, html });
    return `${html}
            <style>${css}</style>`;
  }
  if (presetName === "DOM") {
    const { html, js, css } = code;
    return `${html}
    ${css ? `<style>${css}</style>` : ""}
    <script>${js}</script>
    `;
  }
};
