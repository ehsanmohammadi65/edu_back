

const CategorySchema=require('../model/category')


const categorypre=function (next){
 console.log('در حال ذخیره دسته بندی',this.title);
  next();
}
CategorySchema.pre('save', categorypre);

const categorypost=function(doc, next){
console.log('دسته بندی ذخیره شد' );
next()
}
CategorySchema.post('save',categorypost );
module.exports = { categorypre, categorypost };
