// let map: Array<Array<number>> = []; //// it's the same
var map = [];
var mapLength = 4;
for (var i = 0; i <= mapLength; i++) {
    map.push([0, i]);
    for (var inner = 1; inner <= mapLength; inner++) {
        map.push([inner, i]);
    }
}
