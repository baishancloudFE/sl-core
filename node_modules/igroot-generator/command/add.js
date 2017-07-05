const path = require("path")
const copy = require('./../tools/copy')

require('../tools/colors')()

module.exports = (page, component) => {
    if(typeof page === 'string') {
        const pagePath = path.resolve(`./src/pages/${page}`)

        copy("../page/", pagePath, () => {
            console.log('\nPage templates to complete!'.success)
            console.log('Generate the path as follows: ' + pagePath.info)
        })
    }

    if(typeof component === 'string') {
        const componentPath = path.resolve(`./src/components/${component}`)

        copy("../component/", componentPath, () => {
            console.log('\nComponent templates to complete!'.success)
            console.log('Generate the path as follows: ' + componentPath.info)
        })
    }
}
