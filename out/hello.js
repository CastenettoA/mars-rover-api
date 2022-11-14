var a = [
    { y: 0, x: 0 },
    { y: 0, x: 1 },
    { y: 1, x: 0 },
    { y: 1, x: 1 }
];
var current = { y: 10, x: 0 };
var isEqual = function (point) { return point.x === current.x && point.y == current.y; };
var res = a.some(isEqual);
console.log(res);
/**
 * cosa fa some? è una funzione che:
 * - effettua un loop negli elementi di un array
 * - er ogni elemento chiama la funzione di supporto (in questo caso big)
 * - se la funzione di supporto ritorna TRUE la funzione si blocca.
 * Quindi se un elemento viene trovato la funzione viene bloccata subito
 *  */ 
//# sourceMappingURL=hello.js.map