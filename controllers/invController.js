const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build product page
 * ************************** */
invCont.buildById = async function (req, res, next) {
  const inv_id = req.params.inv_id
  const data = await invModel.getProductById(inv_id)
  const grid = await utilities.buildProductPage(data)
  let nav = await utilities.getNav()
  const year = data[0].inv_year
  const make = data[0].inv_make
  const model = data[0].inv_model

  res.render("./inventory/classification", {
    title: year + " " + make + " " + model,
    nav,
    grid,
  })
}

/* ***************************
 *  Build management page
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()

  res.render("./inventory/management", {
    title: "Management",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build add classification page
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()

  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Adding Classifications
* *************************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body

  const classificationResult = await invModel.insertClassification(classification_name)

  if (classificationResult) {
    let nav = await utilities.getNav()
    req.flash(
      "notice",
      `Classification ${classification_name} added.`
    )
    res.status(201).render("./inventory/management", {
      title: "Management",
      nav,
      errors: null,
    })
  } else {
    let nav = await utilities.getNav()
    req.flash("notice", "Sorry, something failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      classification_name
    })
  }
}

/* ***************************
 *  Build add inventory page
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let dropDown = await utilities.buildDropDownForm(classification_id=null)
  res.render("./inventory/add-inventory", {
    title: "Add To Inventory",
    nav,
    errors: null,
    dropDown
  })
}

/* ****************************************
*  Adding To Inventory
* *************************************** */
invCont.addToInventory = async function (req, res, next) {
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  
  const invResult = await invModel.insertToInventory(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)

  if (invResult) {
    req.flash(
      "notice",
      `Data added.`
    )
    let nav = await utilities.getNav()
    res.status(201).render("./inventory/management", {
      title: "Management",
      nav,
      errors: null,
    })
  } else {
    let nav = await utilities.getNav()
    let dropDown = await utilities.buildDropDownForm(classification_id)
    req.flash("notice", "Sorry, something failed.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add To Inventory",
      nav,
      dropDown
    })
  }
}

module.exports = invCont