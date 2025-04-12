// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  env: { browser: true, es2021: true },
  extends: [
    "expo",
    "prettier",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react-native/all",
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module", // Permite `import`/`export`
    ecmaFeatures: {
      jsx: true,
    },
  },
  ignorePatterns: ["/dist/*", "/node_modules/*"], // Ignorar directorios
  plugins: ["prettier", "react", "react-hooks", "react-native", "import"], // Reglas para manejo
  rules: {
    "prettier/prettier": "error",
    "react/prop-types": "off",
    "no-unused-vars": ["warn"], // Detectar variables no utilizadas
    "react-native/no-inline-styles": "warn", // Detecta estilos en línea
    "react-native/no-unused-styles": "warn", // Detecta estilos que no se usan
    "max-len": ["warn", { code: 200 }],
    "import/no-unresolved": [
      "error",
      {
        ignore: ["@env"], // Ignorar errores para el módulo @env
      },
    ],
  },
  settings: {
    react: {
      version: "detect", // Detecta automáticamente la versión de React
    },
  },
};
