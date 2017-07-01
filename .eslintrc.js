module.exports = {
    env: {
        es6: true,
        node: true
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaFeatures: {
            experimentalObjectRestSpread: true
        },
        sourceType: 'module',
    },
    rules: {
        'linebreak-style': ['error', 'unix'],
        'no-unused-vars': 1,
        'no-console': 0,
        indent: ['error', 2],
        quotes: ['error', 'single'],
        semi: ['error', 'always']
    }
};
