const expect = require("chai").expect;
const authMiddleware = require("../middleware/is-auth");
const jwt = require("jsonwebtoken");
const sinon = require("sinon");
describe("Auth middleware", function () {
  it("shoud throw an error if no authorization header is present", function () {
    const req = {
      get: function (headerName) {
        return null;
      },
    };
    // expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Not authenticated.')
    expect(() => {
      authMiddleware(req, {}, () => {});
    }).to.throw("Not authenticated.");
  });
  it("shoud throw an error if the authorization header is only one string", function () {
    const req = {
      get: function (headerName) {
        return "xyz";
      },
    };
    expect(() => {
      authMiddleware(req, {}, () => {});
    }).to.throw();
  });
});

it("shoud throw an error if the token cannot be verified", function () {
  const req = {
    get: function (headerName) {
      return "Bearer xyz";
    },
  };
  expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
});

// it('shoud throw an error if the token cannot be verified', function () {
//   const req = {
//     get: function(headerName) {
//       return 'Bearer xyz'
//     }
//   }
//   authMiddleware(req, {}, () => {});
//   expect(req).to.have.property('userId');
// })

it("shoud throw an error if the token cannot be verified", function () {
  const req = {
    get: function (headerName) {
      return "Bearer xyz";
    },
  };
  sinon.stub(jwt, "verify");
  jwt.verify.returns({ userId: "abc" });
  // jwt.verify = function() {
  //   return {userId: 'abc'}
  // }
  authMiddleware(req, {}, () => {});
  expect(req).to.have.property("userId");
  jwt.verify.restore();
});
