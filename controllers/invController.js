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
    errors: null,
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
    errors: null,
  })
}

/* ***************************
 *  Build management page
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  // if (req.locals.accountData.account_type == "Employee" || req.locals.accountData.account_type == "Admin") {
    let nav = await utilities.getNav()
    const dropDown = await utilities.buildDropDownForm()

    res.render("./inventory/management", {
      title: "Management",
      nav,
      errors: null,
      dropDown
    })
  // } else {
  //   req.flash("notice", "Sorry, you do not have access to this page. Log in as an employee or admin.")
  //   res.redirect("/account/login")
  // }
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
    const dropDown = await utilities.buildDropDownForm()
    req.flash(
      "notice",
      `Classification ${classification_name} added.`
    )
    res.status(201).render("./inventory/management", {
      title: "Management",
      nav,
      errors: null,
      dropDown
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory page
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inventory_item = await invModel.getProductById(parseInt(req.params.inv_id))
  const dropDown = await utilities.buildDropDownForm(inventory_item.classification_id)
  const itemTitle = `${inventory_item[0].inv_make} ${inventory_item[0].inv_model}`
  
  res.render("./inventory/edit-inventory", {
    title: "Update "+ itemTitle,
    nav,
    dropDown: dropDown,
    errors: null,
    inv_id: inventory_item.inv_id,
    inv_make: inventory_item.inv_make,
    inv_model: inventory_item.inv_model,
    inv_year: inventory_item.inv_year,
    inv_description: inventory_item.inv_description,
    inv_image: inventory_item.inv_image,
    inv_thumbnail: inventory_item.inv_thumbnail,
    inv_price: inventory_item.inv_price,
    inv_miles: inventory_item.inv_miles,
    inv_color: inventory_item.inv_color,
    classification_id: inventory_item.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const dropDown = await utilities.buildDropDownForm(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    dropDown: dropDown,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build delete inventory page
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inventory_item = await invModel.getProductById(parseInt(req.params.inv_id))

  const itemTitle = `${inventory_item[0].inv_make} ${inventory_item[0].inv_model}`
  
  res.render("./inventory/delete", {
    title: "Delete "+ itemTitle,
    nav,
    errors: null,
    inv_id: inventory_item.inv_id,
    inv_make: inventory_item.inv_make,
    inv_model: inventory_item.inv_model,
    inv_year: inventory_item.inv_year,
    inv_price: inventory_item.inv_price,

    classification_id: inventory_item.classification_id
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  const inv_id = req.params.inv_id
  const deleteResult = await invModel.deleteInventory(inv_id)
  
  if (deleteResult) {
    req.flash("notice", `The item was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.redirect("/inv/delete/" + inv_id)
  }
}

module.exports = invCont