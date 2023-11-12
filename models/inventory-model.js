const pool = require("../database")
const invModel = {}

/* ***************************
 *  Get all classification data
 * ************************** */
invModel.getClassifications = async function (){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
invModel.getInventoryByClassificationId = async function (classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
}

/* ***************************
 *  Get product data
 * ************************** */
invModel.getProductById = async function (inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getproductbyid error " + error)
  }
}

/* ***************************
 *  Add new classification
 * ************************** */
invModel.insertClassification = async function (classification_name) {
  try {
    const data = await pool.query(
      `INSERT INTO public.classification (classification_name)
      VALUES ($1)`,
      [classification_name]
    )
    return data.rows
  } catch (error) {
    console.error("insertClassification error " + error)
  }
}

/* ***************************
 *  Check if classification already exists
 * ************************** */
invModel.checkClassification = async function (classification_name) {
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const classificationName = await pool.query(sql, [classification_name])
    return classificationName.rowCount
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Add to inventory
 * ************************** */
invModel.insertToInventory = async function (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) {
  try {
    const sql = "INSERT INTO account (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
  } catch (error) {
    return error.message
  }
}

module.exports = invModel;