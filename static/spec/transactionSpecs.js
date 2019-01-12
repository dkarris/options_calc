describe("Testing Transaction object suite", function() {
  
  beforeEach(function () {
    asset = new Asset ({name:'Test Asset', 
                       type: 'option', 
                       addInfo :{strike:1000, optType :'Call'}})
  });
  
  it ('should throw an exception if asset is not from class Asset', function () {
    var testFunc = function() {
      asset = 'foo';
      trans = new Transaction('foo', asset, 'open_buy', 2222,33 );
    };
    expect(testFunc).toThrow(new Error ('Asset in parameters does not belong to class Asset'))
  });

  it ('shoud throw an exception if transaction type is not supported', function() {
    var testFunc = function() {
      trans_type = 'foo';
      trans = new Transaction('foo', asset, trans_type, 123, 456)
    }
    expect(testFunc).toThrow(new Error('transaction type not supported'))
  });

  it ('should throw an exception if price or volume are not numbers', function() {
    var testFunc = function() {
      trans = new Transaction('foo', asset, 'open_buy', '333', '45a6')
    }
    expect(testFunc).toThrow(new Error('price or volume are not numbers'))
  });
});