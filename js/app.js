
var map;
function initMap() {

  var options = {
    center:{lat:26.3084504,lng:50.2217093},
    zoom:15,
  };

  // New map
  var map = new google.maps.Map(document.getElementById('map'), options);

  // Listen for click on map
  google.maps.event.addListener(map, 'click', function(event){
    // Add marker
    addMarker({coords:event.latLng});
  });

  // Array of markers
  var markers = [
    {
      coords:{lat:26.3197371,lng:50.2273573},
      iconImage:'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
      content:'<h1>SCITECH</h1>'
    },
    {
      coords:{lat:26.300994,lng:50.2258299},
      content:'<h1>Meridien Hotel</h1>'
    },
    {
      coords:{lat:26.2984388,lng:50.2238938},
      content:'<h1>Fouad Shopping Center</h1>'
    },
    {
      coords:{lat:26.2980961,lng:50.2238634},
      content:'<h1>LaFonda Restaurant</h1>'
    },
    {
      coords:{lat:26.2968483,lng:50.2242996},
      content:'<h1>Seef Center</h1>'
    },
  ];

  // Loop through markers
  for(var i = 0;i < markers.length;i++){
    // Add marker
    addMarker(markers[i]);
  };

  // Add Marker Function
  function addMarker(props){
    var marker = new google.maps.Marker({
      position:props.coords,
      map:map,
      //icon:props.iconImage
    });

    // Check for customicon
    if(props.iconImage){
      // Set icon image
      marker.setIcon(props.iconImage);
    }

    // Check content
    if(props.content){
      var infoWindow = new google.maps.InfoWindow({
        content:props.content
      });

      marker.addListener('click', function(){
        infoWindow.open(map, marker);
      });
    }
  }

};

Vue.component('new-div', {

    props: ['places'],
    template: '<li class="nav-item"><a class="nav-link" href="#">{{ places }}</a></li>'
  }),

new Vue({
      el: '#app',
      data: {
          places: ['SCITECH', 'Meridien-Hotel', 'Fouad-Shopping-Center', 'LaFonda-Restaurant', 'Seef-Center'],
      }
    });
