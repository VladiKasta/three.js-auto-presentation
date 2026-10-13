import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
	{
		ignores: ["dist/**"],
	},

	js.configs.recommended,
	...tseslint.configs.recommended,
	...pluginVue.configs["flat/recommended"],

	{
		files: ["**/*.vue"],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser,
			},
		},
	},

	{
		rules: {
			"no-undef": "off",

			"vue/html-self-closing": "off",
			"vue/max-attributes-per-line": "off",
			"vue/multi-word-component-names": "off",
			"vue/singleline-html-element-content-newline": "off",
		},
	},

	// ВАЖНО: должен идти последним
	eslintConfigPrettier,
);
