var map;
var currLocation;
var socket;
var isMobile=false

var mobilePage='1';

function initMapBlack(str) 
{
	// Styles a map in night mode.
      map = new google.maps.Map(document.getElementById(str), {
      center: {lat: 40.674, lng: -73.945},
      zoom: 13,
      disableDefaultUI: true,
      scrollwheel:  false,
      styles: [
        {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#A64CA6'}]},
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{color: '#A64CA6'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#A64CA6'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{color: '#263c3f'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#A64CA6'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#38414e'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{color: '#212a37'}]
        },
        {
     	  featureType: "road",
     	  elementType: "labels.icon",
     	  stylers: [{ visibility: "off" }]
   		},
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{color: '#A64CA6'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#746855'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: '#1f2835'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{color: '#A64CA6'}]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{color: '#2f3948'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{color: '#A64CA6'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{color: '#17263c'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#A64CA6'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{color: '#17263c'}]
        }
      ]
    });
}
function getLoc()
{
	if (navigator.geolocation) 
	{
		navigator.geolocation.getCurrentPosition( (position) => {

			currLocation = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			//this.setCurrLocation(currLocation)
		});
	} else {
		// Browser doesn't support Geolocation
		alert("error geolocation")
	}
}
function centerMap(loc)
{
	map.setCenter(loc);
}


$( document ).ready(function() {

  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    isMobile = true
  }

  if(isMobile)
  {
    $('#Desktop').css({"display": "none"});
    $('#Mobile').css({"display": "block"});
    initMapBlack('mobile_map');

  }else{
    $('#Desktop').css({"display": "block"});
    $('#Mobile').css({"display": "none"});
    initMapBlack('map');
  }

	getLoc();

	setTimeout(()=>{centerMap(currLocation)},700);
	setTimeout(()=>{newMarker()},900);

  socket=io('http://localhost:3000/');
  $('#tab1').click(function() {
    $('#view1').css({"display": "block"});
    $('#view2').css({"display": "none"});
  });
  $('#tab2').click(function() {
    $('#view2').css({"display": "block"});
    $('#view1').css({"display": "none"});
    initMapBlack('mobile_map');
  });

	$('.sexual_assault').click(function() {
			if(currLocation)
			{
				socket.emit('alert', { pos : currLocation, msg: 'sexual assault', userInfo: null});
			}else{
				alert('cant find ur position')
			}
	});
  $('.Other').click(function() {
      if(currLocation)
      {
        socket.emit('alert', { pos : currLocation, msg: 'Other', userInfo: null});
      }else{
        alert('cant find ur position')
      }
  });

	socket.on('alert', function (data) {
    createMarker(data,dangerIcon);
		//centerMap(data.pos);
		createTab(data);
	}); 


	socket.on('get data', function (data) {
    
  setTimeout(()=>{ if(currLocation){ socket.emit('new person', {pos:currLocation});}},500);

    if(data)
    {
      for(var i = 0; i<data.alert.length;i++)
  		{
  			createTab(data.alert[i]);
  		}

      for(var i = 0; i<data.alert.length;i++)
      {
        createMarker(data.alert[i],dangerIcon);
      }
      console.log(data.user)

      for(var i = 0; i<data.user.length;i++)
      {
        console.log(data.user)
        createMarker(data.user[i],friendIcon);
      }
    }

	}); 

}); 

var meMaker;

function newMarker()
{
	meMaker = new google.maps.Marker({
    position:currLocation,
    map: map,
    // set the icon as catIcon declared above
    icon: meIcon,
    // must use optimized false for CSS
    optimized: false
	});
}

function createMarker(place, maker) 
{


	var marker = new google.maps.Marker({
    	position:place.pos,
    	map: map,
    	// set the icon as catIcon declared above
    	icon: maker,
    	// must use optimized false for CSS
    	optimized: false,
    	animation: google.maps.Animation.DROP
	});

    google.maps.event.addListener(marker, 'click', function() {
    	alert(place.msg)
    });
}

function createTab(data)
{
  var d = new Date();
  d.toString();
	$( "#tabs" ).append( "<div style='padding:5px;'><div class='tab'> ( long:"+data.pos.lng+", lat:"+ data.pos.lat+" ) "+ data.msg +" "+d.toString() +"</div></div>" );
  $( "#mobile_tabs" ).append( "<div style='padding:5px;'><div class='tab'> ( long:"+data.pos.lng+", lat:"+ data.pos.lat+" ) "+ data.msg+" "+d.toString() +"</div></div>" );

}
var meIcon = {
    url: './1.gif',
    //state your size parameters in terms of pixels
    size: new google.maps.Size(100, 100),
    scaledSize: new google.maps.Size(35, 35),
    origin: new google.maps.Point(0,0)
}
var friendIcon = {
    url: './5.gif',
    //state your size parameters in terms of pixels
    size: new google.maps.Size(100, 100),
    scaledSize: new google.maps.Size(25, 25),
    origin: new google.maps.Point(0,0)
}
var dangerIcon = {
    url: './3.gif',
    //state your size parameters in terms of pixels
    size: new google.maps.Size(100, 100),
    scaledSize: new google.maps.Size(30, 30),
    origin: new google.maps.Point(0,0)
}