// global variables
var data;
var selectedHotelIndex;
var selectedRestaurantIndex;

function onAppStart() {
	console.log("onAppStart");
	
	setTimeout(initInfoSlider, 1000);
	loadDataFromServer();
}


function initInfoSlider() {
	console.log('lll');
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
		

function loadDataFromServer() {
	$.ajax({
		url:'http://www.blessedbytes.de/mobdev/weimar_catalog.php?callback=?',
		type: 'GET',
        dataType: 'jsonp',
        success: function(callbackData) {
			data = callbackData;
			console.log("loaded server data");
		}
	});
}




/* Hotel List */

//$('#hotel_list').on('pageinit', function() {
//	initHotelList();
//});


function initHotelList() {
	if(data===undefined || data==null) {
		setTimeout(initHotelList, 200);
		return;
	}
	
	// TODO: Load hotel list
	showHotelList(data.Hotels[i]);
      function showHotelList(hotel) {
      	for (i = 0; i < hotel.Name; i++){
	      $('#hotelListing').html(hotel.Name[i] + "<br>");
	      }
      }
}

function showHotel(hotelindex) {
	selectedHotelIndex = hotelindex; 
	$.mobile.changePage($("#hotel_details"));
}




/* Hotel Details */

$('#hotel_details').on('pagebeforeshow', function() {
	initHotelDetails();
var storedValue = localStorage.getItem('HotelStorage2');
$('#hotel_details_content').append(storedValue);
});

function initHotelDetails() {

	// TODO: Load all hotel details 
	// hint: how could  selectedHotelIndex  be useful here?

	var hotel = data.Hotels[0];
	//alert(hotel.Rating);
        var storeDetailLocally = hotel.Name;
			localStorage.setItem('HotelStorage2', storeDetailLocally);
//	$('#hotel_details_content').append(hotel.Description);	

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
	
	// TODO: Load restaurant list
	
}

function showRestaurant(restaurantindex) {
	selectedRestaurantIndex = restaurantlindex; 
	$.mobile.changePage($("#restaurant_details"));
}








/* Restaurant Details */

$('#restaurant_details').on('pagebeforeshow', function() {
	initRestaurantDetails();
});

function initRestaurantDetails() {
	// TODO: Load all hotel details 
	// hint: how could  selectedRestaurantIndex  be useful here?

	var restaurant = data.Restaurants[0];
	alert(restaurant.Name);

	
	//loadRestaurantData(restaurant, selectedRestaurantIndex);
	//loadRestaurantMap(restaurant);
	//loadRestaurantImages(restaurant);
}
