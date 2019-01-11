
const PlayersUrl = 'https://frozen-shore-95322.herokuapp.com/players';
var teams = ['Joe', 'Brian', 'Jim', 'Rich', 'Chris', 'Adam', 'Jody', 'Craig', 'Alan', 'Stu'];

$(document).ready(function() {
	
	// Rosters array
	var rosters = new Array(10);
	for (var i = 0; i < rosters.length; i++) {
		rosters[i] = new Array(0);
	}

	// Available Players array
	var availablePlayers = [];

	
	$.getJSON(PlayersUrl, function(result){
		
		for(i = 0; i < result.players.length; i++) {
			if(result.players[i].ownerid == null) { 
				availablePlayers.push(result.players[i]);
			} else {
				rosters[result.players[i].ownerid - 1].push(result.players[i]);
			}
		}
		updateNominateList(availablePlayers);
		updateBudgets(rosters);
	});

	$("#nominate-list").change(function() {
		var playerNominated = $('#nominate-list').find(":selected").text();
		
		for(i = 0; i < availablePlayers.length; i++) {
			if(availablePlayers[i].name == playerNominated) {
				updateDetails(availablePlayers[i]);
				updateStatsRankings(availablePlayers[i]);
			}
		}
	});

	$("#bid-accepted").click(function() {
		var playerNominated = $('#nominate-list').find(":selected").text();
		var teamPurchasing = $('#bidding-team').find(":selected").text();
		var bidAmount = $('#bid-quantity').val();

		for(i = 0; i < availablePlayers.length; i++) {
			if(availablePlayers[i].name == playerNominated) {
				var purchasedPlayer = availablePlayers.splice(i,1)[0];
				purchasedPlayer.ownerid = teams.indexOf(teamPurchasing) + 1;
				purchasedPlayer.price = bidAmount;
				rosters[purchasedPlayer.ownerid - 1].push(purchasedPlayer);
			}
		}
		updateNominateList(availablePlayers);
		updateBudgets(rosters);
	});

});

// ---- UI Helper Functions ----

// data here is the rosters 2d array
function updateTeamTotals(data) {
	var output = []
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
				console.log(data[i][j]);
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
		htmlString += '<td>' + tableVals[i][3].toString() + '</td>';
		htmlString += '<td>' + tableVals[i][0].toString() + '</td>';
		htmlString += '<td>' + tableVals[i][1].toString() + '</td>';
		htmlString += '<td>' + tableVals[i][2].toString() + '</td>';
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
		$("#stats-categories").html('<th scope="col">Stat Type</th><th scope="col">ERA</th><th scope="col">K</th><th scope="col">S</th><th scope="col">W</th><th scope="col">WHIP</th>');
	} else {
		$("#stats-categories").html('<th scope="col">Stat Type</th><th scope="col">HR</th><th scope="col">OBP</th><th scope="col">R</th><th scope="col">RBI</th><th scope="col">SB</th>');	
	}
	$("#2019Proj").html('<th scope="row">2019 Projections</th><td>' + data.stat1.toString() + '</td><td>' + data.stat2.toString() + '</td><td>' + data.stat3.toString() + '</td><td>' + data.stat4.toString() + '</td><td>' + data.stat5.toString() + '</td>');
}

// data here is a list of players
function updateNominateList(data) {
	$("#nominate-list").html('');
	var htmlString = '';
	for (var i = 0; i < data.length; i++) {
		htmlString = ('<option data-subtext="' + data[i].team + ' $' + data[i].value + '">' + data[i].name + '</option>');
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