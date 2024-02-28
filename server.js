const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json

app.use(cors({ origin: '*'}));

app.use(express.static(path.join(__dirname, '../build')))


app.get('*', function (req, res) {
    console.log(req);
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });

app.listen(port, () => {
    console.log(`JWT generator API listening at http://localhost:${port}`);
});
  