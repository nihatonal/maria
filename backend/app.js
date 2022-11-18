const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const carsRoutes = require("./routes/cars-routes");
const friendsRoutes = require("./routes/friends-routes");
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const conversationRoutes = require("./routes/conversation-routes");
const messageRoutes = require("./routes/message-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

const cors = require("cors");

const corsOptions = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "DELETE, GET, OPTIONS, PATCH, POST, PUT",
  "Access-Control-Allow-Headers":
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/cars", carsRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/message", messageRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wu6wj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    console.log(err);
  });

//   const fs = require("fs");
// const path = require("path");

// const express = require("express");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");

// const carsRoutes = require("./routes/cars-routes");
// const usersRoutes = require("./routes/users-routes");
// const HttpError = require("./models/http-error");

// const app = express();

// app.use(bodyParser.json());

// const cors = require("cors");

// const corsOptions = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "DELETE, GET, OPTIONS, PATCH, POST, PUT",
//   "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept, Authorization",
//   origin: "*",
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };
// app.use(cors(corsOptions));
// app.use("/uploads/images", express.static(path.join("uploads", "images")));

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//   );
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

//   next();
// });

// app.use("/api/cars", carsRoutes);
// app.use("/api/users", usersRoutes);

// app.use((req, res, next) => {
//   const error = new HttpError("Could not find this route.", 404);
//   throw error;
// });

// app.use((error, req, res, next) => {
//   if (res.headerSent) {
//     return next(error);
//   }
//   res.status(error.code || 500);
//   res.json({ message: error.message || "An unknown error occurred!" });
// });

// mongoose
//   .connect(
//     `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wu6wj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
//   )
//   .then(() => {
//     app.listen(5000);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
