const express = require("express");
const categories = require("./routes/categories");
const listings = require("./routes/listings");
const listing = require("./routes/listing");
const users = require("./routes/users");
const user = require("./routes/user");
const auth = require("./routes/auth");
const creditCard = require("./routes/creditCard.route");
const my = require("./routes/my");
const messages = require("./routes/messages");
const expoPushTokens = require("./routes/expoPushTokens");
const product = require("./routes/products.route");
const helmet = require("helmet");
const compression = require("compression");
const config = require("config");
const app = express();
const rating = require("./routes/rating");
const productActions = require("./routes/productActions.route");
const imageGetProduct = require("./routes/imageGetProduct");
//const messages =  require('./routes/messages.route');

app.use(express.static("public"));
app.use(express.json());
app.use(helmet());
app.use(compression());

app.use("/api/categories", categories);
app.use("/api/listing", listing);
app.use("/api/listings", listings);
app.use("/api/user", user);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/my", my);
app.use("/api/expoPushTokens", expoPushTokens);
app.use("/api/messages", messages);
app.use("/api/products", product);
app.use("/api/rating", rating);
app.use("/api/creditCard", creditCard);
app.use("/api/productActions", productActions);
app.use("/api/imageGetProduct", imageGetProduct);

const port = process.env.PORT || config.get("port");
app.listen(port, function() {
  console.log(`Server started on port ${port}...`);
});
