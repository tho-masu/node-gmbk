const defauledata = [];

const DAO = require("./DAO");
/*
DAO.selectData("A").then(res => {
    for (let i = 0; i < res.rows.length; i++) {
        console.log(res.rows[i]);
    }
});
*/
DAO.getNest().then(nest=>console.log(JSON.stringify(nest)));