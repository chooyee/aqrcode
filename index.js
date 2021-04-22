const express = require("express");
const cors = require("cors");
const path = require('path');
const app = express();
const qr = require("./controllers/qr.controller");

require('dotenv').config();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('./public'));

app.use(cors());
app.set('trust proxy', 1) // trust first proxy
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/test", async (req, res) => {
    // QRCode.toDataURL('https://www.google.com', function (err, url) {
    //     res.status(200).send('<img src="' + url+ '">');    
    // })
    const data = 'https://www.google.com';
    var options = {
        text: data,
        width:150,
        height:150,
        // logo:"https://pbs.twimg.com/profile_images/813541500671836160/VZ3p31NW_200x200.jpg",
        // backgroundImage:"https://pbs.twimg.com/profile_images/813541500671836160/VZ3p31NW_200x200.jpg",
        // autoColor:true,
        colorDark : "#9c23ba",
		
    };
    var keys = Object.keys(options);
    for( var i = 0,length = keys.length; i < length; i++ ) {
        console.log(keys[i] + ":" +options[keys[i]]);

    }
    try{
        const datauri = await qr.GenerateQRRaw(options);
        //console.log(datauri);
        res.status(200).send('<img src="' + datauri+ '">');    
    }
    catch(e){
        res.status(500).send(e.message);    
    }
});
// simple route
app.get("/ping", (req, res) => {
    res.status(200).send('pong');    
});

app.get("/home", (req, res) => {
    res.render('pages/home');
});
app.get("/qr", qr.GenerateQR);

app.post("/qr", qr.GenerateQR);


// set port, listen for requests
const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});