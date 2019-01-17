
const PlayersUrl = 'https://frozen-shore-95322.herokuapp.com/players';
var teams = ['Joe', 'Brian', 'Jim', 'Rich', 'Chris', 'Adam', 'Jody', 'Craig', 'Alan', 'Stu'];
var draftNumber = 0;

$(document).ready(function() {
	
	// Rosters array
	var rosters = new Array(10);
	for (var i = 0; i < rosters.length; i++) {
		rosters[i] = new Array(0);
	}

	// Available Players array
	var availablePlayers = [];

	
	$.getJSON(PlayersUrl, function(result){
		
		drawPlayerTable(result.players, 'U', '#hitter-stats');
		drawPlayerTable(result.players, 'P', '#sp-stats');
		// drawPlayerTable(result.players, 'RP', '#rp-stats');
		drawPlayerTable(result.players, '1B', '#fb-stats');
		drawPlayerTable(result.players, '2B', '#sb-stats');
		drawPlayerTable(result.players, '3B', '#tb-stats');
		drawPlayerTable(result.players, 'SS', '#ss-stats');
		drawPlayerTable(result.players, 'MI', '#mi-stats');
		drawPlayerTable(result.players, 'CI', '#ci-stats');
		drawPlayerTable(result.players, 'OF', '#of-stats');
		drawPlayerTable(result.players, 'C', '#c-stats');

		for(i = 0; i < result.players.length; i++) {
			if(result.players[i].ownerid == null) { 
				availablePlayers.push(result.players[i]);
			} else {
				draftNumber = Math.max(draftNumber, result.players[i].draftnumber)
				rosters[result.players[i].ownerid - 1].push(result.players[i]);
				updateDraftLog(result.players[i]);
			}
		}
		draftNumber += 1;
		console.log(draftNumber);
		updateNominateList(availablePlayers);
		updateBudgets(rosters);
		updateRosterTable(rosters[0]);
		updateTeamTotals(rosters[0]);
	});

	$("#nominate-list").change(function() {
		var playerNominated = $('#nominate-list').find(":selected").text();
		
		for(i = 0; i < availablePlayers.length; i++) {
			if(availablePlayers[i].name == playerNominated) {
				updateDetails(availablePlayers[i]);
				updateStatsRankings(availablePlayers[i]);
				updateSimilarPlayers(availablePlayers, availablePlayers[i]);
				updatePositionOptions(availablePlayers[i]);
			}
		}
	});

	$("#bid-accepted").click(function() {
		var playerNominated = $('#nominate-list').find(":selected").text();
		var teamPurchasing = $('#bidding-team').find(":selected").text();
		var bidAmount = $('#bid-quantity').val();
		var rosterSpot = $('#roster-spot').find(":selected").text();

		for(i = 0; i < availablePlayers.length; i++) {
			if(availablePlayers[i].name == playerNominated) {
				var purchasedPlayer = availablePlayers.splice(i,1)[0];
				purchasedPlayer.ownerid = teams.indexOf(teamPurchasing) + 1;
				purchasedPlayer.rosterspot = rosterSpot;
				purchasedPlayer.price = bidAmount;
				purchasedPlayer.draftnumber = draftNumber;
				updatePlayersInTables(purchasedPlayer);
				updateDraftLog(purchasedPlayer);
				rosters[purchasedPlayer.ownerid - 1].push(purchasedPlayer);
			}
		}

		draftNumber += 1;

		updateNominateList(availablePlayers);
		updateBudgets(rosters);

		var activeRosterTeam = $('#active-roster-team').find(":selected").text();
		var activeRosterTeamIndex = teams.indexOf(activeRosterTeam);
		updateRosterTable(rosters[activeRosterTeamIndex]);

		var activeStatsTeam = $('#active-stats-team').find(":selected").text();
		var activeStatsTeamIndex = teams.indexOf(activeStatsTeam);
		updateTeamTotals(rosters[activeStatsTeamIndex]);
	});

	$('body').on('click', '#pos-switcher', function(e) {
		var newPos = $(e.target).text();
		var playerName = $(e.target).val();
		var activeRosterTeam = $('#active-roster-team').find(":selected").text();
		var activeRosterTeamIndex = teams.indexOf(activeRosterTeam);
		for (var i = 0; i < rosters[activeRosterTeamIndex].length; i++) {
			if (rosters[activeRosterTeamIndex][i].name == playerName) {
				rosters[activeRosterTeamIndex][i].rosterspot = newPos;
			}
		}
		updateRosterTable(rosters[activeRosterTeamIndex]);
	});

	$('#active-roster-team').change(function () {
		var activeRosterTeam = $('#active-roster-team').find(":selected").text();
		var activeRosterTeamIndex = teams.indexOf(activeRosterTeam);
		updateRosterTable(rosters[activeRosterTeamIndex]);
	});

	$('#active-stats-team').change(function () {
		var activeStatsTeam = $('#active-stats-team').find(":selected").text();
		var activeStatsTeamIndex = teams.indexOf(activeStatsTeam);
		updateTeamTotals(rosters[activeStatsTeamIndex]);
	});

});

// ---- UI Helper Functions ----

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
	$("tbody#hitter-stats th").filter(function() {
	    return $(this).text() == data.name;
	}).closest("tr").addClass('player-picked').find('td.player-price').html('$' + data.price);
	$("tbody#sp-stats th").filter(function() {
	    return $(this).text() == data.name;
	}).closest("tr").addClass('player-picked').find('td.player-price').html('$' + data.price);
	$("tbody#rp-stats th").filter(function() {
	    return $(this).text() == data.name;
	}).closest("tr").addClass('player-picked').find('td.player-price').html('$' + data.price);
	$("tbody#fb-stats th").filter(function() {
	    return $(this).text() == data.name;
	}).closest("tr").addClass('player-picked').find('td.player-price').html('$' + data.price);
	$("tbody#sb-stats th").filter(function() {
	    return $(this).text() == data.name;
	}).closest("tr").addClass('player-picked').find('td.player-price').html('$' + data.price);
	$("tbody#tb-stats th").filter(function() {
	    return $(this).text() == data.name;
	}).closest("tr").addClass('player-picked').find('td.player-price').html('$' + data.price);
	$("tbody#ss-stats th").filter(function() {
	    return $(this).text() == data.name;
	}).closest("tr").addClass('player-picked').find('td.player-price').html('$' + data.price);
	$("tbody#mi-stats th").filter(function() {
	    return $(this).text() == data.name;
	}).closest("tr").addClass('player-picked').find('td.player-price').html('$' + data.price);
	$("tbody#ci-stats th").filter(function() {
	    return $(this).text() == data.name;
	}).closest("tr").addClass('player-picked').find('td.player-price').html('$' + data.price);
	$("tbody#of-stats th").filter(function() {
	    return $(this).text() == data.name;
	}).closest("tr").addClass('player-picked').find('td.player-price').html('$' + data.price);
	$("tbody#c-stats th").filter(function() {
	    return $(this).text() == data.name;
	}).closest("tr").addClass('player-picked').find('td.player-price').html('$' + data.price);
}

// data here is all players
function drawPlayerTable(data, cat, catID) {
	var eligiblePlayers = [];
	var posArr = new Array (0);
	for (var i = 0; i < data.length; i++) {
		posArr = data[i].elig.split(',');
		if (posArr.indexOf(cat) != -1) {
			eligiblePlayers.push(data[i]);
		}
	}
	var htmlString = '';
	for (var j = 0; j < eligiblePlayers.length; j++) {
		if (eligiblePlayers[j].ownerid == null) {
			htmlString += '<tr class="player-list"><th scope="row"><a href="#">' + eligiblePlayers[j].name + '</a></th><td class="column-right">' + eligiblePlayers[j].stat1 + '</td><td class="column-right">' + eligiblePlayers[j].stat2 + '</td><td class="column-right">' + eligiblePlayers[j].stat3 + '</td><td class="column-right">' + eligiblePlayers[j].stat4 + '</td><td class="column-right">' + eligiblePlayers[j].stat5 + '</td><td class="column-right">$' + eligiblePlayers[j].value + '</td><td class="column-right player-price"></td></tr>'; 
		} else {
			htmlString += '<tr class="player-list player-picked"><th scope="row"><a href="#">' + eligiblePlayers[j].name + '</a></th><td class="column-right">' + eligiblePlayers[j].stat1 + '</td><td class="column-right">' + eligiblePlayers[j].stat2 + '</td><td class="column-right">' + eligiblePlayers[j].stat3 + '</td><td class="column-right">' + eligiblePlayers[j].stat4 + '</td><td class="column-right">' + eligiblePlayers[j].stat5 + '</td><td class="column-right">$' + eligiblePlayers[j].value + '</td><td class="column-right player-price">$' + eligiblePlayers[j].price + '</td></tr>'; 
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
	htmlString += '<tr><th scope="row">' + data.draftnumber + '.</th><td>' + printName + ' <span class="teamname">(' + data.team + ')</span></td><td class="column-center"><div class="pos-' + data.rosterspot + '""><b>' + data.rosterspot + '</b></div></td><td class="column-right">$' + data.price + '</td></tr>';
	$('#draft-log').prepend(htmlString);
}

// data here is a single teams roster
function updateRosterTable(data) {
	var positions = ['C', '1B', '2B', 'SS', '3B', 'MI', 'CI', 'OF', 'OF', 'OF', 'OF', 'OF', 'U', 'U', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P']
	var filledBy = new Array(23).fill(' ');

	for (var i = 0; i < data.length; i++) {
		var pos = positions.indexOf(data[i].rosterspot);
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
	var htmlString = '<th scope="row">Totals</th>';
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
	$("#nominated-player").text(data.name);
	var playerDetails = data.team + ' - ' + data.elig;
	$("#player-details").text(playerDetails);
	var suggestedVal = '<b>Suggested Value: $' + data.value.toString(); + '</b>';
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
	$("#cat-values").html('<th scope="row">Value</th><td class="column-center">$' + data.value1.toString() + '</td><td class="column-center">$' + data.value2.toString() + '</td><td class="column-center">$' + data.value3.toString() + '</td><td class="column-center">$' + data.value4.toString() + '</td><td class="column-center">$' + data.value5.toString() + '</td>');
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

// ---- Other Helpers ----

function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}