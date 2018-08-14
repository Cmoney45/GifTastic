let giphyAPI = {
  functions: {
    displayGifInfo: function() {
        let search = $(this).attr("data-name");
        let limit = 10;

        if ( search === giphyAPI.properties.currentSearch){
          giphyAPI.properties.currentSearchCount += limit;
        } else {
          giphyAPI.properties.currentSearchCount = limit
          $(`#gif-view`).empty()
        }
        giphyAPI.properties.currentSearch = search
        console.log(search);
          const queryURL = `https://api.giphy.com/v1/gifs/search?api_key=ET5w0OlR0mOjSbTget1iYZ31ELsPmcV8&q=${search}&limit=${giphyAPI.properties.currentSearchCount}`;
          // Create promise on queryURL
      $.ajax({
          url: queryURL,
          method: "GET"
        })
        .then((response) => {
          const results = response.data;
          const iCount = (giphyAPI.properties.currentSearchCount <= 10) ? 0: (giphyAPI.properties.currentSearchCount -10);

          // Looping over every result item
          for (let i = iCount; i < results.length; i++) {
            // Only taking action if the photo has an appropriate rating
            if (results[i].rating !== "r" && results[i].rating !== "pg-13") {
              // Creating a div with the class "card" for bootstrap
              const gifDiv = $("<div class='card text-center mr-2'>");
              // Storing the result item's rating to append later
              const rating = results[i].rating.toUpperCase();
              // Creating a paragraph tag with the result item's rating
              const paraRating = $(`<p class="card-text">`).text("Rating: " + rating);
              // Creating an image tag
              const gifImage = $("<img>");
              const cardBody = $(`<div class="body">`)
              // creating rows after title
              const textRow = $(`<div class="row">`)
              // half of the row to hold the Download button and the favorites button
              const buttonsRow =$(`<div class="col-6">`)
              // 2nd half where the rating paragraph will go
              const paraRow = $(`<div class="col-6">`)
              //create const for the buttons to include
              const downloadButton = $(`<a download href=${results[i].images.fixed_height.url}><i class="fas fa-download">`)
              const favoritesButton =$(`<button class="favorite" data-index="${i}"><i class="far fa-star">`)
              // append buttons to the button half of the row
              buttonsRow.append(downloadButton)
              buttonsRow.append(favoritesButton)
              // append the rating paragraph to the para row
              paraRow.append(paraRating)
              // Append them both to the "text row"
              textRow.append(paraRow)
              textRow.append(buttonsRow)
              // Give Gif image a still, animate, state and still source variables to call when the Gif is clicked on
              gifImage.attr({
                "data-still":results[i].images.fixed_height_still.url,
                "data-animate":results[i].images.fixed_height.url,
                "data-state":"still",
                "src": results[i].images.fixed_height_still.url});
              // add class for the bootstrap card
              gifImage.addClass("card-img-top gif")

              // Appending the paragraph and gifImage we created to the "gifDiv" div we created
              gifDiv.append(gifImage);
              gifDiv.append(cardBody)
              cardBody.append(`<h5 class="card-title">${results[i].title}`)
              cardBody.append(textRow);
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
      //Appends the favorites button first to be used as a favorites storage
      // $("#buttons-view").append(`<button class="mr-2 mt-2 favorites-btn btn btn-secondary" data-name="favorites">Favorites</button>`)
      // Looping through the array of active gifs
      for (let i = 0; i < giphyAPI.gifsArray.length; i++) {
        const groupButton =$(`<div class="btn-group mr-2 mt-2" role="group">`)
        const gifButton = $("<button>");
        // Adding a class of movie-btn to our button
        gifButton.addClass("gif-btn btn btn-secondary");
        // Adding a data-attribute
        gifButton.attr("data-name", giphyAPI.gifsArray[i]);
        // Providing the initial button text
        gifButton.text(giphyAPI.gifsArray[i]);
        // Adding the button to the buttons-view div
        const delButton = $(`<button class="btn btn-secondary delete" data-index=${i}>`)
        delButton.text("X");
        
        $(groupButton).append(gifButton)
        $(groupButton).append(delButton);
        $("#buttons-view").append(groupButton);
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
    },
    favoriteGif: function() {

    },
    deleteButton: function() {
      let gifsArray2 = giphyAPI.gifsArray;
      let currentIndex = $(this).attr("data-index");

      if(gifsArray2[currentIndex] === giphyAPI.properties.currentSearch){
        $(`#gif-view`).empty();
      }
      gifsArray2.splice(currentIndex, 1);
      giphyAPI.gifsArray = gifsArray2;

      giphyAPI.functions.renderButtons();
    },
    clearButton: function() {
      $(`#gif-view`).empty()
    },
    favoritesButton: function() {

    },
  },
  properties: {
    currentSearch: "",
    currentSearchCount: "",
  },
  gifsArray: ["Puppies", "Penguins", "Kittens", "Tigers"],
  favorites: [],
}

  // Event for the adding a gif button
  $("#add-gif").on("click", giphyAPI.functions.addGifButton);
  // Event for the clear button
  $("#clear-Button").on("click", giphyAPI.functions.clearButton);
  // Event for when a button is selected, display the gifs
  $(document).on("click", ".gif-btn", giphyAPI.functions.displayGifInfo);
  // Event to start the gif image to play
  $(document).on("click", ".gif", giphyAPI.functions.gifState);
  // Event for the x button next to gifs
  $(document).on("click", ".delete", giphyAPI.functions.deleteButton);

  // Render the initial Buttons
  giphyAPI.functions.renderButtons();
