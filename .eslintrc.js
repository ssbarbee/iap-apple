module.exports = {
    parser: '@typescript-eslint/parser',
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            parserOptions: {
                sourceType: 'module',
                project: ['./tsconfig.json'],
            },
        }
    ],
    plugins: [
        '@typescript-eslint/eslint-plugin',
        'unused-imports',
        'sort-export-all'
    ],
    extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
    ],
    root: true,
    env: {
        node: true,
    },
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        'unused-imports/no-unused-imports': 'error',
        'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
        'sort-export-all/sort-export-all': 'error'
    }
};
