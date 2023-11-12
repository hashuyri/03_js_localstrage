let storage_element = [];
const cell_color = ["white", "black"]; // オセロの色
let choice = 0; // オセロの色変更用
let clicked = false; //ダブルクリック判定用

// htmlのtableタグに対して<tr>タグ<td>タグ<div>タグを追加
for (let i = 0; i < 8; i++) {
    storage_element.push([]); // オセロの盤面を記憶する配列の作成
    const tr = $("<tr>"); // テーブルの行数を設定
    $("table").append(tr);
    for (let j = 0; j < 8; j++) {
        storage_element[i].push(""); // オセロの盤面を記憶する配列の作成
        let div = $("<div>");
        let td = $("<td>");
        div.addClass("cell").attr("data-row", i).attr("data-col", j); // クラス名等を付加
        td.addClass("stage"); // マスのクラス設定
        td.append(div);
        tr.append(td);
    }
}

// 初期の石配置を設定
$("[data-row = 3]" + "[data-col = 3]").css("background-color", cell_color[0]);
$("[data-row = 4]" + "[data-col = 4]").css("background-color", cell_color[0]);
$("[data-row = 3]" + "[data-col = 4]").css("background-color", cell_color[1]);
$("[data-row = 4]" + "[data-col = 3]").css("background-color", cell_color[1]);

// クリックされたセルの色を変える
$(".cell").on("click", function () {
    const cell_row = $(this).attr("data-row");
    const cell_col = $(this).attr("data-col");
    if (clicked) {
        storage_element[cell_row][cell_col] = "";
        console.log(storage_element);
        // ダブルクリックしたセルの色を透明にする
        $(this).css("background-color", "");
        clicked = false;
        return; // 処理終了
    }
    clicked = true;
    setTimeout(() => { // 少し待って再度クリックされなかったらクリック処理を行う
        if (clicked) {
            storage_element[cell_row][cell_col] = choice;
            console.log(storage_element);
            $(this).css("background-color", cell_color[choice]);

            if (choice === 0) { // 白と黒を交互に表示
                choice = 0;
            } else {
                choice = 1;
            }
            clicked = false;
        }
    }, 190);
});

$("#save").on("click", function () {
    const data = {
        tittle: $("#input").val(),
        text: $("#text_area").val()
    }
    const json = JSON.stringify(data);
    localStorage.setItem("data", json);
});

$("#clear").on("click", function () {
    localStorage.removeItem("data");
    $("#input").val("");
    $("#text_area").val("");
});

if (localStorage.getItem("data")) {
    const text = localStorage.getItem("data");
    json = JSON.parse(text);
    console.log(json);
    $("#input").val(json.tittle);
    $("#text_area").val(json.text);
}