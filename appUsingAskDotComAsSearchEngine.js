// app backup slow version of test.js
const express = require('express'); // Include ExpressJS
const app = express(); // Create an ExpressJS app
const bodyParser = require('body-parser'); // Middleware 
const axios = require('axios')
const path = require('path');
const cheerio = require('cheerio')
const puppeteer = require('puppeteer');
const request = require('request');
const fs = require('fs');

const ejs = require("ejs");
const { AddressContext } = require('twilio/lib/rest/api/v2010/account/address');
const { getElementsByTagType } = require('domutils');

// var urlForSwiggy, urlForZomato;
// var extractLinksOfSwiggy, extractLinksOfZomato, matchedDishes = {};
// var matchedDishesForSwiggy, matchedDishesForZomato, tempAddress, discCodesForZomato, addr, linkOld = '';
// var z, s, w;
// var sdfd, tempurl, tempurl2;
// var Offers = 0;
app.set('view engine', 'ejs');
// app.set('views', './');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// var newItem;
// Route to Login Page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/name.html');
});
app.post('/', (req, res) => {
    res.sendFile(__dirname + '/name.html');
});


app.post('/details', async(req, res) => {
    // Insert Login Code Here

    const final = []


    urlForPe = `https://www.apollopharmacy.in/search-medicines/${req.body.foodItem}`;

    extractdoe = async(url) => {
        try {
            // Fetching HTML
            const { data } = await axios.get(url)

            // Using cheerio to extract <a> tags
            const $ = cheerio.load(data);
            var temp;
            // BreadCrumb_peBreadCrumb__2CyhJ
            $('.ProductCard_productName__2LhTY').map((i, elm) => {
                if ($(elm).text().includes('Apollo')) {

                } else {
                    final.push($(elm).text());
                    console.log($(elm).text())
                }
            })
            final.sort();
            final.push(req.body.foodItem);
            console.log(final)

        } catch (error) {
            // res.sendFile(__dirname + '/try.html');
            // res.sendFile(__dirname + '/error.html');
            // console.log(error);

            // console.log(error);
            return {};
        }
    };
    await extractdoe(urlForPe);
    res.render('name', { final: final });
});

extractLinkFromAskDotCom = async(url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url)
            // console.log(data)

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);
        // console.log($.html());

        rawUrl = $('.PartialSearchResults-item-title-link').first().attr('href');
        console.log(rawUrl);
        // url = rawUrl.split("/url?q=")[1].split("&")[0];
        // console.log('Extracting url: ', url);

        return rawUrl;

    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        console.log(error);
        return 0;
    }
};
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/name.html');
// });

// extractLinkFromGoogle = async(url) => {
//     try {
//         // Fetching HTML
//         const { data } = await axios.get(url)

//         // Using cheerio to extract <a> tags
//         const $ = cheerio.load(data);


//         rawUrl = $('.kCrYT>a').first().attr('href');
//         url = rawUrl.split("/url?q=")[1].split("&")[0];
//         console.log('Extracting url: ', url);

//         return url;

//     } catch (error) {
//         // res.sendFile(__dirname + '/try.html');
//         // res.sendFile(__dirname + '/error.html');
//         console.log(error);
//         return 0;
//     }
// };

extractLinkFromyahoo = async(url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url)
            // console.log(data)

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);
        // console.log($.html());

        rawUrl = $('.compTitle h3 a').first().attr('href');
        console.log(rawUrl);
        // url = rawUrl.split("/url?q=")[1].split("&")[0];
        // console.log('Extracting url: ', url);

        return rawUrl;

    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        console.log(error);
        return 0;
    }
};

extractDataOfPharmEasy = async(url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url)

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);
        console.log($.html());
        var temp;
        // BreadCrumb_peBreadCrumb__2CyhJ
        $('.BreadCrumbLink_breadCrumb__LljfJ').map((i, elm) => {
            temp = $(elm).text();
        })
        var price = $('.PriceInfo_ourPrice__P1VR1').text();
        if (price == '') {
            price = $('.ProductPriceContainer_mrp__pX-2Q').text();
        }

        if (price != '') {
            if (price.includes('*')) {
                price = price.split('*')[0];
            }
            if (price.includes('₹')) {
                price = price.split('₹')[1];
            }
        }


        return {
            name: 'PharmEasy',
            link: url,
            item: temp,
            price: price,
        };
    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        // console.log(error);

        console.log(error);
        return {};
    }
};
extractDataOfNetMeds = async(url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url);

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);
        // console.log($.html());

        return {
            name: 'NetMeds',
            link: url,
            item: $('.product-detail').text(),
            price: $('#last_price').attr('value'),
        };

    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        // console.log(error);
        return {};
    }
};
extractDataOfApollo = async(url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url)

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);
        // console.log($.html());
        var t, m;
        t = $('.PdpWeb_productDetails__3K6Dg').first().text();
        if (t == '') {
            t = $('.ProductCard_productName__2LhTY').first().text();
        }

        m = $('.MedicineInfoWeb_medicinePrice__ynSpV').first().text();
        if (m == '') {
            m = $('.ProductCard_priceGroup__Xriou').first().text();
        }

        if (m != '') {
            if (m.includes(')')) {
                m = m.split(')')[1];
            }
        }

        return {
            name: 'Apollo',
            item: t,
            link: url,
            // item: item,
            price: m,
        };

    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        // console.log(error);
        return {};
    }
};
extractDataOfHealthmug = async(url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url)

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);
        console.log($.html());
        var a = $('script[type=application/ld+json]')[1];
        a = JSON.parse(a);
        console.log(a);

        return {
            name: 'Healthmug',
            item: a.name,
            link: url,
            // item: item,
            price: $('.price-area-txt').text(),
        };

    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        // console.log(error);
        return {};
    }
};
extractDataOfSS = async(url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url)

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);
        // console.log($.html());
        var t, m;

        t = $('.hedertitel').text()
        if ($('.hedertitel').text() != '') {
            t = $('.hedertitel').text();
        } else {
            t = $('.DispNamePlaceHolder h1').text();
        }

        m = $('.pad5 h4').first().text();
        if (m == '') {
            m = $('.pricetitle').first().text();
        } else {
            m = "NA";
        }


        return {
            name: 'OBf',
            item: t,
            link: url,
            // item: item,
            price: m,
        };

    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        // console.log(error);
        return {};
    }
};
extractDataOfTata = async(url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url);

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);
        var t, m;
        // console.log($.html());

        if ($('.container-fluid-padded h1').text() != "") {

            t = $('.container-fluid-padded h1').text();

        } else if ($('.style__pro-title___3G3rr').first().text() != "") {

            t = $('.style__pro-title___3G3rr').first().text();
        } else if ($('.style__pro-title___3zxNC').first().text() != '') {
            t = $('.style__pro-title___3zxNC').first().text();
        } else {
            t = $('.style__pro-title___2QwJy').first().text();
        }
        // t = $('.style__pro-title___3G3rr').first().text();


        if ($('.Price__price__22Jxo').text() != "") {

            m = $('.Price__price__22Jxo').text();

        } else if ($('.style__price-tag___B2csA').first().text() != '') {

            m = $('.style__price-tag___B2csA').first().text();

        } else if ($('.style__product-pricing___1OxnE').first().text() != '') {

            m = $('.style__product-pricing___1OxnE').first().text();

        } else {
            m = $('.style__price-tag___cOxYc').first().text();

        }

        if (m != '') {
            // console.log(m);
            if (m.includes('off')) {


                if (m.includes("MRP")) {
                    m = m.split("MRP")[0];
                }
                if (m.includes('₹')) {
                    m = m.split("₹")[1];
                }
            } else if (m.includes('MRP')) {
                m = m.split("MRP")[1].trim();
                if (m.includes('₹')) {
                    m = m.split('₹')[1];
                }
            } else {
                m = m;
            }
        }

        if (t == "" && m == "") {
            t = "Not Available";
        }
        return {
            name: 'Tata 1mg',

            item: t,
            link: url,
            // item: item,
            // price: $('.DrugPriceBox__price___dj2lv').text(),
            price: m,
        };

    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        // console.log(error);
        return {};
    }
};
extractDataOfmedplusMart = async(url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url)

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);
        // console.log($.html());

        var t = $('span[property=price]').attr('content');

        return {
            name: 'PulsePlus',
            item: $('#divProductTitle>h1').text(),
            link: url,
            // item: item,
            // price: $('.DrugPriceBox__price___dj2lv').text(),
            // price: $('span[property=priceCurrency]').text()
            price: t
        };

    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        // console.log(error);
        return {};
    }
};
extractDataOfMyUpChar = async(url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url)

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);
        // console.log($.html());
        var a = $('.head h1').first().text();
        // console.log(a);
        var b = $('.price_txt .txt_big').first().text();
        // console.log(b);
        if (b != '') {
            if (b.includes('₹')) {
                b = b.split('₹')[1];
            }
        }

        return {
            name: 'myupchar',
            item: a,
            link: url,
            price: b,
        };

    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        console.log(error);
        return {};
    }
};



extractDataOfOBP = async(url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url)

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);
        // console.log($.html());

        return {
            name: 'Tablet Shablet',
            item: $('.entry-title').text(),
            link: url,
            // item: item,
            price: $('.price .woocommerce-Price-amount bdi').first().text(),
        };

    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        // console.log(error);
        return {};
    }
};

app.post('/result', async(req, res) => {
    // Insert Login Code Here

    const nameOfMed = req.body.dataOfMed + '\n';

    // fs.appendFile("data.txt", nameOfMed, function(err) {
    //     if (err) {
    //         return console.log(err);
    //     }
    //     console.log("The file was saved!");
    // });
    console.log(nameOfMed);

    const urlForPharmEasy = `https://search.aol.com/aol/search;_ylt=?q=site:pharmeasy.in+${nameOfMed}`;
    const urlForNetMeds = `https://search.aol.com/aol/search;_ylt=?q=site:netmeds.com+${nameOfMed}`;
    const urlForApollo = `https://www.apollopharmacy.in/search-medicines/${nameOfMed}`;
    // urlForHealthmug = `https://www.healthmug.com/search?keywords=${nameOfMed}`;
    // urlForSS = `https://www.google.com/search?q=onebharatpharmacy.com+${nameOfMed}`;
    const urlForTata = `https://search.aol.com/aol/search;_ylt=?q=site:1mg.com+${nameOfMed}`;
    const urlForOBP = `https://search.aol.com/aol/search;_ylt=?q=site:tabletshablet.com+${nameOfMed}`;
    // const urlFormedplusMart = `https://search.aol.com/aol/search;_ylt=?q=pulseplus.in+${nameOfMed}`;
    const urlForMyUpChar = `https://search.aol.com/aol/search;_ylt=?q=site:myupchar.com+${nameOfMed}`;
    const listOfItems = [urlForPharmEasy, urlForNetMeds, urlForTata, urlForOBP, urlForMyUpChar];
    // getLinks = async() => {
    //     for (const item of items) {
    //         // await fetchItem(item)
    //         // if (t != '') {
    //         if (item.includes('netmeds')) {
    //             urlForNetMeds =
    //                 await extractLinkFromyahoo(item)
    //                 // final.push(await extractDataOfNetMeds(t));
    //         } else if (item.includes('1mg')) {

    //             urlForTata = await extractLinkFromyahoo(item)


    //             // final.push(await extractDataOfTata(t));
    //         } else if (item.includes('myupchar')) {
    //             urlForMyUpChar =
    //                 await extractLinkFromyahoo(item);

    //             console.log(urlForMyUpChar);

    //             // final.push(await extractDataOfmedplusMart(t));
    //         } else if (item.includes('pharmeasy')) {
    //             // console.log('yes in it');
    //             urlForPharmEasy =
    //                 await extractLinkFromyahoo(item);

    //             // console.log(urlForMyUpChar);

    //             // final.push(await extractDataOfmedplusMart(t));
    //         } else if (item.includes('pulseplus')) {
    //             // console.log('yes in it');
    //             urlFormedplusMart =
    //                 await extractLinkFromyahoo(item);

    //             // console.log(urlForMyUpChar);

    //             // final.push(await extractDataOfmedplusMart(t));
    //         } else if (item.includes('tabletshablet')) {
    //             // console.log('yes in it');
    //             urlForOBP =
    //                 await extractLinkFromyahoo(item);

    //             // console.log(urlForMyUpChar);

    //             // final.push(await extractDataOfmedplusMart(t));
    //         }

    //         // if(a!=1){
    //         //     final.push(extractLinkFromGoogle('https://www.google.com/search?q=site:pharmeasy/com'))
    //         // }
    //         // } // linkNames.push(t);
    //     }
    // }
    // await getLinks();


    // const items = await Promise.all([
    const Ufpe = await extractLinkFromyahoo(urlForPharmEasy)
    const Ufnm = await extractLinkFromyahoo(urlForNetMeds)
    const Uft = await extractLinkFromyahoo(urlForTata)
    const Ufmuc = await extractLinkFromyahoo(urlForMyUpChar)
        // await extractLinkFromyahoo(urlForOBP),
    const Ufobp = await extractLinkFromyahoo(urlForOBP);
    // ]);
    // axios.all([axios.get(urlForPharmeasy)])
    // .then(axios.spread(urlForPharmEasy){
    //     console.log(axios.spread(urlForPharmEasy));
    // })

    const final = await Promise.all([
        await extractDataOfApollo(urlForApollo),
        await extractDataOfPharmEasy(Ufpe),
        await extractDataOfNetMeds(Ufnm),
        await extractDataOfTata(Uft),
        await extractDataOfMyUpChar(Ufmuc),
        // await extractDataOfOBP(items[4]),
        await extractDataOfOBP(Ufobp),
    ]);

    final.push(nameOfMed);
    console.log(final)
        // fs.appendFile("data.txt", nameOfMed, function(err) {
        //     if (err) {
        //         return console.log(err);
        //     }
        //     console.log("The file was saved!");
        // });


    try {
        res.render('final', { final: final });
    } catch (error) {
        res.render('error.html', { final: final });
    }

});

app.get('/pastdata', (req, res) => {
    res.sendFile(__dirname + '/data.txt');
});
const port = process.env.PORT || 5000 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`));