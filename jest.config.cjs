module.exports = {
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },
  clearMocks: true,
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["./src/singleton.ts"],
};
