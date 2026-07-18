const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "node_test"
});

db.connect((err) => {
    if (err) {
        console.log("Lỗi:", err);
        return;
    }

    console.log("Kết nối MySQL thành công!");
});