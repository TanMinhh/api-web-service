const getAllProducts = async (req, res) => {
    res.status(200).json({ msg: "Products" });
};

const getAllProductsTest = async (req, res) => {
    res.status(200).json({ msg: "Products Test Success" });
};

module.exports = { getAllProducts, getAllProductsTest };