$(document).on("click", ".notes-btn", function () {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "GET",
        url: "/code-cademy/" + thisId
    }).then(function(data) {
        console.log(data);
        $("#notes").append("<h4>Add a note for '" + data[0].title + "'</h4><hr><br />");
        $("#notes").append("<input type='text' id='titleinput' name='title' placeholder='Enter Note Title Here'>");
        $("#notes").append("<input type='text' id='bodyinput' name='body' placeholder='Enter Note Here'></input><br />");
        $("#notes").append("<button class='btn modal-close' data-id='" + data[0]._id + "' id='savenote'>Save Note</button>");
        if (data[0].note) {
            $("#titleinput").val(data[0].note.title);
            $("#bodyinput").val(data[0].note.body);
        }
    });
});

$(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/code-cademy/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    }).then(function(data) {
        console.log(data);
        $("#notes").empty();
    });
    $("#titleinput").val("");
    $("#bodyinput").val("");
});