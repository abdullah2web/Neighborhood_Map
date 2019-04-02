
var appViewModel;

// array of locations
var locations = [
  {
    title: "SCITECH",
    location: {
      lat: 26.3197371,
      lng: 50.2273573
    }
  },
  {
    title: "Meridien Hotel",
    location: {
      lat: 26.300994,
      lng: 50.2258299
    }
  },
  {
    title: "Fouad Shopping Center",
    location: {
      lat: 26.2984388,
      lng: 50.2238938
    }
  },
  {
    title: "LaFonda Restaurant",
    location: {
      lat: 26.2980961,
      lng: 50.2238634
    }
  },
  {
    title: "Seef Center",
    location: {
      lat: 26.2968483,
      lng: 50.2242996
    }
  }

];

// create a map variable that will be used in initMap()
var map;

// create array for listing markers in map
var markers = [];

// initialize map
function initMap() {
  // intial map view when loaded
  var myLatLng = {
    lat: 26.3084504,
    lng: 50.2217093
  };
  // create a map object and get map from DOM for display
  map = new google.maps.Map(document.getElementById("map"), {
    center: myLatLng,
    zoom: 15
  });

  // creates infowindow for each place pin
  var infoWindow = new google.maps.InfoWindow();

  // iterates through all locations and drop pins on every single location
  for (j = 0; j < locations.length; j++) {
    (function() {
      // store title and location iteration in variables
      var title = locations[j].title;
      var location = locations[j].location;

      // drop marker after looping
      var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: title,
        animation: google.maps.Animation.DROP,
        address: address
      });
      // pushes all locations into markers array
      markers.push(marker);
      appViewModel.myLocations()[j].marker = marker;

      // Create an onclick event to open an infowindow at each marker.
      marker.addListener("click", function() {
        // show info inside infowindow when clicked
        populateInfoWindow(this, infoWindow);
        // displays all data retrieved from foursquare api down below
        infoWindow.setContent(contentString);
      });

      // This function populates the infowindow when the marker is clicked.
      function populateInfoWindow(marker, infoWindow) {
        if (infoWindow.marker != marker) {
          infoWindow.marker = marker;
          infoWindow.setContent(
            '<div class="title">' +
              marker.title +
              "</div>" +
              marker.contentString
          );
          // sets animation to bounce 2 times when marker is clicked
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function() {
            marker.setAnimation(null);
          }, 2130);
          infoWindow.open(map, marker);
          // Make sure the marker property is cleared.
          infoWindow.addListener("closeclick", function() {
            infoWindow.setMarker = null;
          });
        }
      }

      // foursquare client-id and client-secret
      var client_id = "Y20HEVJX0L0WEZACMWWXPB3CNY5CMQ3XCXI03DAS3ZYVELAC";
      var client_secret = "ADXK2QOYT1A30Q3QZVSZWJ5S5SYMQQUOE1Q4OLSZ0WS3ISIP";

      // foursquare api url
      var foursquareUrl = "https://api.foursquare.com/v2/venues/search";
      // creating variables outside of the for ajax request for faster loading
      var venue, address, category, foursquareId, contentString;

      // ajax request - foursquare api data
      $.ajax({
        url: foursquareUrl,
        dataType: "json",
        data: {
          client_id: client_id,
          client_secret: client_secret,
          query: marker.title,
          near: "Khobar City",
          v: 20190331
        },
        success: function(data) {
          // get venue info
          venue = data.response.venues[0];
          // get venue address info
          address = venue.location.formattedAddress[0];
          // get venue category info
          category = venue.categories[0].name;
          // gets link of place
          foursquareId = "https://foursquare.com/v/" + venue.id;
          // populates infowindow with api info
          contentString =
            "<div class='name'>" +
            "Name: " +
            "<span class='info'>" +
            title +
            "</span></div>" +
            "<div class='category'>" +
            "Catergory: " +
            "<span class='info'>" +
            category +
            "</span></div>" +
            "<div class='address'>" +
            "Location: " +
            "<span class='info'>" +
            address +
            "</span></div>" +
            "<div class='information'>" +
            "More info: " +
            "<a href='" +
            foursquareId +
            "'>" +
            "Click here" +
            "</a></div>";

          marker.contentString;
        },
        error: function() {
          contentString =
  "<div class='name'>Data is currently not available. Please try again.</div>";
        }
      });
    })(j);
  }
}

function mapError() {
  alert("Map could not be loaded at this moment. Please try again");
}

// Location Constructor
var Location = function(data) {
  var self = this;
  this.title = data.title;
  this.location = data.location;
  this.show = ko.observable(true);
};

// VIEW MODEL //
var AppViewModel = function() {
  var self = this;
  // define Location observable array
  this.myLocations = ko.observableArray();
  this.filteredInput = ko.observable("");

  for (i = 0; i < locations.length; i++) {
    var place = new Location(locations[i]);
    self.myLocations.push(place);
  }

  this.searchFilter = ko.computed(function() {
    var filter = self.filteredInput().toLowerCase();
    // iterates through myLocations observable array
    for (j = 0; j < self.myLocations().length; j++) {
      // it filters myLocations as user starts typing
      if (
        self
          .myLocations()
          [j].title.toLowerCase()
          .indexOf(filter) > -1
      ) {
        // shows locations according to match with user key words
        self.myLocations()[j].show(true);
        if (self.myLocations()[j].marker) {
          self.myLocations()[j].marker.setVisible(true);
        }
      } else {
        self.myLocations()[j].show(false);
        if (self.myLocations()[j].marker) {
          self.myLocations()[j].marker.setVisible(false);
        }
      }
    }
  });

  // map marker bounces when location is clicked on list
  this.showLocation = function(locations) {
    google.maps.event.trigger(locations.marker, "click");
  };
};

// instantiate the ViewModel using the new operator and apply the bindings
appViewModel = new AppViewModel();

// activate knockout apply binding
ko.applyBindings(appViewModel);
