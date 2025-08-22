module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // outros plugins que precisares podem entrar aqui
      "react-native-reanimated/plugin" 
    ],
  };
};
