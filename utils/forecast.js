const createError = require('http-errors');
const axiosRequest = require('./axiosRequest');

const getLocation = async location => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        location
    )}.json?access_token=${process.env.TOKEN_MAPBOX}&limit=1&types=region`;

    const result = await axiosRequest('get', url);

    if (result.features.length === 0) {
        throw new createError(400, 'Unable to find this location. Try another search!');
    }

    return result.features[0].place_name;
};

module.exports = async location => {
    if (!location) {
        throw new createError(400, 'Please provide a location!');
    }

    const region = await getLocation(location);

    const url = `http://api.weatherstack.com/current?access_key=${
        process.env.ACCESS_KEY_WEATHERSTACK
    }&query=${encodeURIComponent(region)}`;

    const result = await axiosRequest('get', url);

    if (result.success === false) {
        if (result.error.code === 615)
            throw new createError(400, 'Unable to obtain the weather of this region!');
        if (result.error.code === 606) throw new createError(400, 'Invalid units!');
    }

    // console.log(region);
    // console.log(
    //     `${result.current.weather_descriptions[0]}. It is currently ${result.current.temperature} degress out.`
    // );

    return { region, result };
};
