
var mongoose = require('mongoose');  
var priceSchema = new mongoose.Schema({  
	stock_id: [Number],
  	date: { type: Date, default: Date.now },
	adj_close: [Number],
	close: [Number],
	high: [Number],
	low: [Number],
	open: [Number],
	volume: [Number]
});
mongoose.model('Price', priceSchema);

//date,adj_close,close,high,low,open,volume
