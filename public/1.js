window.arr1 = [1, 2, 3];
window.arr2 = ["a", "f", "s"];

Object.defineProperty(arr1, "fn", {
    value() {
        console.log(this);
    },
});
Object.defineProperty(arr2, "fn1", {
    value: () => {
        console.log("acscasc");
    },
});
