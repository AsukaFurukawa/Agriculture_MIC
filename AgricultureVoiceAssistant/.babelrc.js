module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript',
    'module:metro-react-native-babel-preset'
  ],
  plugins: [
    'react-native-web',
    '@babel/plugin-transform-runtime',
    ["@babel/plugin-transform-private-property-in-object", { "loose": true }],
    ["@babel/plugin-transform-private-methods", { "loose": true }],
    ["@babel/plugin-transform-class-properties", { "loose": true }]
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel']
    }
  }
}; 