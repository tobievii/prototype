module.exports = (env) => {
  console.log("=========== " + env)

  if (env == undefined) {
    return require(`./webpack.dev.js`)
  } else {
    return require(`./webpack.${env}.js`)
  }

}