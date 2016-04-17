$(document).ready(function(){

  // Generate Template
  var source = $("#track-template").html();
  var trackTemplate = Handlebars.compile(source);

  // List saved songs
  $.ajax({
    url: 'https://api.spotify.com/v1/me/tracks',
    type: "GET",
    headers: {
      'Authorization': 'Bearer ' + window.sessionStorage.getItem("spotify_access_token")
    },
    success : function(response) {
      // See if there are tracks
      if(response.items.length == 0){
        alert("There are no tracks under that search term");
      }else{
        $("#song-container").html("");
        // Loop through the tracks
        response.items.forEach(function(item){
          var track = {
            id : item.track.id,
            title: item.track.name,
            artist : item.track.artists[0].name,
            clip: item.track.preview_url,
            album : item.track.album.name,
            image : item.track.album.images[0].url
          };
          $("#song-container").append(trackTemplate(track));

        });

      }

    },
    error : function(){
      alert("Could not pull in saved track listing, please go back to login into Spotify");
    }
  });

  // Save a searched item
  $(document).on("click", ".save", function(e){
    e.preventDefault();
    var $save = $(this);

    if(!window.sessionStorage.getItem("spotify_access_token")){
      alert("Please login with spotify to save a track");
    }else{
      $.ajax({
        url: 'https://api.spotify.com/v1/me/tracks?ids=' + encodeURIComponent($(this).attr("data-id")),
        type: "PUT",
        headers: {
          'Authorization': 'Bearer ' + window.sessionStorage.getItem("spotify_access_token"),
          'Accept' : 'application/json',
          'Content-Type' : 'application/json'
        },
        success: function(response) {
          $save
            .removeClass("btn-success save")
            .addClass("btn-danger delete")
            .html("<span class=\"glyphicon glyphicon-remove margin-right-5\"></span>Delete Track ");
        },
        error : function(){
          alert("Error: track was not saved");
        }
      });
    }

  });

  // Delete a saved item
  $(document).on("click", ".delete", function(e){
    e.preventDefault();
    var $delete = $(this);

    $.ajax({
      url: 'https://api.spotify.com/v1/me/tracks?ids=' + encodeURIComponent($(this).attr("data-id")),
      type: "DELETE",
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem("spotify_access_token"),
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
      },
      success: function(response) {
        $delete
          .removeClass("btn-danger delete")
          .addClass("btn-success save")
          .html("<span class=\"glyphicon glyphicon-ok margin-right-5\"></span>Save Track ");
      },
      error : function(){
        alert("Error: track was not deleted");
      }
    });

  });


});
