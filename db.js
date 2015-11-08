var mongoose = require('mongoose');
var URLSlugs = require('mongoose-url-slugs');

//schema goes here!
var Item = new mongoose.Schema({
	name:String,
	quantity:String,
	checked:Boolean
});

var List = new mongoose.Schema({
	name:String,
	createdBy:String,
	items: [Item] //array of items
});

List.plugin(URLSlugs('name'));

mongoose.model('List', List);
mongoose.model('Item', Item);
mongoose.connect('mongodb://localhost/grocerydb');

