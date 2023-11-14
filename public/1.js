const template = (html) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="us">${html}</div>
</body>
</html>`;

a.addEventListener("click", () => {
    const d = window.open("", "_blank");

    // d.document.open();
    d.document.write(template("<h1>Hello</h2>"));
});
