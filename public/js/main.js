const $ = document.querySelector.bind(document);

const elArray = [
    'region',
    'localtime',
    'temperature',
    'weather_descriptions',
    'feelslike',
    'wind_speed',
    'humidity',
];

const getLocation = async () => {
    if (navigator.geolocation) {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        return `${position.coords.longitude}, ${position.coords.latitude}`;
    } else {
        return ``;
    }
};

const replaceTemplate = data => {
    for (const el of elArray) {
        $(`#${el}`).innerHTML = data[el];
    }
    $('#weather_icons').src = data['weather_icons'];
    $('.col-weather').classList.remove('loading');
};

const getWeather = async location => {
    try {
        $('.col-weather').classList.add('loading');
        if (!location) {
            location = await getLocation();
        }
        const url = `/api/v1/weather?location=${location.trim()}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== 'success') throw new Error('Error!');

        const cloneData = JSON.parse(JSON.stringify(data.data.data));

        replaceTemplate({
            region: cloneData.region,
            localtime: cloneData.result.location.localtime.split(' ')[1],
            temperature: `${cloneData.result.current.temperature}° C`,
            weather_descriptions: cloneData.result.current.weather_descriptions[0],
            feelslike: `${cloneData.result.current.feelslike}° C`,
            wind_speed: `${cloneData.result.current.wind_speed} km/h`,
            humidity: `${cloneData.result.current.humidity}%`,
            weather_icons: cloneData.result.current.weather_icons[0],
        });
    } catch (err) {
        console.log(err);
    }
};

$('.input-search').addEventListener('keyup', e => {
    if (e.keyCode === 13) {
        getWeather(e.target.value);
    }
});

getWeather();
