const express = require('express');
const app = express();

const { readFileSync } = require('fs');

app.listen(process.env.PORT || 3000, () =>
    console.log('Server started at http://localhost:3000')
);

app.use('/assets', express.static('assets'));

app.get('/', (req, res) => {
    res.send(
        readFileSync('index.html', 'utf8', (err, html) => {
            if (err) res.status(500).send('sorry, my bad');

            res.send(html);
        })
    );
});
