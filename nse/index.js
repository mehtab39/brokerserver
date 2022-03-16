var NSEAPI = require('./services');

function getMarketStatus() {
  return NSEAPI.getMarketStatus();
}


function getIndices() {
  return NSEAPI.getIndices();
}

function getSectorsList() {
  return NSEAPI.getSectorsList();
}

function getQuotes(symbol) {
  return NSEAPI.getQuotes(symbol);
}


function getQuoteInfo(symbol) {
  return NSEAPI.getQuoteInfo(symbol);
}


function getMultipleQuoteInfo(symbols) {
  return Promise.all(symbols.map(async (symbol) => {
    const res = await NSEAPI.getQuoteInfo(symbol)
    return res.data;
  }))
}


function getGainers() {
  return NSEAPI.getGainers();
}


function getLosers() {
  return NSEAPI.getLosers();
}


function getInclineDecline() {
  return NSEAPI.getInclineDecline();
}


function getIndexStocks(slug) {
  return NSEAPI.getIndexStocks(slug);
}



function getIntraDayData(symbol, time) {
  return NSEAPI.getIntraDayData(symbol, time);
}



function getChartDataNew(symbol, time) {
  return NSEAPI.getChartDataNew(symbol, time);
}

function searchStocks(symbol) {
  return NSEAPI.searchStocks(symbol);
}

function getStockFuturesData(symbol, expiryDate, isIndex) {
  return NSEAPI.getStockFuturesData(symbol, expiryDate, isIndex);
}


function get52WeekHigh() {
  return NSEAPI.get52WeekHigh();
}


function get52WeekLow() {
  return NSEAPI.get52WeekLow();
}


function getTopValueStocks() {
  return NSEAPI.getTopValueStocks();
}


function getTopVolumeStocks() {
  return NSEAPI.getTopVolumeStocks();
}


var nse = {
  getMarketStatus,
  getIndices,
  getSectorsList,
  getQuotes,
  getQuoteInfo,
  getMultipleQuoteInfo,
  getGainers,
  getLosers,
  getInclineDecline,
  getIndexStocks,
  getIntraDayData,
  searchStocks,
  getStockFuturesData,
  get52WeekHigh,
  get52WeekLow,
  getTopValueStocks,
  getTopVolumeStocks,
  getChartDataNew
};

module.exports = nse;
