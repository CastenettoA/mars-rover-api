let a = [
    {y: 0, x: 0},
    {y: 0, x: 1},
    {y: 1, x: 0},
    {y: 1, x: 1}
];
let current = {y: 10, x: 0};

let isEqual = (point) => point.x === current.x && point.y == current.y;
let res = a.some(isEqual);
console.log(res);


/** 
 * cosa fa some? è una funzione che:
 * - effettua un loop negli elementi di un array
 * - er ogni elemento chiama la funzione di supporto (in questo caso big)
 * - se la funzione di supporto ritorna TRUE la funzione si blocca.
 * Quindi se un elemento viene trovato la funzione viene bloccata subito
 *  */ 