/* 初期化 */

function init() {
	fetch('/ngmbk/api')
		.then(response => {
			return response.json().then(json => {
				const defaultdata = [];
				for (let i = 0; i < json.length; i++) {
					defaultdata.push({ x: json[i]['ris'], y: json[i]['ret'] });
				}
				graphchange(defaultdata);
				tablechange(defaultdata);
				changeRiskReturn(defaultdata);
			});
		});
	fetch('/ngmbk/nest')
		.then(nest => {
			return nest.json().then(json => {
				alldata = json;
				for (let key in alldata) {
					let op = document.createElement("option");
					op.value = key;
					op.text = key;
					document.getElementById("block").appendChild(op);
				}
			});
		})
}

/* パラメータを受け取りグラフ・テーブル・対象範囲・リスクリターンを一気にチェンジ */

function fetchAndChange(block, branch, salesman) {
	const array = [];
	if (block != undefined && block !== "blockAll") {
		array.push("block=" + block);
	}
	if (branch != undefined && branch !== "branchAll") {
		array.push("branch=" + branch);
	}
	if (salesman != undefined && salesman !== "salesmanAll") {
		array.push("salesman=" + salesman);
	}

	let url;

	if (array.length != 0) {
		const join = array.join("&");
		url = "/ngmbk/api?" + join;
	} else {
		url = "/ngmbk/api";
	}

	fetch(url).then(response => {
		return response.json().then(json => {
			const changedata = [];
			for (let i = 0; i < json.length; i++) {
				changedata.push({ x: json[i]['ris'], y: json[i]['ret'] });
			}
			graphchange(changedata);
			tablechange(changedata);
			rangechange();
			changeRiskReturn(changedata);
		});
	});
}

/* パラメータ */
let alldata;
let block = 'blockAll';
let branch;
let salesman;


/* グラフを更新する処理 */

function graphchange(changedata) {
	myScatterChart.data.datasets[0].data = changedata;
	myScatterChart.update();
}

/* テーブルを更新する処理 */

function tablechange(changedata) {
	let table = document.getElementById("riskReturnTable");

	while (table.rows[1]) {
		table.deleteRow(1);
	}

	for (let i = 0; i < changedata.length; i++) {
		let row = table.insertRow(-1);

		row.insertCell(-1).innerText = changedata[i].x;
		row.insertCell(-1).innerText = changedata[i].y;
	}

}

/* 対象範囲の表示を更新する処理 */

function rangechange() {
	if (block == 'blockAll') {
		document.getElementById("range").value = '全てのブロック';
	} else {
		if (branch == 'branchAll') {
			document.getElementById("range").value = 'ブロック' + block;
		} else {
			if (salesman == 'salesmanAll') {
				document.getElementById("range").value = '支店' + branch;
			} else {
				document.getElementById("range").value = '営業員' + salesman;
			}
		}
	}
}


/* リスク・リターンを計算・更新する処理 */
function changeRiskReturn(data) {
	let Risk = 0;
	let Return = 0;

	for (let i = 0; i < data.length; i++) {
		Risk += data[i].x;
		Return += data[i].y;
	}
	Risk = Risk / data.length;
	Return = Return / data.length;

	document.getElementById("risk").value = Math.round(Risk * 1000) / 1000;
	document.getElementById("return").value = Math.round(Return * 1000) / 1000;
}


/* selectのoptionを更新する処理 */

function optionchange0() {
	block = document.getElementById("block").value;
	let parentBr = document.getElementById('branch');
	let parentSa = document.getElementById('salesman');
	clearChild(parentBr);
	clearChild(parentSa);
	branch = 'branchAll';
	salesman = 'salesmanAll';

	if (block != 'blockAll') {
		let op = document.createElement("option");
		op.value = 'branchAll';
		op.text = '全て';
		document.getElementById("branch").appendChild(op);
		for (let key in alldata[block]) {
			let op = document.createElement("option");
			op.value = key;
			op.text = key;
			document.getElementById("branch").appendChild(op);
		}
	}

	fetchAndChange(block, branch, salesman);
}

function optionchange1() {
	branch = document.getElementById("branch").value;
	let parentSa = document.getElementById('salesman');
	clearChild(parentSa);
	salesman = 'salesmanAll';

	if (branch != 'branchAll') {
		let op = document.createElement("option");
		op.value = 'salesmanAll';
		op.text = '全て';
		document.getElementById("salesman").appendChild(op);
		for (let key of alldata[block][branch]) {
			let op = document.createElement("option");
			op.value = key;
			op.text = key;
			document.getElementById("salesman").appendChild(op);
		}
	}
	fetchAndChange(block, branch, salesman);
}

function optionchange2() {
	salesman = document.getElementById("salesman").value;
	fetchAndChange(block, branch, salesman);
}

//selectのoptionを全削除

function clearChild(parent) {
	while (parent.lastChild) {
		parent.removeChild(parent.lastChild);
	}
}