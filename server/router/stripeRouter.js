const express = require("express");
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51LE8tVAZh3YUC37ZDRrPgDEjuqFoSahOsICmym0kFHlikJKfpCvqMsM61Qd8xK1WbwahRdR8QtDW6hDVx0rreq3J00R9AvIpxJ"
);

router.route("/payment").post((req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});

module.exports = router;
