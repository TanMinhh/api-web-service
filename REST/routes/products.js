const express = require("express");
const router = express.Router();
const { pagination, getAllProducts, getAllProductsTest, getQueryProducts, getQueryProductsWithCompanyFilter, getQueryProductsWithFilters, getSortedProducts, getSortedProductsWithFilters, getSelectedProducts } = require("../controllers/products");

router.route("/").get(getAllProducts);
router.route("/test").get(getAllProductsTest);
router.route("/query").get(getQueryProducts);
router.route("/company").get(getQueryProductsWithCompanyFilter);
router.route("/filter").get(getQueryProductsWithFilters);
router.route("/sort").get(getSortedProducts);
router.route("/sf").get(getSortedProductsWithFilters);
router.route("/select").get(getSelectedProducts);
router.route("/pag").get(pagination);

module.exports = router;