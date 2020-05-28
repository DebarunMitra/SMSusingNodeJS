const express = require("express");
const ejs = require("ejs");
const Nexmo = require("nexmo");
const socketio = require("socket.io");
const cors = require("cors");
const key = require('./key.json');

const app = express();

app.set("view engine", "html");
app.engine("html", ejs.renderFile);

app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(cors());

const nexmo = new Nexmo(
  {
    apiKey: key["API-KEY"],
    apiSecret: key["API-SECRET"],
  },
  { debug: true }
);

app.get("/", (req, res) => {
  res.render("index");
});

// Catch form submit
app.post("/", (req, res) => {
  // console.log(req.body);
  let phoneNumber = req.body.number;
  let textSMS = req.body.text;

  const from = "Vonage APIs";
  const to = phoneNumber;
  const text = textSMS;
  const opts = {
    type: "unicode",
  };

  nexmo.message.sendSms(from, to, text, opts, (err, responseData) => {
    if (err) {
      console.log(err);
    } else {
      if (responseData.messages[0]["status"] === "0") {
        console.log("Message sent successfully.");
      } else {
        console.log(
          `Message failed with error: ${responseData.messages[0]["error-text"]}`
        );
      }
      const { messages } = responseData;
      const {
        ["message-id"]: id,
        ["to"]: number,
        ["error-text"]: error,
      } = messages[0];
      const data = {
        id,
        number,
        error,
      };

      // Emit to the client
      io.emit("smsStatus", data);
    }
  });
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server Up in ${PORT} ...`);
});

// Connect to socket.io
const io = socketio(server);
io.on("connection", (socket) => {
  console.log("Connected");
  io.on("disconnect", () => {
    console.log("Disconnected");
  });
});
