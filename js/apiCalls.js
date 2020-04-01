const googleKey = "AIzaSyDd6YCw-6flTe8hl7pbtf2AG1ngj_uK6Ns";

function getGeocoding(locations) {
    let url = "https://maps.googleapis.com/maps/api/geocode/json?";
    let finalUrlFrom = url + "address=" + locations.from.replace(" ", "+") + "&key=" + googleKey;
    let finalUrlTo= url + "address=" + locations.to.replace(" ", "+") + "&key=" + googleKey;
    let data = fetch(finalUrlTo)
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
            dataObj.fromLat = data.geometry.location.lat;
            dataObj.fromLng = data.geometry.location.lng;
            renderResultsPage(dataObj);
            addLoading();
            //getNearestAirport(dataObj.fromLat, dataObj.fromLng);

            //getGeocoding2(finalUrlFrom)
                


        })
        .catch(e => {
            $('#error-message').removeClass("d-none");
            $('#error-message').text(`Something went wrong. Please try again.`);
            console.log(`Error: ${e}`);
        });
}

/* function getNearestAirport(lat, lng) {
    const airportUrl = `https://test.api.amadeus.com/v1/reference-data/locations/airports?latitude=${lat}&longitude=${lng}`;
    const token = 'Bearer bYS88LLrdK5GRQaQK9Yvx01KoJJA'
    fetch('https://example.com/profile', {
        headers: {
            'Authorization': token,
            'Access-Control-Allow-Origin': '*'
        }})
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            console.log(responseJson.data[0].iataCode);
        })
        .catch(e => {
            // FIGURE OUT HOW TO HANDLE SUCH AN ERROR
            /* $('#error-message').removeClass("d-none");
            $('#error-message').text(`Something went wrong. Please try again.`);
            console.log(`Error: ${e}`); */
        });
} */



/* function getGeocoding2(url) {
    let data = fetch(url)
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
            dataObj.fromLat = data.geometry.location.lat;
            dataObj.fromLng = data.geometry.location.lng;
            renderResultsPage(dataObj);
            addLoading();
        })
        .catch(e => {
            $('#error-message').removeClass("d-none");
            $('#error-message').text(`Something went wrong. Please try again.`);
            console.log(`Error: ${e}`);
        });
} */
