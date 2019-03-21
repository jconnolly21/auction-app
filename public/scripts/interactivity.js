
const SteamerUrl = 'https://frozen-shore-95322.herokuapp.com/steamer';
const RotochampUrl = 'https://frozen-shore-95322.herokuapp.com/rotochamp';
const TheBatUrl = 'https://frozen-shore-95322.herokuapp.com/thebat';
var teams = ['Joe', 'Brian', 'Jim', 'Rich', 'Chris', 'Adam', 'Jody', 'Craig', 'Alan', 'Stu'];
var draftNumber = 0;
var allPlayers;
var availablePlayers = [];
var totalValue = 0;
var totalBudget = 2600;
var myBudget = new Array(23);
for (var i = 0; i < myBudget.length; i++) {
	myBudget[i] = {};
}

// Rosters array
var rosters = new Array(10);
for (var i = 0; i < rosters.length; i++) {
	rosters[i] = new Array(0);
}

$(document).ready(function() {
	
	$.getJSON(TheBatUrl, function(result){
		
		allPlayers = result.players; 

		initializeVars(allPlayers);
		calculateHitterValues();
		calculatePitcherValues();

		console.log(totalValue.toFixed(0));

		allPlayers.sort(function (a,b) {
			return b.value - a.value;
		});

		drawPlayerTable(allPlayers, 'U', '#hitter-stats');
		drawPlayerTable(allPlayers, 'P', '#sp-stats');
		drawPlayerTable(allPlayers, 'C', '#category-stats');

		var draftedPlayers = new Array(0);

		for(i = 0; i < allPlayers.length; i++) {
			if (allPlayers[i].ownerid == null) { 
				availablePlayers.push(allPlayers[i]);
			} else {
				draftNumber = Math.max(draftNumber, allPlayers[i].draftnumber)
				rosters[allPlayers[i].ownerid - 1].push(allPlayers[i]);
				draftedPlayers.push(allPlayers[i]);
				if (allPlayers[i].draftnumber == 0) {
					updateKeeperList(allPlayers[i]);
				}
				totalValue -= allPlayers[i].value;
				totalBudget -= allPlayers[i].price;
			}
		}

		console.log("Inflation Rate: ", (totalBudget/totalValue).toFixed(3));

		draftNumber += 1;
		updateNominateList(availablePlayers);
		updateKeeperOptions(availablePlayers)
		updateBudgets(rosters);
		updateRosterTable(rosters[0]);
		updateTeamTotals(rosters[0]);
		setRevertList(rosters);
		initializeDraftLog(draftedPlayers);

		var playerNominated = $('#nominate-list').find(":selected").text();
		
		for(i = 0; i < availablePlayers.length; i++) {
			if(availablePlayers[i].name == playerNominated) {
				updateDetails(availablePlayers[i]);
				updateStatsRankings(availablePlayers[i]);
				updateSimilarPlayers(availablePlayers, availablePlayers[i]);
				$('#bid-quantity').val(availablePlayers[i].value);
			}
		}
	});

	$.getJSON('https://frozen-shore-95322.herokuapp.com/mybudget', function(result) {
		var budgetRows = result.budget;
		
		for (var i = 0; i < budgetRows.length; i++) {
			myBudget[i].rosterspot = budgetRows[i].rosterspot;
			myBudget[i].budget = budgetRows[i].budget;
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
	});

	$("#nominate-list").change(function() {
		var playerNominated = $('#nominate-list').find(":selected").text();
		
		for(i = 0; i < availablePlayers.length; i++) {
			if(availablePlayers[i].name == playerNominated) {
				updateDetails(availablePlayers[i]);
				updateStatsRankings(availablePlayers[i]);
				updateSimilarPlayers(availablePlayers, availablePlayers[i]);
				$('#bid-quantity').val(availablePlayers[i].value);
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
				purchasedPlayer.rosterspot = findAvailableRosterSpot(purchasedPlayer, rosters[teams.indexOf(teamPurchasing)]);
				purchasedPlayer.price = bidAmount;
				purchasedPlayer.draftnumber = draftNumber;

				totalValue -= purchasedPlayer.value;
				totalBudget -= purchasedPlayer.price;

				updatePlayersInTables(purchasedPlayer);
				updateDraftLog(purchasedPlayer);
				rosters[purchasedPlayer.ownerid - 1].push(purchasedPlayer);
				$.post('https://frozen-shore-95322.herokuapp.com/playerupdate', {pid: purchasedPlayer.pid, player: purchasedPlayer.name, ownerid: purchasedPlayer.ownerid, rosterspot: purchasedPlayer.rosterspot, amount: bidAmount, draftnumber: purchasedPlayer.draftnumber}, function(result) {
					console.log(result);
				});
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

		setRevertList(rosters);

		var playerNominated = $('#nominate-list').find(":selected").text();
		
		for(i = 0; i < availablePlayers.length; i++) {
			if(availablePlayers[i].name == playerNominated) {
				updateDetails(availablePlayers[i]);
				updateStatsRankings(availablePlayers[i]);
				updateSimilarPlayers(availablePlayers, availablePlayers[i]);
				$('#bid-quantity').val(availablePlayers[i].value);
			}
		}
	});

	$("#keeper-submit").click(function() {
		var playerNominated = $('#keeper-options').find(":selected").text();
		var teamPurchasing = $('#keeper-team').find(":selected").text();
		var bidAmount = $('#keeper-quantity').val();

		for(i = 0; i < availablePlayers.length; i++) {
			if(availablePlayers[i].name == playerNominated) {
				var purchasedPlayer = availablePlayers.splice(i,1)[0];
				purchasedPlayer.ownerid = teams.indexOf(teamPurchasing) + 1;
				purchasedPlayer.rosterspot = findAvailableRosterSpot(purchasedPlayer, rosters[teams.indexOf(teamPurchasing)]);
				purchasedPlayer.price = bidAmount;
				purchasedPlayer.draftnumber = 0;

				totalValue -= purchasedPlayer.value;
				totalBudget -= purchasedPlayer.price;

				updatePlayersInTables(purchasedPlayer);
				updateDraftLog(purchasedPlayer);
				updateKeeperList(purchasedPlayer);
				rosters[purchasedPlayer.ownerid - 1].push(purchasedPlayer);
				$.post('https://frozen-shore-95322.herokuapp.com/playerupdate', {pid: purchasedPlayer.pid, player: purchasedPlayer.name, ownerid: purchasedPlayer.ownerid, rosterspot: purchasedPlayer.rosterspot, amount: bidAmount, draftnumber: purchasedPlayer.draftnumber}, function(result) {
					console.log(result);
				});
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

		setRevertList(rosters);

		var playerNominated = $('#nominate-list').find(":selected").text();
		
		for(i = 0; i < availablePlayers.length; i++) {
			if(availablePlayers[i].name == playerNominated) {
				updateDetails(availablePlayers[i]);
				updateStatsRankings(availablePlayers[i]);
				updateSimilarPlayers(availablePlayers, availablePlayers[i]);
				$('#bid-quantity').val(availablePlayers[i].value);
			}
		}
	});

	$('body').on('change', '.pos-switcher', function(e) {
		var newPos = $(e.target).find(':selected').text();
		var playerName = $(e.target).parent().parent().find('td').html();
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
		drawPlayerTable(allPlayers, activeTablePos, "#category-stats");
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
			$.post('https://frozen-shore-95322.herokuapp.com/playerremove', {player: clickedPlayer}, function(result) {
				console.log(result);
			});
			$(e.target).parent().parent().remove();
			for (var i = 0; i < allPlayers.length; i++) {
				if (allPlayers[i].name == clickedPlayer) {
					// Remove from roster
					for (var j = 0; j < rosters[allPlayers[i].ownerid-1].length; j++) {
						if (rosters[allPlayers[i].ownerid-1][j].name == clickedPlayer) {
							// Find player in roster and remove
							rosters[allPlayers[i].ownerid-1].splice(j,1);
						}
					}

					totalValue += allPlayers[i].value;
					totalBudget += allPlayers[i].price;

					// Set ownership props to null
					allPlayers[i].ownerid = null;
					allPlayers[i].price = null;
					allPlayers[i].rosterspot = null;
					allPlayers[i].draftnumber = null;

					// Add to Available Players & un-highlight in tables
					availablePlayers.push(allPlayers[i]);
					updatePlayersInTables(allPlayers[i]);
					removeFromDraftLog(allPlayers[i]);
				}
			}
		}

		availablePlayers.sort(function (a,b) {
			return b.value - a.value;
		});
		updateNominateList(availablePlayers);
		updateKeeperOptions(availablePlayers);

		var activeRosterTeam = $('#active-roster-team').find(":selected").text();
		var activeRosterTeamIndex = teams.indexOf(activeRosterTeam);
		updateRosterTable(rosters[activeRosterTeamIndex]);

		var activeStatsTeam = $('#active-stats-team').find(":selected").text();
		var activeStatsTeamIndex = teams.indexOf(activeStatsTeam);
		updateTeamTotals(rosters[activeStatsTeamIndex]);

		updateBudgets(rosters);

		setRevertList(rosters);

		var playerNominated = $('#nominate-list').find(":selected").text();
		
		for(i = 0; i < availablePlayers.length; i++) {
			if(availablePlayers[i].name == playerNominated) {
				updateDetails(availablePlayers[i]);
				updateStatsRankings(availablePlayers[i]);
				updateSimilarPlayers(availablePlayers, availablePlayers[i]);
				$('#bid-quantity').val(availablePlayers[i].value);
			}
		}
	});

	$('#revert-pick').click(function () {
		var removedPlayer = $('#revert-list').find(":selected").text();

		$.post('https://frozen-shore-95322.herokuapp.com/playerremove', {player: removedPlayer}, function(result) {
			console.log(result);
		});

		$("tbody#keeper-list td").filter(function() {
		    return $(this).text() == removedPlayer;
		}).closest("tr").remove();

		var whenDrafted = 0;

		for (var i = 0; i < allPlayers.length; i++) {
			if (allPlayers[i].name == removedPlayer) {
				// Remove from roster
				for (var j = 0; j < rosters[allPlayers[i].ownerid-1].length; j++) {
					if (rosters[allPlayers[i].ownerid-1][j].name == removedPlayer) {
						// Find player in roster and remove
						rosters[allPlayers[i].ownerid-1].splice(j,1);
					}
				}

				// Find draft number
				whenDrafted = allPlayers[i].draftnumber;

				totalValue += allPlayers[i].value;
				totalBudget += allPlayers[i].price;

				// Set ownership props to null
				allPlayers[i].ownerid = null;
				allPlayers[i].price = null;
				allPlayers[i].rosterspot = null;
				allPlayers[i].draftnumber = null;

				// Add to available players and un-highlight in tables
				availablePlayers.push(allPlayers[i]);
				updatePlayersInTables(allPlayers[i]);
				removeFromDraftLog(allPlayers[i]);
			}
		}

		var playersDrafted = new Array(0);

		for (var i = 0; i < allPlayers.length; i++) {
			if (allPlayers[i].draftnumber != null) {
				if (allPlayers[i].draftnumber > whenDrafted) {
					allPlayers[i].draftnumber = allPlayers[i].draftnumber - 1;
				}
				playersDrafted.push(allPlayers[i]);
			}

		}

		initializeDraftLog(playersDrafted);

		availablePlayers.sort(function (a,b) {
			return b.value - a.value;
		});
		updateNominateList(availablePlayers);
		updateKeeperOptions(availablePlayers);

		var activeRosterTeam = $('#active-roster-team').find(":selected").text();
		var activeRosterTeamIndex = teams.indexOf(activeRosterTeam);
		updateRosterTable(rosters[activeRosterTeamIndex]);

		var activeStatsTeam = $('#active-stats-team').find(":selected").text();
		var activeStatsTeamIndex = teams.indexOf(activeStatsTeam);
		updateTeamTotals(rosters[activeStatsTeamIndex]);

		updateBudgets(rosters);

		setRevertList(rosters);

		var playerNominated = $('#nominate-list').find(":selected").text();
		
		for(i = 0; i < availablePlayers.length; i++) {
			if(availablePlayers[i].name == playerNominated) {
				updateDetails(availablePlayers[i]);
				updateStatsRankings(availablePlayers[i]);
				updateSimilarPlayers(availablePlayers, availablePlayers[i]);
				$('#bid-quantity').val(availablePlayers[i].value);
			}
		}
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
