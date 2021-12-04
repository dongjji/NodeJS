require("dotenv").config();
const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const AuthController = require("../controllers/auth");

describe("Auth Controller - Login", function () {
  it("shoud throw an error if accessing the databse fails", function (done) {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const req = {
      body: {
        email: "test@test.com",
        password: "test",
      },
    };
    AuthController.login(req, {}, () => {})
      .then((result) => {
        // console.log(result);
        expect(result).to.be.an("error");
        expect(result).to.have.property("statusCode", 500);
        done();
      })
      .catch((err) => {
        done(err);
      });

    User.findOne.restore();
  });

  it("should send a response with a valid user status for existing user", function (done) {
    mongoose
      .connect(`${process.env.mongodbAddress}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      // .then(result => {
      // const user = new User({
      //   email: "test@test.com",
      //   password: "test",
      //   name: "Test",
      //   posts: []
      // })
      // return user.save();
      // })
      .then(() => {
        const req = { userId: "61910e2a0e15f82408049fdf" };
        const res = {
          statusCode: 500,
          userStatus: null,
          status: function (code) {
            this.statusCode = code;
            return this;
          },
          json: function (data) {
            this.userStatus = data.status;
          },
        };
        AuthController.getUserStatus(req, res, () => {}).then(() => {
          expect(res.statusCode).to.be.equal(200);
          expect(res.userStatus).to.be.equal("I am new!");
          User.deleteMany({}).then(() => {
            return mongoose.disconnect();
          }).then(() => {
            done();
          })
        });
      })
      .catch((err) => console.log(err));
  });
});
