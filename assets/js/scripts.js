$(document).ready(function(){
	initializeType();
	$(".select_category").change(function(){
		var id = $(this).val();
		if(id > -1){
			ajaxCall("home/getmapbasedonid", {id:id}, "POST", "json", function(data){
				if(!$.isEmptyObject(data)){
					var html = "";
					plotMaps(data);
					html += "<option value='-1'>--Select Restaurant--</option>";
					for(var index in data){
						html +="<option value='" + data[index].id + "'>" + data[index].name + "</option>";
					}
					$(".select_restaurant").html(html);
					$(".res_list").removeClass("hide");
				}
			});
		}else{
			ajaxCall("home/loaddefaultmaps", {}, "GET", "json",function(data){
				plotMaps(data);
				$(".res_list").addClass("hide");	
			});	
		}
	});
    //restaurant
    $(".select_restaurant").change(function(){
        var id = $(this).val();
        if(id > -1){
            ajaxCall("home/getrestaurant", {id:id}, "POST", "json", function(data){
                console.log(data);
                if(!$.isEmptyObject(data)){
                    plotMaps(data);
                    var info = restaurantInfo(data[0]);
                    $(".restaurant_detail").removeClass("hide").html(info);
                }
            });
        }
    });
});

var myOrigin = {
    lat: 10.3098124,
    longi: 123.8939467,
    name: "Fuente Circle"
}

function restaurantInfo(data){
    var html = '<table class="restaurant_info">';
        html += '<tr><td colspan="2">Detail:</td></tr>';
        html += '<tr>';
        html += '<td>Name:</td><td>' + data.name + '</td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td>Specialty:</td><td>' + data.specialty + '</td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td>Patrons:</td><td>' + ((data.jobs != null) ? data.jobs : 'None Specified') + '</td>';
        html += '</tr>';
        html += '</table>';
    return html;
}

function ajaxCall(url, data, type, dataType, callback){	
	return $.ajax({
		url: url,
        type: type,
       	data: data,	           	
       	dataType: dataType,	           
        success: function(data){
        	if(callback){
        		callback(data);
        	}
        },
        error: function(){
        	console.log("There was an error with your request.");
        }
    });	
}

function initializeType(){
	ajaxCall("home/getcategory", {}, "GET", "json", function(data){
		var html = "";
		for(var index in data){
			html +="<option value='" + index + "'>" + data[index] + "</option>";
		}
		$(".select_category").append(html);
		initialize();
	});
}

function initialize() {
	ajaxCall("home/loaddefaultmaps", {}, "GET", "json",function(data){
		plotMaps(data);	
	});      	
}

function plotMaps(data){

	var map, markers = [], info = [];
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
        mapTypeId: 'roadmap'
    }
    var latLngCenter = new google.maps.LatLng(myOrigin.lat, myOrigin.longi);
    var markerCenter = new google.maps.Marker({
            position: latLngCenter,
            title: 'Location',
            map: map,
            draggable: true
        });

    map = new google.maps.Map(document.getElementById("mycontent"), mapOptions);
    map.setTilt(45);
    var radius = getDistance(data);
   
    var circle = new google.maps.Circle({
            map: map,
            clickable: false,            
            radius: radius * 1050,
            fillColor: '#fff',
            fillOpacity: .6,
            strokeColor: '#313131',
            strokeOpacity: .4,
            strokeWeight: .8
        });
    // attach circle to marker
    circle.bindTo('center', markerCenter, 'position')

    for(var x = 0; x < data.length; x++){
    	markers.push(new Array(data[x].name, data[x].lat, data[x].longi));
    	info.push(new Array('<div class="info_content"><h3>' + data[x].name + '</h3><p>SPECIALTY: ' + data[x].specialty + '<br/>' + 'VISITS: ' + data[x].visits + '</p></div>'));        
    }

    var infoWindow = new google.maps.InfoWindow(), marker, i;
    
    for( i = 0; i < markers.length; i++ ) {
        var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
        bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: markers[i][0]
        });
         
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {	            	
                infoWindow.setContent(info[i][0]);
                infoWindow.setOptions({maxWidth: 400});
                infoWindow.open(map, marker);
            }
        })(marker, i));

        map.fitBounds(bounds);
    }
   
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        this.setZoom(14);
        google.maps.event.removeListener(boundsListener);
    });
}

function getDistance(data){
    var tmp = 0;
    var service = new google.maps.DistanceMatrixService();
    for(var i=0; i < data.length; i++){
        if(getHeightsRadius(myOrigin.lat, myOrigin.longi, data[i].lat, data[i].longi) > tmp){
            tmp = getHeightsRadius(myOrigin.lat, myOrigin.longi, data[i].lat, data[i].longi);
        }
    }

    return tmp;
}

function getHeightsRadius(lat1, lon1, lat2, lon2){
    var R = 6371; // km
    var dLat = toRadian(lat2-lat1);
    var dLon = toRadian(lon2-lon1);
    var lat1 = toRadian(lat1);
    var lat2 = toRadian(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;

    return d;
}

function toRadian(num){
    return num * Math.PI / 180;
}