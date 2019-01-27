
const SteamerUrl = 'https://frozen-shore-95322.herokuapp.com/steamer';
const RotochampUrl = 'https://frozen-shore-95322.herokuapp.com/rotochamp';
var teams = ['Joe', 'Brian', 'Jim', 'Rich', 'Chris', 'Adam', 'Jody', 'Craig', 'Alan', 'Stu'];
var draftNumber = 0;
var allPlayers;

$(document).ready(function() {
	
	// Rosters array
	var rosters = new Array(10);
	for (var i = 0; i < rosters.length; i++) {
		rosters[i] = new Array(0);
	}

	// Available Players array
	var availablePlayers = [];
	
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
			}
		}

		draftNumber += 1;
		updateNominateList(availablePlayers);
		updateBudgets(rosters);
		updateRosterTable(rosters[0]);
		updateTeamTotals(rosters[0]);
		updateHitterPitcherBudgets(rosters[0]);
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
		updateBudgets(rosters);

		var activeRosterTeam = $('#active-roster-team').find(":selected").text();
		var activeRosterTeamIndex = teams.indexOf(activeRosterTeam);
		updateRosterTable(rosters[activeRosterTeamIndex]);

		var activeStatsTeam = $('#active-stats-team').find(":selected").text();
		var activeStatsTeamIndex = teams.indexOf(activeStatsTeam);
		updateTeamTotals(rosters[activeStatsTeamIndex]);

		updateHitterPitcherBudgets(rosters[0]);
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