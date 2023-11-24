const a = { a: 1234 };
a.b = a;

const str = JSON.stringify(a);

console.log(str);
