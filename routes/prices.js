var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    querystring = require('querystring'),
//    jQuery = require('jQuery'),
//    jsdom = require('jsdom'),
    methodOverride = require('method-override'); //used to manipulate POST


//Any requests to this controller must pass through this 'use' function
//Copy and pasted from method-override
router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))


router.route('/')
    //GET all prices
    .get(function(req, res, next) {
        //retrieve all prices from Monogo
        mongoose.model('Price').find({}, function (err, prices) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/prices folder. We are also setting "prices" to be an accessible variable in our jade view
                    html: function(){
                        res.render('prices/index', {
                              title: 'All my Prices',
                              "prices" : prices
                          });
                    },
                    //JSON response will show all prices in JSON format
                    json: function(){
                        res.json(prices);
                    }
                });
              }     
        });
    })
    //POST a new price
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms

	var stock_id = req.body.stock_id;
	var date = req.body.date;
	var adj_close = req.body.adj_close;
	var close = req.body.close;
	var high = req.body.high;
	var low = req.body.low;
	var open = req.body.open;
	var volume= req.body.volume;

//gy        var name = req.body.name;
//gy        var badge = req.body.badge;
//gy        var date = req.body.date;
//gy        var company = req.body.company;
//gy        var isloved = req.body.isloved;
        //call the create function for our database
        mongoose.model('Price').create({
//gy            name : name,
//gy            badge : badge,
//gy            date : date,
//gy            isloved : isloved

	      stock_id: stock_id,
	      date: date,
	      adj_close: adj_close,
	      close: close,
	      high: high,
	      low: low,
	      open: open,
	      volume : volume



        }, function (err, price) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //Price has been created
                  console.log('POST creating new price: ' + price);
                  res.format({
                      //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("prices");
                        // And forward to success page
                        res.redirect("/prices");
                    },
                    //JSON response will show the newly created price
                    json: function(){
                        res.json(price);
                    }
                });
              }
        })
    });
/* GET New Price page. */
router.get('/new', function(req, res) {
    res.render('prices/new', { title: 'Add New Price' });
});

//function priceConverter(volume,open,low,high,close,adj_close,date) {
function priceConverter(volume,open,low,high,close,adj_close,date,stock_id) {
	var objectValueArray = [volume,open,low,high,close,adj_close,date,stock_id];
	var objectNameArray= ['volume','open','low','high','close','adj_close','date','stock_id'];
	console.log('c_close=',close); 
	console.log('objectValueArray[0]',objectValueArray[0]); 
	var sumArray =[];
	for (i = 0; i < 8; i++) {
		if(typeof objectValueArray[i]!="undefined"){
			var stringTemp="\""+objectNameArray[i]+"\""+":\""+objectValueArray[i]+"\"";
			console.log(stringTemp); 
			sumArray.push(stringTemp);
		}
	}
	console.log('sumArray.length=',sumArray.length); 
	var sumString="{";
	for (i = 0; i < sumArray.length; i++) {
		sumString=sumString+sumArray[i];
		if(i==sumArray.length-1) {
			sumString=sumString+"}"
		} else {
			sumString=sumString+",";
		}
	}
	return JSON.parse(sumString);
}
router.get('/findPrice', function(req, res) {
        console.log('inside_1 ' , req.url);

	var query = require('url').parse(req.url,true).query;
	var q_stock_id = query.stock_id;
	var q_volume = query.volume;
	var q_open= query.open;
	var q_low= query.low;
	var q_high= query.high;
	var q_close= query.close;
	var q_adj_close= query.adj_close;
	var q_date=query.date;
	var queryObject="";
	var queryObject=priceConverter(q_volume,q_open,q_low,q_high,q_close,q_adj_close,q_date,q_stock_id);
        console.log('q_stock_id=',q_stock_id);
        console.log('q_volume=',q_volume);
        console.log('q_open=',q_open);
        console.log('q_low=',q_low);
        console.log('q_high=',q_high);
        console.log('q_close=',q_close);
        console.log('q_adj_close=',q_adj_close);
        console.log('q_date=',q_date);
        console.log('inside_2 ' , queryObject);
        console.log('typeof ' , typeof queryObject);
  //  mongoose.model('Price').find({'stock_id':q_stock_id}, function (err, price) {
    mongoose.model('Price').find(queryObject, function (err, price) {
//    mongoose.model('Price').find(JSON.stringify(eval(queryObject)), function (err, price) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + price);
      } else {
        //console.log(price);
        res.format({
		'application/json': function(){
	      	res.send(price);
   		}
	});
      }
    });
  });
// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Price').findById(id, function (err, price) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            console.log(price);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next(); 
        } 
    });
});
router.route('/:id')
  .get(function(req, res) {
    mongoose.model('Price').findById(req.id, function (err, price) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + price._id);
        var pricedate = price.date.toISOString();
        pricedate = pricedate.substring(0, pricedate.indexOf('T'))
        res.format({
          html: function(){
              res.render('prices/show', {
                "pricedate" : pricedate,
                "price" : price
              });
          },
          json: function(){
              res.json(price);
          }
        });
      }
    });
  });

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('Price').findById(req.id, function (err, price) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + price._id);
        var pricedate = price.date.toISOString();
        pricedate = pricedate.substring(0, pricedate.indexOf('T'))
        res.format({
          html: function(){
              res.render('prices/show', {
                "pricedate" : pricedate,
                "price" : price
              });
          },
          json: function(){
              res.json(price);
          }
        });
      }
    });
  });

//router.get('/new', function(req, res) {
//    res.render('prices/new', { title: 'Add New Price' });
//});
//
//router.route('/stock/:stock_id')
//  .get(function(req, res) {
//    mongoose.model('Price').findById(req.stock_id, function (err, price) {
//      if (err) {
//        console.log('GET Error: There was a problem retrieving: ' + err);
//      } else {
//        console.log('GET Retrieving ID: ' + price._id);
//        var pricedate = price.date.toISOString();
//        pricedate = pricedate.substring(0, pricedate.indexOf('T'))
//        res.format({
//          html: function(){
//              res.render('prices/show', {
//                "pricedate" : pricedate,
//                "price" : price
//              });
//          },
//          json: function(){
//              res.json(price);
//          }
//        });
//      }
//    });
//  });


router.route('/:id/edit')
	//GET the individual price by Mongo ID
	.get(function(req, res) {
	    //search for the price within Mongo
	    mongoose.model('Price').findById(req.id, function (err, price) {
	        if (err) {
	            console.log('GET Error: There was a problem retrieving: ' + err);
	        } else {
	            //Return the price
	            console.log('GET Retrieving ID: ' + price._id);
              var pricedate = price.date.toISOString();
              pricedate = pricedate.substring(0, pricedate.indexOf('T'))
	            res.format({
	                //HTML response will render the 'edit.jade' template
	                html: function(){
	                       res.render('prices/edit', {
	                          title: 'Price' + price._id,
                            "pricedate" : pricedate,
	                          "price" : price
	                      });
	                 },
	                 //JSON response will return the JSON output
	                json: function(){
	                       res.json(price);
	                 }
	            });
	        }
	    });
	})
	//PUT to update a price by ID
	.put(function(req, res) {
	    // Get our REST or form values. These rely on the "name" attributes
	var stock_id = req.body.stock_id;
	var date = req.body.date;
	var adj_close = req.body.adj_close;
	var close = req.body.close;
	var high = req.body.high;
	var low = req.body.low;
	var open = req.body.open;
	var volume= req.body.volume;

	    //find the document by ID
	    mongoose.model('Price').findById(req.id, function (err, price) {
	        //update it
	        price.update({
	      stock_id: stock_id,
	      date: date,
	      adj_close: adj_close,
	      close: close,
	      high: high,
	      low: low,
	      open: open,
	      volume : volume
	        }, function (err, priceID) {
	          if (err) {
	              res.send("There was a problem updating the information to the database: " + err);
	          } 
	          else {
	                  //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
	                  res.format({
	                      html: function(){
	                           res.redirect("/prices/" + price._id);
	                     },
	                     //JSON responds showing the updated values
	                    json: function(){
	                           res.json(price);
	                     }
	                  });
	           }
	        })
	    });
	})
	//DELETE a Price by ID
	.delete(function (req, res){
	    //find price by ID
	    mongoose.model('Price').findById(req.id, function (err, price) {
	        if (err) {
	            return console.error(err);
	        } else {
	            //remove it from Mongo
	            price.remove(function (err, price) {
	                if (err) {
	                    return console.error(err);
	                } else {
	                    //Returning success messages saying it was deleted
	                    console.log('DELETE removing ID: ' + price._id);
	                    res.format({
	                        //HTML returns us back to the main page, or you can create a success page
	                          html: function(){
	                               res.redirect("/prices");
	                         },
	                         //JSON returns the item with the message that is has been deleted
	                        json: function(){
	                               res.json({message : 'deleted',
	                                   item : price
	                               });
	                         }
	                      });
	                }
	            });
	        }
	    });
	});
module.exports = router;
