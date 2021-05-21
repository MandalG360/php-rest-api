 $(document).ready(function(){
  //Fetch All Records
  function loadTable(){ 
    $("#load-table").html("");
    $.ajax({ 
      url : 'http://localhost/php-rest-api/api-fetch-all.php',
      type : "GET",
      success : function(data){
        if(data.status == false){
          $("#load-table").append("<tr><td colspan='6'><h2>"+ data.message +"</h2></td></tr>");
        }else{
          var sn = 0;
          $.each(data, function(key, value){ 
            $("#load-table").append("<tr>" + 
                                    "<td>" + ++sn + "</td>" + 
                                    "<td>" + value.student_name +"</td>" + 
                                    "<td>" + value.age +"</td>" + 
                                    "<td>" + value.city +"</td>" + 
                                    "<td><button class='edit-btn' data-eid='"+ value.id + "'>Edit</button></td>" + 
                                    "<td><button class='delete-btn' data-id='"+ value.id + "'>Delete</button></td>" + 
                                    "</tr>");
          });
        }
      }
    });
  }

  loadTable();

  //Show Success or Error Messages
  function message(message, status){
    if(status == true){
      $("#success-message").html(message).slideDown();
      $("#error-message").slideUp();
      setTimeout(function(){
        $("#success-message").slideUp();
      },4000);

    }else if(status == false){
      $("#error-message").html(message).slideDown();
      $("#success-message").slideUp();
      setTimeout(function(){
        $("#error-message").slideUp();
      },4000);
    }
  }

  // Function for form Data to JSON Object
  function jsonData(targetForm){
      var arr = $(targetForm).serializeArray();
    
      var obj = {};
      for(var a= 0; a < arr.length; a++){
        if(arr[a].value == ""){
          return false;
        }
        obj[arr[a].name] = arr[a].value;
      }
      
      var json_string = JSON.stringify(obj);

      return json_string;
      
  }

  //Insert New Record
  $("#save-button").on("click",function(e){
    e.preventDefault();

    var jsonObj = jsonData("#addForm");

    if( jsonObj == false){
      message("All Fields are required.",false);
    }else{
      $.ajax({ 
      url : 'http://localhost/php-rest-api/api-insert.php',
      type : "POST",
      data : jsonObj,
      success : function(data){
        message(data.message, data.status);

        if(data.status == true){
          loadTable();
          $("#addForm").trigger("reset");
        }
      }
    });
  }
  });

  //Delete Record
  $(document).on("click",".delete-btn",function(){
    if(confirm("Do you really want to delete this record ? ")){
      var studentId = $(this).data("id");
      var obj = {sid : studentId};
      var myJSON = JSON.stringify(obj);

      var row = this;

      $.ajax({
      url : 'http://localhost/php-rest-api/api-delete.php',
      type : "POST",
      data : myJSON,
      success : function(data){
        message(data.message, data.status);

        if(data.status == true){
          $(row).closest("tr").fadeOut();
        }
      }
    });
    }
  });

  //Fetch Single Record : Show in Modal Box
  $(document).on("click",".edit-btn",function(){
    $("#modal").show();
    var studentId = $(this).data("eid");
    var obj = {sid : studentId};
    var myJSON = JSON.stringify(obj);

    $.ajax({
      url : 'http://localhost/php-rest-api/api-fetch-single.php',
      type : "POST",
      data : myJSON,
      success : function(data){
        $("#edit-id").val(data[0].id);
        $("#edit-name").val(data[0].student_name);
        $("#edit-age").val(data[0].age);
        $("#edit-city").val(data[0].city);
      }
    });
  });

  //Hide Modal Box
  $("#close-btn").on("click",function(){
    $("#modal").hide();
  });

  //Update Record
  $("#edit-submit").on("click",function(e){
    e.preventDefault();

    var jsonObj = jsonData("#edit-form");

    if( jsonObj == false){
      message("All Fields are required.",false);
    }else{
      $.ajax({ 
      url : 'http://localhost/php-rest-api/api-update.php',
      type : "POST",
      data : jsonObj,
      success : function(data){
        message(data.message, data.status);

        if(data.status == true){
          $("#modal").hide();
          loadTable();
        }
      }
    });
  }
  });

  //Live Search Record
  $("#search").on("keyup",function(){
    var search_term = $(this).val();

    $("#load-table").html("");

    $.ajax({ 
      url : 'http://localhost/php-rest-api/api-search.php?search=' + search_term,
      type : "GET",
      success : function(data){
       if(data.status == false){
          $("#load-table").append("<tr><td colspan='6'><h2>"+ data.message +"</h2></td></tr>");
        }else{
          $.each(data, function(key, value){ 
            $("#load-table").append("<tr>" + 
                                    "<td>" + value.id + "</td>" + 
                                    "<td>" + value.student_name +"</td>" + 
                                    "<td>" + value.age +"</td>" + 
                                    "<td>" + value.city +"</td>" + 
                                    "<td><button class='edit-btn' data-eid='"+ value.id + "'>Edit</button></td>" + 
                                    "<td><button class='delete-btn' data-id='"+ value.id + "'>Delete</button></td>" + 
                                    "</tr>");
          });
        }
      }
    });
  })
 });
  