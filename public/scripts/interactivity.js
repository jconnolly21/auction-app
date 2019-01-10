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

var http = require("http");

var options = {
	host: "still-ravine-63937.herokuapp.com",
	path: "/players",
	method: "GET",
	headers: {
		"Content-Type": "application/json"
	}
};

var req = http.request(options, function(res) {
	var responseString = "";

	res.on("data", function(data) {
		responseString += data;
	});

	res.on("end", function() {
		console.log(responseString);
	});
});

$(document).ready(function() {
	req.write();
	req.end();
});