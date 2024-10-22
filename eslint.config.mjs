import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';


export default [
	{ files: ['**/*.ts'], languageOptions: { sourceType: 'commonjs' } },
	{ languageOptions: { globals: globals.node } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	{
		rules: {
			'indent': [
				'error',
				'tab'
			],
			'no-mixed-spaces-and-tabs': 0,
			'linebreak-style': [
				'error',
				'unix'
			],
			'semi': [
				'error',
				'always'
			],
			'no-console': 2,
			'max-len': [2, 120],
			'@typescript-eslint/no-unused-vars': [
				'error'
			],
			'@typescript-eslint/no-explicit-any': 'off',
			"@typescript-eslint/no-var-requires": 'off'

		}
	},
	{
		ignores: ['.config/*', 'node_modules/*', 'coverage/*', '*.d.ts', 'build/*'],
	}
];