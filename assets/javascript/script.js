let giphyAPI = {
  functions: {
    displayGifInfo: function() {
        let search = $(this).attr("data-name");
        console.log(search);
          const queryURL = `https://api.giphy.com/v1/gifs/search?api_key=ET5w0OlR0mOjSbTget1iYZ31ELsPmcV8&q=${search}&limit=10`;
          $(`#gif-view`).empty()
          // Create promise on queryURL
      $.ajax({
          url: queryURL,
          method: "GET"
        })
        .then((response) => {
          const results = response.data;
          // Looping over every result item
          for (let i = 0; i < results.length; i++) {
            // Only taking action if the photo has an appropriate rating
            if (results[i].rating !== "r" && results[i].rating !== "pg-13") {
              // Creating a div with the class "card" for bootstrap
              const gifDiv = $("<div class='card'>");
              // Storing the result item's rating to append later
              const rating = results[i].rating;
              // Creating a paragraph tag with the result item's rating
              const para = $(`<p class="card-text">`).text("Rating: " + rating);

              // Creating an image tag
              const gifImage = $("<img>");

              // Giving the image tag an src attribute of a proprty pulled off the
              // result item
              gifImage.attr({
                "data-still":results[i].images.fixed_height_still.url,
                "data-animate":results[i].images.fixed_height.url,
                "data-state":"still",
                "src": results[i].images.fixed_height_still.url});
              gifImage.addClass("card-img-top gif")

              // Appending the paragraph and gifImage we created to the "gifDiv" div we created
              gifDiv.append(gifImage);
              gifDiv.append(para);

              // Prepending the gifDiv to the "#gifs-appear-here" div in the HTML
              $("#gif-view").prepend(gifDiv);
            }
          }
          console.log(response)
        });
    },
    renderButtons: function() {
      // Deleting the prior butotns before adding new buttons
      $("#buttons-view").empty();

      // Looping through the array of active gifs
      for (let i = 0; i < giphyAPI.gifsArray.length; i++) {
        const button = $("<button>");
        // Adding a class of movie-btn to our button
        button.addClass("gif-btn btn btn-secondary");
        // Adding a data-attribute
        button.attr("data-name", giphyAPI.gifsArray[i]);
        // Providing the initial button text
        button.text(giphyAPI.gifsArray[i]);
        // Adding the button to the buttons-view div
        $("#buttons-view").append(button);
      }     
    },
    gifState: function() {
      // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
      let state = $(this).attr("data-state");
      console.log(state);
      // If the clicked image's state is still, update its src attribute to what its data-animate value is.
      // Then, set the image's data-state to animate
      // Else set src to the data-still value
      if (state === "still") {
        $(this).attr("src", $(this).attr("data-animate"));
        console.log($(this).attr("data-animate"))
        $(this).attr("data-state", "animate");
      } else {
        $(this).attr("src", $(this).attr("data-still"));
        console.log($(this).attr("data-still"))
        $(this).attr("data-state", "still");
      }
    },
    addGifButton: function(event) {
      event.preventDefault();
      // This line grabs the input from the textbox
      const userInput = $("#gif-input").val().trim();
      if (userInput === "") {
          return;
      } else {
      // Adding movie from the textbox to our array
      giphyAPI.gifsArray.push(userInput);
      // Calling renderButtons which handles the processing of our movie array
      giphyAPI.functions.renderButtons();
      }
      $(`#gif-input`).text("")
    }
  },
  gifsArray: ["Puppies", "Penguins", "kittens", "tigers"]
}

  $("#add-gif").on("click", giphyAPI.functions.addGifButton)
  $(document).on("click", ".gif-btn", giphyAPI.functions.displayGifInfo);
  $(document).on("click", ".gif", giphyAPI.functions.gifState)

  giphyAPI.functions.renderButtons();
