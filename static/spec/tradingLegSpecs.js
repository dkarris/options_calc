describe("Testing tradingLeg script", function () {

  beforeAll(function () {
    // create test new Asset object to add to tradingLeg
    var asset_1 = new Asset({ name: 'RTS', type: 'index', underlyingName: 'RTS' });
    var asset_2 = new Asset({ name: 'RTS-2', underlyingName: 'RTS' })
    var asset_3 = new Asset({ name: 'RTS-again', underlyingName: 'RTS' })
    var asset_4 = new Asset({ name: 'RTS-again', underlyingName: 'RTS-2' })
    // create 4 transactions to use for tradingLeg
    this.trans1 = new Transaction('none', asset_1, 'open_buy', 1, 1)
    this.trans2 = new Transaction('none', asset_2, 'open_buy', 2, 2)
    this.trans3 = new Transaction('none', asset_1, 'open_buy', 3, 3)
    this.trans4 = new Transaction('none', asset_1, 'open_buy', 4, 4)
    this.trans5 = new Transaction('none', asset_4, 'open_buy', 4, 4)
  });

  it("should throw an exception when addTransaction method is called without transaction object or undefined",
    function () {
      var testFuncArgEmpty = function () {
        var trans_empty = undefined
        var tradingLeg = new TradingLeg('legN1');
        tradingLeg.addTransaction()
      }
      expect(testFuncArgEmpty).toThrow(new Error('transaction parameter is not type Transaction or missing'))
    });

  it("should throw an exception when addTransaction method is called witht transaction object not transaction type",
    function () {
      var testFuncArgEmpty = function () {
        var trans_wrong_type = 'foo'
        var tradingLeg = new TradingLeg('legN1');
        tradingLeg.addTransaction(trans_wrong_type)
      }
      expect(testFuncArgEmpty).toThrow(new Error('transaction parameter is not type Transaction or missing'))
    });

  it("should NOT throw an exception when addTransaction method is called with transaction object in argument and should return status 'success' and transaction object",
    function () {
      var testFuncArgTrans = function () {
        var tradingLeg = new TradingLeg('legN1');
        return tradingLeg.addTransaction(this.trans1)
      }
      expect(testFuncArgTrans.bind(this)).not.toThrow();
      testFunc2 = testFuncArgTrans.bind(this);
      [status, trans_return] = testFunc2()
      expect(status).toBe('success');
      expect(trans_return).toBe(this.trans1);
    });

  it("should be incrementing id by 1 when adding new transaction",
    function () {
      tradingLeg = new TradingLeg('my leg');
      var result;
      var trans_reply;
      [result, trans_reply] = tradingLeg.addTransaction(this.trans1);
      expect(trans_reply.id).toBe(1);
      [result, trans_reply] = tradingLeg.addTransaction(this.trans2);
      expect(trans_reply.id).toBe(2);
      [result, trans_reply] = tradingLeg.addTransaction(this.trans3);
      expect(trans_reply.id).toBe(3);
    })

  it("getTransaction return transaction with id or undefined", function () {

    tradingLeg = new TradingLeg('my leg');
    tradingLeg.addTransaction(this.trans1);
    tradingLeg.addTransaction(this.trans2);
    tradingLeg.addTransaction(this.trans3);
    tradingLeg.addTransaction(this.trans4);
    expect(tradingLeg.getTransaction(2)).toEqual(this.trans2)
    expect(tradingLeg.getTransaction(5)).toEqual(undefined);
    expect(tradingLeg.getTransaction(undefined)).toEqual(undefined);
  })


  it("should be able to delete transaction with id in parameter", function () {
    tradingLeg = new TradingLeg('my leg');
    var msg, t1, tr2, tr3;
    [msg, tr1] = tradingLeg.addTransaction(this.trans1);
    [msg2, tr2] = tradingLeg.addTransaction(this.trans2);
    [msg3, tr3] = tradingLeg.addTransaction(this.trans3);
    var id = tr2.id;
    expect(tradingLeg.getTransaction(id)).toBe(tr2);
    expect(tradingLeg.deleteTransaction(id)).toBe(id)
    expect(tradingLeg.getTransaction(id)).toBe(undefined);
    [msg, tr4] = tradingLeg.addTransaction(this.trans4)
    expect(tr4.id).toBe(4)
  });


  it("it should return transactions number when adding transaction", function () {
    tradingLeg = new TradingLeg("my leg");
    var msg, msg2, msg3, tr1, tr2, tr3;
    [msg, tr1] = tradingLeg.addTransaction(this.trans1);
    [msg2, tr2] = tradingLeg.addTransaction(this.trans2);
    [msg3, tr3] = tradingLeg.addTransaction(this.trans3);
    expect(tradingLeg.countTransactions).toBe(3)
  }
  );

  it("it should return transactions number equal to zero, when adding and then deleting when deleting all transactions", function () {
    tradingLeg = new TradingLeg("my leg");
    var msg, msg2, msg3, tr1, tr2, tr3;
    [msg, tr1] = tradingLeg.addTransaction(this.trans1);
    [msg2, tr2] = tradingLeg.addTransaction(this.trans2);
    [msg3, tr3] = tradingLeg.addTransaction(this.trans3);
    tradingLeg.deleteTransaction(tr1.id);
    tradingLeg.deleteTransaction(tr2.id);
    tradingLeg.deleteTransaction(tr3.id);
    expect(tradingLeg.countTransactions).toBe(0)
  }
  );


  it("it should throw an exception when attempting to add transaction, containing asset with different underlyingName than exists", function () {
    var testFuncError = function () {
      tradingLeg = new TradingLeg("my leg");
      var msg, msg2, msg3, tr1, tr2, tr3;
      [msg, tr1] = tradingLeg.addTransaction(this.trans1);
      [msg2, tr2] = tradingLeg.addTransaction(this.trans5); // asset with different underlyingName
    };
    var testFuncCorrect = function () {
      tradingLeg = new TradingLeg("my leg");
      var msg, msg2, msg3, tr1, tr2, tr3;
      [msg, tr1] = tradingLeg.addTransaction(this.trans1);
      [msg2, tr2] = tradingLeg.addTransaction(this.trans3); // asset with the samee
    };
    expect(testFuncError.bind(this)).toThrow(new Error('Attempt to add transaction with underlyingName different from what is already defined for this trading leg'));
    expect(testFuncCorrect.bind(this)).not.toThrow(new Error('Attempt to add transaction with underlyingName different from what is already defined for this trading leg'));

  });

  // solved with underlyingName being a combination of name+Strike
  //xit("it should block from using options of different strike/name in one leg");


});