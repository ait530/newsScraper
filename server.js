// Dependencies 
var express = require("express");
var mongojs = require("mongojs");

var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Database Configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];



