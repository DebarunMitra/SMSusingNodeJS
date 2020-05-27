const express = require('express');
const ejs = require("ejs");
const nexmo = require("nexmo");
const socketio = require("socket.io");
const cors = require('cors');

const app = express();

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

app.use(express.static(__dirname + './public'));

app.use(express.json());
app.use(cors());


app.get('/', (req,res)=>{
    res.render("index");
})

// Catch form submit
app.post('/', (req, res) => {
//   res.send(req.body);
  console.log(req.body);
//   const { number, text } = req.body;
})

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, ()=>{
    console.log(`Server Up in ${PORT} ...`);
    
})