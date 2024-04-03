
// load mongoose since we need it to define a model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
prdSchema = new Schema({
    asin: String,
    title: String,
    imgUrl: String,
    stars: Number,
    reviews: Number,
    price: Number,
    listPrice: Number,
    categoryName: String,
    isBestSeller: String,
    boughtInLastMonth: Number
});
module.exports = mongoose.model('products', prdSchema);

