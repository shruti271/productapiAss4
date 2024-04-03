
/****************************************************************************** *** 
*	ITE5315 – Assignment 4 
*	I declare that this assignment is my own work in accordance with Humber Academic Policy.   *  No part of this assignment has been copied manually or electronically from any other source *  (including web sites) or distributed to other students. 
*  
*	Name: __shrutiben italiya__ Student ID: _N01579444___ Date: _27/03/2024___________________ 
* 
* 
******************************************************************************
**/  
var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
const exphbs = require('express-handlebars');
var product = require('./models/products');
const ObjectId = mongoose.Types.ObjectId;

var port     = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

mongoose.set('strictQuery', false);
mongoose.connect(database.url,{ useNewUrlParser: true, useUnifiedTopology: true })


 
// Require Express Handlebars for template engine

app.engine('.hbs', exphbs.engine({ extname: '.hbs',
helpers:{
    showRow:function(data){
        return `<tr>
        <td> <span >${data.asin}</span ></td>
        <td> <span >${data.title}</span ></td>
        <td> <span >  <img src='${data.imgUrl}'style="width: 30px; height: 30px;"/> </span >  </td>
    	<td > <span > ${data.stars} </span>  </td>
    	<td><span >  ${data.reviews==0?"N/A":data.reviews} </span>  </td>
    	<td><span >  ${data.price?data.prie:""} </span>  </td>
    	<td><span >  ${data.listprice}  </span> </td>
   		 <td><span >  ${data.categoryName} </span>  </td>
   		 <td> <span > ${data.isbestseller}</span>   </td>
    	<td><span >  ${data.boughtInLastMonth} </span> </td><tr>`;
    },
    
    } }));
app.set('view engine', 'hbs');

app.get('/api/alldata', async (req, res) => {
    try {
        const products = await product.find();
		console.log("-----",products)
        res.render('alldata', { products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get("/api/getform",function(req,res){
	// res.send("product");
	res.render('product',{
        layout:'main.hbs'
    })
})
app.post('/api/newProduct', function(req, res) {

    // create mongose method to create a new record into collection
    console.log(req.body);

	product.create({
		"asin": req.body.asin,
    "title": req.body.title,
    "imgUrl": req.body.imgurl,
    "stars": req.body.stars,
    "reviews": req.body.reviews,
    "price": req.body.price,
    "listPrice": req.body.listPrice,
    "categoryName": req.body.categoryName,
    "isBestSeller": req.body.BetterSeller,
    "boughtInLastMonth": req.body.lastmonth
	}, function(err, product) {
		if (err)
			res.send(err);
 
		// get and return all the products after newly created employe record
		product.find("main",function(err, products) {
			if (err)
				res.send(err)
			    res.redirect('/success',{data:"instred"});
		});
	});
 
});

//get all product data from db
app.get('/api/products', async function(req, res) {
	// use mongoose to get all todos in the database

	// const query=product.find({});

	// const cursor = query.cursor();

	// cursor.eachAsync(async function(doc) {
	// 	// Process each document here
	// 	console.log(doc);
	// }).then(() => {
	// 	// Cursor has completed, close it properly
	// 	cursor.close().then(() => {
	// 		console.log('Cursor closed');
	// 		// You may perform additional tasks here after the cursor is closed
	// 	});
	// }).catch(err => {
	// 	// Handle errors
	// 	console.error('Error processing cursor:', err);
	// });
// res.send(query)
	product.find(function(err, prd) {
		// if there is an error retrieving, send the error otherwise send data
		if (err)
			res.send(err)
		res.json(prd); // return all products in JSON format
	});
});

// get a product with ID of 1
app.get('/api/products/:product_id', function(req, res) {
    try{
	let validId = req.params.product_id;
    // console.log("-------------",id);
    // const validId = mongoose.Types.ObjectId(req.params.product_id);
    let objectId = ObjectId(validId);
	product.findById( {_id: ObjectId(validId)}, function(err, product) {
		if (err)
			res.send(err)
 
		res.json(product);
	});} catch (error) {
        console.error("Error converting to ObjectId:", error); // Debugging statement
        res.status(400).json({ message: 'Invalid product ID' });
    }
 
});
// get a product with ID of 1
app.get('/api/products/filterby', function(req, res) {
    // try {
    //     product.find({ price: { $gt: 500 } }, function(err, result) {
    //         if (err) {
    //             console.error('Error finding products:', err);
    //             res.status(500).json({ message: 'Internal Server Error' });
    //             return;
    //         }
    //         console.log('Filtered products:', result);
    //         res.json(result);
    //     });
    // } catch (error) {
    //     console.error("Error:", error); // Debugging statement
    //     res.status(400).json({ message: 'Invalid request' });
    // }

	const query=product.find({ asin:"B09B5YL866"});

	const cursor = query.cursor();

	cursor.eachAsync(async function(doc) {
		// Process each document here
		console.log(doc);
	}).then(() => {
		// Cursor has completed, close it properly
		cursor.close().then(() => {
			console.log('Cursor closed');
			// You may perform additional tasks here after the cursor is closed
		});
	}).catch(err => {
		// Handle errors
		console.error('Error processing cursor:', err);
	});
})

app.get('/api/products/all', function(req, res) {
	// use mongoose to get all todos in the database
	product.find({ price: { $gt: 500 } },function(err, prd) {
		// if there is an error retrieving, send the error otherwise send data
		if (err)
			res.send(err)
		res.json(prd.body.asin); // return all products in JSON format
	});
});


// create product and send back all products after creation
app.post('/api/products', function(req, res) {

    // create mongose method to create a new record into collection
    console.log(req.body);

	product.create({
		"asin": req.body.asin,
    "title": req.body.title,
    "imgUrl": req.body.imgurl,
    "stars": req.body.stars,
    "reviews": req.body.reviews,
    "price": req.body.price,
    "listPrice": req.body.listPrice,
    "categoryName": req.body.categoryName,
    "isBestSeller": req.body.BetterSeller,
    "boughtInLastMonth": req.body.lastmonth
	}, function(err, product) {
		if (err)
			res.send(err);
 res.send("success")
		// get and return all the products after newly created employe record
		// product.find(function(err, products) {
		// 	if (err)
		// 		res.send(err)
		// 	res.json(products);
		// });
	});
 
});


// create product and send back all products after creation
app.put('/api/products/:product_id', function(req, res) {
	// create mongose method to update an existing record into collection
    console.log(req.body);

	let id = req.params.product_id;
	var data = {
    "title": req.body.title,
    "price": req.body.price,
	}

	// save the user
	product.findByIdAndUpdate({_id: ObjectId(id)}, data, function(err, product) {
	if (err) throw err;

	res.send('Successfully! product updated - ');
	});
});

// delete a product by id
app.delete('/api/products/:product_id', function(req, res) {
	console.log(req.params.product_id);
	let id = req.params.product_id;
	product.remove({
		_id : id
	}, function(err) {
		if (err)
			res.send(err);
		else
			res.send('Successfully! product has been Deleted.');	
	});
});

app.listen(port);
console.log("App listening on port : " + port);
