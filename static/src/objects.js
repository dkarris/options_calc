
// object function constructor just to have both constructor 

function chart() {
  this.draw =  function() {
    alert('ddd');
  }
}

/** Class representing an asset */
class Asset {
  /**
   * Create an asset 
   * @param {string} name
   * @param {string} assetType can be anything. See internal asset.set type for mapping dict
   * @param expiryDate non required
   * @param addInfo: for options: addInfo.strike - number , addInfo.optionType(call/put)
   */
    constructor (objectParams){
    this.name = objectParams.name;
    this.addInfo = objectParams.addInfo; //should preceed type setter since it relies on adddata
    this.type = objectParams.assetType;
    this.expiryDate = objectParams.expiryDate;
    this.underlyingName = objectParams.underlyingName
  }  
  set type(assetType) {
    var assetTypeMap = {
    option : "option",
    opt     : "option",
    index   : "underlying",
    stock   : "underlying",
    underlying : "underlying"
    }
    if (assetType ===  undefined) {
      this._type = undefined
    } else {
      if (assetType.toLowerCase() in assetTypeMap) 
       {
         this._type = assetTypeMap[assetType.toLowerCase()]
      } else {
        throw new Error ('Can not initialize asset with this type. AssetType should be option/opt/index/stock/underlying')
      }
    }
    
    
    if (this._type == 'option') {
      // need to check if optionsType exist
      if (!this.addInfo) {
        //alert ('Options additional info is not defined when creating Options asset')
        throw new Error('No addInfo is passed to asset constructor when creating asset option')
      }
      if (!this.addInfo.optType) {
        //alert ('Options additional info provided but non optType exists in addInfo');
        throw new Error('No optionsType');
      }
      var optionTypeParam = this.addInfo.optType.toLowerCase()
      if (optionTypeParam !== "call" && optionTypeParam !== "put") {
        throw new Error ('Option type is not call or put')
      }
      if (!this.addInfo.strike || isNaN(Number(this.addInfo.strike))) { 
        throw new Error ('Option addInfo does not have strike or strike is not number')
      }
    }
  }
  get type() {
    return this._type
  }
}


/** Class representing a transaction */
class Transaction {
/**
   * Create an asset 
   * @param {string} id
   * @param {asset} 
   * @param {string} trans_type: //open_buy / open_sell, close_buy/ close_sell
   * @param {number} price
   * @param {number} volume
   */

  constructor (id,asset,trans_type,price,vol) {
    this.id = id;
    if (asset.constructor.name !== 'Asset') {
      throw new Error ('Asset in parameters does not belong to class Asset')
    };
    var transCheckList = ['open_buy', 'open_sell', 'close_buy', 'close_buy'];
    if (!(transCheckList.includes(trans_type))) {
      throw new Error ('transaction type not supported')
    }
    if ((isNaN(price) || isNaN(vol))) {
      throw new Error ('price or volume are not numbers')
    }
    this.asset = asset
    this.trans_type = trans_type
    this.price = price
    this.vol = vol
  }
}

class TradingLeg {
  /**
   * Create a Trading Leg
   * @param {transaction{}
   * @method addTransaction(transaction). adds Transaction and creates new id. even if id is created it will be overwritten
   * @method removeTransaction(transaction)
   */
  
  constructor (name) {
    this.name = name
    this.transactionList = []
    this.underlyingName = null;
  }
  addTransaction(transaction) {
    if ((!(transaction)) || (transaction.constructor.name !== 'Transaction')) {
      throw new Error ('transaction parameter is not type Transaction or missing')
    }
    
    // check if underlyingName != null , then we cant add different
    // underlyingName asset
    
    if (this.underlyingName  !== null) {
        if (transaction.asset.underlyingName !== this.underlyingName) {
           throw new Error ('Attempt to add transaction with underlyingName different from what is already defined for this trading leg')
        }
    }
    
    // get max id of all transactions in the trading leg
    // and create id = id ++
       
    var maxId = 0;
    this.transactionList.forEach(function(element){
      if (element.id > maxId) {
        maxId = element.id
      }
    });
    ++maxId;
    transaction.id = maxId
    this.underlyingName = transaction.asset.underlyingName
    this.transactionList.push(transaction)
    return ['success',transaction]
  }
  
  deleteTransaction(transaction_id) {
    // accepts all id types except undefined or null
    if (transaction_id == undefined || transaction_id == null) {
      return undefined
    }
    var result;
    this.transactionList.forEach(function(element, index, thisTransList){
       if (element.id == transaction_id) {
         thisTransList.splice(index,1);
         result = transaction_id 
        }
    });
    if (!(result)) {
      return ('no records found with that id');
    } else {
      if (this.countTransactions === 0) {
        this.underlyingName = null;
      }
      return result
    }
  }

  getTransaction(transaction_id) {
    // accepts all id types except undefined or null
    if (transaction_id == undefined || transaction_id == null) {
      return undefined
    }
    return this.transactionList.filter(function(element){ return element.id == transaction_id})[0]
  };

  get countTransactions() {
    return this.transactionList.length
  }
}  

// use different syntaxis just to refresh memory
// add JSDOC and unit tests
var Strategy = function Strategy(name) {
  this.name = name
  this.tradingLegs = {}
  this.addLeg = function(leg) {
  // tested
  
    if (leg.constructor.name !== 'TradingLeg') {
      throw new Error ('addLeg called w/o TradingLeg argument')
    }
    this.tradingLegs[leg.name] = leg
  };
  this.deleteLeg = function(leg) {
    // need to create test scripts
    delete this.tradingLegs[leg.name]
  };
  this.generatePriceAxisRange = function() {
    var xAxisarray = [];
    var tradeLeg = this.tradingLegs
    var xMin = Number.MAX_SAFE_INTEGER
      , xMax = 0
      , stepSize = 0
      , steps = 0;  // xMin, xMax,Step used to create x axis
    const adjustement = 0.1; // to create left and right addiitonal areas
    Object.keys(tradeLeg).forEach(function (key){
      var transList = tradeLeg[key].transactionList; 
      transList.forEach(function(transaction){
        // different approach for options and underlying
        if (transaction.asset.type === 'option') {
          xAxisarray.push(transaction.asset.addInfo.strike)
          xMax = (transaction.asset.addInfo.strike > xMax ) ? transaction.asset.addInfo.strike : xMax; 
          xMin = (transaction.asset.addInfo.strike < xMin ) ? transaction.asset.addInfo.strike: xMin;
          xMin = (xMin == xMax) ? xMax*0.9 : xMin;
        } else {
          xMax = (transaction.price > xMax) ? transaction.price*(1+adjustement) : xMax;
          xMin = (transaction.price<xMin) ? transaction.price*(1-adjustement) : xMin;
          xMin = (xMin == xMax) ? xMax*0.9 : xMin;
        }
       stepSize = Math.round((xMax - xMin)/1);
      })
    })
    //steps = Math.ceil((xMax-xMin)/stepSize)
    steps = Math.ceil((xMax-xMin)/10)
    // redo for lambda function later
    for (var x=xMin-(stepSize*2); x<=xMin + stepSize*(steps+2); x=x+stepSize) {
      xAxisarray.push(x)
    }
    xAxisarray.sort(function(a,b){return a-b});
    return xAxisarray;
  };

  this.generatePNLPlotData = function(xAxisvalues) {
    var xValues = this.generatePriceAxisRange();
    var dataPlotValues = [];
    var tradeLegs = this.tradingLegs // to avoid 'this' scope complications
    var valueOptAtExp = true; // change when needed to call BS formula vs max/min opt value at exp
    xValues.forEach(function(axisXelement){
      var total_y_value=0;
      Object.keys(tradeLegs).forEach(function(key){
          tradeLegs[key].transactionList.forEach(function(transaction){
          var y_value;
          if (transaction.asset.type === 'underlying') {
            y_value = (axisXelement - transaction.price)*transaction.vol
          }
          if (transaction.asset.type === 'option') {
            optType = transaction.asset.addInfo.optType;
            strike =  transaction.asset.addInfo.strike;
            assetPrice = axisXelement;
            switch (transaction.trans_type) {
              case 'open_buy':
                var posType = 'long';
                break;
              case 'open_sell':
                var posType = 'short';
                break;
              case 'close_buy':
                var posType = 'non defined: to implement. See objects.js ;line 250'
                break;
              case 'close_sell':
                var posType = 'non defined: to implement. See objects.js ;line 250'
                break;
            };
            initPrice = transaction.price;
            valueOptAtExp ? y_value = OptionValueAtExp(optType, strike,assetPrice, posType, initPrice)*transaction.vol :
                   ( function () {throw new Error ('option BS value not implemented')})();
          }  
         total_y_value = total_y_value + y_value
         })
       })
     var newPlotValue = {'x' : axisXelement, 'y' : total_y_value}
     dataPlotValues.push(newPlotValue);
     });
  return dataPlotValues;
  };
}
