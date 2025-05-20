

const Category = require('../model/category');  // مدل را وارد کنید


const categorypre=function (next){
 console.log('در حال ذخیره دسته بندی',this.title);
  next();
}
Category.pre('save', categorypre);

const categorypost=function(doc, next){
console.log('دسته بندی ذخیره شد' );
next()
}
Category.post('save',categorypost );
module.exports = { categorypre, categorypost };
