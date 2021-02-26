const NASA_KEY = "AxyVlATDjde91tv0Jc3LF8hJFnBKsnHiRDOwJsIA";
// https://api.nasa.gov/planetary/earth/assets?lon=-95.33&lat=29.78&date=2018-01-01&&dim=0.10&api_key=DEMO_KEY
const GOOGLE_KEY = "AIzaSyDLqZDmW8vw7jjDcsTHVH0Ga82irtt-7vg";


// https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
// ADDRESS
const AddressSearch = (e) => {
    e.preventDefault();
    if (document.getElementById("AddressSearchInput").value === "") {
        alert("Input an address");
        return;
    }
    document.querySelector(".sateliteImageHolder").classList.remove("hide");
    let address = document.getElementById("AddressSearchInput").value;
    let google_url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_KEY}`;
    fetch(google_url)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            let latitude = json.results[0].geometry.location.lat;
            let longitude = json.results[0].geometry.location.lng;

            let date = document.getElementById("date").value;
            if (date == "")
                date = "2019-01-01";
            //console.log(date)
            console.log(latitude, longitude)
            let url = `https://api.nasa.gov/planetary/earth/assets?lon=${longitude}&lat=${latitude}&date=${date}&dim=.1&api_key=${NASA_KEY}`;
            fetch(url)
                .then(function (response) {
                    return response.json();
                }).then(function (json) {
                    document.getElementById("sateliteImage").src = json.url;
                }).catch((error) => {
                    alert("No Satelite information for given date. Try again :)");
                    return;
                })
        })
        .catch((error) => {
            alert("No data given for specific address. try again :)")
            return;
        });
    document.getElementById("sateliteImage").classList.remove("hide");
}
document.getElementById("AddressSearchInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter")
        AddressSearch(e);
});
document.getElementById("AddressSearch").addEventListener("click", function (e) {
    AddressSearch(e);
});



//ASTRONOMY OF THE DAY
document.getElementById("getAPOD").addEventListener("click", function (e) {
    let date = document.getElementById("getAPODDate").value;
    e.preventDefault();
    fetch(`https://api.nasa.gov/planetary/apod?date=${date}&api_key=${NASA_KEY}`)
        .then(function (response) {
            return response.json();
        }).then(function (json) {
            let date = json.date;
            let description = json.explanation;
            let title = json.title;
            let image = json.url;

            document.querySelector(".APODdescription h3").innerText = title;
            document.querySelector(".APODimage").src = image;
            document.querySelector(".APODdescription p").innerText = description;
            document.querySelector(".APODdescription h5").innerText = date;

        })
    document.getElementById("APOD").classList.remove("hide");
});


//NASA IMAGE SEARCH
const NASASEARCH = (e) => {
    if (document.getElementById("NASAinput").value == "") {
        alert("Please add a search term")
    }
    let search = document.getElementById("NASAinput").value;
    e.preventDefault();
    fetch(`https://images-api.nasa.gov/search?q=${search}&media_type=image`)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            let items = json.collection.items;
            let images = "";
            for (let i of items) {
                images += `<img src="${i.links[0].href}">`;
            }
            document.getElementById("NASAimagesHolder").innerHTML = images;
        })
    document.getElementById("NASAimagesWrapper").classList.remove("hide");
}

document.getElementById("NASAinput").addEventListener("keydown", function (e) {
    if (e.key === "Enter" && document.getElementById("NASAinput").value != "") { //checks whether the pressed key is "Enter"
        NASASEARCH(e);
    }

})
document.getElementById("NASAsearch").addEventListener("click", function (e) {
    if (document.getElementById("NASAinput").value != "")
        NASASEARCH(e);
    else
        alert("Add a search term")
})


//EVENTS 

document.getElementById("eventSearch").addEventListener("click", function (e) {
    console.log("clicked")

    fetch("https://eonet.sci.gsfc.nasa.gov/api/v2.1/events")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            let events = "<table class='fl-table'><thead><tr><th>Icebergs</th><th>Fires</th><th>Tropical Storms</th><th>Volcanos</th><th>Misc.</th></tr></thead><tbody>";
            let iceberg = [];
            let fire = [];
            let tropical = [];
            let volcano = [];
            let misc = [];
            for (let i in json.events) {
                let lower = json.events[i].title.toLowerCase();
                if (lower.includes("iceberg")) {
                    iceberg.push(lower)
                } else if (lower.includes("fire")) {
                    fire.push(lower);
                } else if (lower.includes("tropical")) {
                    tropical.push(lower);
                } else if (lower.includes("volcano")) {
                    volcano.push(lower);
                } else {
                    misc.push(lower);
                }
            }
            for (let j = 0; j < iceberg.length; j++) {

                events += `<tr><td>${iceberg[j]}</td><td>${fire[j]}</td><td>${tropical[j]}</td><td>${volcano[j]}</td><td>${misc[j]}</td></tr>`

            }
            events += `</tbody></table>`;
            console.log(events);
            const regex = /undefined/ig;
            let final = events.replaceAll(regex, "");
            document.getElementById("eventTable").innerHTML = final;
        })
    document.getElementById("eventTable").classList.remove("hide");

});