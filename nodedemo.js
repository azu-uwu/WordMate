console.log("Xin chào Node.js!");
let name = "Admin";
let age = 20;

console.log("Tên:", name);
console.log("Tuổi:", age);

function message(){
	return 'Vietpro Academy';	
}
// export ra đối tương
module.exports = {
	'message': message	
}

// export ra hàm
module.exports = message;