let storage_element = [];
const cell_color = ["white", "black"]; // オセロの色
let choice = 0; // オセロの色変更用
let clicked = false; //ダブルクリック判定用
let white_time = [3, 0, 0, 0]; // カウントダウン用
let black_time = [3, 0, 0, 0]; // カウントダウン用
let white_count; // カウントダウン一時停止用
let black_count; // カウントダウン一時停止用
let ten = 1; // 「十秒桁」管理用
let han = 1; // 「分」管理用
let sau = 1; // 「十分桁」管理用

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
storage_element[3][3] = 0;
$("[data-row = 4]" + "[data-col = 4]").css("background-color", cell_color[0]);
storage_element[4][4] = 0;
$("[data-row = 3]" + "[data-col = 4]").css("background-color", cell_color[1]);
storage_element[3][4] = 1;
$("[data-row = 4]" + "[data-col = 3]").css("background-color", cell_color[1]);
storage_element[4][3] = 1;

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
                choice = 1;
            } else {
                choice = 0;
            }
            clicked = false;
        }
    }, 190);
});

$("#white_button").on("click", function () {
    // 先攻（白）のカウントを止める
    clearInterval(white_count);
    $("#black_button").css("border-color", "red");
    $("#white_button").css("border-color", "");
    // 後攻（黒）のカウントを実行
    black_count = setInterval(function () {
        if (black_time[3] == 0) {
            if (black_time[0] == 0 && black_time[1] == 0 && black_time[2] == 0) {
                return;
            }
            black_time[3] = 9;
            ten = black_time[2];
            black_time[2]--;
        } else {
            black_time[3]--;
        }
        if (ten == 0) {
            black_time[2] = 5;
            han = black_time[1];
            black_time[1]--;
            ten = 1;
        }
        if (han == 0) {
            black_time[1] = 9;
            sau = black_time[0];
            black_time[0]--;
            han = 1;
        }
        if (sau == 0) {
            black_time[0] = 0;
            sau = 1;
        }
        $("#black_button").text(String(black_time[0]) + String(black_time[1]) + "：" + String(black_time[2]) + String(black_time[3]));
    }, 1000);
});

$("#black_button").on("click", function () {
    // 後攻（黒）のカウントを止める
    clearInterval(black_count);
    $("#white_button").css("border-color", "red");
    $("#black_button").css("border-color", "");
    // 先攻（白）のカウントを実行
    white_count = setInterval(function () {
        if (white_time[3] == 0) {
            if (white_time[0] == 0 && white_time[1] == 0 && white_time[2] == 0) {
                return;
            }
            white_time[3] = 9;
            ten = white_time[2];
            white_time[2]--;
        } else {
            white_time[3]--;
        }
        if (ten == 0) {
            white_time[2] = 5;
            han = white_time[1];
            white_time[1]--;
            ten = 1;
        }
        if (han == 0) {
            white_time[1] = 9;
            sau = white_time[0];
            white_time[0]--;
            han = 1;
        }
        if (sau == 0) {
            white_time[0] = 0;
            sau = 1;
        }
        $("#white_button").text(String(white_time[0]) + String(white_time[1]) + "：" + String(white_time[2]) + String(white_time[3]));
    }, 1000);
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