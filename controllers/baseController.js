const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
    const nav = await utilities.getNav()
    req.flash("notice", "This is a flash message.")
    res.render("index", {title:"Home", nav})
}

baseController.buildErrPage = async function(req, res){
    throw new Error('Internal Server 500 Error')
}

module.exports = baseController