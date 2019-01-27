var hitterEconomy;
var pitcherEconomy;

var hitterRVals = [0,0,0,0,0];
var pitcherRVals = [0,0,0,0,0];

var hitterPitcherSplit = .65;

var hitters = new Array(0);
var pitchers = new Array(0);

function initializeVars (data) {

	hitterEconomy = teams.length*260*(hitterPitcherSplit);
	pitcherEconomy = teams.length*260*(1-hitterPitcherSplit);

	for (var i = 0; i < data.length; i++) {
		if (data[i].type == 'Hitter') {
			addEWH(data[i]);
			hitters.push(data[i]);
		} else {
			pitchers.push(data[i]);
		}
	}
}

function calculateHitterValues () {
	for (var i = 0; i < 500; i++) {
		setHitterRVals();
		setHitterCatVals();
		hitters.sort(function (a,b) {
			return b.value - a.value;
		});
	}
	for (var i = 0; i < 10; i++) {
		console.log(hitters[i].name + ': $' + hitters[i].value);
	}
}

function calculatePitcherValues () {
}

function setHitterCatVals () {
	var poolVals = [0,0,0,0,0];
	for (var i = 0; i < (14 * teams.length); i++) {
		poolVals[0] += hitters[i].stat1;
		poolVals[1] += hitters[i].ewh;
		poolVals[2] += hitters[i].stat3;
		poolVals[3] += hitters[i].stat4;
		poolVals[4] += hitters[i].stat5;
	}
	for (var i = 0; i < hitters.length; i++) {
		hitters[i].value1 = (hitterEconomy * .2) * (hitters[i].stat1 - hitterRVals[0]) / (poolVals[0] - (14*teams.length*hitterRVals[0]));
		hitters[i].value2 = (hitterEconomy * .2) * (hitters[i].ewh - hitterRVals[1]) / (poolVals[1] - (14*teams.length*hitterRVals[1]));
		hitters[i].value3 = (hitterEconomy * .2) * (hitters[i].stat3 - hitterRVals[2]) / (poolVals[2] - (14*teams.length*hitterRVals[2]));
		hitters[i].value4 = (hitterEconomy * .2) * (hitters[i].stat4 - hitterRVals[3]) / (poolVals[3] - (14*teams.length*hitterRVals[3]));
		hitters[i].value5 = (hitterEconomy * .2) * (hitters[i].stat5 - hitterRVals[4]) / (poolVals[4] - (14*teams.length*hitterRVals[4]));
		hitters[i].value = Math.round(hitters[i].value1 + hitters[i].value2 + hitters[i].value3 + hitters[i].value4 + hitters[i].value5);
	}
}

function setHitterRVals () {
	var tempRVals = [0,0,0,0,0];
	for (var i = (14 * teams.length); i < (14 * teams.length) + 14; i++) {
		tempRVals[0] += hitters[i].stat1;
		tempRVals[1] += hitters[i].ewh;
		tempRVals[2] += hitters[i].stat3;
		tempRVals[3] += hitters[i].stat4;
		tempRVals[4] += hitters[i].stat5;
	}
	hitterRVals[0] = tempRVals[0] / 14;
	hitterRVals[1] = tempRVals[1] / 14;
	hitterRVals[2] = tempRVals[2] / 14;
	hitterRVals[3] = tempRVals[3] / 14;
	hitterRVals[4] = tempRVals[4] / 14;
}

function addEWH (player) {
	player.ewh = (player.countstat*player.stat2) - (player.countstat*.325)
}