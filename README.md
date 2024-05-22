
# Node.js Server with Templating

This project demonstrates a simple Node.js server that serves static HTML templates and dynamically generates content based on product data.

## Features

- **Static HTML Templating**: Uses placeholders to dynamically generate HTML content.
- **Simple HTTP Server**: Serves HTML content and JSON data over HTTP.

## Project Structure

```
├── dev-data
│   └── data.json                # JSON file containing product data
├── templates
│   ├── template-overview.html   # HTML template for the overview page
│   ├── template-card.html       # HTML template for individual product cards
│   └── template-product.html    # HTML template for product detail page
└── index.js                     # Main server code
```

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/your-repo.git
   cd NodeFarm
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

## Running the Server

1. Start the server:
   ```sh
   node index.js
   ```

2. Open your browser and navigate to `http://127.0.0.1:8000` to view the overview page.

### Available Routes

- `/` or `/overview`: Displays the overview page with product cards.
- `/product?id=<product_id>`: Displays the product detail page for the specified product ID.
- `/api`: Returns the product data as JSON.
- Any other route will return a 404 page.

## Detailed Explanation

### HTML Templating

The project uses simple string replacement to generate dynamic HTML content. The `replaceTemplate` function replaces placeholders in the HTML templates with actual product data.

### Server Code

The server is created using the built-in `http` module. It handles different routes to serve the overview page, product detail page, and API endpoint.

```javascript
const fs = require("fs");
const http = require("http");
const { URL } = require("url");

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

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const myUrl = new URL(req.url, `http://${req.headers.host}`);
  const { searchParams, pathname } = myUrl;
  const query = Object.fromEntries(searchParams.entries());
  
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-Type": "text/html" });

    const cardHtml = dataObj.map((card) => replaceTemplate(tempCard, card)).join("");
    const output = tempOverview.replace("{%PRODUCTS_CARD%}", cardHtml);

    res.end(output);

  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-Type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);

  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);

  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("<h1>Page not found</h1>");
  }
});

const port = 8000;
const localhost = "127.0.0.1";
server.listen(port, localhost, () => {
  console.log(`Server is running on port ${port}`);
});
```

## Contributing

Feel free to open issues or submit pull requests for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
```

Replace the placeholder `https://github.com/yourusername/your-repo.git` with your actual repository URL. This README provides a comprehensive overview and instructions for setting up and running the Node.js server project.
