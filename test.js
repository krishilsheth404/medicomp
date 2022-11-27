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
const { off } = require('process');
// var urlForSwiggy, urlForZomato;
// var extractLinksOfSwiggy, extractLinksOfZomato, matchedDishes = {};
// var matchedDishesForSwiggy, matchedDishesForZomato, tempAddress, discCodesForZomato, addr, linkOld = '';
// var z, s, w;
// var sdfd, tempurl, tempurl2;
// var Offers = 0;
app.set('view engine', 'ejs');
app.use(express.static(__dirname));
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
app.post('/details', async (req, res) => {
    // Insert Login Code Here

    const final = [];


    urlForPe = `https://www.apollopharmacy.in/search-medicines/${req.body.foodItem}`;

    extractdoe = async (url) => {
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

extractDataForAds = async (url) => {

    try {
        // Fetching HTML
        const { data } = await axios.get(url);

        const $ = cheerio.load(data);
        // console.log($.html());
        

        return {
            type: 'ad',
            name:$('.resultTitle').first().text().trim(),
            link: $('.resultTitle a').first().attr('href').trim(),
            imgLink: '',
            price: 'Ratings  ' + $('.ratevalue').first().text().trim(),
            number: $('.cardElement').first().text().trim(),
        };

    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        // console.log(error);
        return {};
    }
}
extractLinkFromyahoo = async (url) => {
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
        console.log(error);
        return 0;
    }
};




getOffersOfPharmeasy=async()=>{

    const { data } = await axios.get(`https://pharmeasy.in/offers`)

    // Using cheerio to extract <a> tags
    const $ = cheerio.load(data);
    const offers=[];
    $('.OffersCard_title__1CZHB').map((i, elm) => {
        offers.push($(elm).text());
     });
    return offers;
}
extractDataOfPharmEasy = async (url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url)

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);
       
        

        const offers=await getOffersOfPharmeasy();
           
        // console.log(offers)
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
            offer:offers,
        };
    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        // console.log(error);

        console.log(error);
        return {};
    }
};

getOffersOfNetmeds=async()=>{
    const { data } = await axios.get(`https://netmeds.com/offers`)

    // Using cheerio to extract <a> tags
    const $ = cheerio.load(data);
    const offers=[];
    $('.offer-coupon').map((i, elm) => {
        offers.push($(elm).text());
     });
    return offers;
}
extractDataOfNetMeds = async (url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url);

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);
        // console.log($.html());
        const offers=await getOffersOfNetmeds();


        return {
            name: 'NetMeds',
            link: url,
            item: $('.product-detail').text(),
            imgLink: $('.largeimage img').attr('src'),
            price: $('#last_price').attr('value'),
            offer:offers,
        };

    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        // console.log(error);
        return {};
    }
};


getOffersOfApollo=async()=>{
    const { data } = await axios.get(`https://www.apollopharmacy.in/special-offers`)

    // Using cheerio to extract <a> tags
    const $ = cheerio.load(data);
    const offers=[];
    $('.OffersCard_title__1U6VE').map((i, elm) => {
        offers.push($(elm).text());
     });
    return offers;
}
extractDataOfApollo = async (url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url)

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);
        // console.log($.html());
        var t, m;
        const offers=await getOffersOfApollo();

      

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
        if(m){
            if(m.includes('₹')){
                m=m.split('₹')[1];
            }
        }

        return {
            name: 'Apollo',
            item: t,
            link: "https://apollopharmacy.in"+$('.ProductCard_productCardGrid__rpg72 a').first().attr('href'),
            imgLink: $('.ProductCard_bigAvatar__2D8AB img').attr('src'),
            price: m,
            offer:offers,
        };

    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        // console.log(error);
        return {};
    }
};


extractDataOfHealthmug = async (url) => {
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
extractDataOfOmChemist = async (url) => {
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
extractDataOfTata = async (url) => {
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

getOffersOfMedplusMart=async()=>{
    const { data } = await axios.get(`https://www.pulseplus.in/offers`)

    // Using cheerio to extract <a> tags
    const $ = cheerio.load(data);
    const offers=[];
    $('#accordion h2').each(function(i, elm) {
        offers.push($(elm).text());
     });
    return offers;
}
extractDataOfmedplusMart = async (url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url)

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);
        // console.log($.html());
                const offers=await getOffersOfMedplusMart();


        var t = $('span[property=price]').attr('content');

        return {
            name: 'PulsePlus',
            item: $('#divProductTitle>h1').text(),
            link: url,
            imgLink: $('.profile-picture').attr('src'),
            // price: $('.DrugPriceBox__price___dj2lv').text(),
            // price: $('span[property=priceCurrency]').text()
            price: t,
            offer:offers,
        };

    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        // console.log(error);
        return {};
    }
};

getOffersOfMyUpChar=async()=>{
    const { data } = await axios.get(`https://www.myupchar.com/en/offers`)

    // Using cheerio to extract <a> tags
    const $ = cheerio.load(data);
    const offers=[];
    $('.offers-bx h2').each(function(i, elm) {
        offers.push($(elm).text());
     });
    return offers;
}
extractDataOfMyUpChar = async (url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url)

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);

        const offers=await getOffersOfMyUpChar();
        
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
            offer:offers,
        };

    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        console.log(error);
        return {};
    }
};


extractDataOfOBP = async (url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url)

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);
        // console.log($.html());
        var p=$('.price').first().text();
        if(p){
            if(p.includes(" – "))
            {
                console.log(p)
                p=p.split(" – ")[0];
                console.log(p)
            }
        }
        if(p){
            if(p.includes('₹')){
                p=p.split('₹')[1];
            }
        }

        return {
            name: 'Tablet Shablet',
            item: $('.entry-title').text(),
            link: url,
            imgLink: $('.jws-gallery-image img').attr('src'),
            price: p,
            offer:[],
        };

    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        // console.log(error);
        return {};
    }
};


extractDataOfIndiMedo = async (url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url)

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);
        // console.log($.html());

        return {
            name: 'IndiMedo',
            item: $('.tt-old-details-1-1-1 h3').text(),
            link: url,
            imgLink: $('.xzoom-container img').attr('src'),
            price: $('.regular-price span').first().text(),
        };

    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        // console.log(error);
        return {};
    }
};



const nameOfMed = [], final = [];





app.post('/result', async (req, res) => {
    // Insert Login Code Here
     final.length = 0;
    nameOfMed.length = 0;
    nameOfMed.push(req.body.finalmed) + '\n';
    console.log('first name->'+nameOfMed[0]);
    // const city = req.body.city + '\n';
    const linkForSubs=[];


    const urlForPharmEasy = `https://in.search.yahoo.com/search;_ylt=?p=site:pharmeasy.in+${nameOfMed[0]}&ad=dirN&o=0`;
    console.log(urlForPharmEasy)
    const urlForNetMeds = `https://in.search.yahoo.com/search;_ylt=?p=site:netmeds.com+${nameOfMed[0]}&ad=dirN&o=0`;
    const urlForApollo = `https://www.apollopharmacy.in/search-medicines/${nameOfMed[0]}`;
    const urlForIndiMedo= `https://in.search.yahoo.com/search;_ylt=?p=${nameOfMed[0]}+site:indimedo.com+&ad=dirN&o=0`;
    // const urlForHealthmug = `https://www.healthmug.com/search?keywords=${nameOfMed[0]}`;
    const urlForTata = `https://in.search.yahoo.com/search;_ylt=?p=site:1mg.com+${nameOfMed[0]}&ad=dirN&o=0`;
    const urlForOBP = `https://in.search.yahoo.com/search;_ylt=?p=site:tabletshablet.com+${nameOfMed[0]}&ad=dirN&o=0`;
    const urlFormedplusMart = `https://in.search.yahoo.com/search;_ylt=?p=site:pulseplus.in+${nameOfMed[0]}&ad=dirN&o=0`;
    const urlForMyUpChar = `https://in.search.yahoo.com/search;_ylt=?p=site:myupchar.com+${nameOfMed[0]}&ad=dirN&o=0`;
    // const urlForAd = `https://in.search.yahoo.com/search;_ylt=?p=site:asklaila.com chemist shops in ${city}&ad=dirN&o=0`;
    const urlForOmChemist = `https://omhealthcart.com/catalogsearch/result/?q=${nameOfMed[0]}`

    const item = [];
  
    extractSubsfApollo = async (url,final) => {
        try {
            // Fetching HTML
            url=url.split('?')[0];
            // url="https://apollopharmacy.in"+url;
            console.log('got it->'+url);
            const { data } = await axios.get(url)
            const NameOfSubs=[];
            const PriceOfSubs=[];
            const ImgLinkOfSubs=[];
            // Using cheerio to extract <a> tags
            const $ = cheerio.load(data);
            // console.log($.html());
            const subs=[];

            $('.ProductSubstituteWidget_productTitle__t4qgT').each(function(i, elm) {
                NameOfSubs.push($(this).text()) // for name 
            });
            $('.ProductSubstituteWidget_priceGroup__1crky').each(function(i, elm) {
                PriceOfSubs.push($(this).text()) // for price 
            });
            $('.ProductSubstituteWidget_productIcon__16R4h img').each(function(i, elm) {
                ImgLinkOfSubs.push($(this).attr('srcset')) // for imgLink 
            });
            if(NameOfSubs=='')
            {
                console.log('method 2');
                $('.CommonWidget_productTitle__2FRMY').each(function(i, elm) {
                    NameOfSubs.push($(this).text()) // for name 
                });
                $('.CommonWidget_priceGroup__1resK').each(function(i, elm) {
                    PriceOfSubs.push($(this).text()) // for price 
                });
                $('.CommonWidget_productIcon__ky-JT img').each(function(i, elm) {
                    ImgLinkOfSubs.push($(this).attr('srcset')) // for imgLink 
                });
            }
            console.log('PRODUCT SUBSTITUTES-.\n');
            for(var i=0;i<NameOfSubs.length;i++){
                final.push({
                    subsname:NameOfSubs[i],
                    subsprice:PriceOfSubs[i],
                    subsImgLink:ImgLinkOfSubs[i],
            })
            // console.log(final);
           }
    
         
    
        } catch (error) {
            // res.sendFile(__dirname + '/try.html');
            // res.sendFile(__dirname + '/error.html');
            // console.log(error);
            return error;
        }
    };


  

            
    await Promise.all([extractLinkFromyahoo(urlForNetMeds), extractLinkFromyahoo(urlForPharmEasy),extractLinkFromyahoo(urlForOBP), 
        extractLinkFromyahoo(urlFormedplusMart), extractLinkFromyahoo(urlForMyUpChar)])
        .then(await axios.spread(async (...responses) => {
            // console.log(...responses);

            item.push(responses[0])
            item.push(responses[1])
            item.push(responses[2])
            item.push(responses[3])
            item.push(responses[4])

            console.log(item);
            await Promise.all([extractDataOfNetMeds(item[0]), extractDataOfPharmEasy(item[1]),
            extractDataOfOBP(item[2]), extractDataOfmedplusMart(item[3]), extractDataOfMyUpChar(item[4]),extractDataOfApollo(urlForApollo)])
                .then(await axios.spread(async (...responses) => {
                    // console.log(...responses);
        
                    final.push(responses[0])
                    final.push(responses[1])
                    final.push(responses[2])
                    final.push(responses[3])
                    final.push(responses[4])
                    final.push(responses[5])
                    await extractSubsfApollo(final[final.length-1].link,final);
        
                }))
                final.sort((a, b) => a.price - b.price); // b - a for reverse sort
                console.log(final);

                final.push(nameOfMed[0]);
              
                console.log('Found Everything Sir!..')
                res.render('final', { final: final });


         // getData(item);
            }))


            
         

            // console.log(final[1]);
            // console.log(final);
           


});


app.post('/final', async (req, res) => {
    // Insert Login Code Here
    // Insert Login Code Here

    const browser= await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ]
    });;

    async function extractDataOfmedplusmartOg(medname) {
        try {
            // Fetching HTML
            console.log('url:'+nameOfMed);
          
         
        
            const urlFormedplusMartOg = await extractLinkFromyahoo(`https://in.search.yahoo.com/search;_ylt=?p=site:medplusmart.com+${nameOfMed}&ad=dirN&o=0`);
            console.log(urlFormedplusMartOg)
            // await browser.close();
            // console.log(data)
            // await page.close();
            // Using cheerio to extract <a> tags
            const page1 = await browser.newPage();
            await page1.goto(urlFormedplusMartOg, { waitUntil: 'networkidle2' });
            var data= await page1.evaluate(() => document.querySelector('*').outerHTML); +"";
            // await browser.close();
    
            const $ = cheerio.load(data);
            var a = $('.mrp-details-div h2').text().trim();
            if (!a) {
                a = $('.mrp-details-div h3').text().trim();
            }
            if(a.includes('₹')){
                a=a.split('₹')[1];
            }
            console.log('value of medplus'+a);
            // a=a.split('MRP')[1].trim();//price
    
            var imgUrl = $('.zoomWindowContainer div').attr('style');
            if(imgUrl){
            if(imgUrl.includes('url("')){
                imgUrl = imgUrl.split('url("')[1];
            }
            if(imgUrl.includes('")')){
                imgUrl = imgUrl.split('")')[0];
            }
        }
            var url="";
            return {
                name: 'MedPlusMart',
                item: $('.composition-details h1').text().trim(),
                price: a,
                imgLink: imgUrl,
                link: urlFormedplusMartOg,
            }
    
        } catch (error) {
            // res.sendFile(__dirname + '/try.html');
            console.log(error);
        }
    }
    async function extractDataOfDhani(medname) {
        try {
            // Fetching HTML
         
        const urlForDhani = await extractLinkFromyahoo(`https://in.search.yahoo.com/search;_ylt=?p=site:dhani.com+${nameOfMed}&ad=dirN&o=0`);
        // await extractLinkFromyahoo(`https://in.search.yahoo.com/search;_ylt=?p=site:wellnessforever.com+${nameOfMed}&ad=dirN&o=0`);
        
        const page1 = await browser.newPage();
        await page1.goto(urlForDhani, { waitUntil: 'networkidle2' });
        var data= await page1.evaluate(() => document.querySelector('*').outerHTML); +"";
        // await browser.close();
        //    console.log(typeof(final.datafordhani));
            const $ = cheerio.load(data);
            // var a = $('.product-name').text().trim();
          
            // a=a.split('MRP')[1].trim();//price
    
            var imgUrl = $('.img-section img').attr('src');
            var url="";
            
            return {
                name: 'Dhani Pharmacy',
                item: $('.product-name').text().trim(),
                price: $('.price-area-txt--existing').first().text(),
                imgLink: imgUrl,
                link: urlForDhani,
            }
    
        } catch (error) {
            // res.sendFile(__dirname + '/try.html');
            console.log(error);
        }
    
    }
    async function extractDataOfWelnessForever(medname) {
        try {
            // Fetching HTML
         
        const urlForWelnessForever = await extractLinkFromyahoo(`https://in.search.yahoo.com/search;_ylt=?p=site:wellnessforever.com+${nameOfMed}&ad=dirN&o=0`);
        const page1 = await browser.newPage();
        await page1.goto(urlForWelnessForever, { waitUntil: 'networkidle2' });
        var data= await page1.evaluate(() => document.querySelector('*').outerHTML); +"";
        // await browser.close();
        //    console.log(typeof(final.datafordhani));
            const $ = cheerio.load(data);
          
            var imgUrl = $('.ngxImageZoomContainer img').attr('src');
            var price=$('.infoPrice').text();
            if(price.includes('Rs')){
                price=price.split('Rs')[1];
            }
            // var url="";
            
            return {
                name: 'Wellness Forever',
                item: $('.prdName').text().trim(),
                price: price,
                imgLink: imgUrl,
                link: urlForWelnessForever,
            }
    
        } catch (error) {
            // res.sendFile(__dirname + '/try.html');
            console.log(error);
        }
    }
    async function extractDataOfPracto(urlForPracto) {
        try {
            // Fetching HTML
         
    
            console.log("name->"+nameOfMed)
        const urlForPracto = await extractLinkFromyahoo(`https://in.search.yahoo.com/search;_ylt=?p=site:practo.com+${nameOfMed}&ad=dirN&o=0`);
        // await extractLinkFromyahoo(`https://in.search.yahoo.com/search;_ylt=?p=site:wellnessforever.com+${nameOfMed}&ad=dirN&o=0`);
        
        const page2 = await browser.newPage();
        await page2.goto(urlForPracto, { waitUntil: 'networkidle2' });
        var data= await page2.evaluate(() => document.querySelector('*').outerHTML); +"";
        // await browser.close();
        //    console.log(typeof(final.datafordhani));
            const $ = cheerio.load(data);
            console.log($.html());
          
            var imgUrl = $('.image-carousel--image_wrapper img').attr('src');
            // var url="";
            
            return {
                name: 'Practo',
                item: $('.heading-alpha').text().trim(),
                price: $('.heading-beta-bold').text(),
                imgLink: imgUrl,
                link: urlForPracto,
            }
    
        } catch (error) {
            // res.sendFile(__dirname + '/try.html');
            console.log(error);
        }
    }


    console.log('name of med =>' + nameOfMed[0])
    await Promise.all([extractDataOfDhani(nameOfMed[0]),extractDataOfWelnessForever(nameOfMed[0]),extractDataOfmedplusmartOg(nameOfMed[0])])
        .then(await axios.spread(async (...responses) => {
            // console.log(...responses);

            final.push(responses[0])
            final.push(responses[1])
            final.push(responses[2])
           
            // await extractSubsfApollo(final[final.length-1].link,final);

        }))
    
        await browser.close();
        final.sort((a, b) => a.name - b.name); // b - a for reverse sort
        final.push(nameOfMed[0]);
        // nameOfMed.pop();
    
    res.render('secondFinal', { final: final });

})


const port = process.env.PORT || 1000 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`));
