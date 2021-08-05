let fs =  require("fs");
let url = require('url');
let connection = require("./../../database/index.js")
exports.getUsers = (req, res)=>{
	var params = url.parse(req.url, true).query;
	fs.readFile( __dirname+"../../../public/datas/user.json", 'utf8', (err, data) =>{
		// console.error(err)
		if(params && params.id){
			let data_ = JSON.parse(data)
			let end_ = JSON.stringify( data_['user'+params.id] )
			console.log(end_)
			res.end( end_ );
		}else{
			res.end( data );
		}
	});
}
exports.setUsers = (req, res)=>{

	let user_add = req.body.user;
	fs.readFile( __dirname+"../../../public/datas/user.json", 'utf8', (err, data) =>{
		let data_ = JSON.parse(data)
		data_['user'+user_add.id] = user_add;
		
		fs.writeFile(__dirname+"../../../public/datas/user.json",JSON.stringify(data_),(err1)=>{
			res.end( JSON.stringify(data_) );
		})
	});
}
exports.login = (req, res)=>{
	let sql = `SELECT * FROM user WHERE name='${req.body.name}' AND password='${req.body.password}'` 
	connection.query(sql,(err, result)=>{
		if(err){
			console.log('[SELECT ERROR] - ',err.message);
			return;
		}
		if(result && result.length > 0){
			res.end('登录成功！')
		}else{
			res.end("用户名或密码错误！")
		}
	})
}
exports.addUsers = (req, res)=>{
	let sql_query = `SELECT * FROM user WHERE name='${req.body.name}'`;
	connection.query(sql_query,(err, result)=>{
		if(err){
			console.log('[SELECT ERROR] - ',err.message);
			return;
		}
		if(result && result.length > 0){
			res.end('用户名重复！')
		}else{
			var  sql_add = 'INSERT INTO user(name,password) VALUES(?,?)';
			var  sql_add_params = [req.body.name, req.body.password];
			connection.query(sql_add,sql_add_params,function (err, result) {
				if(err){
					console.log('[INSERT ERROR] - ',err.message);
					return;
				}
				if(result){
					console.log(result)
					res.end('添加成功！')
				}
			})
		}
	})
}
exports.update = (req, res)=>{
	let sql_query = `SELECT * FROM user WHERE name='${req.body.name}' AND password='${req.body.oldpassword}'`;
	connection.query(sql_query,(err, result)=>{
		if(err){
			console.log('[SELECT ERROR] - ',err.message);
			return;
		}
		if(result && result.length <= 0){
			res.end('用户名或旧密码错误')
		}else{
			var  sql_update = `UPDATE user SET password = ? WHERE id = '${result[0].id}'`;
			var  sql_update_params = [ req.body.newpassword];
			connection.query(sql_update,sql_update_params,function (err, result) {
				if(err){
					console.log('[UPDATE ERROR] - ',err.message);
					return;
				}
				if(result){
					res.end('更新成功！')
				}
			})
		}
	})
}