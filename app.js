const express = require("express");
const app = express();
const port = 3000;
const routes = require("./routes");

// Parsing req dari FE / postman
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(routes);

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
