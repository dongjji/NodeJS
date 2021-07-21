const bcrypt = require("bcrypt");

// const hashPassword = async (pw) => {
//   const salt = await bcrypt.genSalt(10);
//   const hash = await bcrypt.hash(pw, salt);
//   console.log(salt);
//   console.log(hash);
// };

const hashPassword = async (pw) => {
  const hash = await bcrypt.hash(pw, 10);
  console.log(hash);
};

const login = async (pw, hashedPw) => {
  const result = await bcrypt.compare(pw, hashedPw);
  if (result) {
    console.log("success");
  } else {
    console.log("fail");
  }
};

hashPassword("monkey");
login("monkey", "$2b$10$ZPhieeXuuKjeujEnqFgy3.pcqa6zF0OPAVS6zFdum.qSOknHYq8Bu");
