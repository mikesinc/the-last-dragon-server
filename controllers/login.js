const { loginValidation } = require("../validation");
const jwt = require("jsonwebtoken");

//create access token
function generateAccessToken(user) {
  return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: "15m" });
}

const handleSignin = (db, bcrypt) => (req, res) => {
  //Login Validation
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Login user
  const { email, password } = req.body;
  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      if (data.length === 0)
        res.status(400).send("incorrect email or password");
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            const isEmailVerified = user[0].verified;
            if (isEmailVerified) {
              //Create and assign a token
              const accessToken = generateAccessToken({ name: user[0].username });
              const refreshToken = jwt.sign(
                { name: user[0].username },
                process.env.REFRESH_TOKEN_SECRET
              );
              try {
                db.transaction((trx) => {
                  trx
                    .insert({
                      refreshtoken: refreshToken,
                    })
                    .into("refreshtokens")
                    .then(trx.commit)
                    .catch(trx.rollback);
                });
              } catch (err) {
                console.log(err);
              }

              res.json({
                accessToken: accessToken,
                refreshToken: refreshToken,
              });
            } else {
              return res
                .status(303)
                .send(
                  "Please verify your email by clicking the link sent to your address before logging in again."
                );
            }
          })
          .catch((err) => res.status(400).send(err.detail));
      } else {
        return res.status(400).send("incorrect email or password");
      }
    })
    .catch((err) => res.status(400).send(err.detail));
};

module.exports = {
  handleSignin,
  generateAccessToken,
};
