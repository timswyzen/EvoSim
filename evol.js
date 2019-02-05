//Moddable constants
const MUTATION_RATE = 0.25; //How much a new child can be mutated
var AVE_DEATH = 90; //Average death age of a creature
const BASE_REPRODUCTION = 0.6; //Raise to increase reproduction chances overall
const OVERPOPULATION_AMOUNT = 1000 //Amount before creatures start dying from overpopulation

//Set up canvas
var canvas = document.getElementById( "evoCanvas" );
var ctx = canvas.getContext( "2d" );

//Set up game vars
var gameSpeed = 10;
var allCreatures = [];
var gamePaused = false;
var pausedText = "Pause Game";
var mousePos = [ 0, 0 ];
var circleSize = 6;
var sliderAVal = 0;
var sliderBVal = 0;
var sliderCVal = 0;
var selectAVal = 0.5;
var selectBVal = 0.5;
var selectCVal = 0.5;
var latestDeath = 0;

//Set up sliders
var sliderA = document.getElementById( "sliderA" );
var sliderB = document.getElementById( "sliderB" );
var sliderC = document.getElementById( "sliderC" );
var selectA = document.getElementById( "selectA" );
var selectB = document.getElementById( "selectB" );
var selectC = document.getElementById( "selectC" );

//Set up slider input
sliderA.oninput = function() { sliderAVal = this.value/100; }
sliderB.oninput = function() { sliderBVal = this.value/100; }
sliderC.oninput = function() { sliderCVal = this.value/100; }
selectA.oninput = function() { selectAVal = this.value/100; }
selectB.oninput = function() { selectBVal = this.value/100; }
selectC.oninput = function() { selectCVal = this.value/100; }

document.getElementById( "pauseB" ).innerHTML = pausedText;
document.getElementById( "formValueId" ).defaultValue = String( AVE_DEATH );

//Getting mouse position (why isnt this built in omg)
function getMousePos( canvas, event ) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top
	};
}

canvas.addEventListener( 'mousemove', function(evt) {
	mousePos = getMousePos( canvas, evt );
}, false );

//User changed death rate
function changeDeathRate( val ) {
	if ( event.key === 'Enter' ) {
		AVE_DEATH = val.value;
		console.log( "Ave death changed to " + AVE_DEATH );
	}
}

//Pause functionality
function pauseToggle() {
	gamePaused = !gamePaused;
	if( gamePaused )
		pausedText = "Unpause Game";
	else
		pausedText = "Pause Game";
	document.getElementById( "pauseB" ).innerHTML = pausedText;
}

//Ball object definition
function Ball( traitA, traitB, traitC, id, parents, xPos, yPos, age, sex, generation ) {
	this.traitA = traitA;
	this.traitB = traitB;
	this.traitC = traitC;
	this.id = id;
	this.parents = parents;
	this.xPos = xPos;
	this.yPos = yPos;
	this.age = age;
	this.sex = sex;
	this.generation = generation;
	this.deathAge = parseInt(AVE_DEATH) + Math.random()*(AVE_DEATH/10);
	console.log( "this death age: " + this.deathAge + ". normald eath age: " + AVE_DEATH );
	this.draw = function() {
		ctx.beginPath();
		ctx.arc( this.xPos, this.yPos, circleSize, 0, Math.PI*2, false );
		ctx.fillStyle = "rgb( " + String(this.traitA*255) + ", " + String(this.traitB*255) + ", " + String(this.traitC*255) + "0 )";
		ctx.fill();
		ctx.closePath();
	}
}

//Aging loop
function aging() {
	//So death happens semi randomly
	var rand = Math.floor( 1200 - Math.random() * 400 )/gameSpeed;
	setTimeout( function() {
		aging();
	}, rand );

	if( gamePaused ) return false;
	for( var i = 0; i < allCreatures.length; i++ ) {
		allCreatures[i].age += 1;
		
		//Die of natural causes
		if( allCreatures[i].age > allCreatures[i].deathAge ) {
			if( i > latestDeath )
				latestDeath = i;
			allCreatures[i] = false;
		}
		
		//Die of bad conditions
		if( ((allCreatures[i].traitA - selectAVal)>0.7) || ((allCreatures[i].traitB - selectBVal)>0.7) || ((allCreatures[i].traitC - selectCVal)>0.7) ) {
			if( Math.random() > 0.95 )
			{
				allCreatures[i] = false;
				console.log( "A creature died" );
			}
		}
	}
}
aging();


//Speed changer using UI
function changeSpeed( input ) {
	gameSpeed = input * 5;
	console.log( "speed changed to " + String( gameSpeed ) );
}

//To inject the first few specimen
function injectSpecimen() {
	newId = allCreatures.length;
	newSex = ( Math.floor( Math.random() * 2 ) == 0 ) ? "m" : "f";
	console.log( String( sliderAVal ) + String( sliderBVal ) + String( sliderCVal ) );
	var tempA = sliderAVal;
	var tempB = sliderBVal;
	var tempC = sliderCVal;
	allCreatures[newId] = new Ball( tempA, tempB, tempC, newId, [ "YOU" ], 
		Math.random()*canvas.width, Math.random()*canvas.height, 0, newSex, 0 )
}

/*Reproduction loop
- Attempts to find a different sex, adult partner
- If fails after 20 attempts, it's over for the beta
*/
function reproduce() {
	//So reprdouction happens semi randomly
	var rand = Math.floor( 5000 - Math.random() * 5000 )/gameSpeed;
	setTimeout( function() {
		reproduce();
	}, rand );

	if( gamePaused ) return false;
	for( var i = latestDeath; i < allCreatures.length; i++ ) {
		if( allCreatures[i].age > 5 && allCreatures[i].sex == "m" ) {
			//Chance of reproduction given current environment
			var reproRate = (BASE_REPRODUCTION + ( 1.2*(selectAVal-0.5)*allCreatures[i].traitA + (selectBVal-0.5)*allCreatures[i].traitB
				+ (selectCVal-0.5)*allCreatures[i].traitC ) )/(1+(selectAVal+selectBVal+selectCVal)/6).toPrecision(4); //Possibly divide by total traits for a ratio?
			console.log( String( allCreatures[i].traitA )+"|"+String(allCreatures[i].traitB)+"|"
				+String(allCreatures[i].traitC)+"  Rate: " + String( reproRate ) );
				
			var chance = Math.random();
			if( chance > reproRate ) {
				console.log( String( allCreatures[i].id ) + " did not live on: " + String( allCreatures[i].traitA )+"|"+String(allCreatures[i].traitB)+"|"
				+String(allCreatures[i].traitC)+". Generated #: "+String(chance) );
				return false;
			}
		
			//Find a partner that isn't himself, the same gender, or an infant
			var attempts = 0;
			do {
				if( attempts >= 20 ) { console.log( "virgin" ); return false; }
				partner = allCreatures[ Math.floor( latestDeath + Math.random() * (allCreatures.length - latestDeath) ) ]; 
				attempts++;
			}
			while( !partner || partner.id == i || partner.sex == allCreatures[i].sex || partner.age <= 5 );
			
			//Inefficient but... population control
			var curAlive = 0;
			for( var j = 0; j < allCreatures.length; j++ ){
				if( allCreatures[j] ) { curAlive++; }
			}
			if( curAlive >= OVERPOPULATION_AMOUNT ) {
				console.log( "Overpopulation: " + String( curAlive ) );
				if( Math.random() > 0.6 )
					return false;
			}
				
			
			//Make babby
			newId = allCreatures.length;
			partnerWeightA = Math.random();
			partnerWeightB = Math.random();
			partnerWeightC = Math.random();
			newA = ( ( partnerWeightA*partner.traitA + (1-partnerWeightA)*allCreatures[i].traitA ) 
				+ (Math.random()-0.5) * MUTATION_RATE ).toPrecision(4); //Weights of parents plus possible mutation
			newB = ( ( partnerWeightB*partner.traitB + (1-partnerWeightB)*allCreatures[i].traitB )
				+ (Math.random()-0.5) * MUTATION_RATE ).toPrecision(4);
			newC = ( ( partnerWeightC*partner.traitC + (1-partnerWeightC)*allCreatures[i].traitC )
				+ (Math.random()-0.5) * MUTATION_RATE ).toPrecision(4);
			newA = ( newA < 0 ) ? 0 : newA;
			newB = ( newB < 0 ) ? 0 : newB;
			newC = ( newC < 0 ) ? 0 : newC;
			newA = ( newA > 1 ) ? 1 : newA;
			newB = ( newB > 1 ) ? 1 : newB;
			newC = ( newC > 1 ) ? 1 : newC;
			newSex = ( Math.floor( Math.random() * 2 ) == 0 ) ? "m" : "f";
			allCreatures[newId] = new Ball( newA, newB, newC, newId, [ allCreatures[i].id, partner.id ], 
				Math.random()*canvas.width, Math.random()*canvas.height, 0, newSex, allCreatures[i].generation + 1 )
			
			console.log( String(allCreatures[i].id) + " reproduced with " + String(partner.id) + "." );
			console.log( "Traits: " + String( newA ) + ", " + String( newB ) + ", " + String( newC ) + "." + newSex );
		}
	}
}
reproduce();

//Send information to UI
function sendInfo( creature ) {
	document.getElementById( "creatID" ).innerHTML = String( creature.id );
	document.getElementById( "traA" ).innerHTML = String( creature.traitA );
	document.getElementById( "traB" ).innerHTML = String( creature.traitB );
	document.getElementById( "traC" ).innerHTML = String( creature.traitC );
	document.getElementById( "traSex" ).innerHTML = String( creature.sex );
	document.getElementById( "traParents" ).innerHTML = String( creature.parents );
	document.getElementById( "traAge" ).innerHTML = String( creature.age );
	document.getElementById( "traGen" ).innerHTML = String( creature.generation );
}

//Draw loop
function draw( event ) {
	ctx.clearRect( 0, 0, canvas.width, canvas.height );
	
	//Draw all living creatures
	for( var i = 0; i < allCreatures.length; i++ ) {
		if( allCreatures[i] ) {
			allCreatures[i].draw();
			
			//Check if hovering over a guy
			var diffX = mousePos.x - allCreatures[i].xPos;
			var diffY = mousePos.y - allCreatures[i].yPos;
			var distance = Math.sqrt( diffX*diffX + diffY*diffY );
			if( distance < 5 ) {
				sendInfo( allCreatures[i] );
			}
		}
	}
	
}
setInterval( draw, 10 );
