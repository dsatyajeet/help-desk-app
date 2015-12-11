var mongoose = require('mongoose');

module.exports = mongoose.model('Ticket', {
	userName : {type : String, required:true},
	subject : {type : String, default: ''},
	content : {type : String, default: ''},
	status : {type : String, default: 'NEW'},
	createDate : {type : Date},
	updateDate : {type : Date}
});