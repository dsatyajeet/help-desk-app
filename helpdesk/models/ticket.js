var mongoose = require('mongoose');

module.exports = mongoose.model('Ticket', {
	subject : {type : String, default: ''},
	content : {type : String, default: ''},
	createDate : {type : Date},
	updateDate : {type : Date}
});