const express = require("express");
const { gainers, losers, inclineDecline, yearhigh, yearlow } = require("../nse/dummy.data");
const router = express.Router();

// Get the stock market status (open/closed) - JSON
// Example: http://localhost:2550/nse/get_market_status
router.get("/get_market_status", (req, res, next) => {
    const status = "open";
    res.json({status});
})
  
  // Get the NSE indexes information (last updated, name, previous close, open, low, high, last, percent change, year high and low, index order) - JSON
  // Example: http://localhost:2550/nse/get_indices
  router.get("/get_indices", (req, res, next) => {
        res.json([]);
  });
  
  // Get the quotation data of the symbols (companyNames) from NSE - JSON
  // Example: http://localhost:2550/nse/get_multiple_quote_info?companyNames=TCS,WIPRO
  router.get("/get_multiple_quote_info", (req, res, next) => {
              res.json({status: 'Not Avalaible'})
  });
  
  
  // Get the top 10 gainers of NSE - JSON
  // Example: http://localhost:2550/nse/get_gainers
  router.get("/get_gainers", (req, res, next) => {
         res.json(gainers)
  });
  
  // Get the top 10 losers of NSE - JSON
  // Example: http://localhost:2550/nse/get_losers
  router.get("/get_losers", (req, res, next) => {
         res.json(losers)
  });
  
  // Get advances/declines of individual index, and the value if its changed or not - JSON
  // Example: http://localhost:2550/nse/get_incline_decline
  router.get("/get_incline_decline", (req, res, next) => {
    res.json(inclineDecline)
  });
  
  // Get the list of companies in provided NSE index with matching keyword data - JSON
  // Example: http://localhost:2550/nse/search_stocks?keyword=AXIS
  router.get("/search_stocks", (req, res, next) => {
            res.json({status: 'Not Avalaible'})
  });
   
  // Get 52 weeks all high stocks in NSE - JSON
  // Example: http://localhost:2550/nse/get_52_week_high
  router.get("/get_52_week_high", (req, res, next) => {
   
        res.json(yearhigh);
     
  });
  
  // Get 52 weeks all low stocks in NSE - JSON
  // Example: http://localhost:2550/nse/get_52_week_low
  router.get("/get_52_week_low", (req, res, next) => {
        res.json(yearlow);    
  });
  
 
module.exports = router;