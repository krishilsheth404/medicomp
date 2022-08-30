// app using yahoo.com as a search engine
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

        rawUrl = $('li[class=first] .compTitle h3 a').first().attr('href');
        console.log(rawUrl);
        if (rawUrl != undefined) {
            return rawUrl
        } else {
            return '';
        }
        // url = rawUrl.split("/url?q=")[1].split("&")[0];
        // console.log('Extracting url: ', url);


    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        // console.log(error);
        return 0;
    }
};

extractDataOfPharmEasy = async(url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url)

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);
        // console.log($.html());
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
            imgLink: $('.swiper-wrapper img').attr('src'),
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
            imgLink: $('.largeimage img').attr('src'),
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
            link: $('.ProductCard_productCardGrid__rpg72 a').first().attr('href'),
            imgLink: $('.ProductCard_bigAvatar__2D8AB img').attr('src'),
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
        // console.log($.html());
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
extractDataOfOmChemist = async(url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url)

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);

        return {
            name: 'Om Healthcart',
            item: $('.product-name a').first().text().trim(),
            link: $('.product-name a').first().attr('href').trim(),
            imgLink: $('.product-image img').first().attr('src').trim(),
            price: $('.regular-price').first().text().trim(),

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

        if ($('.container-fluid-padded h1').text()) {
            t = $('.container-fluid-padded h1').text();

        } else if ($('.style__pro-title___3G3rr').first().text()) {

            t = $('.style__pro-title___3G3rr').first().text();
        } else if ($('.style__pro-title___3zxNC').first().text()) {
            t = $('.style__pro-title___3zxNC').first().text();
        } else if ($('.style__pro-title___2QwJy').first().text()) {
            t = $('.style__pro-title___2QwJy').first().text();
        } else if ($('.PriceWidget__selectedContainer__cCRai .marginTop-8').first().text()) {
            t = $('.PriceWidget__selectedContainer__cCRai .marginTop-8').first().text();
        } else {
            t = $('h1[class=col-6]').first().text()
        }
        // t = $('.style__pro-title___3G3rr').first().text();


        if ($('.Price__price__22Jxo').text()) {

            m = $('.Price__price__22Jxo').text();

        } else if ($('.style__price-tag___B2csA').first().text()) {

            m = $('.style__price-tag___B2csA').first().text();

        } else if ($('.style__product-pricing___1OxnE').first().text()) {

            m = $('.style__product-pricing___1OxnE').first().text();

        } else if ($('.style__price-tag___cOxYc').first().text()) {
            m = $('.style__price-tag___cOxYc').first().text();
        } else {
            m = $('.l3Regular').first().text();
        }

        console.log(m, "===", t)
        if (m != '') {
            console.log(m);
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
        console.log(m, "===", t)
        if (t == "" && m == "") {
            t = "Not Available";
            m = "Not Available";
        }

        return {
            name: 'Tata 1mg',
            item: t,
            link: url,
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
            imgLink: $('.profile-picture').attr('src'),
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
            imgLink: $('.image_slide').attr('src'),
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
            imgLink: $('.jws-gallery-image img').attr('src'),
            price: $('.price').first().text(),
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
    // try {
    //     let date_ob = new Date();

    //     // current date
    //     // adjust 0 before single digit date
    //     const date = ("0" + date_ob.getDate()).slice(-2);

    //     // current month
    //     const month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    //     // current year
    //     const year = date_ob.getFullYear();
    //     const finalDate = date + '/' + month + '/' + year;

    //     const auth = new google.auth.GoogleAuth({
    //         keyFile: "medicompJson.json",
    //         scopes: "https://www.googleapis.com/auth/spreadsheets",
    //     })
    //     const spreadsheetId = "18AFfkHKArlpCqDuBC6yzfXOkTgOzRGmXeq88uhqQqGo";
    //     const client = await auth.getClient();
    //     const googleSheets = google.sheets({ version: "v4", auth: client });

    //     googleSheets.spreadsheets.values.append({
    //             auth,
    //             spreadsheetId,
    //             range: "Sheet1!A:B",
    //             valueInputOption: "USER_ENTERED",
    //             resource: {
    //                 values: [
    //                     [finalDate, nameOfMed]
    //                 ]
    //             },
    //         })
    //         // console.log(metadata);
    // } catch (error) {
    //     console.log({});
    // }



    // fs.appendFile("data.txt", nameOfMed, function(err) {
    //     if (err) {
    //         return console.log(err);
    //     }
    //     console.log("The file was saved!");
    // });
    // https://www.ask.com/web?q=site:apollopharmacy.in%20crocin%20advance&ad=dirN&o=0
    const urlForPharmEasy = `https://in.search.yahoo.com/search;_ylt=?p=site:pharmeasy.in+${nameOfMed}&ad=dirN&o=0`;
    const urlForNetMeds = `https://in.search.yahoo.com/search;_ylt=?p=site:netmeds.com+${nameOfMed}&ad=dirN&o=0`;
    const urlForApollo = `https://www.apollopharmacy.in/search-medicines/${nameOfMed}`;
    // const urlForHealthmug = `https://www.healthmug.com/search?keywords=${nameOfMed}`;
    const urlForTata = `https://in.search.yahoo.com/search;_ylt=?p=site:1mg.com+${nameOfMed}&ad=dirN&o=0`;
    const urlForOBP = `https://in.search.yahoo.com/search;_ylt=?p=site:tabletshablet.com+${nameOfMed}&ad=dirN&o=0`;
    const urlFormedplusMart = `https://in.search.yahoo.com/search;_ylt=?p=site:pulseplus.in+${nameOfMed}&ad=dirN&o=0`;
    const urlForMyUpChar = `https://in.search.yahoo.com/search;_ylt=?p=site:myupchar.com+${nameOfMed}&ad=dirN&o=0`;
    const urlForOmChemist = `https://omhealthcart.com/catalogsearch/result/?q=${nameOfMed}`
   
    const items = [urlForNetMeds, urlForPharmEasy, urlForTata, urlForOBP, urlFormedplusMart, urlForMyUpChar];
    const item = [],
        final = [];
    // getLinks = async() => {
    //     for (const item of items) {
    //         // await fetchItem(item)
    //         // if (t != '') {
    //         if (item.includes('netmeds')) {
    //             final.push(
    //                     await extractLinkFromyahoo(item)
    //                 ) // final.push(await extractDataOfNetMeds(t));
    //         } else if (item.includes('1mg')) {

    //             final.push(
    //                 await extractLinkFromyahoo(item)
    //             )


    //             // final.push(await extractDataOfTata(t));
    //         } else if (item.includes('myupchar')) {
    //             final.push(
    //                 await extractLinkFromyahoo(item)
    //             )

    //             console.log(urlForMyUpChar);

    //             // final.push(await extractDataOfmedplusMart(t));
    //         } else if (item.includes('pharmeasy')) {
    //             // console.log('yes in it');
    //             final.push(

    //                 await extractLinkFromyahoo(item)
    //             )

    //             // console.log(urlForMyUpChar);

    //             // final.push(await extractDataOfmedplusMart(t));
    //         } else if (item.includes('pulseplus')) {
    //             // console.log('yes in it');
    //             final.push(
    //                 await extractLinkFromyahoo(item)
    //             )

    //             // console.log(urlForMyUpChar);

    //             // final.push(await extractDataOfmedplusMart(t));
    //         } else if (item.includes('tabletshablet')) {
    //             // console.log('yes in it');
    //             final.push(
    //                 await extractLinkFromyahoo(item)
    //             )

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
    // console.log(final);


    // const item = [];
    // item.push(
    //     await extractLinkFromyahoo(urlForPharmEasy),
    // )
    // item.push(
    //     await extractLinkFromyahoo(urlForNetMeds),
    // )
    // item.push(
    //     await extractLinkFromyahoo(urlForTata),
    // )
    // item.push(
    //     await extractLinkFromyahoo(urlForMyUpChar),
    // )
    // item.push(
    //     await extractLinkFromyahoo(urlForOBP),
    // )
    // item.push(
    //     await extractLinkFromyahoo(urlFormedplusMart),
    // )
    async function getData(item) {
        console.log('---');

        // final.push(await extractDataOfHealthmug(urlForHealthmug))

        final.push(await extractDataOfApollo(urlForApollo))
        await Promise.all(item.map(async(item) => {
            if (item != undefined || item != 0 || item != 'undefined') {
                if (item.includes('netmeds')) {
                    final.push(await extractDataOfNetMeds(item))
                        // await fetchItem(item) 
                } else if (item.includes('1mg')) {
                    // final.push(await extractDataOfTata(item))
                        // await fetchItem(item) 
                } else if (item.includes('pharmeasy')) {
                    final.push(await extractDataOfPharmEasy(item))
                        // await fetchItem(item) 
                } else if (item.includes('tabletshablet')) {
                    final.push(await extractDataOfOBP(item))
                        // await fetchItem(item) 
                } else if (item.includes('pulseplus')) {
                    final.push(await extractDataOfmedplusMart(item))
                        // await fetchItem(item) 
                } else if (item.includes('myupchar')) {
                    final.push(await extractDataOfMyUpChar(item))
                        // await fetchItem(item) 
                } else if (item.includes(undefined)) {
                    console.log('~~');
                }
                // await fetchItem(item) 

            } else {
                console.log('`')
            }
        }))

        // final.push(await extractDataOfOmChemist(urlForOmChemist))
        // final.push(await extractDataOfSS(urlForSS));


        final.push(nameOfMed);
        console.log(final);



        res.render('final', { final: final });

    }

    await axios.all([extractLinkFromyahoo(urlForNetMeds), extractLinkFromyahoo(urlForPharmEasy), extractLinkFromyahoo(urlForTata), extractLinkFromyahoo(urlForOBP), extractLinkFromyahoo(urlFormedplusMart), extractLinkFromyahoo(urlForMyUpChar)])
        .then(await axios.spread(async(...responses) => {
            // console.log(...responses);

            item.push(responses[0])
            item.push(responses[1])
            item.push(responses[2])
            item.push(responses[3])
            item.push(responses[4])
            item.push(responses[5])

            console.log(item);

            getData(item);
        }))



});

const port = process.env.PORT || 3000 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`));