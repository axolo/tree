export default {
  build: {
    minify: 'terser',
    lib: {
      entry: 'src/tree.js',
      name: 'Tree',
      formats: ['es', 'umd'],
      fileName: format => `tree.${format}.js`
    }
  }
}
