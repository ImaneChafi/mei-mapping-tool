//Collapsible function for each neume element
var coll = document.getElementsByClassName("collapsible");
var i;
for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
}

// Get the modal and cloned element
var modal = document.getElementById("projectModal");

// Get the button that opens the modal
var btn = document.getElementById("projectButton");
var buttonSubmit = document.getElementById("submitProject")

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

//Variables for the new button project
var newProject = document.createElement("BUTTON");

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

//Making a test button :
var newProject = document.createElement("BUTTON");
newProject.setAttribute("style", "   background-color: #659abb; border-radius: 10px; /* Green */ border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;");


