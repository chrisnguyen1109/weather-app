require('dotenv').config({ path: './config/.env' });
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const createError = require('http-errors');
const catchAsync = require('./utils/catchAsync');
const forecast = require('./utils/forecast');

const root = './public';

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.static(path.join(__dirname, root)));

app.get('/', (req, res) => {
    res.sendFile('index');
});

app.get(
    '/api/v1/weather',
    catchAsync(async (req, res) => {
        const location = req.query.location;

        if (!location) throw new createError(400, 'Location must be provided!');

        const data = await forecast(location);

        res.json({
            status: 'success',
            data: {
                data,
            },
        });
    })
);

// test
// app.get('/test/*', (req, res, next) => {
//     res.send('<h1>Not Found</h1>');
// });

app.all('*', (req, res, next) => {
    res.sendFile('404.html', { root });
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = `${err.statusCode}`.startsWith('4') ? 'fail' : 'error';

    if (err.expose) {
        // console.error(`${err.name}😢: ${err.message}`);
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        // console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Unknow error!',
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
