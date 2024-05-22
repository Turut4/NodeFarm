const fs = require("fs");
const http = require("http");
const { URL } = require("url");

//server

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

  return output;
};
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const myUrl = new URL(req.url, `https://${req.headers.hostname}`);
  const { searchParams, pathname } = myUrl;
  const query = Object.fromEntries(searchParams.entries());
  console.log(query);
  //Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-Type": "text/html" });

    const cardHtml = dataObj
      .map((card) => replaceTemplate(tempCard, card))
      .join("");
    const output = tempOverview.replace("{%PRODUCTS_CARD%}", cardHtml);

    res.end(output);

    //Product page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-Type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    //API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-Type": "application/JSON" });
    res.end(data);

    //Not found
  } else {
    res.writeHead(404, {
      "content-type": "text/html",
    });
    res.end("<h1>this is a 404 page<h1>");
  }
});
const port = 8000;
const localhost = "127.0.0.1";
server.listen(port, localhost, () => {
  console.log(`Server is running on port ${port}`);
});
