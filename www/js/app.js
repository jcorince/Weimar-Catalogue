// global variables
var data;
var selectedHotelIndex;
var selectedRestaurantIndex;


function onAppStart() {
	console.log("onAppStart");

	loadFromCache();
	loadDataFromServer();

	/* to show back button always */
	$(document).bind("mobileinit", function() {
		  $.mobile.page.prototype.options.addBackBtn = true;
	});

}

function loadFromCache() {
	var strigifiedData = localStorage.getItem("local_data");
    data = JSON.parse(strigifiedData);
    console.log("data=" + data);
}


function loadDataFromServer() {
	$.ajax({
		url:'http://www.blessedbytes.de/mobdev/weimar_catalog.php?callback=?',
		type: 'GET',
        dataType: 'jsonp',
        success: function(callbackData) {
			data = callbackData;
			var strigifiedData = JSON.stringify(data);
			localStorage.setItem("local_data", strigifiedData);
			console.log("loaded server data");
		}
	});
}

/* Main Page */

$('#startup').on('pagebeforeshow', function() {
	setTimeout(initHomeSlider, 1000);
});


function initHomeSlider() {
	window.mySlider = new Swipe(document.getElementById("home_slider"), {
		startSlide: 0,
		// speed: 400,
		auto: 2000,
		continuous: true,
		// disableScroll: false,
		// stopPropagation: false,
		// callback: function(index, elem) {},
		// transitionEnd: function(index, elem) {}
	});		
}


/* GENERAL INFO */

$('#general_info').on('pagebeforeshow', function() {
	setTimeout(initInfoSlider, 1000);
});


function initInfoSlider() {
	window.mySlider = new Swipe(document.getElementById("info_slider"), {
		startSlide: 0,
		// speed: 400,
		auto: 2000,
		continuous: true,
		// disableScroll: false,
		// stopPropagation: false,
		// callback: function(index, elem) {},
		// transitionEnd: function(index, elem) {}
	});		
}






/* Hotel List */

$('#hotel_list').on('pageinit', function() {
	initHotelList();
});


function initHotelList() {
	if(data===undefined || data==null) {
		setTimeout(initHotelList, 200);
		return;
	}

	showHotelList(data.Hotels);
}

function showHotelList(hotels) {
 	console.log("showHotelList" + hotels);
  	var i;
  	
  	for (i = 0; i < hotels.length; i++) {
  		console.log("showHotelList" + i);
         $('#hotel_listview').append('<li> <a href="javascript:showHotel(' + i + ')">' +'<img src="'+ hotels[i].Pictures[0]+'" ></img><h3>' + hotels[i].Name + '</h3><p>'+ hotels[i].Description+'</p></a></li>' );
    }
	$('#hotel_listview').listview();	
}

function showHotel(hotelindex) {
	selectedHotelIndex = hotelindex; 
	$.mobile.changePage($("#hotel_details"));
}



/* Hotel Details */

$('#hotel_details').on('pagebeforeshow', function() {
	initHotelDetails();
});


function initHotelDetails() {
	var hotel = data.Hotels[selectedHotelIndex];

 	$('#hotel_details_header').html(hotel.Name + " Hotel");
    $('#stars').html(hotel.Rating);
    $('#description').html(hotel.Description);
    $('#rooms').html(hotel.Rooms);
    $('#Pricing').html(hotel.Pricing);
    $('#Location').html(hotel.Location);
    $('#Homepage').html(hotel.HomePage);
    $('#address').html(hotel.Street + " Weimar");
    $('#preview').attr('src', hotel.Pictures[0]);
    $('#img1').attr('src', hotel.Pictures[0]);
    $('#img2').attr('src', hotel.Pictures[1]);
    $('#img3').attr('src', hotel.Pictures[2]);
    
    $('#call_hotel').attr('href', getCallLink(hotel));
    $('#save_hotel').attr('href', 'javascript:saveHotel(' + selectedHotelIndex + ')');
    $('#goto_hotel').attr('href', getNavigateToLink(hotel));
}



function initSlider(id) {
	window.mySlider = new Swipe(document.getElementById(id), {
		startSlide: 0,
		// speed: 400,
		auto: 2000,
		continuous: true,
		// disableScroll: false,
		// stopPropagation: false,
		// callback: function(index, elem) {},
		// transitionEnd: function(index, elem) {}
	});
}




/* Restaurant List */

$('#restaurant_list').on('pageinit', function() {
	initRestaurantList();
});


function initRestaurantList() {
	if(data===undefined || data==null) {
		setTimeout(initRestaurantList, 200);
		return;
	}

	var $restaurantsList = $('#restaurant_listview');
	var restaurantsData = data.Restaurants;
	var restaurantsElementsCollection = [];

	console.log(restaurantsData);


	for( var i in restaurantsData ) {
		var currentRestaurant = restaurantsData[i];
		var $restaurantElement = $('<li>');
		$restaurantElement.attr('class','listcontent');
		$restaurantElement.append('<a>');
		$restaurantElement.find('a')
					.attr('href','#restaurant_details')
					.html(currentRestaurant.Name)
					.append('<img class="listimage" src="'+currentRestaurant.Pictures[0]+'" />')
					.append('<p>'+currentRestaurant.Location+'</p>')
					.append('<p>'+currentRestaurant.OpeningHours+'</p>')
					.data('index',i)
					.click(function(){
							showRestaurant($(this).data('index'));
						});
		restaurantsElementsCollection.push($restaurantElement);
	}

	$restaurantsList
		.append(restaurantsElementsCollection)
		.listview('refresh');

}

function showRestaurant(restaurantindex) {
	selectedRestaurantIndex = restaurantindex; 
	$.mobile.changePage($("#restaurant_details"));
}








/* Restaurant Details */

$('#restaurant_details').on('pagebeforeshow', function() {
	initRestaurantDetails();
});

function initRestaurantDetails() {
	var currentRestaurant = data.Restaurants[selectedRestaurantIndex];

	loadRestaurantData(currentRestaurant);
	loadRestaurantImages(currentRestaurant);
	InitRestaurantDetailsButtons();
}

function loadRestaurantData(restaurant) {
	$('#restaurant_details_header').html(restaurant.Name);

	var address = 
			restaurant.Name+'<br/>'+
			restaurant.Street+'<br/>'+
			restaurant.ZIPCode+', '+restaurant.Town+'<br/>'+
			restaurant.Telephone+'<br/>'+
			restaurant.Email+'</p>';

	var map_image = 'http://maps.googleapis.com/maps/api/staticmap?markers=';
	map_image += restaurant.Coordinates;
	map_image += '&zoom=16&size=350x350&scale=2&sensor=false';


	$('#restaurant-data')
		.empty()
		.append('<h2>'+restaurant.Name+'</h2>')
		.append('<p><strong>Type:</strong> '+restaurant.Type+'</p>')
		.append('<p><strong>Opening Hours:</strong> '+restaurant.OpeningHours+' stars</p>')
		.append('<p><strong>Location:</strong> '+restaurant.Location+'</p>')
		.append('<p><strong>Seating:</strong> '+restaurant.Seats+'</p>')
		.append('<p>'+restaurant.Extra+'</p>')
		.append('<h3>Address & Contact</h3>')
		.append('<p>'+address+'</p>')
		.append('<h3>Description</h3>')
		.append('<p>'+restaurant.Description+'</p>')
		.append('<h3>Map</h3>')
		.append('<img class="map-image" src="'+map_image+'" />');
}


function loadRestaurantImages( restaurant ) {	
	var restaurantImageElementsCollection = [];
	var pictures = restaurant.Pictures;


	for( var i in pictures ) {
		var pictureHtml = '<div display="none"><img src="'+pictures[i]+'" height="200" width="300"/></div>';
		restaurantImageElementsCollection.push( $( pictureHtml ) );
	}

	$('#restaurant_photos')
		.empty()
		.append(restaurantImageElementsCollection);


	var sliderTimeout = isMobile ? 2000 : 500;
	setTimeout("initSlider('restaurantSlider');", sliderTimeout);
}


function InitRestaurantDetailsButtons() {
	var restaurant = data.Restaurants[selectedRestaurantIndex];

   
	$('#restaurant-call-btn').attr('href', getCallLink(restaurant));

	$('#restaurant-contact-btn').click(function(){
		var restaurant = data.Restaurants[selectedRestaurantIndex];
		addContact(restaurant);
	});

	$('#restaurant-maps-btn').attr('href', getNavigateToLink(restaurant));
} 



function getCallLink(hotel) {
	var phonenum = hotel.Telephone;
    return "tel:" + phonenum;
}


function saveHotel(index) {
	var hotel = data.Hotels[selectedHotelIndex];
	addContact(hotel);
}


function getNavigateToLink(hotel) {
	var name = escape(hotel.Name);
	var coordinates = hotel.Coordinates;

	var isAndroid = isMobile && navigator.userAgent.indexOf('Android') > 0;
	var isWindowsPhone = isMobile && navigator.userAgent.indexOf('WindowsPhone') > 0;
	var isiOS = isMobile && navigator.userAgent.indexOf('AppleWebKit') > 0;
       
    if (isAndroid || !isMobile)
    {
        //geo:lon,lat?q=coordinates(name);
        return "geo:"+coordinates+"?q="+coordinates+"("+name+")";
    }
    else if (isWindowsPhone)
    {
    	return "explore-maps://v1.0/?latlon="+coordinates+"&zoom=5";
    }
    else if (isiOS)
    {
        //http:/\/maps.apple.com/?ll=coordinates;
		return "http://maps.apple.com/?ll="+coordinates;
	}
}



 
    

function addContact(hotel){
	if(!isMobile) {
		alert("addContact " + hotel.Name);
		return;
	}

	alert("adding contact");
	var displayName = hotel.Name;
	//alert(displayName);
	var note = hotel.Description;
	//alert(note);
	var phoneNumber = hotel.Telephone;
	//alert(phoneNumber);
	var email = hotel.Email;
	//alert(email;)
	var street = hotel.Street;
	//alert(street);
	var town = hotel.Town;
	//alert(town);
	var ZIP = hotel.ZIPCode;
	//alert(ZIP);
	var country = "Germany";
	//alert(country);
//	alert(displayName + note + phoneNumbers + emails + addresses);
	var theContact = navigator.contacts.create({"displayName" : displayName});
	//alert("ccccc");
	theContact.note = note;
	//alert(theContact.note);

	var phoneNumbers = [];
	phoneNumbers[0]= new ContactField('work', phoneNumber, true);
	theContact.phoneNumbers = phoneNumbers;

	//alert(phoneNumbers);
	var emails = [];
	emails[0]= new ContactField('work', email, false);
	theContact.emails = emails;
	//alert(theContact.emails);

	var addresses = [];
	addresses[0]= new ContactAddress({"pref" : false,"type" : "home","streetAddress" : street,"locality" : town,"postalCode" : ZIP,"country" : country});
	theContact.addresses = addresses;
	//alert(theContact.addresses);
	theContact.save(onSaveSuccess, onSaveError);

	function onSaveSuccess(theContact) {
		alert("Save Success");
	}
 
	// onSaveError: Failed to get the contacts
	function onSaveError(contactError) {
    	alert("Error = " + contactError.code);
	}
}

  
