
// data here is from budget table
function initializeMyBudget(data) {
	for (var i = 0; i < data.length; i++) {
		myBudget[i].rosterspot = data[i].rosterspot;
		myBudget[i].budget = data[i].budget;
	}
	var contenders;	
	for (var i = 0; i < rosters[0].length; i++) {
		contenders = [];
		for (var j = 0; j < myBudget.length; j++) {
			if (rosters[0][i].rosterspot == myBudget[j].rosterspot) {
				var obj = {};
				obj.name = rosters[0][i].name;
				obj.rosterspot = rosters[0][i].rosterspot;
				obj.price = rosters[0][i].price;
				obj.diff = myBudget[j].budget - rosters[0][i].price;
				obj.budget = myBudget[j].budget;
				contenders.push(obj);
			}
		}
		contenders.sort(function (a,b) {
			return Math.abs(a.diff) - Math.abs(b.diff);
		});
		for (var j = 0; j < myBudget.length; j++) {
			if (myBudget[j].rosterspot == contenders[0].rosterspot && myBudget[j].budget == contenders[0].budget) {
				myBudget[j].name = contenders[0].name;
				myBudget[j].price = contenders[0].price;
				myBudget[j].diff = contenders[0].diff;
			}
		}
	}
	for (var i = 0; i < myBudget.length; i++) {
		if (myBudget[i].name) {
			$("#budget-rows").append('<tr><td>' + myBudget[i].rosterspot + '</td><td>' + myBudget[i].name + '</td><td class="column-center">$' + myBudget[i].budget + '</td><td class="column-center">$' + myBudget[i].price + '</td><td class="column-center">$' + myBudget[i].diff + '</td></tr>');
		} else {
			$("#budget-rows").append('<tr><td>' + myBudget[i].rosterspot + '</td><td></td><td class="column-center">$' + myBudget[i].budget + '</td><td class="column-center"></td><td class="column-center"></td></tr>');
		}
	}
}

// data here is a single player
function addToBudget(data) {
	var contenders = [];	
	for (var j = 0; j < myBudget.length; j++) {
		if (data.rosterspot == myBudget[j].rosterspot && !myBudget[j].name) {
			var obj = {};
			obj.name = data.name;
			obj.rosterspot = data.rosterspot;
			obj.price = data.price;
			obj.diff = myBudget[j].budget - data.price;
			obj.budget = myBudget[j].budget;
			contenders.push(obj);
		}
	}
	contenders.sort(function (a,b) {
		return Math.abs(a.diff) - Math.abs(b.diff);
	});
	for (var j = 0; j < myBudget.length; j++) {
		if (myBudget[j].rosterspot == contenders[0].rosterspot && myBudget[j].budget == contenders[0].budget) {
			myBudget[j].name = contenders[0].name;
			myBudget[j].price = contenders[0].price;
			myBudget[j].diff = contenders[0].diff;
			break;
		}
	}
	$("#budget-rows").html("");
	for (var i = 0; i < myBudget.length; i++) {
		if (myBudget[i].name) {
			$("#budget-rows").append('<tr><td>' + myBudget[i].rosterspot + '</td><td>' + myBudget[i].name + '</td><td class="column-center">$' + myBudget[i].budget + '</td><td class="column-center">$' + myBudget[i].price + '</td><td class="column-center">$' + myBudget[i].diff + '</td></tr>');
		} else {
			$("#budget-rows").append('<tr><td>' + myBudget[i].rosterspot + '</td><td></td><td class="column-center">$' + myBudget[i].budget + '</td><td class="column-center"></td><td class="column-center"></td></tr>');
		}
	}
}

// data here is a single player
function removeFromBudget(data) {
	for (var j = 0; j < myBudget.length; j++) {
		if (data.name == myBudget[j].name) {
			myBudget[j].name = null;
			myBudget[j].price = null;
			myBudget[j].diff = null;
		}
	}
	$("#budget-rows").html("");
	for (var i = 0; i < myBudget.length; i++) {
		if (myBudget[i].name) {
			$("#budget-rows").append('<tr><td>' + myBudget[i].rosterspot + '</td><td>' + myBudget[i].name + '</td><td class="column-center">$' + myBudget[i].budget + '</td><td class="column-center">$' + myBudget[i].price + '</td><td class="column-center">$' + myBudget[i].diff + '</td></tr>');
		} else {
			$("#budget-rows").append('<tr><td>' + myBudget[i].rosterspot + '</td><td></td><td class="column-center">$' + myBudget[i].budget + '</td><td class="column-center"></td><td class="column-center"></td></tr>');
		}
	}
}

// data here is a single roster
function swapStatsValuesTotals(valMode, data) {
	var vals = new Array(10);

	if (valMode) {
		updateTeamTotals(data);
	} else {
		var teamTotals = [0,0,0,0,0,0,0,0,0,0];
		var numH = 0;
		var numP = 0;
		var totalIp = 0;
		var totalAb = 0;

		for (var i = 0; i < data.length; i++) {
			if (data[i].type == 'Hitter'){
				numH += 1;
				teamTotals[0] += data[i].stat1;
				teamTotals[1] = (((teamTotals[1]*totalAb) + (data[i].stat2*data[i].countstat))/(totalAb + data[i].countstat)).toFixed(3);
				teamTotals[2] += data[i].stat3;
				teamTotals[3] += data[i].stat4;
				teamTotals[4] += data[i].stat5;
				totalAb += data[i].countstat;
			} else {
				numP += 1;
				teamTotals[5] = (((totalIp*teamTotals[5]) + (data[i].countstat*data[i].stat1))/(totalIp + data[i].countstat)).toFixed(2);
				teamTotals[6] += data[i].stat2;
				teamTotals[7] += data[i].stat3;
				teamTotals[8] += data[i].stat4;
				teamTotals[9] = (((totalIp*teamTotals[9]) + (data[i].countstat*data[i].stat5))/(totalIp + data[i].countstat)).toFixed(2);
				totalIp += data[i].countstat;
			}
		}
		
		hRVals = getHitterRVals();
		pRVals = getPitcherRVals();

		teamTotals[0] += (14-numH)*hRVals[0];
			teamTotals[0] = teamTotals[0].toFixed(0);
		teamTotals[1] = (((teamTotals[1]*totalAb) + (.325*450*(14-numH)))/(totalAb + (450*(14-numH)))).toFixed(3);
		teamTotals[2] += (14-numH)*hRVals[2];
			teamTotals[2] = teamTotals[2].toFixed(0);
		teamTotals[3] += (14-numH)*hRVals[3];
			teamTotals[3] = teamTotals[3].toFixed(0);
		teamTotals[4] += (14-numH)*hRVals[4];
			teamTotals[4] = teamTotals[4].toFixed(0);

		teamTotals[5] = (((totalIp*teamTotals[5]) + (3.9*100*(9-numP)))/(totalIp + 100*(9-numP))).toFixed(2);
		teamTotals[6] += (9-numP)*pRVals[1];
			teamTotals[6] = teamTotals[6].toFixed(0);
		teamTotals[7] += (9-numP)*4; // cant get these vals directly due to way I model rVals
			teamTotals[7] = teamTotals[7].toFixed(0);
		teamTotals[8] += (9-numP)*5; // same as above...
			teamTotals[8] = teamTotals[8].toFixed(0);
		teamTotals[9] = (((totalIp*teamTotals[9]) + (1.3*100*(9-numP)))/(totalIp + 100*(9-numP))).toFixed(2);

		var htmlString = '<th scope="row"><a id="swap-vals-stats" href="#">Tot+RV</a></th>';
		for (var i = 0; i < teamTotals.length; i++) {
			htmlString += '<td class="column-right">' + teamTotals[i] + '</td>';
		}
		$('#team-stats').html(htmlString);
	}	
}

// data here is a single player
function swapStatsValues(tableID, playerName, isPicked, valMode) {
	var player;
	for (var i = 0; i < allPlayers.length; i++) {
		if (allPlayers[i].name == playerName) {
			player = allPlayers[i];
		}
	}

	var val1, val2, val3, val4, val5, colAlign;
	if (valMode) {
		colAlign = 'column-center';
		val1 = player.stat1;
		val2 = player.stat2;
		val3 = player.stat3;
		val4 = player.stat4;
		val5 = player.stat5;
		if (player.type == "Hitter") {
			val2 = val2.toFixed(3).toString().substring(1);
		} else {
			val1 = val1.toFixed(2);
			val5 = val5.toFixed(2);
		}
	} else {
		colAlign = 'column-center';
		val1 = "$" + player.value1.toFixed(0);
		val2 = "$" + player.value2.toFixed(0);
		val3 = "$" + player.value3.toFixed(0);
		val4 = "$" + player.value4.toFixed(0);
		val5 = "$" + player.value5.toFixed(0);
	}

	var htmlString;
	if (isPicked) {
		htmlString = '<th class="big-col" scope="row"><a class="player-link" href="#">' + player.name + '</a></th><td class="small-col ' + colAlign + '">' + val1 + '</td><td class="small-col ' + colAlign + '">' +  val2 + '</td><td class="small-col ' + colAlign + '">' + val3 + '</td><td class="small-col ' + colAlign + '">' + val4 + '</td><td class="small-col ' + colAlign + '">' + val5 + '</td><td class="small-col column-right">$' + player.value + '</td><td class="small-col column-right player-price">$' + player.price + '</td>';
	} else {
		htmlString = '<th class="big-col" scope="row"><a class="player-link" href="#">' + player.name + '</a></th><td class="small-col ' + colAlign + '">' + val1 + '</td><td class="small-col ' + colAlign + '">' +  val2 + '</td><td class="small-col ' + colAlign + '">' + val3 + '</td><td class="small-col ' + colAlign + '">' + val4 + '</td><td class="small-col ' + colAlign + '">' + val5 + '</td><td class="small-col column-right">$' + player.value + '</td><td class="small-col column-right player-price"></td>';
	}

	$(tableID).filter(function() {
	    return $(this).text() == playerName;
	}).closest("tr").html(htmlString);
}

// data here is availablePlayers, and player is a certain player
function updateSimilarPlayers(data, player) {
	var closestPlayers = new Array (0);
	var valDistArr = new Array (0);
	var valDist = 0;
	var sameElig = false;
	var eligComp = Array(1);

	var eligArr = player.elig.split(',');
	if (eligArr.indexOf('U') != -1) {
		eligArr.splice(eligArr.indexOf('U'), 1);
	}
	for (var i = 0; i < data.length; i++) {
		sameElig = false;
		eligComp = data[i].elig.split(',');
		for (var j = 0; j < eligArr.length; j++) {
			if (eligComp.indexOf(eligArr[j]) != -1) {
				if (data[i].name != player.name) {
					sameElig = true;
				}
			}
		}
		if (sameElig) {
			if (closestPlayers.length < 2) {
				closestPlayers.push(data[i]);
				valDistArr.push(Math.abs(player.value - data[i].value));
			} else {
				valDist = Math.abs(player.value - data[i].value);
				if (valDist < Math.max.apply(null, valDistArr)) {
					repIndex = valDistArr.indexOf(Math.max.apply(null, valDistArr));
					closestPlayers[repIndex] = data[i];
					valDistArr[repIndex] = Math.abs(player.value - data[i].value);
				}
			}
		}
	}
	$("#similar-players").html("<li>" + closestPlayers[0].name + " - " + closestPlayers[0].team + " - " + closestPlayers[0].elig + " - $" + closestPlayers[0].value + "</li>" + "<li>" + closestPlayers[1].name + " - " + closestPlayers[1].team + " - " + closestPlayers[1].elig + " - $" + closestPlayers[1].value + "</li>")
}

// data here is the rosters 2d array
function setRevertList(data) {
	var htmlString = '<option>Pick a Player</option>';
	for (var i = 0; i < data.length; i++) {
		for (var j = 0; j < data[i].length; j++) {
			htmlString += '<option>' + data[i][j].name + '</option>';
		}
	}
	$('#revert-list').html(htmlString);
	$('#revert-list').selectpicker('refresh');
}

// data here is a player
function updatePlayersInTables(data) {
	if (data.ownerid != null) {
		var classText = 'player-picked';
		if (data.ownerid == 1) {
			classText = 'player-mine';
		}
		$("tbody#hitter-stats th").filter(function() {
		    return $(this).text() == data.name;
		}).closest("tr").addClass('player-picked').addClass(classText).find('td.player-price').html('$' + data.price);
		$("tbody#sp-stats th").filter(function() {
		    return $(this).text() == data.name;
		}).closest("tr").addClass('player-picked').addClass(classText).find('td.player-price').html('$' + data.price);
		$("tbody#category-stats th").filter(function() {
		    return $(this).text() == data.name;
		}).closest("tr").addClass('player-picked').addClass(classText).find('td.player-price').html('$' + data.price);
	} else {
		$("tbody#hitter-stats th").filter(function() {
		    return $(this).text() == data.name;
		}).closest("tr").removeClass('player-picked').removeClass('player-mine').find('td.player-price').html('');
		$("tbody#sp-stats th").filter(function() {
		    return $(this).text() == data.name;
		}).closest("tr").removeClass('player-picked').removeClass('player-mine').find('td.player-price').html('');
		$("tbody#category-stats th").filter(function() {
		    return $(this).text() == data.name;
		}).closest("tr").removeClass('player-picked').removeClass('player-mine').find('td.player-price').html('');
	}
}

// data here is all players
function drawPlayerTable(data, cat, catID) {
	var eligiblePlayers = [];
	var posArr = new Array (0);
	for (var i = 0; i < data.length; i++) {
		posArr = data[i].elig.split(',');
		if (posArr.indexOf(cat) != -1) {
			eligiblePlayers.push(data[i]);
		} else if (cat == 'P' && data[i].type == 'Pitcher') {
			eligiblePlayers.push(data[i]);
		}
	}
	if (catID == '#category-stats') {
		var headerHTMLString = '<th class="big-col" scope="col">Name</th>';
		if (['C','1B','2B','SS','3B','MI','CI','OF','U'].indexOf(cat) != -1) {
			var hitCats = ['HR','OBP','R','RBI','SB','$V','$P'];
			for (var i = 0; i < hitCats.length; i++) {
				headerHTMLString += '<th class="small-col column-center" scope="col">' + hitCats[i] + '</th>';
			}
		} else {
			var pitCats = ['ERA','K','S','W','WHIP','$V','$P'];
			for (var i = 0; i < pitCats.length; i++) {
				headerHTMLString += '<th class="small-col column-center" scope="col">' + pitCats[i] + '</th>';
			}
		}
		$('#category-stats').parent().find('thead').find('tr').html(headerHTMLString);
	}

	var htmlString = '';
	for (var j = 0; j < eligiblePlayers.length; j++) {
		var stat1 = eligiblePlayers[j].stat1;
		var stat2 = eligiblePlayers[j].stat2;
		var stat3 = eligiblePlayers[j].stat3;
		var stat4 = eligiblePlayers[j].stat4;
		var stat5 = eligiblePlayers[j].stat5;

		if (eligiblePlayers[j].type == "Hitter") {
			stat2 = stat2.toFixed(3).toString().substring(1);
		} else {
			stat1 = stat1.toFixed(2);
			stat5 = stat5.toFixed(2);
		}

		if (eligiblePlayers[j].ownerid == null) {
			htmlString += '<tr class="player-list"><th class="big-col" scope="row"><a class="player-link" href="#">' + eligiblePlayers[j].name + '</a></th><td class="small-col column-center">' + stat1 + '</td><td class="small-col column-center">' + stat2 + '</td><td class="small-col column-center">' + stat3 + '</td><td class="small-col column-center">' + stat4 + '</td><td class="small-col column-center">' + stat5 + '</td><td class="small-col column-center">$' + eligiblePlayers[j].value + '</td><td class="small-col column-center player-price"></td></tr>'; 
		} else {
			var classText = 'player-picked';
			if (eligiblePlayers[j].ownerid == 1) {
				classText = 'player-picked player-mine';
			} 
			htmlString += '<tr class="player-list ' + classText + '"><th class="big-col" scope="row"><a class="player-link" href="#">' + eligiblePlayers[j].name + '</a></th><td class="small-col column-center">' + stat1 + '</td><td class="small-col column-center">' + stat2 + '</td><td class="small-col column-center">' + stat3 + '</td><td class="small-col column-center">' + stat4 + '</td><td class="small-col column-center">' + stat5 + '</td><td class="small-col column-center">$' + eligiblePlayers[j].value + '</td><td class="small-col column-center player-price">$' + eligiblePlayers[j].price + '</td></tr>'; 
		}
	}

	$(catID).html(htmlString);
}

// data here is a list of players
function initializeDraftLog(data) {
	data.sort(function (a,b) {
		return b.draftnumber - a.draftnumber;
	});
	var htmlString = '';
	for (var i = 0; i < data.length; i++) {
		var printName = data[i].name;
		if (printName.length > 12) {
			printName = printName.split(' ')[0][0] + '.' + printName.substring(printName.indexOf(' '));
		}
		var draftNumClean = data[i].draftnumber;
		if (draftNumClean == 0) {
			draftNumClean = 'K';
		}
		htmlString += '<tr><th scope="row">' + draftNumClean + '.</th><td>' + printName + ' <span class="teamname">(' + data[i].team + ')</span></td><td class="column-center"><div class="pos-' + data[i].rosterspot + '""><b>' + data[i].rosterspot + '</b></div></td><td class="column-right">$' + data[i].price + '</td></tr>';
	}
	$('#draft-log').html(htmlString);
}

// data here is a player
function updateDraftLog(data) {
	var htmlString = '';
	var printName = data.name;
	if (printName.length > 12) {
		printName = printName.split(' ')[0][0] + '.' + printName.substring(printName.indexOf(' '));
	}
	var draftNumClean = data.draftnumber;
	if (draftNumClean == 0) {
		draftNumClean = 'K';
	}
	htmlString += '<tr><th scope="row">' + draftNumClean + '.</th><td>' + printName + ' <span class="teamname">(' + data.team + ')</span></td><td class="column-center"><div class="pos-' + data.rosterspot + '""><b>' + data.rosterspot + '</b></div></td><td class="column-right">$' + data.price + '</td></tr>';
	$('#draft-log').prepend(htmlString);
}

function removeFromDraftLog(data) {
	var printName = data.name;
	if (printName.length > 12) {
		printName = printName.split(' ')[0][0] + '.' + printName.substring(printName.indexOf(' '));
	}
	$("#draft-log td").filter(function() {
		return $(this).text() == (printName + ' (' + data.team + ')');
	}).closest("tr").remove();
}

// data here is a player
function updateKeeperList(data) {
	var htmlString = '<tr><td class="keeper-big">' + data.name + '</td><td class="keeper-small column-center">' + teams[data.ownerid-1] + '</td><td class="keeper-small column-center">$' + data.price + '</td><td class="keeper-small column-center remove-keeper"><a href="#">X</a></td></tr>';
	$('#keeper-list').prepend(htmlString);
}

// takes in a player and a roster
function findAvailableRosterSpot(player, roster) {
	var availableSpot = ' ';
	var positions = ['C', '1B', '2B', 'SS', '3B', 'MI', 'CI', 'OF', 'OF', 'OF', 'OF', 'OF', 'U', 'U', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'];

	for (var i = 0; i < roster.length; i++) {
		var cleanRosSpot = roster[i].rosterspot;
		if (cleanRosSpot == 'RP' || cleanRosSpot == 'SP') {
			cleanRosSpot = 'P';
		}
		positions[positions.indexOf(cleanRosSpot)] += '*';
	}

	var elig = player.elig.split(',');
	if (player.type == 'Hitter') {
		for (var i = 0; i < elig.length; i++) {
			if (positions.indexOf(elig[i]) != -1 && availableSpot == ' ') {
				availableSpot = elig[i];
			}
		}
		if (availableSpot == ' ') {
			availableSpot = 'U';
		}
	} else {
		if (player.elig == 'SP') {
			availableSpot = 'SP';
		} else {
			availableSpot = 'RP';
		}
	}
	return availableSpot;
}

// data here is a single teams roster
function updateRosterTable(data) {
	var positions = ['C', '1B', '2B', 'SS', '3B', 'MI', 'CI', 'OF', 'OF', 'OF', 'OF', 'OF', 'U', 'U', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'];
	var filledBy = new Array(23).fill(' ');

	for (var i = 0; i < data.length; i++) {
		var cleanRosSpot = data[i].rosterspot;
		if (cleanRosSpot == 'RP' || cleanRosSpot == 'SP') {
			cleanRosSpot = 'P';
		}
		var pos = positions.indexOf(cleanRosSpot);
		positions[pos] += '*';
		filledBy[pos] = data[i];
	}

	$('#team-roster').html('');
	var htmlString = '';
	var eligString = '';

	for (var i = 0; i < positions.length; i++) {
		if (filledBy[i] != ' ') {
			elig = filledBy[i].elig.split(',');
			eligString = '<select class="pos-switcher"><option>' + filledBy[i].rosterspot + '</option>';
			for (var j = 0; j < elig.length; j++) {
				if (positions[i].slice(0,-1) != elig[j]) {
					if (elig[j] != 'SP' && elig[j] != 'RP') {
						eligString += '<option>' + elig[j] + '</option>';
					}
				}
			}
			eligString += '</select>';
			htmlString += '<tr><th scope="row">' + positions[i] + '</th><td>' + filledBy[i].name + '</td><td>' + eligString + '</td><td class="column-right">$' + filledBy[i].price + '</td></tr>';
		} else {
			htmlString += '<tr><th scope="row">' + positions[i] + '</th><td></td><td></td><td class="column-right"></td></tr>';
		}
	}
	$('#team-roster').html(htmlString);
}

// data here is a single teams roster
function updateTeamTotals(data) {
	var totalIp = 0;
	var totalAb = 0;
	var teamTotals = [0,0,0,0,0,0,0,0,0,0];
	
	for (var i = 0; i < data.length; i++) {
		if (data[i].type == "Pitcher") {
			teamTotals[5] = (((totalIp*teamTotals[5]) + (data[i].countstat*data[i].stat1))/(totalIp + data[i].countstat)).toFixed(2);
			teamTotals[6] += data[i].stat2;
			teamTotals[7] += data[i].stat3;
			teamTotals[8] += data[i].stat4;
			teamTotals[9] = (((totalIp*teamTotals[9]) + (data[i].countstat*data[i].stat5))/(totalIp + data[i].countstat)).toFixed(2);
			totalIp += data[i].countstat;
		} else {
			teamTotals[0] += data[i].stat1;
			teamTotals[1] = (((teamTotals[1]*totalAb) + (data[i].stat2*data[i].countstat))/(totalAb + data[i].countstat)).toFixed(3);
			teamTotals[2] += data[i].stat3;
			teamTotals[3] += data[i].stat4;
			teamTotals[4] += data[i].stat5;
			totalAb += data[i].countstat;
		}
	}
	var htmlString = '<th scope="row"><a id="swap-vals-stats" href="#">Totals</a></th>';
	for (var i = 0; i < teamTotals.length; i++) {
		htmlString += '<td class="column-right">' + teamTotals[i] + '</td>';
	}
	$('#team-stats').html(htmlString);
}

// data here is the rosters 2d array
function updateBudgets(data) {
	
	// Create the needed data
	var tableVals = new Array (10);
	for (var i = 0; i < data.length; i++) {
		tableVals[i] = [260,0,0];
		for (var j = 0; j < data[i].length; j++) {
			tableVals[i][0] = tableVals[i][0] - data[i][j].price;
			if (data[i][j].type == 'Hitter') {
				tableVals[i][1] += 1;
			} else {
				tableVals[i][2] += 1;
			}
		}
		var maxBid = tableVals[i][0] + tableVals[i][1] + tableVals[i][2] - 22;
		tableVals[i].push(maxBid);
	}

	// Put it into the table
	var htmlString = '';
	for (var i = 0; i < tableVals.length; i++) {
		htmlString += '<tr>'
		htmlString += '<th scope = "row">' + teams[i] + '</th>';
		htmlString += '<td class="column-right">$' + tableVals[i][3].toString() + '</td>';
		htmlString += '<td class="column-right">$' + tableVals[i][0].toString() + '</td>';
		htmlString += '<td class="column-right">' + tableVals[i][1].toString() + '</td>';
		htmlString += '<td class="column-right">' + tableVals[i][2].toString() + '</td>';
		htmlString += '</tr>';
	}

	$("#budgetTable").html(htmlString);
}

// data here is a single player
function updateDetails(data) {
	var printName = data.name;
	if (printName.length > 18) {
		printName = printName.split(' ')[0][0] + '.' + printName.substring(printName.indexOf(' '));
	}
	var notesSection;
	if (data.note) {
		notesSection = ' <a href="' + data.note + '" target="_blank"><img border="0" src="images/notes_image.png" alt="Notes" width="16"></a>';
	} else {
		notesSection = '';
	}
	
	$("#nominated-player").html(printName + notesSection);
	var playerDetails = data.team + ' - ' + data.elig;
	$("#player-details").text(playerDetails + ' ');
	var suggestedVal = '<b>Suggested Value: $' + data.value.toString() + '</b> ($' + (data.value*(totalBudget/totalValue)).toFixed(0) + ')';
	$("#suggested-val").html(suggestedVal);
}

// data here is a single player
function updateStatsRankings(data) {
	if(data.type == 'Pitcher') {
		$("#stats-categories").html('<th scope="col"></th><th class="column-center" scope="col">ERA</th><th class="column-center" scope="col">K</th><th class="column-center" scope="col">S</th><th class="column-center" scope="col">W</th><th class="column-center" scope="col">WHIP</th>');
	} else {
		$("#stats-categories").html('<th scope="col"></th><th class="column-center" scope="col">HR</th><th class="column-center" scope="col">OBP</th><th class="column-center" scope="col">R</th><th class="column-center" scope="col">RBI</th><th class="column-center" scope="col">SB</th>');	
	}
	$("#2019Proj").html('<th scope="row">Stats</th><td class="column-center">' + data.stat1.toString() + '</td><td class="column-center">' + data.stat2.toString() + '</td><td class="column-center">' + data.stat3.toString() + '</td><td class="column-center">' + data.stat4.toString() + '</td><td class="column-center">' + data.stat5.toString() + '</td>');
	$("#cat-values").html('<th scope="row">Value</th><td class="column-center">$' + data.value1.toFixed(2) + '</td><td class="column-center">$' + data.value2.toFixed(2) + '</td><td class="column-center">$' + data.value3.toFixed(2) + '</td><td class="column-center">$' + data.value4.toFixed(2) + '</td><td class="column-center">$' + data.value5.toFixed(2) + '</td>');
}

// data here is a list of players
function updateNominateList(data) {
	$("#nominate-list").html('');
	var htmlString = '';
	for (var i = 0; i < data.length; i++) {
		htmlString = ('<option data-subtext="$' + data[i].value + ' (' + data[i].team + ') ' + data[i].elig + '">' + data[i].name + '</option>');
		$("#nominate-list").append(htmlString);
	}
	$("#nominate-list").selectpicker('refresh');
}

// data here is a list of players
function updateKeeperOptions(data) {
	$("#keeper-options").html('');
	var htmlString = '';
	for (var i = 0; i < data.length; i++) {
		htmlString = ('<option data-subtext="$' + data[i].value + ' (' + data[i].team + ') ' + data[i].elig + '">' + data[i].name + '</option>');
		$("#keeper-options").append(htmlString);
	}
	$("#keeper-options").selectpicker('refresh');
}