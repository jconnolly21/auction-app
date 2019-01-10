
$(document).ready(function() {
	const Url = 'https://still-ravine-63937.herokuapp.com/players';
	$.getJSON(Url, function(result){
		for(i = 0; i < result.players.length; i++) {
			console.log(result.players[i].name);
			console.log(result.players[i].team);
			console.log(result.players[i].elig);
			console.log(result.players[i].value);
		}
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