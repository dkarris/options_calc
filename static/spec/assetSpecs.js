  describe("Testing Asset object suit", function() {
  var name = 'RTS';
  var assetTypeUnderlying = 'Index';
  var assetTypeOpt = 'OptIOn'
  
  beforeAll(function () {
    // init asset object
    newAsset = new Asset({name:name})
  });
  it("Asset object should have a name", function() {
    expect(newAsset.name).toBe(name);
  });
  
  it("Asset object type should be undefined if asset create w/o asset type", function() {
      expect(newAsset.type).toBe(undefined);
  });
  
  it("Asset object type should be 'underlying' for Index or Index", function() {
    optAsset = new Asset ({name:'optAsset', assetType: assetTypeUnderlying})
    expect(optAsset.type).toBe('underlying');
  });

  it("Asset object type should throw an error if value not mapped into Asset typer setter mapping", function() {
    var testFunc = function() {
      optAsset = new Asset ({name: 'optAsset', assetType:'someGibberish'})
    }
    expect(testFunc).toThrow(new Error('Can not initialize asset with this type. AssetType should be option/opt/index/stock/underlying'))
  });
 
  it("Asset constructor should throw an exception if asset is option and no addInfo is passed to constructor", function() {
    var testFunc = function () {
      optAsset = new Asset ({name:'optAsset', assetType:assetTypeOpt})
    }
    expect(testFunc).toThrow(new Error('No addInfo is passed to asset constructor when creating asset option'))
  });
  
  it("Asset constructor should throw an exception if asset is option and no call/put info in addInfo is passed to constructor", function() {
    var testFunc = function () {
      addInfo = {foo: "bar"}
      optAsset = new Asset ({name: 'optAsset',
                            assetType: assetTypeOpt,
                            addInfo: addInfo});
    }
    expect(testFunc).toThrow(new Error('No optionsType'))
  });

  it('Asset object type  should throw exception if asset is option and option type is different from call or put info in addInfo', function() {
    var testFunc = function () {
      addInfo = {optType: "foo"};
      optAsset = new Asset ({name:'optAsset',assetType: assetTypeOpt, addInfo: addInfo});
    }
    expect(testFunc).toThrow(new Error('Option type is not call or put'))
    });
  
  
  it('Asset object type should throw exception if asset is option and option type is call or put info in addInfo and strike is not defined or a number', function() {
    var testFunc = function() {
      addInfo = {optType: "CaLL", strike: '1111cc'};
      optAsset = new Asset ({name:'optAsset',assetType: assetTypeOpt, addInfo: addInfo});
    };
    expect(testFunc).toThrow(new Error('Option addInfo does not have strike or strike is not number'))
  });
 
  it('Asset object type should initialized if asset is option and option type is call or put info in addInfo and strike is number', function () {
    addInfo = {optType: "CaLL", strike: '1111'};
    optAsset = new Asset ({name:'optAsset',assetType: assetTypeOpt, addInfo: addInfo});
    expect(optAsset.addInfo.strike).toBe(addInfo.strike)
  });
});