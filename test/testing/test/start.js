const expect = require('chai').expect;

const sayhello = require('./hello').sayhello

it('should add numbers correctly', function() {
  const num1 = 2;
  const num2 = 3;
  expect(num1 + num2).to.equal(5);
})

it('sayhello function should return hello', function() {
  expect(sayhello()).to.equal("hello")
})

