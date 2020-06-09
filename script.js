$(document).ready(function () {
	// Country selector input
	$.ajax({
		url: "https://restcountries.eu/rest/v2/all",
		method: "GET",
		timeout: 0,
	}).done(function (countries) {
		for (const country of countries) {
			$("select").append(
				`<option value=${country.alpha3Code} >${country.name}</option>`
			);
		}
	});

	// Map API
	var app = new Mapp({
		element: "#app",
		presets: {
			latlng: {
				lat: 32,
				lng: 52,
			},
			zoom: 10,
		},
		apiKey:
			"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjNkZmM0ZTAwNmM5Mjg2N2ZhNDQzMzY2NzlkOWY4N2ZiZTI3MzkwNWQ3NTA0ODRhZDVkNmQ2OTIwNGZmZmMzYjUyYTJhNmMyYTFlNTFjODlkIn0.eyJhdWQiOiI5NTIxIiwianRpIjoiM2RmYzRlMDA2YzkyODY3ZmE0NDMzNjY3OWQ5Zjg3ZmJlMjczOTA1ZDc1MDQ4NGFkNWQ2ZDY5MjA0ZmZmYzNiNTJhMmE2YzJhMWU1MWM4OWQiLCJpYXQiOjE1OTE0NDE5MjMsIm5iZiI6MTU5MTQ0MTkyMywiZXhwIjoxNTk0MDMzOTIzLCJzdWIiOiIiLCJzY29wZXMiOlsiYmFzaWMiXX0.gs9EjdM6HXX0S0WFA-kf8uAjbonaKsB645A9x6aPir53hv1hTtaSotHrAQH4mOiNkjMYFzUhKH5DzTEzYc07rK-YomA6cH-SLBl4wgg5D1qvCnLwO42tsi4eRpvCm_AoanmTcePTq8npwrqEYWI2Eh7wMB0u4HU5aDUM2JjOf0SYgcFcVSslQB1n3pFC7lxOuFqBvNpDBsmIL6KW8o34-xiI2nfNTn14fGZgyP8_TOmJvl0zWpMyB1DZZoNvlzQ0ev3SauD1xuJQKFGyPxGYZ99xQfI98SB93cWlPIPhW9OBc08oLb5znMSTImdRkzEd1MG_6xC13hoM88q5dRfeFg",
	});

	app.addLayers();

	// Fetch the data for info section by alpha3code
	$("select").on("change", function () {
		$.ajax({
			url: `https://restcountries.eu/rest/v2/alpha/${$(this).val()}`,
			method: "GET",
		}).done(function (country) {
			// Information section
			$(".information").html(
				`
                <h3>${country.name}</h3>
                <ul>
						<li>Native Name: ${country.nativeName}</li>
						<li>Capital: ${country.capital}</li>
						<li>Region: ${country.region},${country.subregion}</li>
						<li>Population: ${country.population}</li>
						<li>Languages: ${country.languages[0].name}</li>
						<li>Timezones: ${country.timezones}</li>
				</ul>
                `
			);

			// Prenumber section
			$(".prenumber").html(`<h1>+${country.callingCodes}</h1>`);

			// Flag section
			$(".flag").html(`<img src=${country.flag}></img>`);

			// Weather section
			$.ajax({
				url: `http://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=249a5e3bd1fa12d2e9371b9a3ce677ae&mode=json`,
				method: "GET",
				timeout: 0,
			}).done(function (climate) {
				console.log(climate);
				$(".weather").html(
					`
                    <img src="https://openweathermap.org/img/wn/${climate.weather[0].icon}@4x.png" alt="weather-condition">
                    <p>${climate.weather[0].description}<p>
                    <ul>
                            <li>Wind Speed: ${climate.wind.speed} m/s</li>
                            <li>Temperature: ${climate.main.temp}</li>
                            <li>Humidity: ${climate.main.humidity}</li>
                            <li>Visibility: ${climate.visibility}</li>
                    </ul>
                    `
				);

				// Map section
				app.addMarker({
					name: "basic-marker",
					latlng: {
						lat: climate.coord.lat,
						lng: climate.coord.lon,
					},
					popup: {
						title: {
							html: `${country.translations.fa}`,
						},
						description: {
							html: "This is sample of the country",
						},
						open: true,
					},
				});
			});
		});
	});
});
