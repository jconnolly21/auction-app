
$(document).ready(function() {
	const PlayersUrl = 'https://still-ravine-63937.herokuapp.com/players';
	$.getJSON(PlayersUrl, function(result){
		var htmlString = ''
		for(i = 0; i < result.players.length; i++) {
			htmlString = ('<option data-subtext="' + result.players[i].team + ' $' + result.players[i].value + '">' + result.players[i].name + '</option>');
			$("#nominate-list").append(htmlString);
		}
		$("#nominate-list").selectpicker('refresh');
	});

	$("#nominate-list").change(function() {
		var playerNominated = $('#nominate-list').find(":selected").text();
		$('#nominated-player').text(playerNominated);
	});
});

// <option data-subtext="WAS SP">Max Scherzer</option>


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