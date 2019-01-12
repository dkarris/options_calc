

describe("Testing  strategy object suite", function() {
  
  beforeAll(function () {
    this.assetOption_1 = new Asset ({name: 'RTS option 2', 
                                    assetType: 'option',
                                     addInfo: {strike:1000, optType :'Call'},
                                     underlyingName: 'RTS'});
    this.assetOption_2 = new Asset( {name:'RTS option 2', 
                                    assetType: 'option',
                                    addInfo : {strike:800, optType: 'Put'},
                                    underlyingName: 'RTS2'});
    this.assetIndex_1 = new Asset({name:'RTS index 1', assetType :'index', underlyingName:'RTS Index'});
    this.trans1 = new Transaction('none', this.assetOption_1, 'open_buy', 10, 1)
    this.trans2 = new Transaction('none', this.assetOption_2, 'open_buy', 20, 2)
    this.trans3 = new Transaction('none', this.assetIndex_1, 'open_buy', 1230, 3)
    this.tradeLeg = new TradingLeg('leg1')
    this.tradeLeg.addTransaction(this.trans1);
  });
  
  beforeEach(function () {
    this.strategy = new Strategy('jasmine test')
  })

  it ('it should be able to add trading leg', function(){
    var leg_name = this.tradeLeg.name
    this.strategy.addLeg(this.tradeLeg)
    expect(this.strategy.tradingLegs[leg_name]).toBe(this.tradeLeg)
  });

  it ('it should fall gracefully when non TradingLeg object is passed to addLeg method', function(){
    var testFunc = function() {
    var foo = "bar";
    this.strategy.addLeg(foo)
    }
    expect(testFunc.bind(this)).toThrow(new Error('addLeg called w/o TradingLeg argument'))
  });

  it ('it should be able to produce X axis range depending on objects in trading leg', function(){
    var leg_name = this.tradeLeg.name
    this.strategy.addLeg(this.tradeLeg)
    xAixs = this.strategy.generatePriceAxisRange() 
  });


  xit ('it should be able to delete trading leg');

  xit ('it should be able to produce data array for charting');

  xit ('it should be able to recalc balancing opened positions');

});

