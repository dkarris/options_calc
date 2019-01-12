/// boilerplate for charting


// Testing script to create mock objects

  var ctx = document.getElementById("myChart").getContext('2d');
  Chart.defaults.global.animation = 0;
  var assetOption_1 = new Asset ({name: 'RTS option call', 
                                    assetType: 'option',
                                     addInfo: {strike:1000, optType :'Call'},
                                     underlyingName: 'RTS'});
  var assetOption_2 = new Asset ({name: 'RTS option put', 
                                    assetType: 'option',
                                     addInfo: {strike:1000, optType :'Put'},
                                     underlyingName: 'RTS'});
  
  var assetOption_3 = new Asset( {name:'RTS option same type as option 1', 
                                    assetType: 'option',
                                    addInfo : {strike:1200, optType: 'Call'},
                                    underlyingName: 'RTS'});
  var assetIndex_1 = new Asset({name:'RTS index 1', assetType :'index', underlyingName:'RTS'});
  var trans1 = new Transaction('none', assetOption_1, 'open_buy', 10, 1)
  var trans2 = new Transaction('none', assetOption_2, 'open_buy', 0, 1)
  var trans3 = new Transaction('none', assetIndex_1, 'open_buy', 1000, 1)
  var trans4 = new Transaction('none', assetOption_1, 'close_buy', 5,1)
  var trans5 = new Transaction('none', assetOption_3, 'open_sell',5,1)
  var tradeLeg = new TradingLeg('leg1')
  //tradeLeg.addTransaction(trans1);
  //tradeLeg.addTransaction(trans2);
  tradeLeg.addTransaction(trans2);
  tradeLeg.addTransaction(trans3);
  var strategy = new Strategy('jasmine test')    
  strategy.addLeg(tradeLeg)
  plotData = strategy.generatePNLPlotData()
  axisValues = strategy.generatePriceAxisRange()
  var data = {
    datasets:[{
    label: 'Trading Leg',
    data: plotData,
    borderColor : '#36a2eb',
    borderWidth: 1,
    fill :false,
    lineTension :0, // no line smoothing
    backgroundColor: 'rgba(255,255,255,0.0)',
    cubicInterpolationMode: "default"}]
  }
  var options = {
    title: {
    display: true,
    text: 'la-la-la'},
    scales: {
      xAxes: [{
        type: 'linear',
        position: 'bottom',
        // ticks: {
        //   min: 0,
        //   max: 12000
        // },
        display: true,
        scaleLabel: {
          display: true
        },
      }]
    },
    tooltips : {
      enabled: true,
      mode: 'index',
      intersect: false
    },
    hover: {
      mode: 'index',
      intersect: false
    }

  };

  var chart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: options
  })
  



