var express = require('express');
var router = express.Router();
var getUsers = require("../server/users/getUsers.js")

/* GET users listing. */
router.get('/', (req, res)=>{
	try{
		getUsers.getUsers(req, res)
	}
	catch(err){
		console.log(err)
	}
});

router.post('/setUsers', (req, res)=>{
	getUsers.setUsers(req, res)
});

router.post('/login', (req, res)=>{
	getUsers.login(req, res)
});

router.post('/addUsers', (req, res)=>{
	getUsers.addUsers(req, res)
});

router.post('/update', (req, res)=>{
	try{
		getUsers.update(req, res)
	}catch(err){
		console.error(err)
		res.end(err.toString())
	}
});
module.exports = router;
