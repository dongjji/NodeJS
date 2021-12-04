const mongoose = require("mongoose");
const { Schema } = mongoose;

mongoose
  .connect("mongodb://localhost:27017/relationshipDemo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongo connection open!!");
  })
  .catch((err) => {
    console.log("oh no mongo connection error!!");
    console.log(err);
  });

const userSchema = new Schema({
  username: String,
  age: Number,
});

const tweetSchema = new Schema({
  text: String,
  likes: Number,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const User = mongoose.model("User", userSchema);
const Tweet = mongoose.model("Tweet", tweetSchema);

// const makeTweets = async () => {
//   // const user = new User({ username: "Chickenfan99", age: 61 });
//   const user = await User.findOne({ username: "Chickenfan99" });
//   // const tweet1 = new Tweet({ text: "omg I love my chicken", likes: 0 });
//   const tweet2 = new Tweet({ text: "bock bock bock", likes: 1234 });
//   tweet2.user = user;
//   await tweet2.save();
// };

// makeTweets();

const findTweet = async () => {
  const t = await Tweet.findOne({}).populate("user", "username");
  console.log(t);
};

findTweet();
