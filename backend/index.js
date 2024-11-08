const cors = require('cors');
const express = require("express");
const helmet = require("helmet");
require('dotenv').config();

const corsOptions ={
      origin:'http://localhost:3000',
      credentials:true,            //access-control-allow-credentials:true
      optionSuccessStatus:200
  }
const app = express();
const port = 3300;

app.use(helmet())
app.use(cors(corsOptions));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.get("/", (req, res) => {
  res.json({ message: "ok" });
});


/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
