/*
  https://gist.github.com/joaojeronimo/3020458
  PutCallFlag: Either "put" or "call"
  S: Stock Price
  X: Strike Price
  T: Time to expiration (in years)
  r: Risk-free rate
  v: Volatility
  This is the same one found in http://www.espenhaug.com/black_scholes.html
  but written with proper indentation and a === instead of == because it's
  faster, and it doesn't declare 5 useless variables (although if you really
  want to do it to have more elegant code I left a commented CND function in
  the end)
*/


function BlackScholes(PutCallFlag, S, X, T, r, v) {
  var d1 = (Math.log(S / X) + (r + v * v / 2) * T) / (v * Math.sqrt(T));
  var d2 = d1 - v * Math.sqrt(T);
  if (PutCallFlag === "call") {
    return ( S * CND(d1)-X * Math.exp(-r * T) * CND(d2) );
  } else {
    return ( X * Math.exp(-r * T) * CND(-d2) - S * CND(-d1) );
  }
}

/* The cummulative Normal distribution function: */
function CND(x){
  if(x < 0) {
    return ( 1-CND(-x) );
  } else {
    k = 1 / (1 + .2316419 * x);
    return ( 1 - Math.exp(-x * x / 2)/ Math.sqrt(2*Math.PI) * k * (.31938153 + k * (-.356563782 + k * (1.781477937 + k * (-1.821255978 + k * 1.330274429)))) );
  }
}

/*
// returns output of long position of either call or put at optPriceAtExpiry
*/

function OptionValueAtExp(optType, strike, assetPrice, posType, initPrice) {
  if (optType.toLowerCase() !== 'call' && optType.toLowerCase() !== 'put') {
    throw Error ('Option type is not valid')
  } 
  if (posType.toLowerCase() !=='long' && posType.toLowerCase() !== 'short') {
    throw  Error ('Position type is not valid')
  }
  
  if (isNaN(initPrice)) {
    throw Error ('Initial option price is not a number')
  }

  if (posType.toLowerCase() === 'long') {
    if (optType.toLowerCase() === 'call') {
      return Math.max(0, assetPrice - strike) - initPrice
    }
    if (optType.toLowerCase() === 'put') {
      return Math.max(0, strike - assetPrice) - initPrice
    }
  }
  if (posType.toLowerCase() === 'short') {
    if (optType.toLowerCase() === 'call') {
      return Math.min(0, strike - assetPrice) + initPrice
    }
    if (optType.toLowerCase() === 'put') {
      return Math.min(0, assetPrice - strike) + initPrice
    }
  }
}

//https://github.com/MattL922/implied-volatility
/**
 * Calculate a close estimate of implied volatility given an option price.  A
 * binary search type approach is used to determine the implied volatility.
 *
 * @param {Number} expectedCost The market price of the option
 * @param {Number} s Current price of the underlying
 * @param {Number} k Strike price
 * @param {Number} t Time to experiation in years
 * @param {Number} r Anual risk-free interest rate as a decimal
 * @param {String} callPut The type of option priced - "call" or "put"
 * @param {Number} [estimate=.1] An initial estimate of implied volatility
 * @returns {Number} The implied volatility estimate
 */
function getImpliedVolatility(callPut, expectedCost, s, k, t, r,estimate)
{
  estimate = estimate || .1;
  var low = 0;
  var high = Infinity;
  // perform 100 iterations max
  for(var i = 0; i < 100; i++)
  {
    var actualCost = BlackScholes(callPut,s, k, t, r, estimate);
    // compare the price down to the cent
    if(expectedCost * 100 == Math.floor(actualCost * 100))
    {
      break;
    }
    else if(actualCost > expectedCost)
    {
      high = estimate;
      estimate = (estimate - low) / 2 + low
    }
    else
    {
      low = estimate;
      estimate = (high - estimate) / 2 + estimate;
      if(!isFinite(estimate)) estimate = low * 2;
    }
  }
  return estimate;
}