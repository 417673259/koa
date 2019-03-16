module.exports = () => ({
  presets: [
    [
      '@babel/preset-env', {
        targets: {
          node: '8.9.3',
        },
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    // "react-hot-loader/babel",
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    'transform-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    ['css-modules-transform', {
      extensions: ['.css', '.scss', '.less'],
      preprocessCss: './src/sassFn.js',
      camelCase: true,
      generateScopedName: '[path][name]--[hash:base64:5]',
    }],
  ],
});
