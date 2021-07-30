export default (presetName, code) => {
  if (presetName === "css") {
    const { css, html } = code;
    return `${html}
            <style>${css}</style>`;
  }
  if (presetName === "dom") {
    const { html, js, css } = code;
    return `${html}
    ${css && `<style>${css}</style>`}
    <script>${js}</script>
    `;
  }
};
