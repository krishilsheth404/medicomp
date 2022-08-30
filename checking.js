const express = require('express'); // Include ExpressJS
const app = express(); // Create an ExpressJS app
const bodyParser = require('body-parser'); // Middleware 
const axios = require('axios')
const cheerio = require('cheerio')
const puppeteer = require('puppeteer');
const request = require('request');
const { link } = require('fs');
const { AddressContext } = require('twilio/lib/rest/api/v2010/account/address');


extractAddress = async(url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url)

        const $ = cheerio.load(data);
        var offers = {};
        // offers.push($('.Coupons_offersListMain__22w6C h2').text())
        // var b = $('.OffersCard_couponBox__1uW5C .OffersCard_detailMainList__38bTS').text()
        $('.OffersCard_couponBox__1uW5C ').each((_idx, el) => {
                var title = $($('.OffersCard_couponBox__1uW5C   h2', el)).text()
                var desc = $($('.OffersCard_detailMainList__38bTS p span', el)).text()
                console.log(title + "----" + desc + '\n');

            })
            // console.log(offers)
            // console.log(b);

        // console.log($.html());


    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        console.log('hey2');
    }
};

extractAddress("https://www.apollopharmacy.in/special-offers");