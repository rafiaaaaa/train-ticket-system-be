import express from "express";

const app = express();

app.get("/", (_req, res) => {
  res.send("OK EXPRESS TS JALAN 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("running on " + PORT);
});
