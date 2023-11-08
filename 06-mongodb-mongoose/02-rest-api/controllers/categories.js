const Category = require('../models/Category');


module.exports.categoryList = async function categoryList(ctx, next) {
  const categorie = await Category.find({});
  const result = {
    categories: categorie.map((item) => (
      {
        id: item.id,
        title: item.title,
        subcategories: item.subcategories.map((subitem) => (
          {
            id: subitem.id,
            title: subitem.title,
          }
        )),
      }
    ),
    ),
  };
  ctx.body = result;
};
