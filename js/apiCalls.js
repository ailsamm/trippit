const googleKey = "AIzaSyDd6YCw-6flTe8hl7pbtf2AG1ngj_uK6Ns";
const airportCodeToken = 'Bearer <token>'

function getGeocoding1(locations) {
    let url = "https://maps.googleapis.com/maps/api/geocode/json?";
    let finalUrlFrom = url + "address=" + locations.from.replace(" ", "+") + "&key=" + googleKey;
    let finalUrlTo= url + "address=" + locations.to.replace(" ", "+") + "&key=" + googleKey;
    fetch(finalUrlTo)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            return responseJson.results[0];
        })
        .then(data => {
            let dataObj = {};
            dataObj.destination= data.formatted_address;
            dataObj.toLat = data.geometry.location.lat;
            dataObj.toLng = data.geometry.location.lng;
            renderResultsPage(dataObj);
            addLoading();
            getGeocoding2(finalUrlFrom, dataObj);
        })
        .catch(e => {
            $('#error-message').removeClass("d-none");
            $('#error-message').text(`Something went wrong. Please try again.`);
            console.log(`Error: ${e}`);
        });
}

function getGeocoding2(fromUrl, dataObj) {
    fetch(fromUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            return responseJson.results[0];
        })
        .then(data => {
            dataObj.fromLat = data.geometry.location.lat;
            dataObj.fromLng = data.geometry.location.lng;
            getNearestAirport1(dataObj);
        })
        .catch(e => {
            $('#error-message').removeClass("d-none");
            $('#error-message').text(`Something went wrong. Please try again.`);
            console.log(`Error: ${e}`);
        });
}

function getNearestAirport1(dataObj) {
    const airportUrl = `https://api.amadeus.com/v1/reference-data/locations/airports?latitude=${dataObj.toLat}&longitude=${dataObj.toLng}`;
    fetch(airportUrl, {
        headers: {
            'Authorization': airportCodeToken
        }})
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            console.log(`To: ${responseJson.data[0].iataCode}`);
            dataObj.toAirport = responseJson.data[0].iataCode;
            getNearestAirport2(dataObj);
        })
        .catch(e => {
            // FIGURE OUT HOW WE WANT TO HANDLE SUCH AN ERROR
        });
}

function getNearestAirport2(dataObj) {
    const airportUrl = `https://api.amadeus.com/v1/reference-data/locations/airports?latitude=${dataObj.fromLat}&longitude=${dataObj.fromLng}`;
    
    fetch(airportUrl, {
        headers: {
            'Authorization': airportCodeToken
        }})
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            console.log(`From: ${responseJson.data[0].iataCode}`);
            dataObj.fromAirport = responseJson.data[0].iataCode;
            getFlightInfomation(dataObj);
        })
        .catch(e => {
            // FIGURE OUT HOW WE WANT TO HANDLE SUCH AN ERROR
        });
}

function getFlightInfomation(dataObj){
    const flightUrl = `https://api.skypicker.com/flights?flyFrom=${dataObj.fromAirport}&to=${dataObj.toAirport}&dateFrom=18/11/2020&dateTo=12/12/2020&partner=picky&v=3`;
    
    fetch(flightUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            dataObj.flightLink = responseJson.data[0].deep_link;
            dataObj.flightPrice = responseJson.data[0].price;
            getFlights(dataObj);
        })
        .catch(e => {
            // FIGURE OUT HOW WE WANT TO HANDLE SUCH AN ERROR
        });
}
