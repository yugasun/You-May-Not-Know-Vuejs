const path = require("path");
const ghpages = require("gh-pages");

const ghDir = path.join(__dirname, "..", "docs/.vuepress/dist");
ghpages.publish(ghDir, function(err) {
  if (err) {
    console.log(err);
  }
});
