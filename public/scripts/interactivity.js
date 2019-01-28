
const SteamerUrl = 'https://frozen-shore-95322.herokuapp.com/steamer';
const RotochampUrl = 'https://frozen-shore-95322.herokuapp.com/rotochamp';
var teams = ['Joe', 'Brian', 'Jim', 'Rich', 'Chris', 'Adam', 'Jody', 'Craig', 'Alan', 'Stu'];
var draftNumber = 0;
var allPlayers;
var availablePlayers = [];
$(document).ready(function() {
	
	// Rosters array
	var rosters = new Array(10);
	for (var i = 0; i < rosters.length; i++) {
		rosters[i] = new Array(0);
	}
	
	$.getJSON(RotochampUrl, function(result){
		
		allPlayers = result.players; 

		initializeVars(allPlayers);
		calculateHitterValues();
		calculatePitcherValues();

		allPlayers.sort(function (a,b) {
			return b.value - a.value;
		});

		drawPlayerTable(allPlayers, 'U', '#hitter-stats');
		drawPlayerTable(allPlayers, 'P', '#sp-stats');
		drawPlayerTable(allPlayers, 'C', '#category-stats');

		for(i = 0; i < allPlayers.length; i++) {
			if (allPlayers[i].ownerid == null) { 
				availablePlayers.push(allPlayers[i]);
			} else {
				draftNumber = Math.max(draftNumber, allPlayers[i].draftnumber)
				rosters[allPlayers[i].ownerid - 1].push(allPlayers[i]);
				updateDraftLog(allPlayers[i]);
				if (allPlayers[i].draftnumber == 0) {
					updateKeeperList(allPlayers[i]);
				}
			}
		}

		draftNumber += 1;
		updateNominateList(availablePlayers);
		updateKeeperOptions(availablePlayers)
		updateBudgets(rosters);
		updateRosterTable(rosters[0]);
		updateTeamTotals(rosters[0]);
		updateHitterPitcherBudgets(rosters[0]);
		setRevertList(rosters);
	});

	$('#proj-source').change(function () {
		var projSource;
		if ($('#proj-source').find(":selected").text() == 'RotoChamp') {
			projSource = RotochampUrl;
		} else {
			projSource = SteamerUrl;
		}
		
		$.getJSON(projSource, function(result){
		
			for (var i = 0; i < allPlayers.length; i++) {
				for (var j = 0; j < result.players.length; j++) {
					if (allPlayers[i].name == result.players[j].name) {
						allPlayers[i].stat1 = result.players[j].stat1;
						allPlayers[i].stat2 = result.players[j].stat2;
						allPlayers[i].stat3 = result.players[j].stat3;
						allPlayers[i].stat4 = result.players[j].stat4;
						allPlayers[i].stat5 = result.players[j].stat5;
						allPlayers[i].countstat = result.players[j].countstat;
					}
				}
			} 
	
			initializeVars(allPlayers);
			calculateHitterValues();
			calculatePitcherValues();
	
			allPlayers.sort(function (a,b) {
				return b.value - a.value;
			});

			availablePlayers.sort(function (a,b) {
				return b.value - a.value;
			});
	
			drawPlayerTable(allPlayers, 'U', '#hitter-stats');
			drawPlayerTable(allPlayers, 'P', '#sp-stats');
			drawPlayerTable(allPlayers, 'C', '#category-stats');

			updateNominateList(availablePlayers);
			updateKeeperOptions(availablePlayers)
			updateTeamTotals(rosters[0]);
		});
	});

	$("#nominate-list").change(function() {
		var playerNominated = $('#nominate-list').find(":selected").text();
		
		for(i = 0; i < availablePlayers.length; i++) {
			if(availablePlayers[i].name == playerNominated) {
				updateDetails(availablePlayers[i]);
				updateStatsRankings(availablePlayers[i]);
				updateSimilarPlayers(availablePlayers, availablePlayers[i]);
				updatePositionOptions(availablePlayers[i]);
				$('#bid-quantity').val(availablePlayers[i].value);
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
		updateKeeperOptions(availablePlayers);
		updateBudgets(rosters);

		var activeRosterTeam = $('#active-roster-team').find(":selected").text();
		var activeRosterTeamIndex = teams.indexOf(activeRosterTeam);
		updateRosterTable(rosters[activeRosterTeamIndex]);

		var activeStatsTeam = $('#active-stats-team').find(":selected").text();
		var activeStatsTeamIndex = teams.indexOf(activeStatsTeam);
		updateTeamTotals(rosters[activeStatsTeamIndex]);

		updateHitterPitcherBudgets(rosters[0]);

		setRevertList(rosters);
	});

	$("#keeper-submit").click(function() {
		var playerNominated = $('#keeper-options').find(":selected").text();
		var teamPurchasing = $('#keeper-team').find(":selected").text();
		var bidAmount = $('#keeper-quantity').val();

		for(i = 0; i < availablePlayers.length; i++) {
			if(availablePlayers[i].name == playerNominated) {
				var purchasedPlayer = availablePlayers.splice(i,1)[0];
				var rosterSpot = purchasedPlayer.elig.split(',')[0];
				purchasedPlayer.ownerid = teams.indexOf(teamPurchasing) + 1;
				purchasedPlayer.rosterspot = rosterSpot;
				purchasedPlayer.price = bidAmount;
				purchasedPlayer.draftnumber = 0;
				updatePlayersInTables(purchasedPlayer);
				updateDraftLog(purchasedPlayer);
				updateKeeperList(purchasedPlayer);
				rosters[purchasedPlayer.ownerid - 1].push(purchasedPlayer);
			}
		}

		updateNominateList(availablePlayers);
		updateKeeperOptions(availablePlayers);
		updateBudgets(rosters);

		var activeRosterTeam = $('#active-roster-team').find(":selected").text();
		var activeRosterTeamIndex = teams.indexOf(activeRosterTeam);
		updateRosterTable(rosters[activeRosterTeamIndex]);

		var activeStatsTeam = $('#active-stats-team').find(":selected").text();
		var activeStatsTeamIndex = teams.indexOf(activeStatsTeam);
		updateTeamTotals(rosters[activeStatsTeamIndex]);

		updateHitterPitcherBudgets(rosters[0]);

		setRevertList(rosters);
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

	$('#stats-table-position').change(function () {
		var activeTablePos = $('#stats-table-position').find(":selected").text();
		drawPlayerTable(allPlayers, activeTablePos, "#category-stats")
	});

	$('body').on('click', '.player-link', function(e) {
		var tableID = "#" + $(e.target).parent().parent().parent().attr('id') + " th";
		var playerName = $(e.target).text();
		var isPicked = $(e.target).parent().parent().hasClass('player-picked');
		var valMode = $(e.target).parent().parent().hasClass('val-mode');
		$(e.target).parent().parent().toggleClass('val-mode');
		swapStatsValues(tableID, playerName, isPicked, valMode);
		e.preventDefault();
	});

	$('body').on('click', '#swap-vals-stats', function(e) {
		var valMode = $(e.target).parent().parent().parent().hasClass('val-mode');
		$(e.target).parent().parent().parent().toggleClass('val-mode');

		var activeStatsTeam = $('#active-stats-team').find(":selected").text();
		var activeStatsTeamIndex = teams.indexOf(activeStatsTeam);
		var activeRoster = rosters[activeStatsTeamIndex]

		swapStatsValuesTotals(valMode, activeRoster);
		e.preventDefault();
	});

	$('body').on('click', '#settings-button', function(e) {
		e.preventDefault();
	});

	$('body').on('click', '.remove-keeper', function(e) {
		var clickedPlayer = $(e.target).parent().parent().find('td').html();
		if ($(e.target).parent().parent().is('tr')) {
		$(e.target).parent().parent().remove();
			for (var i = 0; i < allPlayers.length; i++) {
				if (allPlayers[i].name == clickedPlayer) {
					// Remove from roster
					for (var j = 0; j < rosters[allPlayers[i].ownerid-1]; j++) {
						if (rosters[allPlayers[i].ownerid-1][j].name == clickedPlayer) {
							// Find player in roster and remove
							rosters[allPlayers[i].ownerid-1].splice(j,1);
						}
					}

					// Set ownership props to null
					allPlayers[i].ownerid = null;
					allPlayers[i].price = null;
					allPlayers[i].rosterspot = null;
					allPlayers[i].draftnumber = null;

					// Add to Available Players & un-highlight in tables
					availablePlayers.push(allPlayers[i]);
					updatePlayersInTables(allPlayers[i]);
				}
			}
		}

		availablePlayers.sort(function (a,b) {
			return b.value - a.value;
		});
		updateNominateList(availablePlayers);

		var activeRosterTeam = $('#active-roster-team').find(":selected").text();
		var activeRosterTeamIndex = teams.indexOf(activeRosterTeam);
		updateRosterTable(rosters[activeRosterTeamIndex]);

		var activeStatsTeam = $('#active-stats-team').find(":selected").text();
		var activeStatsTeamIndex = teams.indexOf(activeStatsTeam);
		updateTeamTotals(rosters[activeStatsTeamIndex]);

		updateHitterPitcherBudgets(rosters[0]);

		setRevertList(rosters);
	});

	$('#revert-pick').click(function () {
		var removedPlayer = $('#revert-list').find(":selected").text();
		for (var i = 0; i < allPlayers.length; i++) {
			if (allPlayers[i].name == removedPlayer) {
				// Remove from roster
				for (var j = 0; j < rosters[allPlayers[i].ownerid-1]; j++) {
					console.log(rosters[allPlayers[i].ownerid-1][j]);
					if (rosters[allPlayers[i].ownerid-1][j].name == removedPlayer) {
						// Find player in roster and remove
						console.log('made it here');
						rosters[allPlayers[i].ownerid-1].splice(j,1);
					}
				}

				// Set ownership props to null
				allPlayers[i].ownerid = null;
				allPlayers[i].price = null;
				allPlayers[i].rosterspot = null;
				allPlayers[i].draftnumber = null;

				// Add to available players and un-highlight in tables
				availablePlayers.push(allPlayers[i]);
				updatePlayersInTables(allPlayers[i]);
			}
		}

		availablePlayers.sort(function (a,b) {
			return b.value - a.value;
		});
		updateNominateList(availablePlayers);

		var activeRosterTeam = $('#active-roster-team').find(":selected").text();
		var activeRosterTeamIndex = teams.indexOf(activeRosterTeam);
		updateRosterTable(rosters[activeRosterTeamIndex]);

		var activeStatsTeam = $('#active-stats-team').find(":selected").text();
		var activeStatsTeamIndex = teams.indexOf(activeStatsTeam);
		updateTeamTotals(rosters[activeStatsTeamIndex]);

		updateHitterPitcherBudgets(rosters[0]);

		setRevertList(rosters);
	});

});

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