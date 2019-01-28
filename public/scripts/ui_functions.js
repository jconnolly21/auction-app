// data here is a single roster
function swapStatsValuesTotals(valMode, data) {
	var vals = new Array(10);

	if (valMode) {
		updateTeamTotals(data);
		$('#totals-vals').html('<th scope="row">Targets</th><td class="column-right">300</td><td class="column-right">0.340</td><td class="column-right">1000</td><td class="column-right">950</td><td class="column-right">125</td><td class="column-right">3.60</td><td class="column-right">1300</td><td class="column-right">75</td><td class="column-right">90</td><td class="column-right">1.20</td>');
	} else {
		var teamTotals = [0,0,0,0,0,0,0,0,0,0];
		for (var i = 0; i < data.length; i++) {
			var priceMultiplier = data[i].price / data[i].value;
			if (data[i].type == 'Hitter'){
				teamTotals[0] += data[i].value1 * priceMultiplier;
				teamTotals[1] += data[i].value2 * priceMultiplier;
				teamTotals[2] += data[i].value3 * priceMultiplier;
				teamTotals[3] += data[i].value4 * priceMultiplier;
				teamTotals[4] += data[i].value5 * priceMultiplier;
			} else {
				teamTotals[5] += data[i].value1 * priceMultiplier;
				teamTotals[6] += data[i].value2 * priceMultiplier;
				teamTotals[7] += data[i].value3 * priceMultiplier;
				teamTotals[8] += data[i].value4 * priceMultiplier;
				teamTotals[9] += data[i].value5 * priceMultiplier;
			}
		}
		var htmlString = '<th scope="row"><a id="swap-vals-stats" href="#">Totals</a></th>';
		for (var i = 0; i < teamTotals.length; i++) {
			htmlString += '<td class="column-right">$' + teamTotals[i].toFixed(0) + '</td>';
		}
		$('#team-stats').html(htmlString);
		$('#totals-vals').html('<th scope="row">Targets</th><td class="column-right">$35</td><td class="column-right">$21</td><td class="column-right">$35</td><td class="column-right">$30</td><td class="column-right">$27</td><td class="column-right">$22</td><td class="column-right">$18</td><td class="column-right">$22</td><td class="column-right">$25</td><td class="column-right">$26</td>');
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

// data here is a single teams roster
function updateHitterPitcherBudgets(data) {
	var hRem = 148;
	var pRem = 112;
	for (var i = 0; i < data.length; i++) {
		if (data[i].type == "Hitter") {
			hRem -= data[i].price;
		} else {
			pRem -= data[i].price;
		}
	}
	$("#hitter-budget").text("Hitting: $" + hRem);
	$("#pitcher-budget").text("Pitching: $" + pRem);
}

// data here is a single player
function updatePositionOptions(data) {
	var eligArr = data.elig.split(',');
	var htmlString = '';
	for (var i = 0; i < eligArr.length; i++) {
		htmlString += '<option>' + eligArr[i] + '</option>';
	}
	$('#roster-spot').html(htmlString);
	$('#roster-spot').selectpicker('refresh');
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

// data here is a player
function updatePlayersInTables(data) {
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

// data here is a single teams roster
function updateRosterTable(data) {
	var positions = ['C', '1B', '2B', 'SS', '3B', 'MI', 'CI', 'OF', 'OF', 'OF', 'OF', 'OF', 'U', 'U', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P']
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
			eligString = '';
			for (var j = 0; j < elig.length; j++) {
				if (positions[i].slice(0,-1) != elig[j]) {
					if (elig[j] != 'SP' && elig[j] != 'RP') {
						eligString += '<button value="' + filledBy[i].name + '" id="pos-switcher" type="button">' + elig[j] + '</button>';
					}
				}
			}
			var printName = filledBy[i].name;
			if (printName.length > 15) {
				printName = printName.split(' ')[0][0] + '.' + printName.substring(printName.indexOf(' '));
			}
			htmlString += '<tr><th scope="row">' + positions[i] + '</th><td>' + printName + '</td><td>' + eligString + '</td><td class="column-right">$' + filledBy[i].price + '</td></tr>';
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
		notesSection = ' <a href="#" tab-index="0" data-toggle="popover" data-trigger="focus" title="Player Notes" data-content="' + data.note + '"><img border="0" src="images/notes_image.png" alt="Notes" width="16" height="24"></a>';
	} else {
		notesSection = ' <a href="#" tab-index="0" data-toggle="popover" data-trigger="focus" title="Player Notes" data-content="No notes about this player..."><img border="0" src="images/notes_image.png" alt="Notes" width="16" height="24"></a>';
	}
	
	$("#nominated-player").html(printName + notesSection);
	var playerDetails = data.team + ' - ' + data.elig;
	$("#player-details").text(playerDetails + ' ');
	var suggestedVal = '<b>Suggested Value: $' + data.value.toString(); + '</b>';
	$("#suggested-val").html(suggestedVal);

	$(function () {
  		$('[data-toggle="popover"]').popover({trigger: 'focus'})
	});
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