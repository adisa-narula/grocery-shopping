var mongoose = require('mongoose');
var List = mongoose.model('List');
var express = require('express');
var router = express.Router(); //create router object

router.get('/list', function (req, res){
	List.find({}, function(err, lists, count){
		console.log('in main list:', lists);
		res.render('grocery', {grocery:lists});
	});
});

router.get('/', function (req,res){
	res.redirect(303, "/list");
})

router.get('/list/create', function (req, res){
	res.render('create');
});

router.post('/list/create', function (req, res){
console.log("in create list");
	//handling the submit
	var l = new List({
		name: req.body.name,
		createdBy: req.body.createdBy
	})

	//redirect when saved
	l.save(function (err,list,count){
		// res.redirect(303, listname);
		console.log("list's slug: ",list.slug);
		res.redirect(303, '/list/'+ list.slug);
	});
});

router.get('/list/:slug', function (req, res){
	console.log('in /list/' + req.params.slug);
	List.findOne({slug:req.params.slug}, function (err, list, count){
		//pass in the items and slug for the grocery list
		res.render('detail', {items:list.items, slug:req.params.slug, name:list.name})
	});
});

router.post('/item/create', function (req, res) {

	//get all the information from the form
	var uniqueSlug = req.body.slugList;
	var number = req.body.quantity;
	var itemName = req.body.itemName;

	console.log('slug in create: ' + uniqueSlug + ' quantity: ' + number + ' item name: ' + itemName);
	// find the list that the item is stored in
	List.findOne({slug:uniqueSlug}, function (err, list, count){
		list.items.push({name: itemName, quantity: number, checked:false});
		list.save(function (saveErr, saveList, saveCount){
			res.redirect(303, '/list/'+ uniqueSlug);
		});
	});
});

router.post('/item/check', function(req,res){

	var checked = req.body.checkedItems;
	console.log('checked items: ', checked);
	// console.log('checked from req', req.body.checkedItems);
	// console.log("checked items", checked);
	List.findOne({slug:req.body.slugName}, function(err, list, count){
		for (var i = 0; i < list.items.length; i++) {
			//if the item is in the checked array
			if(checked.indexOf(list.items[i].name) > -1) {
				list.items[i].checked = true;
			}
		}
		//save the modified version
		list.save(function(error, modifiedItems, count){
			console.log('modified', modifiedItems);
			res.redirect(303,'/list/'+req.body.slugName);
		});
	});
});

module.exports = router;
