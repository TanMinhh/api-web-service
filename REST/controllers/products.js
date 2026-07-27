const Products = require("../models/products");

const getAllProducts = async (req, res) => {
    const myData = await Products.find({});
    res.status(200).json({ myData });
};

const getAllProductsTest = async (req, res) => {
    const myBanana = await Products.find({ name: "banana" });
    res.status(200).json({ myBanana });
};

const getQueryProducts = async (req, res) => {
    const myData = await Products.find(req.query);
    res.status(200).json({ myData });
};

const getQueryProductsWithCompanyFilter = async (req, res) => {
    const { company } = req.query;
    const queryObj = {};
    if (company) {
        queryObj.company = company;
    }

    const myData = await Products.find(queryObj);
    res.status(200).json({ myData });
};

const getQueryProductsWithFilters = async (req, res) => {
    const { company, name } = req.query;
    const queryObj = {};
    if (company) {
        queryObj.company = company;
    }
    if (name) {
        queryObj.name = { $regex: name, $options: "i" };
        //Full text search functionality - $regex with $options
    }

    const myData = await Products.find(queryObj);
    res.status(200).json({ myData });
};

const getSortedProducts = async (req, res) => {
    const myData = await Products.find(req.query).sort("-price");
    //Sort price asc ("price") - Sort price desc ("-price")
    res.status(200).json({ myData });
};

const getSortedProductsWithFilters = async (req, res) => {
    const { company, name, sort } = req.query;
    const queryObj = {};
    if (company) {
        queryObj.company = company;
    }
    if (name) {
        queryObj.name = { $regex: name, $options: "i" };
        //Full text search functionality - $regex with $options
    }

    let apiData = Products.find(queryObj);
    if (sort) {
        let sortify = sort.replace(",", " ");
        apiData = apiData.sort(sortify);
    }

    const myData = await apiData;
    res.status(200).json({ myData });
};
//For test: /api/products/sf?company=Bach%20Hoa%20Xanh&sort=-price

const getSelectedProducts = async (req, res) => {
    const { company, name, sort, select } = req.query;
    const queryObj = {};
    if (company) {
        queryObj.company = company;
    }
    if (name) {
        queryObj.name = { $regex: name, $options: "i" };
        //Full text search functionality - $regex with $options
    }

    let apiData = Products.find(queryObj);
    if (sort) {
        let sortify = sort.replace(",", " ");
        apiData = apiData.sort(sortify);
    }

    if (select) {
        let selectify = select.split(",").join(" ");
        apiData = apiData.select(selectify);
    }

    const myData = await apiData;
    res.status(200).json({ myData });
};

const pagination = async (req, res) => {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 3;
    let skip = (page - 1) * limit;
    let apiData = Products.find({}).skip(skip).limit(limit);

    const myData = await apiData;
    res.status(200).json({ myData, nbHits: myData.length });
};

module.exports = { pagination, getAllProducts, getAllProductsTest, getQueryProducts, getQueryProductsWithCompanyFilter, getQueryProductsWithFilters, getSortedProducts, getSortedProductsWithFilters, getSelectedProducts };