// データセット
var dataset = [
    { text: "サンプル1", x: 100, y: 50 },
    { text: "サンプル2", x: 200, y: 100 },
    { text: "サンプル3", x: 300, y: 150 },
];

// SVGの幅と高さを指定
var svgWidth = 400;
var svgHeight = 200;

// SVG要素を作成し、描画領域を指定
var svg = d3.select("body").append("svg").attr("width", svgWidth).attr("height", svgHeight);

// データをもとにテキストと四角を描画
svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "rectangle")
    .attr("x", function (d) {
        return d.x - 50;
    }) // 四角の左上のx座標
    .attr("y", function (d) {
        return d.y - 20;
    }) // 四角の左上のy座標
    .attr("width", 100) // 四角の幅
    .attr("height", 40); // 四角の高さ

svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function (d) {
        return d.text;
    }) // テキストを表示
    .attr("class", "text")
    .attr("x", function (d) {
        return d.x;
    }) // テキストのx座標
    .attr("y", function (d) {
        return d.y;
    }); // テキストのy座標

// SVGを画像として保存
var svgString = new XMLSerializer().serializeToString(svg.node());
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var DOMURL = window.URL || window.webkitURL || window;

var img = new Image();
var svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
var url = DOMURL.createObjectURL(svgBlob);

img.onload = function () {
    ctx.drawImage(img, 0, 0);
    var imgURI = canvas.toDataURL("image/png");
    var a = document.createElement("a");
    a.download = "d3_plot.png";
    a.href = imgURI;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    DOMURL.revokeObjectURL(url);
};

img.src = url;
