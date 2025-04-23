export default{
  env: {
    node: true, // This enables Node.js global variables
    es2021: true
  },
  plugins: ['node'],
  extends: [
    'eslint:recommended',
    'plugin:node/recommended'
  ],
  rules: {
    // Your other rules...
  }
};