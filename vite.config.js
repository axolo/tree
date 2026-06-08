import copy from 'rollup-plugin-copy'

export default {
  plugins: [
    copy({
      targets: [
        { src: 'src/tree.d.ts', dest: 'dist' }
      ]
    }),
  ],
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
