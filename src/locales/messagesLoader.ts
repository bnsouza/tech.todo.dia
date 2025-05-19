export const loadMessages = async (locale: string) => {
  switch (locale) {
    case "en":
      return import("./en.json").then((module) => module.default);
    case "pt":
      return import("./pt.json").then((module) => module.default);
    default:
      return import("./en.json").then((module) => module.default);
  }
};
