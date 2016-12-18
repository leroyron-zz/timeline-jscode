////Rendering - PassChecking
//ObjectPolyRes Field - evaluate all object distances from camera Low/Mid (every object)
//
//TextureRes Field - evaluate all object distances from camera None/Low/Mid/High (every object)
//
//ShadowRes Field - evaluate all object distances from camera and pass None/Low/Mid (shadows only on Loom)

////Bounds/collisions - PassChecking
//boundary Field - evaluate at Loom/Crux/SpaceSafeRadius
//missile collisions - evaluate at Loom/Crux/SpaceSafeRadius
//expolsion radius expansion - evaluate at Loom/Crux/SpaceSafeRadius
//craft to craft collisions - evaluate at Loom/Crux/SpaceSafeRadius

////Craft Flight

//Speeds:
//Orbit flight speed Mach 1.75 / 1500KMH
//Space flight speed Mach 3.5 / 3000KMH
//
//Hyperdrive:
//Orbit flight speed Mach 3.5 / 3000KMH
//Space flight speed Mach 14 / 12000KMH

//Turning (drive)
//MouseMove/RightSide-TouchMove
//
//Shifting (propulsion)
//WSAD-UpDnLtRt/LeftSide-TouchMove

//RollTurn -
//DoublePressAD-LtRt/DoubleSwipe-Outward/Inward-LeftSide
//
//LoopTurn -
//DoublePressWS-UpDn/DoubleSwipe-Upward/Downward-LeftSide
//
//Combine^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//Diagonal LoopTurn-RollTurn -

//Hyperdrive
//SpaceBar/DoubleTapHOLD-RightSide&LeftSide-TouchMove *withTurning
//Stop immediate on release SpaceBar/RightSide&LeftSide-TouchUp
//Stop after 2sec on release LeftSide-TouchUp *this allows for LoopTurn-RollTurn For Touch
//
//Shooting - Guns/Missiles(beam/vortex) - Toggle - (non-Hyperdrive)
//Guns - LeftClick/DoubleTapHOLD - withTurning
//Missiles - Multi/Selections


    heroCraft.ctrl = {
        thrusts:
        {
            forwardthrust: {vector: {x: 1, y: 1, z: 0}, thurst: function () { thrust(this.vector) }},
            backwardsthrust: {vector: {x: 1, y: 1, z: 0}, thurst: function () { thrust(this.vector) }}
        },
        drive:
        {
            thunder: {stokes: {max: 4, at: 1}, diaphragm: {size: 1, move: 1}},
            // Internal thunder engine
            hyper: {limit: 14, on: false},
            auto: {limit: 3.5, on: true},
            propulsion: {lb: false, rb: false, bb: false, tb: false, tt: false, bt: false, fn: false, bn: false}
            // DriveCode:LeftBody, RightBody, BottomBody, TopBody, TopTail, BottomTail, FrontNose, BottomNose
        },
        instruments:
        {
            turn: false,
            shift: false
        },
        sensors:
        {
            sun: function () { detect([sun]) },
            gravity: function () { detect([loom.crux, loom.formations]) },
            discovery: function () { detect([space.photons]) }
        },
        balancers:
        {
            energy: function () { energy(this.drive, this.sensors.sun) },
            propulsion: function () { gradualate(this.drive, this.sensors.gravity) },
            shutdown: function () { shutdown(this.drive, this.sensors.discovery) },
            trouble: function () { troubleshoot(this) }
        },
        position: {x: 246.4, y: 687.2, z: 0},
        rotation: {x: 135, y: 0, z: 0},
        trajectory: function () { endpoints(craft.velocity, craft.speed, craft.acceleration) },
        dim: {takeover: function () { takeover(craft) }}
    }

        function thrust (velocity) {
        // Three.js var lat = 90 - (Math.acos(y / sphereRadius)) * 180 / Math.PI;
        // var lon = ((270 + (Math.atan2(x , y)) * 180 / Math.PI) % 360) -180;
        // Three.js var lon = ((270 + (Math.atan2(x , z)) * 180 / Math.PI) % 360) -180;
        return false
    }
    function latlon (percision, position, sphereRadius) {
        // Three.js var lat = 90 - (Math.acos(y / sphereRadius)) * 180 / Math.PI;
        // var lon = ((270 + (Math.atan2(x , y)) * 180 / Math.PI) % 360) -180;
        // Three.js var lon = ((270 + (Math.atan2(x , z)) * 180 / Math.PI) % 360) -180;
        return {lat: lat, lon: lon}
    }
    function latlon_data (percision, position, sphereRadius) {
        // Three.js var lat = 90 - (Math.acos(y / sphereRadius)) * 180 / Math.PI;
        // var lon = ((270 + (Math.atan2(x , y)) * 180 / Math.PI) % 360) -180;
        // Three.js var lon = ((270 + (Math.atan2(x , z)) * 180 / Math.PI) % 360) -180;
        return false
    };
    function detect_data (percision, position, sphereRadius) {
        // Three.js var lat = 90 - (Math.acos(y / sphereRadius)) * 180 / Math.PI;
        // var lon = ((270 + (Math.atan2(x , y)) * 180 / Math.PI) % 360) -180;
        // Three.js var lon = ((270 + (Math.atan2(x , z)) * 180 / Math.PI) % 360) -180;
        return false
    };
    function detect (phase) {
        // Three.js var lat = 90 - (Math.acos(y / sphereRadius)) * 180 / Math.PI;
        // var lon = ((270 + (Math.atan2(x , y)) * 180 / Math.PI) % 360) -180;
        // Three.js var lon = ((270 + (Math.atan2(x , z)) * 180 / Math.PI) % 360) -180;
        return false
    };
    function gradualate (drive, gravity) {
        // Three.js var lat = 90 - (Math.acos(y / sphereRadius)) * 180 / Math.PI;
        // var lon = ((270 + (Math.atan2(x , y)) * 180 / Math.PI) % 360) -180;
        // Three.js var lon = ((270 + (Math.atan2(x , z)) * 180 / Math.PI) % 360) -180;
        return false
    };
    function shutdown (drive, gravity) {
        // Three.js var lat = 90 - (Math.acos(y / sphereRadius)) * 180 / Math.PI;
        // var lon = ((270 + (Math.atan2(x , y)) * 180 / Math.PI) % 360) -180;
        // Three.js var lon = ((270 + (Math.atan2(x , z)) * 180 / Math.PI) % 360) -180;
        return false
    };
    function energy (drive, sun) {
        // Three.js var lat = 90 - (Math.acos(y / sphereRadius)) * 180 / Math.PI;
        // var lon = ((270 + (Math.atan2(x , y)) * 180 / Math.PI) % 360) -180;
        // Three.js var lon = ((270 + (Math.atan2(x , z)) * 180 / Math.PI) % 360) -180;
        return false
    };
    function endpoints (velocity, speed, acceleration) {
        // Three.js var lat = 90 - (Math.acos(y / sphereRadius)) * 180 / Math.PI;
        // var lon = ((270 + (Math.atan2(x , y)) * 180 / Math.PI) % 360) -180;
        // Three.js var lon = ((270 + (Math.atan2(x , z)) * 180 / Math.PI) % 360) -180;
        return false
    };
    function troubleshoot (velocity) {
        // Three.js var lat = 90 - (Math.acos(y / sphereRadius)) * 180 / Math.PI;
        // var lon = ((270 + (Math.atan2(x , y)) * 180 / Math.PI) % 360) -180;
        // Three.js var lon = ((270 + (Math.atan2(x , z)) * 180 / Math.PI) % 360) -180;
        return false
    };
    function takeover (velocity) {
        // Three.js var lat = 90 - (Math.acos(y / sphereRadius)) * 180 / Math.PI;
        // var lon = ((270 + (Math.atan2(x , y)) * 180 / Math.PI) % 360) -180;
        // Three.js var lon = ((270 + (Math.atan2(x , z)) * 180 / Math.PI) % 360) -180;
        return false
    };

    function keyDown () {
        // craft.drive.thunder.diaphragm.move += 0.05;
        accumilate_acceleration([craft.drive.thunder.stokes, craft.drive.thunder.diaphragm.move])
    }
    function keyUp () {
        // craft.drive.thunder.diaphragm.move = 0;
        deaccumulation_acceleration([craft.drive.thunder.stokes, craft.drive.thunder.diaphragm.move])
    }
    function accumilate_acceleration (aquire) {
        for (var a = 1, alen = aquire.length; a < alen; a++) {
            craft.acceleration.vector.x *= craft.drive.thunder.stokes * aquire[a]++
        }
    }
    function deaccumulation_acceleration (aquire) {
        for (var a = 1, alen = aquire.length; a < alen; a++) {
            craft.acceleration.vector.x *= craft.drive.thunder.stokes * aquire[a]--
        }
    }
    return this
/* var sun =
{
	radius: 2555,
	position: {x:0, y:0, z:0}
};
var loom =
{
	crux:
	{
		position: {x:0, y:0, z:0},
		radius: 220.7,
		gravity: 0.33
	},
	formations:
	{
		contours:
		[
			[
			true,
			//if contour, elevation is prioritized//match highest peek
			//else levitation is prioritized//match highest peek//evaluate low peeks
			{
				peeks:
				{
					points: function() {latlon_data(1)},//percision 1m
					erecting: function() {detect_data(1)}
				},
				mobilizing: function() {detect_data(1)}
			}
			]
		],
		coves:
		[
			[
			true,
			//if cove has opening manuver through hull center//Detect center
			//else manuver to hull sides//Detect widest
			{
				openings:
				{
					points: function() {latlon_data(1)},//percision 1m
					erecting: function() {detect_data(1)}
				},
				mobilizing: function() {detect_data(1)}

			}
			]
		],
		radius: 308.7,
		gravity: 0.66
	},
	photon:
	{
		name: "Photon:",
		type: "Analisis Weapon",
		greet: "Greetings from ",
		confirm: "Where am I, Human? EAST or WEST?, or be destroyed.",
		west:
		{
			message: function() {uiux.tophud.messageSoundInput(this.greet+(this.pass = "WEST")+", "+this.name, 0)},
			constuct: "My configuration hasen't been updated for 480 days, im in need of termosupply and PenteNetabyte storage."
		},
		east:
		{
			message: function() {uiux.tophud.messageSoundInput(this.greet+(this.pass = "EAST")+", "+this.name, 1)},
			constuct: "My configuration hasen't been updated for 422 days and in need of termosupply."
		}
	}
}

var space =
{
	//size: {width: infinite, height:infinite, depth:infinite},
	//there's no right side up in outterspace properties are unlimited

	photons: [loom.photon],
	//photons are used to make sense of outterspace.
	//they are extreamly bright to find in space and easy to detect in deepspace by its glimmering PhotonBeams
	//photons obsorb light and radiation
	//within its maps and constucts light data and has a wide array of systems is used for analisis, mapping,
	//creating guiding systems for craft key holders and its subsystems
	//checking contant velocities of anything in its fusion range
	//and destroys anything in its defence range giving wrong communication or validation
	//its system priorities are:
	//
	//todo star referencing to check boundries (basied on human data)
	//
	//check irregular velocities (hostiles)
	//perfect velocities (projectiles)
	//
	//keeping record
	//
	//alerting collision paths
	//
	//dim and node storage

	//dims are light carriers
	//dims are tagged to crafts, its function is to leach analisis systems and data from photons
	//to render coordinate systems on the planet
	//
	//nodes are its orbit guide/binding system

	universe: [sun,loom]
};
var craft =
{
	clip: craft_mc,
	velocity:
	{
		vector: {x:-1, y:1, z:0},
		rotation: {x:1, y:-1, z:1}
	},
	speed:
	{
		vector: {x:1, y:1, z:0},
		rotation: {x:10, y:5, z:22}
	},
	thrusts:
	{
		forwardthrust: {vector: {x:1, y:1, z:0}, thurst: function() {thrust(this.vector)}},
		backwardsthrust: {vector: {x:1, y:1, z:0}, thurst: function() {thrust(this.vector)}}
	},
	drive:
	{
		thunder: {stokes:{max:4, at:1}, diaphragm:{size:1, move:1}},
		//Internal thunder engine
		hyper: {limit:14, on:false},
		auto: {limit:3.5, on:true},
		propulsion: {lb:false, rb:false, bb:false, tb:false, tt:false, bt:false, fn:false, bn:false}
		//DriveCode:LeftBody, RightBody, BottomBody, TopBody, TopTail, BottomTail, FrontNose, BottomNose
	},
	instruments:
	{
		turn: false,
		shift: false
	},
	sensors:
	{
		sun: function() {detect([sun])},
		gravity: function() {detect([loom.crux, loom.formations])},
		discovery: function() {detect([space.photons])}
	},
	balancers:
	{
		energy: function() {energy(this.drive, this.sensors.sun)},
		propulsion: function() {gradualate(this.drive, this.sensors.gravity)},
		shutdown: function() {shutdown(this.drive, this.sensors.discovery)},
		trouble: function() {troubleshoot(this)}
	},
	position: {x:246.4, y:687.2, z:0},
	rotation: {x:135, y:0, z:0},
	trajectory: function() {endpoints(craft.velocity, craft.speed, craft.acceleration)},
	dim: {takeover:function() {takeover(craft)}}
};

var app =
{
	core:
	{
		update: function()
		{
			/*app.loiterckecking.bounds([screen], 100)//loiter checking boundies that have {x, y, z, width, height, depth}
			.exploit(
			{
				app.checkpassing.bounds(arguments);
			});

			app.loiterckecking.zones([photons, orbit, autopropulsion, autoflight], 100)//loiter checking zones {x, y, z, radius}
			.exploit(
			{
				app.checkpassing.zones(arguments),
				app.loiterckecking.collisions([crux, formation], 100)//loiter checking collisions {x, y, z, radius} or {velocity{}, speed{}}
				.exploit(
				{
					app.checkpassing.collisions(arguments);
				});
			});
			};

			// Update css position
			craft.position.x += (craft.velocity.vector.x * craft.speed.vector.x) | 0;  // Fast round to whole pixel
			craft.clip.x = craft.position.x;
			craft.position.y += (craft.velocity.vector.y * craft.speed.vector.y) | 0;  // Fast round to whole pixel
			craft.clip.y = craft.position.y;
			craft.rotation.x += (craft.velocity.rotation.x * craft.speed.rotation.x) | 0;  // Fast round to whole pixel
			craft.clip.rotationX = craft.rotation.x;
			craft.rotation.y += (craft.velocity.rotation.y * craft.speed.rotation.y) | 0;  // Fast round to whole pixel
			craft.clip.rotationY = craft.rotation.y;
			craft.rotation.z += (craft.velocity.rotation.z * craft.speed.rotation.z) | 0;  // Fast round to whole pixel
			craft.clip.rotationZ = craft.rotation.z;
			//app.bullet.element.style.left = wholePixelBulletX + 'px';

			// Render Framerate every 1/4 second
			/*if(app.framerateDisplay.timer > 0.25) {
				app.framerateDisplay.innerHTML = (1/app._delta) | 0; // fast round to whole number
				app.framerateDisplay.timer = 0;
			} else {
				app.framerateDisplay.timer += app._delta;
			}
		}
	}
} */
/* Info:
Moon 1,737 km
Flight:
At Mach 3.5 / 3000KMH
REALTIME--------------
1.125 hours to circle the moon/crux altitude.
1.375 hours to circle the formation altitude.

##Orbital Auto Propultion Zone##
Flight:
At Mach 3.5 / 3000KMH
GAMETIME--------------
Game Flight Speed x10
6.75 minutes to circle the moon/crux altitude.
8.25 minutes to circle the formation altitude.
####

##Space Orbital##
Flight:
At Mack 14 / 12000KMH
GAMETIME--------------
Game Flight Speed x10
1.6875 minutes to circle the moon/crux altitude.
2.0625 minutes to circle the formation altitude.
#### */