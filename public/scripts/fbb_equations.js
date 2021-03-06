var hitterEconomy;
var pitcherEconomy;

var hitterRVals;
var pitcherRVals;

var hitterPitcherSplit = .65;

var hitters;
var pitchers;

function getHitterRVals() {
	return hitterRVals;
}

function getPitcherRVals() {
	return pitcherRVals;
}

function initializeVars (data) {

	hitterEconomy = teams.length*260*(hitterPitcherSplit);
	pitcherEconomy = teams.length*260*(1-hitterPitcherSplit);

	hitterRVals = [0,0,0,0,0];
	pitcherRVals = [0,0,0,0];

	hitters = new Array(0);
	pitchers = new Array(0);

	for (var i = 0; i < data.length; i++) {
		if (data[i].type == 'Hitter') {
			addEWH(data[i]);
			hitters.push(data[i]);
		} else {
			addWH(data[i]);
			addEER(data[i]);
			pitchers.push(data[i]);
		}
	}

	// Initial order for hitters is descending At Bats
	hitters.sort(function (a,b) {
		return b.countstat - a.countstat;
	});

	// Initial order for pitchers is descending 2*W + S 
	pitchers.sort(function (a,b) {
		return (2*b.stat4 + b.stat3) - (2*a.stat4 + a.stat3);
	});
}

function calculateHitterValues () {
	for (var i = 0; i < 1000; i++) {
		setHitterRVals();
		setHitterCatVals();
		hitters.sort(function (a,b) {
			return b.value - a.value;
		});
	}
	var checkSum = 0;
	for (var i = 0; i < 140; i++) {
		checkSum += hitters[i].value;
	}
	console.log('Hitters - Expected sum: $' + hitterEconomy.toFixed(0));
	console.log('Hitters - Actual sum: $' + checkSum.toFixed(0));
	totalValue += checkSum;
}

function calculatePitcherValues () {
	for (var i = 0; i < 1000; i++) {
		setPitcherRVals();
		setPitcherCatVals();
		pitchers.sort(function (a,b) {
			return b.value - a.value;
		});
	}
	var checkSum = 0;
	for (var i = 0; i < 90; i++) {
		checkSum += pitchers[i].value;
	}
	console.log('Pitchers - Expected sum: $' + pitcherEconomy.toFixed(0));
	console.log('Pitchers - Actual sum: $' + checkSum.toFixed(0));
	totalValue += checkSum;
}

function setPitcherCatVals () {
	var poolVals = [0,0,0,0];
	for (var i = 0; i < (9 * teams.length); i++) {
		poolVals[0] += pitchers[i].eer;
		poolVals[1] += pitchers[i].stat2;
		poolVals[2] += 2*pitchers[i].stat4 + pitchers[i].stat3;
		poolVals[3] += pitchers[i].wh;
	}
	for (var i = 0; i < pitchers.length; i++) {
		pitchers[i].value1 = (pitcherEconomy * .2) * (pitchers[i].eer - pitcherRVals[0]) / (poolVals[0] - (9*teams.length*pitcherRVals[0]));
		pitchers[i].value2 = (pitcherEconomy * .2) * (pitchers[i].stat2 - pitcherRVals[1]) / (poolVals[1] - (9*teams.length*pitcherRVals[1]));
		pitchers[i].value3 = (pitcherEconomy * .4) * (2*pitchers[i].stat4 + pitchers[i].stat3 - pitcherRVals[2]) / (poolVals[2] - (9*teams.length*pitcherRVals[2]));
		pitchers[i].value4 = (pitcherEconomy * .4) * (2*pitchers[i].stat4 + pitchers[i].stat3 - pitcherRVals[2]) / (poolVals[2] - (9*teams.length*pitcherRVals[2]));
		pitchers[i].value5 = (pitcherEconomy * .2) * (pitchers[i].wh - pitcherRVals[3]) / (poolVals[3] - (9*teams.length*pitcherRVals[3]));

		pitchers[i].value3 = (pitchers[i].value3*pitchers[i].stat3)/(2*pitchers[i].stat4 + pitchers[i].stat3);
		pitchers[i].value4 = (pitchers[i].value4*2*pitchers[i].stat4)/(2*pitchers[i].stat4 + pitchers[i].stat3);

		pitchers[i].value = Math.round(pitchers[i].value1 + pitchers[i].value2 + pitchers[i].value3 + pitchers[i].value4 + pitchers[i].value5);
	}
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

function setPitcherRVals () {
	var tempRVals = [0,0,0,0];
	for (var i = (9 * teams.length); i < (9 * teams.length) + 18; i++) {
		tempRVals[0] += pitchers[i].eer;
		tempRVals[1] += pitchers[i].stat2;
		tempRVals[2] += 2*pitchers[i].stat4 + pitchers[i].stat3;
		tempRVals[3] += pitchers[i].wh;
	}
	pitcherRVals[0] = tempRVals[0] / 18;
	pitcherRVals[1] = tempRVals[1] / 18;
	pitcherRVals[2] = tempRVals[2] / 18;
	pitcherRVals[3] = tempRVals[3] / 18;
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

function addEER (player) {
	player.eer = (player.countstat*4/9) - (player.countstat*player.stat1/9);
}

function addWH (player) {
	player.wh = (player.countstat*1.3) - (player.countstat*player.stat5);
}

function addEWH (player) {
	player.ewh = (player.countstat*player.stat2) - (player.countstat*.325);
}
