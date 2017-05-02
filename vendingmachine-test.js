var expect = require("chai").expect,
    getChange = require('./vendingmachine.js');

describe("vending machine testing", function(){
    it('getChange(215, 300) should return [50, 20, 10, 5]', function() {
        var result = getChange(215, 300); // expect an array containing [50,20,10,5]
        var expected = [50, 20, 10, 5];
        console.log(result == [50, 20, 10, 5])
        expect(result).to.be.deep.equal(expected);
    });

    it('getChange(486, 600) should equal [100, 10, 2, 2]', function() {
        var result = getChange(486, 600);
        var expected = [100, 10, 2, 2];
        expect(result).to.be.deep.equal(expected);
    });

    it('getChange(12, 400) should return [200, 100, 50, 20, 10, 5, 2, 1]', function() {
        var result = getChange(12, 400);
        var expected = [200, 100, 50, 20, 10, 5, 2, 1];
        expect(result).to.be.deep.equal(expected);
    });
});


