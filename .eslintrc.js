module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true
    },
    extends: [
        'standard'
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
    },
    parserOptions: {
        // ecmaVersion 用来指定你想要使用的 ECMAScript 版本
        ecmaVersion: 11
    },
    rules: {
        "no-console": "warn",
        "prefer-destructuring": ["error", { "object": true, "array": false }],
        "no-unused-vars": ["error", { "argsIgnorePattern": "req|res|next|val" }]
    }
}
