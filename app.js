var start_modal = document.getElementById("start_modal");
var easy = document.getElementById('easy');
var medium = document.getElementById('medium');
var hard = document.getElementById('hard');
var extreeme = document.getElementById('extreeme');
var filterBtn = document.getElementById('filterBtn');

easy.addEventListener('click', function(e) {
	filterBtn.className = 'btn btn-success btn-block';
	filterBtn.innerHTML = 'Ці руки ніколи не грали';
})
medium.addEventListener('click', function(e) {
	filterBtn.className = 'btn btn-warning btn-block';
	filterBtn.innerHTML = 'Ведіть сюди ту скотиняку';
})
hard.addEventListener('click', function(e) {
	filterBtn.className = 'btn btn-danger btn-block';
	filterBtn.innerHTML = 'Астанавітесь';
})
extreeme.addEventListener('click', function(e) {
	filterBtn.className = 'btn btn-dark btn-block';
	filterBtn.innerHTML = 'Куля в лоб, так куля в лоб';
})

var startGame = function(){
	t = document.querySelector('input[name="hardness"]:checked').value;

	start_modal.style.display = 'none';
	setTimeout(function(){
		putin_attack(t);
	}, 1000);

}

var resetGame = function(){


	bunkers = [
		[57.17788175696055, 90.3232157602],
		[67.108168967632636, 90.3232157602],
		[67.108168967632636, 64.0755738530741],
		[57.17788175696055, 64.0755738530741],
		[57.17788175696055, 116.57085766742468],
		[67.108168967632636, 116.57085766742468]];
	bunker_points.clearLayers();
	bunker_destroyed.clearLayers();
	bunker_attack.clearLayers();
	city_destroyed.clearLayers();
	dead_putin.clearLayers();
	destroyed_sities = [];
	destroyed_bunkers = [];
	hits = 0;
	map.closePopup();
	addBunkers();
	start_modal.style.display = 'block';

}

var map = L.map('map').setView([58, 60], 4);

		map.dragging.disable();
		map.touchZoom.disable();
		map.doubleClickZoom.disable();
		map.scrollWheelZoom.disable();
		
var bounds = [
    [42.983217980469,  15.58367495674107],
    [73.09089383408825, 123.68914370674108]
    ];


map.fitBounds(bounds);
//Declarign variables
bunkers = [
[57.17788175696055, 90.3232157602],
[67.108168967632636, 90.3232157602],
[67.108168967632636, 64.0755738530741],
[57.17788175696055, 64.0755738530741],
[57.17788175696055, 116.57085766742468],
[67.108168967632636, 116.57085766742468]];




var Ukraine_cities = [[ 49.8446292072748, 24.03147697448731], [49.99162134064152, 36.23120907540986],[46.4741921028687,  30.725519657135013], [50.46683017224245, 30.510932207107547]];
var popup = L.popup({closeButton: false, closeOnClick: false})
					.setContent("Ви маєте змогу грати в цю гру завдяки Збройним силам України, які боронять нашу неньку від орди. Їм дуже потрібна Ваша допомога. Задонатьте збройним силам України. Пам'ятайте - немає маленьких донатів. Це можна зробити через <a href = 'https://bank.gov.ua/ua/news/all/natsionalniy-bank-vidkriv-spetsrahunok-dlya-zboru-koshtiv-na-potrebi-armiyi'>Національний банк України</a>, або через будь-яку волонтерську організацію на Ваш вибір. Будьте свідомими Українцями.<br><button id='filterBtn' class='btn btn-warning btn-block' type='submit' onClick = 'resetGame()'>Зіграти ще раз</button>");
var destroyed_bunkers = [];
var cities = [];
var destroyed_sities = [];
var attacking_bunker_latlng = '';
var last_bunker_latlng;
var attack = false;
var is_clicked = false;
var last_bunker = false;
var click = false;
var hits = 0;
var t = 2000;

var bunker_points = L.layerGroup().addTo(map);
var bunker_attack = L.layerGroup().addTo(map);
var bunker_destroyed = L.layerGroup().addTo(map);
var city_destroyed = L.layerGroup().addTo(map);
var dead_putin = L.layerGroup().addTo(map);
var bunker_icon = L.icon({
    iconUrl: 'img/bunker.png',
    iconSize:     [105, 105], // size of the icon
    iconAnchor:   [52, 52]
});
var bunker_attack_icon = L.icon({
    iconUrl: 'img/bunker_attack.png',
    iconSize:     [176, 105], // size of the icon
    iconAnchor:   [88, 52]
});
var bunker_destroyed_icon = L.icon({
    iconUrl: 'img/bunker_damaged.png',
    iconSize:     [105, 105], // size of the icon
    iconAnchor:   [52, 52]
});
var missle_icon = L.icon({
    iconUrl: 'img/missle.png',
    iconSize:     [123, 17], // size of the icon
    iconAnchor:   [61, 8]
});
var putin_icon = L.icon({
    iconUrl: 'img/huilo.png',
    iconSize:     [60, 57], // size of the icon
    iconAnchor:   [30, 29]
});
var rip_icon = L.icon({
    iconUrl: 'img/rip.png',
    iconSize:     [70, 88], // size of the icon
    iconAnchor:   [35, 44]
});
var crack_icon = L.icon({
    iconUrl: 'img/crack.png',
    iconSize:     [30, 30], // size of the icon
    iconAnchor:   [15, 15]
});
//loading icons

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 22,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
var addBunkers = function(){
bunkers.forEach((bunker) => {
	L.marker(bunker, {icon: bunker_icon}).addTo(bunker_points).on('click', function(e){miss(e);});;
})
destroyed_bunkers.forEach((bunker) => {
	L.marker(bunker, {icon: bunker_destroyed_icon}).addTo(bunker_destroyed);
})
}
addBunkers();
var putin_attack = function(t){
	if (bunkers.length > 0 && hits < 4){
		attack = true;
		var bunker = Math.floor(Math.random()*bunkers.length);
		var attacking = L.marker(bunkers[bunker], {icon: bunker_attack_icon}).addTo(bunker_attack).on('click', function(e){hit(e);});
		attacking_bunker_latlng = attacking.getLatLng();
		setTimeout(function(){
			if (attack == true){
			attack = false;
			console.log("miss");
			hits++;
			
			var missle = L.Marker.movingMarker([[attacking_bunker_latlng.lat, attacking_bunker_latlng.lng],[50.44572674279861, 30.52847385406494]],
						[2000], {icon: missle_icon}).addTo(map);

			missle.start();
			missle.on('end', function() {
				missle.remove();
				L.marker(Ukraine_cities[hits-1], {icon: crack_icon}).addTo(city_destroyed);
				
			});
				  bunker_points.clearLayers();
				  bunker_destroyed.clearLayers();
				  bunker_attack.clearLayers();
				  addBunkers(); 
			}
		
		}, t);
		setTimeout(function(){
			putin_attack(t);
		}, (Math.floor(Math.random() * (5000 - 2000 + 1) + 2000)));
	} else if (hits < 4){
		var huilo = L.Marker.movingMarker([[last_bunker_latlng.lat, last_bunker_latlng.lng],[43.72722404829262, 36.36619674810896]],
						[3000], {icon: putin_icon}).addTo(map);

			huilo.start();
			huilo.on('end', function() {
				huilo.remove();
				var marker = L.marker([43.72722404829262, 36.36619674810896], {icon: rip_icon}).addTo(dead_putin);
				

			popup.setLatLng([50.46683017224245, 30.510932207107547]).openOn(map);
			});
		
	} else {
		popup.setLatLng([50.46683017224245, 30.510932207107547]).openOn(map);
	}
}

var miss = function(e){
	if (attack){
			attack = false;
			console.log("miss");
			hits++;
			
			var missle = L.Marker.movingMarker([[attacking_bunker_latlng.lat, attacking_bunker_latlng.lng],[50.44572674279861, 30.52847385406494]],
						[2000], {icon: missle_icon}).addTo(map);

			missle.start();
			missle.on('end', function() {
				missle.remove();
				L.marker(Ukraine_cities[hits-1], {icon: crack_icon}).addTo(map);
				
			});
				  bunker_points.clearLayers();
				  bunker_destroyed.clearLayers();
				  bunker_attack.clearLayers();
				  addBunkers(); 
			
		}
	}


var hit = function(e){
	var found;
	var index = -1;
	for(var k = 0; k < bunkers.length; k++){
		if(bunkers[k][0] == e.latlng.lat && bunkers[k][1] == e.latlng.lng){
			found = true;
			index = k;
		}
	}
	if (index !== -1) {
	  //array.splice(index, 1);
	  last_bunker_latlng = attacking_bunker_latlng;
	  destroyed_bunkers.push(bunkers[index]);
	  bunkers.splice(index, 1);
	  bunker_attack.clearLayers();
	  bunker_points.clearLayers();
	  bunker_destroyed.clearLayers();
	  attack = false;
	  addBunkers();
		
	} else {
		
	}
	
}

