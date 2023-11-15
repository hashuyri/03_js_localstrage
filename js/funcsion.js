// カウントダウンを実行
function countDown(array) {
    if (array[3] == 0) {
        if (array[0] == 0 && array[1] == 0 && array[2] == 0) {
            return;
        }
        array[3] = 9;
        ten = array[2];
        array[2]--;
    } else {
        array[3]--;
    }
    if (ten == 0) {
        array[2] = 5;
        han = array[1];
        array[1]--;
        ten = 1;
    }
    if (han == 0) {
        array[1] = 9;
        sau = array[0];
        array[0]--;
        han = 1;
    }
    if (sau == 0) {
        array[0] = 0;
        sau = 1;
    }
}