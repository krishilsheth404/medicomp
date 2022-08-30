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

const url = "https://www.apollopharmacy.in/otc/dolo-650mg-tablet-15-s";

// Async function which scrapes the data
async function scrapeData() {
    // Fetch HTML of the page we want to scrape
    const { data } = await axios.get(url);
    // Load HTML we fetched in the previous line
    const $ = cheerio.load(data);
    const NameOfSubs=[];
    const PriceOfSubs=[];
    const ImgLinkOfSubs=[];
       
        $('.ProductSubstituteWidget_productTitle__t4qgT').each(function(i, elm) {
            NameOfSubs.push($(this).text()) // for name 
        });
        $('.ProductSubstituteWidget_priceGroup__1crky').each(function(i, elm) {
            PriceOfSubs.push($(this).text()) // for price 
        });
        $('.ProductSubstituteWidget_productIcon__16R4h img').each(function(i, elm) {
            ImgLinkOfSubs.push($(this).attr('src')) // for imgLink 
        });
        console.log('PRODUCT SUBSTITUTES-.\n');
        for(var i=0;i<NameOfSubs.length;i++){
            console.log(NameOfSubs[i]+'-'+PriceOfSubs[i]+'-'+ImgLinkOfSubs[i]+'\n');
        }

    // console.log($('.product-name a').first().attr('href').trim())
    // console.log($('.product-image img').first().attr('src').trim())
    // console.log($('.product-name a').first().text().trim())
    // console.log($('.regular-price').first().text().trim())
    // console.log($('.yfrtbx a').attr('href').trim()); 
    // console.log($('#ncard0').first().text().trim());
    // console.log($('.green-box').first().text().trim())
    // console.log($('.rt_count').fi    rst().text().trim())
    // console.log($('.distnctxt').first().text().trim())
    // Select all the list items in plainlist class

    // console.log($('.product-item-name').first().text().trim());
    // console.log($('[data-price-type=finalPrice]').first().text().trim());


}
// Invoke the above function
scrapeData()