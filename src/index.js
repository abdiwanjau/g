const express = require("express");
const path = require('path');
const User = require("./models/user");
const mongoose = require("mongoose");
const hbs = require("hbs");
const auth = require("./middleware/auth")

const port = process.env.PORT || 3000

mongoose.connect('mongodb://127.0.0.1:27017/auth', {
  useCreateIndex:true,
  useNewUrlParser:true,
})

const app = express();
const viewPath = path.join(__dirname,"./views/templates")
const partialsPath = path.join(__dirname,"./views/partials")
const publicPath = path.join(__dirname,"./public")

app.use(express.json());
app.set("views",viewPath )
app.set('view engine','hbs')
app.use(express.static(publicPath))
hbs.registerPartials(partialsPath)

app.get("/signup", (req,res) => {
  res.render("signup")
})

app.post("/signup", async (req,res) => {
  const user = new User(req.body);
  try {
    const token = await user.generateToken();
    await user.save();
    res.status(201).send({ user, token })
  } catch(e) {
    res.status(400).send("Sign up failed")
  }
})

app.post("/login", async (req,res) => {
  try {
    const user = await User.findUser(req.body.email, req.body.password);
    const token = await user.generateToken();
    res.send({user, token})
  } catch(e) {
    res.status(400).send(e)
  }
})

app.post("/logout", auth, async (req,res) => {
  req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
  await req.user.save();
  res.send("Logout successful")
})

app.listen(port, () => {
  console.log("Live")
})