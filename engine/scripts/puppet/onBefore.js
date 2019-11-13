module.exports = async (page, scenario, vp) => {
  await require("./loadCookies")(page, scenario);
  await require("./interceptMedia")(page, scenario);
};
