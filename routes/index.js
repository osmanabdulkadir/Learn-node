const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  const reborn = { name: "osman", age: 23, cool: true};

  res.render();
});

router.get('/reverse/:name', (req,res) => {
  const reverse = [...req.params.name].reverse().join("");
  res.send(reverse);
})

module.exports = router;
