//dunzo parcel price getter automation
const puppeteer = require('puppeteer')
const express = require('express'); // Include ExpressJS
const app = express(); // Create an ExpressJS app
const bodyParser = require('body-parser'); // Middleware 
const cheerio=require('cheerio');
const { raw } = require('body-parser');
var urlForZomato = `https://google.com/search?q=zomato+khana khazana+opera house,mumbai+order+online`;
        // urlForZomato = urlForZomato.split(' ').join('+')

app.set('view engine', 'ejs');
// app.set('views', './');

var urlForSwiggy, urlForZomato;
var extractLinksOfSwiggy, extractLinksOfZomato, matchedDishes = {};
var matchedDishesForSwiggy, matchedDishesForZomato, tempAddress, discCodesForZomato, addr, linkOld = '';
var z, s, w;
var sdfd, tempurl, tempurl2;
var Offers = 0;
var final = [];
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// var newItem;
// Route to Login Page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});
app.post('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.post('/result', async(req, res) => {
    // Insert Login Code Here   
    const nameOfMed = req.body.dataOfMed + '\n';

    extractLinksOfZomato = async(url) => {
        try {
            // Fetching HTML
            console.log(url);
            const browser = await puppeteer.launch({ headless: false });

             const page = await browser.newPage();
                await page.goto(url, { waitUntil: 'networkidle2' });
                const data = await page.evaluate(() => document.querySelector('*').outerHTML);
                console.log("got the link for zomato");
                // console.log(data)
                // await page.close();

            // Using cheerio to extract <a> tags
            const $ = cheerio.load(data);

            rawUrl = $('.yuRUbf > a').first().attr('href');
            console.log(rawUrl);
            if(rawUrl.includes('/url?q='))
            {
                url = rawUrl.split("/url?q=")[1].split("&")[0];
            }

            if (url.includes("zomato") && !url.includes("/order")) {
                url = url + "/order"
            }
             url=rawUrl
            tempurl = url;
            tempurl = tempurl.split('/');

            for (var i = 0; i < tempurl.length - 1; i++) {
                linkOld += tempurl[i];
                linkOld += '/';
            }
            console.log('linkOld ', linkOld);
            console.log('url ', url);

            return url;

        } catch (error) {
            // res.sendFile(__dirname + '/try.html');
            console.log(error);
        }
    };
    z = await extractLinksOfZomato(urlForZomato);
    console.log('final---'+z);
 
});

const port = process.env.PORT || 4000 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`));