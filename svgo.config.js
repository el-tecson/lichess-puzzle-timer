export default {
  plugins: [
    {
      name: 'removeAttrs',
      params: { attrs: '(fill|stroke|style)' },
    },
    {
      name: 'addAttributesToSVGElement',
      params: { attributes: [{ fill: 'currentColor' }] },
    },
  ],
}