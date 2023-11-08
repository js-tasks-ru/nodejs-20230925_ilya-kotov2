const Product = require('../models/Product');
const mongoose = require('mongoose');

const mapProduct = (product) => ({
  id: product.id,
  title: product.title,
  images: product.images,
  category: product.category,
  subcategory: product.subcategory,
  price: product.price,
  description: product.description,
});

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;
  if (!subcategory) return next();

  const subcategoryProduct = await Product.find({subcategory});

  const result = {
    products: subcategoryProduct.map(mapProduct),
  };

  ctx.body = result;
};

module.exports.productList = async function productList(ctx, next) {
  const productList = await Product.find({});
  const result = {
    products: productList.map(mapProduct),
  };
  ctx.body = result;
};

module.exports.productById = async function productById(ctx, next) {
  const productID = ctx.params.id;

  if (!mongoose.isValidObjectId(productID)) ctx.throw(400, 'invalid product id');

  const product = await Product.findById(productID);

  if (!product) ctx.throw(404, 'product not founded');

  const result = {
    product: {
      id: product._id,
      title: product.title,
      images: product.images,
      category: product.category,
      subcategory: product.subcategory,
      price: product.price,
      description: product.description,
    },
  };

  ctx.body = result;
};

