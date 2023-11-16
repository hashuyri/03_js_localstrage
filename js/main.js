let storage_element = [];
const cell_color = ["white", "black"]; // オセロの色
let choice = 0; // オセロの色変更用
let clicked = false; //ダブルクリック判定用
let play_time = [0, 0, 0, 0]; // プレイ時間管理用
let play_time_control; // プレイ時間管理用
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

if (localStorage.getItem("data")) {
    $("#start").text("再スタート");
}
$(".fix_button").hide(); // ボタンを隠す

$("#start").on("click", function () {
    $(".fix_button").show(); // ボタンを表示
    // もしセーブデータがあれば
    if (localStorage.getItem("data")) {
        const text = localStorage.getItem("data");
        json = JSON.parse(text);
        console.log(json);
        play_time = json.count_time;
        $("#first").val(json.first_text);
        white_time = json.first_time;
        $("#second").val(json.second_text);
        black_time = json.second_time;
        storage_element = json.stone_array;

        // プレー時間（セーブデータ）を表示
        play_time_control = String(play_time[0]) + String(play_time[1]) + "：" + String(play_time[2]) + String(play_time[3]);
        $("#playtime").append("<p>" + "PlayTime ： " + play_time_control + "</p>");

        // セーブした石の配置を再現
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (storage_element[i][j] === 0) {
                    // <table>タグ内の「i * 8 + j」番目のdivタグに色を付ける
                    $("table div").eq(i * 8 + j).css("background-color", cell_color[0]);
                } else if (storage_element[i][j] === 1) {
                    $("table div").eq(i * 8 + j).css("background-color", cell_color[1]);
                }
            }
        }
    } else {
        // 初期の石配置を設定
        $("[data-row = 3]" + "[data-col = 3]").css("background-color", cell_color[0]);
        storage_element[3][3] = 0;
        $("[data-row = 4]" + "[data-col = 4]").css("background-color", cell_color[0]);
        storage_element[4][4] = 0;
        $("[data-row = 3]" + "[data-col = 4]").css("background-color", cell_color[1]);
        storage_element[3][4] = 1;
        $("[data-row = 4]" + "[data-col = 3]").css("background-color", cell_color[1]);
        storage_element[4][3] = 1;

        // プレー時間（初期値）を表示
        play_time_control = String(play_time[0]) + String(play_time[1]) + "：" + String(play_time[2]) + String(play_time[3]);
        $("#playtime").append("<p>" + "PlayTime ： " + play_time_control + "</p>");
    }

    // お互いの制限時間（初期値）を表示
    $("#white_button").text(String(black_time[0]) + String(black_time[1]) + "：" + String(black_time[2]) + String(black_time[3]));
    $("#black_button").text(String(black_time[0]) + String(black_time[1]) + "：" + String(black_time[2]) + String(black_time[3]));

    // 先攻（白）のカウントダウンスタート
    $("#white_button").css("border-color", "red");
    $("#white_button").css("background-color", "white");
    $("#black_button").css("background-color", "black");
    $("#black_button").css("color", "white");

    white_count = setInterval(function () {
        countDown(white_time);
        $("#white_button").text(String(white_time[0]) + String(white_time[1]) + "：" + String(white_time[2]) + String(white_time[3]));
    }, 1000);

    // プレー時間をカウントする
    setInterval(function () {
        if (play_time[3] === 9) {
            play_time[3] = 0;
            play_time[2]++;
        } else {
            play_time[3]++;
        }
        if (play_time[2] === 6) {
            play_time[2] = 0;
            play_time[1]++;
            ten = 1;
        }
        if (play_time[1] === 10) {
            play_time[1] = 0;
            play_time[0]++;
            han = 1;
        }
        if (play_time[0] === 10) {
            play_time[0] = 0;
            sau = 1;
        }
        play_time_control = String(play_time[0]) + String(play_time[1]) + "：" + String(play_time[2]) + String(play_time[3]);
        const jeneral_time = "PlayTime ： " + play_time_control;
        $("#playtime p").text(jeneral_time);
        const json_time = JSON.stringify(jeneral_time);
        localStorage.setItem("time", json_time);
    }, 1000);
    $("#start").hide(); // スタートボタンを隠す
});

$("#white_button").on("click", function () {
    // 先攻（白）のカウントを止める
    clearInterval(white_count);
    $("#black_button").css("border-color", "red");
    $("#white_button").css("border-color", "");
    // 後攻（黒）のカウントを実行
    black_count = setInterval(function () {
        countDown(black_time);
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
        countDown(white_time);
        $("#white_button").text(String(white_time[0]) + String(white_time[1]) + "：" + String(white_time[2]) + String(white_time[3]));
    }, 1000);
});

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
            if (storage_element[cell_row][cell_col] === 0) {
                choice = 1;
            } else if (storage_element[cell_row][cell_col] === 1) {
                choice = 0;
            }
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

// 停戦ボタンを押したときローカルストレージにデータを記憶しリロード
$("#save").on("click", function () {
    const data = {
        count_time: play_time,
        first_text: $("#first").val(),
        first_time: white_time,
        second_text: $("#second").val(),
        second_time: black_time,
        stone_array: storage_element
    }
    const json = JSON.stringify(data);
    localStorage.setItem("data", json);
    $(location).prop("href", location.href);
});

// クリアボタンを押したときローカルストレージのデータを削除しリロード
$("#clear").on("click", function () {
    localStorage.removeItem("data");
    $(location).prop("href", location.href);
});