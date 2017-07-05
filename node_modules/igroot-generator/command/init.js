const path = require("path")
const copy = require('./../tools/copy')

require('../tools/colors')()

module.exports = function (name) {
    copy("../template/", name, () => {
        console.log('\ninitialize complete!\n'.success)
        console.log('please run:', `\n   cd ${name}\n   npm install && sl-core run`.info)
    })
}
