// interactive nav-menu
function myMenuFunction() {
    console.log("button clicked")
    var menu = document.getElementById("navMenu");
    var closeButton = document.querySelector(".close-btn");

    if(menu.className === "nav-menu") {
        menu.className += " responsive";
        closeButton.style.display = "block"; // Show the close button
    } else {
        menu.className = "nav-menu";
        closeButton.style.display = "none"; // Hide the close button
    }
}