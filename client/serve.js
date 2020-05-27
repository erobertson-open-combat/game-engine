let express = require('express');
let app = express();
let opn = require('opn');

app.use('/engine', express.static('../engine/build'));
app.use('/', express.static('public'));

app.listen(3000, () => {
    console.log('Client test server open @ localhost:3000');
    opn('http://localhost:3000')
});
