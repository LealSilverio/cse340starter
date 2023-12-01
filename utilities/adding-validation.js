const utilities = require(".")
const invModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Insert Classification Validation Rules
 * ********************************* */
validate.insertClassificationRules = () => {
  return [
    // classification name is required and must be string
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .matches('^[A-Za-z]+$')
      .withMessage("Please provide a classification name.")
      .custom(async (classification_name) => {
        const classificationExists = await invModel.checkClassification(classification_name)
        if (classificationExists){
          throw new Error("Classification exists. Please try a different one")
        }
      }),
  ]
}

/* ******************************
* Check data and return errors or continue to add-classification
* ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/*  **********************************
 *  Insert Inventory Data Validation Rules
 * ********************************* */
validate.insertInvRules = () => {
    return [
      // classification is required
      body("classification_id")
      .isLength({ min:1 })  
      .withMessage("Please provide a car make."),

      // make is required and must be string
      body("inv_make")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a car make."),
  
      // model is required and must be string
      body("inv_model")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a car model."),

      // year is required and must be a number
      body("inv_year")
        .trim()
        .isInt({ min: 0, max: 4 })
        .withMessage("Please provide a year."),

      // description is required and must be a string
      body("inv_description")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a description."),

      // image is required and must be a string
      body("inv_image")
        .trim()
        .isLength({ min: 2 })
        .isIn([ "png" || "jpeg" || "jpg" || "gif" || "webp" || "svg" ])
        .withMessage("Please provide an image path."),
      
      // thumbnail is required and must be a string
      body("inv_thumbnail")
        .trim()
        .isLength({ min: 2 })
        .isIn([ "png", "jpeg", "jpg", "gif", "webp", "svg" ])
        .withMessage("Please provide a thumbnail path."),

      // price is required and must be a number
      body("inv_price")
        .isInt({ min: 1, max: 9 })
        .isLength({min: 1})
        .withMessage("Please provide a price."),

      // miles is required and must be a number
      body("inv_miles")
        .isInt({ min: 1, max: 12 })
        .isLength({min: 1})
        .withMessage("Please provide the miles."),

      // color is required and must be a string
      body("inv_color")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Please provide a color."),
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      const dropDown = utilities.buildDropDownForm(classification_id);
      res.render("inventory/add-inventory", {
        errors,
        title: "Add Inventory",
        nav,
        dropDown,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
      })
      return
    }
    next()
}


/* ******************************
 * Check update data and return errors
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { inv_id, classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const dropDown = utilities.buildDropDownForm(classification_id);
    const itemTitle = `${inventory_item[0].inv_make} ${inventory_item[0].inv_model}`
    res.render("./inventory/edit-inventory", {
      errors,
      title: "Update "+ itemTitle,
      nav,
      dropDown,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      inv_id
    })
    return
  }
  next()
}

module.exports = validate