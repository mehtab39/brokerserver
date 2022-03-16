require("dotenv").config();
require("./config/db")();
const express = require("express");
const app = express();
const ordercontroller = require("./controllers/order.controller");
const usercontroller = require("./controllers/user.controller");
const nsecontroller = require("./controllers/nse.controller");
app.use(express.json());
app.use("/order", ordercontroller);
app.use("/user", usercontroller);
app.use("/nse", nsecontroller);
// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.status(500).json(err);
});
var port = process.env.PORT || 3000;
app.set("port", port);
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
