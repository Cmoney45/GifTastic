//Instructions
//Before you can make any part of our site work, you need to create an array of strings, each one related to a topic that interests you. Save it to a variable called topics.

// We chose animals for our theme, but you can make a list to your own liking.

// Your app should take the topics in this array and create buttons in your HTML.

// Try using a loop that appends a button for each string in the array.

// When the user clicks on a button, the page should grab 10 static, non-animated gif images from the GIPHY API and place them on the page.
// When the user clicks one of the still GIPHY images, the gif should animate. If the user clicks the gif again, it should stop playing.

// Under every gif, display its rating (PG, G, so on).

// This data is provided by the GIPHY API.
// Only once you get images displaying with button presses should you move on to the next step.

// Add a form to your page takes the value from a user input box and adds it into your topics array. Then make a function call that takes each topic in the array remakes the buttons on the page.
// Deploy your assignment to Github Pages.
// Rejoice! You just made something really cool.

// Pseudo Code
// Need to create variables for the API url, key and 
// Create a pre-generated array of items I want to display. 
// Have a loop create buttons for the entire array. 
// Have a function create the form and add it to the page? 
// take in the form's data and add a button.
// when a button is clicked, create the promise for the selected button's GIF. (use instruction parameters here.)
var gifs = ["Puppies", "Penguins", "kittens", "tigers"];


function displayGifInfo() {
    var search = $(this).attr("data-name");
    var queryURL = `https://api.giphy.com/v1/gifs/search?api_key=ET5w0OlR0mOjSbTget1iYZ31ELsPmcV8&q=${search}&limit=10`;
    
    $(`#gif-view`).empty()
$.ajax({
    url: queryURL,
    method: "GET"
  })
  .then(function(response) {

    var results = response.data;

    // Looping over every result item
    for (var i = 0; i < results.length; i++) {

      // Only taking action if the photo has an appropriate rating
      if (results[i].rating !== "r" && results[i].rating !== "pg-13") {
        // Creating a div with the class "item"
        var gifDiv = $("<div class='item'>");

        // Storing the result item's rating
        var rating = results[i].rating;

        // Creating a paragraph tag with the result item's rating
        var p = $("<p>").text("Rating: " + rating);

        // Creating an image tag
        var personImage = $("<img>");

        // Giving the image tag an src attribute of a proprty pulled off the
        // result item
        personImage.attr("data-still",results[i].images.fixed_height_still.url);
        personImage.attr("data-animate",results[i].images.fixed_height.url);
        personImage.attr("data-state","still");
        personImage.addClass("gif")
        //TODO - change src 2nd variable to pull the data-still value
        personImage.attr("src", results[i].images.fixed_height_still.url);

        // Appending the paragraph and personImage we created to the "gifDiv" div we created
        gifDiv.append(p);
        gifDiv.append(personImage);

        // Prepending the gifDiv to the "#gifs-appear-here" div in the HTML
        $("#gif-view").prepend(gifDiv);
      }
    }
    console.log(response)
  });

}


function renderButtons() {
    // Deleting the movies prior to adding new movies
    // (this is necessary otherwise you will have repeat buttons)
    $("#buttons-view").empty();

    // Looping through the array of movies
    for (var i = 0; i < gifs.length; i++) {

      // Then dynamicaly generating buttons for each movie in the array
      // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
      var a = $("<button>");
      // Adding a class of movie-btn to our button
      a.addClass("gif-btn");
      // Adding a data-attribute
      a.attr("data-name", gifs[i]);
      // Providing the initial button text
      a.text(gifs[i]);
      // Adding the button to the buttons-view div
      $("#buttons-view").append(a);
    }
  }

  function gifState() {
    // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
    var state = $(this).attr("data-state");
    // If the clicked image's state is still, update its src attribute to what its data-animate value is.
    // Then, set the image's data-state to animate
    // Else set src to the data-still value
    if (state === "still") {
      $(this).attr("src", $(this).attr("data-animate"));
      $(this).attr("data-state", "animate");
    } else {
      $(this).attr("src", $(this).attr("data-still"));
      $(this).attr("data-state", "still");
    }
}

  $("#add-gif").on("click", function(event) {
    event.preventDefault();
    // This line grabs the input from the textbox
    var GIF = $("#gif-input").val().trim();
    if (GIF === "") {
        return;
    } else {
    // Adding movie from the textbox to our array
    gifs.push(GIF);
    // Calling renderButtons which handles the processing of our movie array
    renderButtons();
    }
  });

  $(document).on("click", ".gif-btn", displayGifInfo);
  $(document).on("click", ".gif", gifState)

  renderButtons();
