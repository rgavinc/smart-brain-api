const jwt = require("jsonwebtoken");
var constants = require("../env");
let jwtSecret = constants.JWT_SECRET;
const redis = require("redis");

const redisClient = redis.createClient({ host: "127.0.0.1" });

const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject("incorrect form submission");
  }
  return db
    .select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then(user => user[0])
          .catch(err => Promise.reject("incorrect form submission"));
      } else {
        Promise.reject("wrong credentials");
      }
    })
    .catch(err => res.status(400).json("wrong credentials"));
};

const getAuthTokenId = () => {
  console.log("auth ok");
};

const signToken = email => {
  const jwtPayload = { email };
  return jwt.sign({ jwtPayload }, jwtSecret, { expiresIn: "2 days" });
};

const createSessions = user => {
  //JWT, return useer data
  const { email, id } = user;
  const token = signToken(email);
  return { success: "true", userId: id, token };
};

const signinAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization
    ? getAuthTokenId()
    : handleSignin(db, bcrypt, req, res)
        .then(data => {
          return data.id && data.email
            ? createSessions(data)
            : Promise.reject(data);
        })
        .then(session => res.json(session))
        .catch(err => res.status(400).json(err));
};

module.exports = {
  signinAuthentication: signinAuthentication
};
