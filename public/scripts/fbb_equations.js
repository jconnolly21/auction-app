var hitterEconomy;
var pitcherEconomy;

var hittersDrafted;
var pitchersDrafted;

var hitterRVals;
var pitcherRVals;

var hitterPitcherSplit = .65;

function initializeVars (rosters) {
	hittersDrafted = 0;
	pitchersDrafted = 0;

	hitterEconomy = teams.length*260*(hitterPitcherSplit);
	pitcherEconomy = teams.length*260*(1-hitterPitcherSplit);

	for (var i = 0; i < rosters.length; i++) {
		for (var j = 0; j < rosters[i].length; j++) {
			if (rosters[i][j].type == 'Hitter') {
				hitterEconomy -= rosters[i][j].price;
				hittersDrafted += 1;
			} else {
				pitcherEconomy -= rosters[i][j].price;
				pitchersDrafted += 1;
			}
		}
	}
}

function initializeHitterValues (hitters, rosters) {


}

function initializePitcherValues (pitchers, rosters) {
}

function setHitterCatVals (hitters) {
	var poolVals = [0,0,0,0,0];
	for (var i = 0; i < (140 - hittersDrafted); i++) {
		poolVals[0] += hitters[i].stat1;
		poolVals[1] += hitters[i].stat2;
		poolVals[2] += hitters[i].stat3;
		poolVals[3] += hitters[i].stat4;
		poolVals[4] += hitters[i].stat5;
	}
	for (var i = 0; i < hitters.length; i++) {
		hitters[i].value1 = 
	}
}

function setHitterRVals (hitters) {
	var tempRVals = [0,0,0,0,0];
	for (var i = (140 - hittersDrafted); i < (154 - hittersDrafted); i++) {
		tempRVals[0] += hitters[i].stat1;
		tempRVals[1] += hitters[i].stat2;
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

function addEWH (hitters) {
	for (var i = 0; i < hitters.length; i++) {
		hitters[i].ewh = (hitters[i].countstat*hitters[i].stat2) - (hitters[i].countstat*.315)
	}
}