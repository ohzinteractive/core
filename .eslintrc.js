module.exports = {
    'env': {
        'browser': true,
        'es6': true
    },
    'extends': 'eslint:recommended',
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly',
        'ViewApi': 'readonly',
        '$': 'readonly',
        'Cesium': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 2018,
        'sourceType': 'module'
    },
    'rules': {
        'indent': [
            'error',
            2
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'brace-style': [
            'error',
            'allman'
        ],
        'space-before-function-paren': [
            'error',
            'never'
        ],
        "camelcase": 0,
        'import/no-absolute-path': 0,
        'import/no-duplicates': 0,
        'linebreak-style': 0,
        'no-multi-spaces': 0,
        'prefer-const': 0,
        'no-useless-constructor': 0,
        'no-undef-init': 0
    }
};
