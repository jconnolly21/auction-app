
$(document).ready(function() {
	
	// Initialize team array
	var rosters = new Array(10);
	for (var i = 0; i < rosters.length; i++) {
		rosters[i] = new Array(23);
	}

	const PlayersUrl = 'https://still-ravine-63937.herokuapp.com/players';
	$.getJSON(PlayersUrl, function(result){
		
		var personOne = result.players[0];
		var personTwo = {
			pid: result.players[0].pid,
			name: result.players[0].name,
			type: result.players[0].type,
			team: result.players[0].team,
			elig: result.players[0].elig,
			stat1: result.players[0].stat1,
			stat2: result.players[0].stat2,
			stat3: result.players[0].stat3,
			stat4: result.players[0].stat4,
			stat5: result.players[0].stat5,
			value: result.players[0].value,
			price: result.players[0].price,
			ownerid: result.players[0].ownerid
		};

		console.log(personOne);
		console.log(personTwo);

		// Populate elements of UI on load
		var htmlString = ''
		for(i = 0; i < result.players.length; i++) {
			if(result.players[i].owner == null) { 
				htmlString = ('<option data-subtext="' + result.players[i].team + ' $' + result.players[i].value + '">' + result.players[i].name + '</option>');
				$("#nominate-list").append(htmlString);
			} else {
				var owningTeamID = result.players[i].ownerid
			}
		}
		$("#nominate-list").selectpicker('refresh');


	});

	$("#nominate-list").change(function() {
		var playerNominated = $('#nominate-list').find(":selected").text();
		$.getJSON(PlayersUrl, function(result){
			for(i = 0; i < result.players.length; i++) {
				if(result.players[i].name == playerNominated) {
					
					// Name and Details
					$("#nominated-player").text(playerNominated);
					var playerDetails = result.players[i].team + ' - ' + result.players[i].elig;
					$("#player-details").text(playerDetails);
					var suggestedVal = '<b>Suggested Value: $' + result.players[i].value.toString(); + '</b>';
					$("#suggested-val").html(suggestedVal);
					
					// Stats and Rankings
					if(result.players[i].type == 'Pitcher') {
						$("#stats-categories").html('<th scope="col">Stat Type</th><th scope="col">ERA</th><th scope="col">K</th><th scope="col">S</th><th scope="col">W</th><th scope="col">WHIP</th>');
					} else {
						$("#stats-categories").html('<th scope="col">Stat Type</th><th scope="col">HR</th><th scope="col">OBP</th><th scope="col">R</th><th scope="col">RBI</th><th scope="col">SB</th>');	
					}
					$("#2019Proj").html('<th scope="row">2019 Projections</th><td>' + result.players[i].stat1.toString() + '</td><td>' + result.players[i].stat2.toString() + '</td><td>' + result.players[i].stat3.toString() + '</td><td>' + result.players[i].stat4.toString() + '</td><td>' + result.players[i].stat1.toString() + '</td>');
				}
			}
		});
	});
});

// HELPER FUNCTIONS BELOW

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