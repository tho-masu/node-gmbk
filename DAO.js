const DBManager = require("./DBManager");

function selectData(block, branch, salesman) {
    const array = [];
    if (block != undefined) {
        array.push("block=" + "'" + block + "'");
    }
    if (branch != undefined) {
        array.push("branch=" + "'" + branch + "'");
    }
    if (salesman != undefined) {
        array.push("salesman=" + "'" + salesman + "'");
    }

    let query;

    if (array.length != 0) {
        const join = array.join(" AND ");
        query = "SELECT* FROM DATA WHERE " + join;
    } else {
        query = "SELECT* FROM DATA";
    }
    return DBManager.execute(query);
}

async function getNest() {
    const nest = {};
    const blockList = await getBlockList();
    for (let i = 0; i < blockList.length; i++) {
        nest[blockList[i]] = {};
        const branchList = await getBranchList(blockList[i]);
        for (let j = 0; j < branchList.length; j++) {
            nest[blockList[i]][branchList[j]] = [];
            const salesmanList = await getSalesmanList(branchList[j]);
            for (let k = 0; k < salesmanList.length; k++) {
                nest[blockList[i]][branchList[j]].push(salesmanList[k]);
            }
        }
    }

       /* 努力の結晶（ゴミ）
       getBlockList().then(blockList => {
            for (let i = 0; i < blockList.length; i++) {
                nest[blockList[i]] = await getBranch(blockList[i])
                    .then(branchList => {
                        for (let j = 0; j < branchList.length; j++) {
                            nest[blockList[i]][branchList[j]] = await getSalesman(branchList[j])
                                .then(salesmanList => {
                                    for (let k = 0; k < salesmanList.length; k++) {
                                        nest[blockList[i]][branchList[j]].push(salesmanList[k]);
                                    }
                                    return nest;
                                });
                        }
                        return nest
                    });
            }
            return nest;
        });
        return nest;
        */

    return nest;
}

async function getBlockList() {
    const query = "SELECT DISTINCT block FROM DATA ORDER BY block ASC;"
    const blockList = [];
    return DBManager.execute(query)
        .then(rs => rs.rows)
        .then(rsrows => {
            for (let i = 0; i < rsrows.length; i++) {
                blockList.push(rsrows[i]['block']);
            }
            return blockList;
        });
}

async function getBranchList(where) {
    const query = "SELECT DISTINCT branch FROM DATA WHERE block = '" + where + "' ORDER BY branch ASC;"
    const branchList = [];
    return DBManager.execute(query)
        .then(rs => rs.rows)
        .then(rsrows => {
            for (let i = 0; i < rsrows.length; i++) {
                branchList.push(rsrows[i]['branch']);
            }
            return branchList;
        });
}

async function getSalesmanList(where) {
    const query = "SELECT DISTINCT salesman FROM DATA WHERE branch = '" + where + "' ORDER BY salesman ASC;"
    const salesmanList = [];
    return DBManager.execute(query)
        .then(rs => rs.rows)
        .then(rsrows => {
            for (let i = 0; i < rsrows.length; i++) {
                salesmanList.push(rsrows[i]['salesman']);
            }
            return salesmanList;
        });
}


module.exports.selectData = selectData;
module.exports.getNest = getNest;