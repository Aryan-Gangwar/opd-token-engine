const express = require("express");
const app = express();

const tokenRoutes = require("./routes/tokenRoutes");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("OPD Token Engine Running");
});

app.use("/tokens", tokenRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
