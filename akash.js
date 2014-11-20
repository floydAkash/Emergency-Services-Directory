//<script type="text/javascript">
//now what?
/*if they enter an orgId (we will get it next class through a search), we need to find:
    -What different areas of information the organization has (/Application/Tabs?orgId=x)
    -then, find each area on demand (each will need it's own call)
      General
        Path: ...ESD/{orgId}/General
      Locations
        Path: ...ESD/{orgId}/Locations
      Treatment
        Path: ...ESD/{orgId}/Treatments
      Training
        Path: ...ESD/{orgId}/Training
      Facilities
        Path: ...ESD/{orgId}/Facilities
      Equipment
        Path: ...ESD/{orgId}/Equipment
      Physicians
        Path: ...ESD/{orgId}/Physicians
      People
        Path: ...ESD/{orgId}/People
  */
var url = "http://people.rit.edu/dmgics/754/23/proxy.php";

/*This function is used to return a dropdown list of all the organization types from the RESTful service feed. */
function getOrgTypes() {
  var url = "http://people.rit.edu/dmgics/754/23/proxy.php";
  $.ajax({
    type: "GET",
    async: true,
    cache: false,
    url: url,
    data: {
      path: "/OrgTypes"
    },
    dataType: "xml",
    success: function (data, status) { //callback function
      var x = "";
      //Let's make sure we have valid data
      if ($(data).find('error').length != 0) {
        //do something here....
      } else {
        x = "<option value=''>All Organization Types</option>";
        //Iterate through all <row> elements
        //$(data).find("row")//equivalent
        $("row", data).each(function () {
          console.log(data);
          //x += "<option>"+$(this).find("type").text()+"</option>";
          x += "<option>" + $("type", this).text() + "</option>";
        });
        $("#orgType").html(x);
      }
    }
  });
}

/*This function returns a dropdown list of cities if any, for a particular selected state from the RESTful feed. There may be no cities listed for a state. */
function getCities(_arg) {
  console.log(_arg.value);
  var url = "http://people.rit.edu/dmgics/754/23/proxy.php";
  $.ajax({
    type: "GET",
    async: true,
    cache: false,
    url: url,
    data: {
      path: "/Cities?state=" + _arg.value
    },
    dataType: "xml",
    success: function (data, status) {
      var x = "";
      if ($(data).find('error').length != 0) {
        //do nothing..
      } else {
        console.log(data);
        x = "<option value=''>--City--</option>";
        $("row", data).each(function () {
          x += "<option>" + $("city", this).text() + "</option>";
        });

        /*
        var foo = document.getElementById("orgCitySearch");
        var cityDiv = document.getElementById("orgCitySearch");
        cityDiv.innerHTML = "";
        var citySel = document.createElement("select");
        citySel.setAttribute('id', 'citiesDiv');
        citySel.setAttribute('class', 'form-control ');
        citySel.innerHTML = x;
        cityDiv.appendChild(citySel);
        */
        $('#citiesDiv').html(x);
        $('#orgCitySearch').append($('#citiesDiv'));    
      }
    }
  });
}

/*This function returns all the Tab information for a particular organization name clicked. This function takes in organization ID as the parameter. */
function getTabs(orgId) {
  console.log(orgId);
  var url = "http://people.rit.edu/dmgics/754/23/proxy.php";
  $.ajax({
    type: "GET",
    async: true,
    cache: false,
    url: url,
    data: {
      path: "/Application/Tabs?orgId=" + orgId
    },
    dataType: "xml",
    success: function (data, status) {
      var x = "";
      var y = "";
      //Let's make sure we have valid data
      if ($(data).find('error').length != 0) {
        //do something here....
      } else {
        var x = '<div id="tabs">';
        x += '<ul>';
        $("Tab", data).each(function () { //Iterating through the Tab tag.
          console.log(data);
          x += '<li><a href="#' + $(this).text() + '" onclick="get' + $(this).text() + '(' + orgId + ');">' + $(this).text() + '</a></li>';
          y += '<div id="' + $(this).text() + '"></div>';
        });
        console.log(x);
        $('#dialog-modal').html(x + '</ul>' + y + '</div>'); //appending the content to the jQuery UI dialog modal div
        $('#tabs').tabs(); //using the jQuery UI tabs plugin to tabularize the data from the Tabs tag coming from the feed.
        getGeneral(orgId); //this displays the General information for the organization by default.
        $('#dialog-modal').dialog({ //effect for closing the dialog modal box.
          minHeight: 400,
          minWidth: 800,
          show: {
            effect: "blind",
            duration: 1000
          },
          hide: {
            effect: "explode",
            duration: 1000
          },
          buttons: {
            'Close': function () {
              $(this).dialog('close');
            }
          }
        });
        //$("#orgType").html(x);
      }
    }
  });
}

/*This function returns the General information of the Organization name selected. */
function getGeneral(orgId) {
  console.log("Inside getGeneral");
  console.log(orgId);
  var url = "http://people.rit.edu/dmgics/754/23/proxy.php";
  $.ajax({
    type: "GET",
    async: true,
    cache: false,
    url: url,
    data: {
      path: "/" + orgId + "/General"
    },
    dataType: "xml",
    success: function (data, status) {
      var x = "";
      //Let's make sure we have valid data
      if ($(data).find('error').length != 0) {
        //do something here....
      } else {
        console.log("hello general");
        console.log(data);
        //x='<p>';
        //x+='Hello Akash';
        //x+='</p>';
        x += '<p><span id="para">Name:</span> ' + $(data).find("name").text() + ' </p>';
        x += '<p><span id="para">Email:</span> ' + $(data).find("email").text() + ' </p>';
        x += '<p><span id="para">Website:</span> ' + $(data).find("website").text() + ' </p>';
        x += '<p><span id="para">Description:</span> ' + $(data).find("description").text() + ' </p>';
        x += '<p><span id="para">Number of Members:</span> ' + $(data).find("nummembers").text() + ' </p>';
        x += '<p><span id="para">No. of calls last year:</span> ' + $(data).find("numcalls").text() + ' </p>';
        x += '<p><span id="para">Service Area:</span> ' + $(data).find("serviceArea").text() + ' </p>';
        console.log(x);
        $('#General').html(x);
      }
    },
    error: function () {
      console.log("error");
    }
  });
}

/*This function returns the location information for the organization grouped by mailing, main and branch types.
  There is also a map displayed when the latitudes and the longitudes are present. gmap3 plugin was used for displaying the map.
  source: http://gmap3.net/en/catalog/18-data-types/latlng-67
*/
function getLocations(orgId) {
  console.log("inside getLocations");
  var url = "http://people.rit.edu/dmgics/754/23/proxy.php";
  $.ajax({
    type: 'get',
    data: {
      path: '/' + orgId + '/Locations'
    },
    url: url,
    success: function (data) {
      console.log(data);
      if ($(data).find('count').text() == 0) {
        $('#Locations').html("No locations available");
      } else {

        var x = '<h3>Location Information</h3><select id="locations" onchange="showLocation(this.value)">'; //this selected value is passed to a function to display location details.
        $('location', data).each(function () {
          x += '<option value="' + $(this).find('siteId').text() + '"> Location: ' + $(this).find('type').text() + '</option>';
        });
        x += '</select><br />';
        $('location', data).each(function () {
          x += '<table class="loc" id="site' + $(this).find('siteId').text() + '">';
          x += '<tr><td>Type: </td><td>' + $(this).find('type').text() + '</td></tr>';
          x += '<tr><td>Address: </td><td>' + $(this).find('address1').text() + '</td></tr>';
          x += '<tr><td>city: </td><td>' + $(this).find('city').text() + '</td></tr>';
          x += '<tr><td>state: </td><td>' + $(this).find('state').text() + '</td></tr>';
          x += '<tr><td>Zip: </td><td>' + $(this).find('zip').text() + '</td></tr>';
          x += '<tr><td>Phone: </td><td>' + $(this).find('phone').text() + '</td></tr>';
          x += '<tr><td>County: </td><td>' + $(this).find('countyName').text() + '</td></tr>';
          x += '</table>';
        });
        x += '<div id="mapHolder">';
        $('location', data).each(function () {
          x += '<div id="map_canvas' + $(this).find('siteId').text() + '" class="maps"></div>';
          console.log("here");
        });
        x += '</div><div style="clear:both"></div>';
        $('#Locations').html(x);
        $('location', data).each(function () {
          if ($(this).find('latitude').text() == 'null' && $(this).find('longitude').text() == 'null') {} else {
            var siteId = $(this).find('siteId').text();
            $('#map_canvas' + siteId).width("500px").height("250px").css("float", "right").css("top", "-220px").css("left", "25px").gmap3({
              marker: {
                latLng: [$(this).find('latitude').text(), $(this).find('longitude').text()]
              },
              map: {
                options: {
                  zoom: 8
                }
              }
            });
          }
        });
      }
      showLocation('1'); //show location for siteID 1 by default
    }
  });
}

/*This function is used to display the selected location option from the dropdown list in the locations tab
  The table displaying the current result and the map are hidden and the respective result and the map is displayed for 
  the selected option.
*/
function showLocation(which) {
  console.log(which);
  $('.loc').hide();
  $('.maps').hide();
  $('#site' + which).show();
  $('#map_canvas' + which).show();
}

/*This function displays the treatment information in case there is Treatment information associated with the organization 
  selected. Again, the data Table plugin is applied for this to paginate the results.
  source: http://datatables.net/release-datatables/examples/basic_init/themes.html
*/
function getTreatment(orgId) {
  console.log("inside getTreatment");
  var url = "http://people.rit.edu/dmgics/754/23/proxy.php";
  $.ajax({
    url: url,
    data: {
      path: "/" + orgId + "/Treatments"
    },
    success: function (responseData) {
      console.log(responseData);
      var x = "";
      //$("#tableOutput").html("");
      //check for errors
      if ($(responseData).find('error').length != 0) {
        console.log("Can't display");
      } else {
        x += "<table id='treatment-table'>";
        x += "<thead>";
        x += "<tr>";
        x += "<th>Type</th>";
        x += "<th>Abbreviation</th>";
        x += "</tr>";
        x += "</thead>";
        x += "<tbody>";
        $('treatment', responseData).each(function () {
          x += "<tr>";
          x += "<td>" + $('type', this).text() + "</td>";
          x += "<td>" + $('abbreviation', this).text() + "</td>";
          x += "</tr>";
        });
        x += "</tbody>";
        x += "</table>";
        //console.log(x);
        //$("#tableOutput").html(x);
        //$("#result-table").tablesorter({theme:"bootstrap"});
        $("#Treatment").html(x);
        $('#treatment-table').dataTable({
          "bJQueryUI": true,
          "sPaginationType": "full_numbers"
        });
      }
    },
    error: function () {
      console.log("Can't be displayed");
    }
  })
}

/*This function returns result of training information for the organization name selected*/
function getTraining(orgId) {
  console.log("inside getTraining");
  var url = "http://people.rit.edu/dmgics/754/23/proxy.php";
  //orgId = 2377;
  $.ajax({
    url: url,
    data: {
      path: "/" + orgId + "/Training"
    },
    success: function (responseData) {
      console.log(responseData);
      var x = "";
      //$("#tableOutput").html("");
      //check for errors
      if ($(responseData).find('error').length != 0) {
        console.log("Can't display");
      } else {
        x += "<table id='training-table'>";
        x += "<thead>";
        x += "<tr>";
        x += "<th>Type</th>";
        x += "<th>Abbreviation</th>";
        /* x += "<th>City</th>";
          x += "<th>County</th>";
          x += "<th>State</th>";
          x += "<th>Zip</th>";*/
        x += "</tr>";
        x += "</thead>";
        x += "<tbody>";
        $('training', responseData).each(function () {
          x += "<tr>";
          x += "<td>" + $('type', this).text() + "</td>";
          x += "<td>" + $('abbreviation', this).text() + "</td>";
          x += "</tr>";
        });
        x += "</tbody>";
        x += "</table>";
        //console.log(x);
        //$("#tableOutput").html(x);
        //$("#result-table").tablesorter({theme:"bootstrap"});
        $("#Training").html(x);
        $('#training-table').dataTable({
          "bJQueryUI": true,
          "sPaginationType": "full_numbers"
        });
      }
    },
    error: function () {
      console.log("Can't be displayed");
    }
  })
}

/*This function returns the Equipment information for the organization name selected. This is displayed in 
  the equipments tab.
*/
function getEquipment(orgId) {
  console.log("inside getEquipment");
  var url = "http://people.rit.edu/dmgics/754/23/proxy.php";
  //orgId = 350 ;
  $.ajax({
    url: url,
    data: {
      path: "/" + orgId + "/Equipment"
    },
    success: function (responseData) {
      console.log(responseData);
      var x = "";
      //$("#tableOutput").html("");
      //check for errors
      if ($(responseData).find('error').length != 0) {
        console.log("Can't display");
      } else {
        x += "<h3>Equipment</h3>";
        x += "<table id='equipment-table'>";
        x += "<thead>";
        x += "<tr>";
        x += "<th>Name</th>";
        x += "<th>Quantity</th>";
        x += "<th>Description</th>"
        x += "</tr>";
        x += "</thead>";
        x += "<tbody>";
        $('equipment', responseData).each(function () {
          x += "<tr>";
          x += "<td>" + $('type', this).text() + "</td>";
          x += "<td>" + $('quantity', this).text() + "</td>";
          x += "<td>" + $('description', this).text() + "</td>";
          x += "</tr>";
        });
        x += "</tbody>";
        x += "</table>";
        //console.log(x);
        //$("#tableOutput").html(x);
        //$("#result-table").tablesorter({theme:"bootstrap"});
        $("#Equipment").html(x);
        $('#equipment-table').dataTable({
          "bJQueryUI": true,
          "sPaginationType": "full_numbers",
        });
      }
    },
    error: function () {
      console.log("Can't be displayed");
    }
  })
}

/*This function returns the information of the people in the organization listed by location. When a 
  a location is selected, showPeople() is fired which displays the indormation of the people by the location.
*/
function getPeople(orgId) {
  console.log("inside getPeople");
  var url = "http://people.rit.edu/dmgics/754/23/proxy.php";
  $.ajax({
    type: 'get',
    data: {
      path: '/' + orgId + '/People'
    },
    url: url,
    success: function (data) {
      //console.log(data);
      var x = '';
      x += '<h3>People</h3><select onchange="showPeople(this.value)">';
      $('site', data).each(function () {
        x += '<option value="' + $(this).attr('siteId') + '">' + $(this).attr('address') + '</option>';
      });
      x += '</select><br />';
      if ($(data).find('personCount').text() == 0) {
        x += '<div id="peopleDiv' + $(this).attr('siteId') + '"><table class="ppl" id="peopleTable' + $(this).attr('siteId') + '">';
        x += '<thead><tr><th>No People Available</th></tr></thead><tbody>';
        x += '</tbody></table></div>';
        $('#People').html(x);
      } else {
        $('site', data).each(function () {
          if ($(this).attr('address') != 'null') {
            x += '<div class="pplDiv" id="peopleDiv' + $(this).attr('siteId') + '"><table class="ppl" id="peopleTable' + $(this).attr('siteId') + '">';
            x += '<thead><tr><th>Name</th><th>Role</th></tr></thead><tbody>';
            var currentPeople = $(this).find('person');
            $(currentPeople, data).each(function () {
              var name = $(this).find('lName').text();
              x += '<tr><td>' + name + '</td>';
              x += '<td>' + $(this).find('role').text() + '</td></tr>';
            });
            x += '</tbody></table></div>';
            $('#People').html(x);
          }
        });
      }
      //$('#people').empty();
      //$('#People').html(x+'</tbody></table>');
      $('.ppl').dataTable({
        "bJQueryUI": true,
        "sPaginationType": "full_numbers"
      });
      showPeople("1");
    }
  });
}

/*This function shows the information of the people for the siteId selected from the dropdown list.
  THis basically hides the previous information of people and shows the new information. 
*/
function showPeople(which) {
  console.log(which);
  $('.pplDiv').hide();
  $('#peopleDiv' + which).show();
}

/*This function returns the information of facilities for the organization selected.*/
function getFacilities(orgId) {
  console.log("Inside getFacilities");
  var url = "http://people.rit.edu/dmgics/754/23/proxy.php";
  //orgId = 2038;
  $.ajax({
    url: url,
    data: {
      path: "/" + orgId + "/Facilities"
    },
    success: function (responseData) {
      console.log(responseData);
      var x = "";
      //$("#tableOutput").html("");
      //check for errors
      if ($(responseData).find('error').length != 0) {
        console.log("Can't display");
      } else {
        x += "<h3>Facilities</h3>";
        x += "<table id='facilities-table'>";
        x += "<thead>";
        x += "<tr>";
        x += "<th>Name</th>";
        x += "<th>Quantity</th>";
        x += "<th>Description</th>"
        x += "</tr>";
        x += "</thead>";
        x += "<tbody>";
        $('facility', responseData).each(function () {
          x += "<tr>";
          x += "<td>" + $('type', this).text() + "</td>";
          x += "<td>" + $('quantity', this).text() + "</td>";
          x += "<td>" + $('description', this).text() + "</td>";
          x += "</tr>";
        });
        x += "</tbody>";
        x += "</table>";
        //console.log(x);
        //$("#tableOutput").html(x);
        //$("#result-table").tablesorter({theme:"bootstrap"});
        $("#Facilities").html(x);
        $('#facilities-table').dataTable({
          "bJQueryUI": true,
          "sPaginationType": "full_numbers"
        });
      }
    },
    error: function () {
      console.log("Can't be displayed");
    }
  })
}

/*This function returns the Physicians contact information in case there are physicians
  in the organization chosen.
*/
function getPhysicians(orgId) {
  console.log("inside getPhysicians");
  var url = "http://people.rit.edu/dmgics/754/23/proxy.php";
  //orgId = 126;
  $.ajax({
    url: url,
    data: {
      path: "/" + orgId + "/Physicians"
    },
    success: function (responseData) {
      console.log(responseData);
      var x = "";
      //$("#tableOutput").html("");
      //check for errors
      if ($(responseData).find('error').length != 0) {
        console.log("Can't display");
      } else {
        x += "<h3>Physicians with Admitting privileges</h3>"
        x += "<table id='physician-table'>";
        x += "<thead>";
        x += "<tr>";
        x += "<th>Name</th>";
        x += "<th>License</th>";
        x += "<th>Contact</th>"
        x += "</tr>";
        x += "</thead>";
        x += "<tbody>";
        $('physician', responseData).each(function () {
          x += "<tr>";
          x += "<td>" + $('fName', this).text() + " " + $('mName', this).text() + " " + $('lName', this).text() + "</td>";
          x += "<td>" + $('license', this).text() + "</td>";
          x += "<td>" + $('phone', this).text() + "</td>";
          x += "</tr>";
        });
        x += "</tbody>";
        x += "</table>";
        //console.log(x);
        //$("#tableOutput").html(x);
        //$("#result-table").tablesorter({theme:"bootstrap"});
        $("#Physicians").html(x);
        $('#physician-table').dataTable({
          "bJQueryUI": true,
          "sPaginationType": "full_numbers"
        });
      }
    },
    error: function () {
      console.log("Can't be displayed");
    }
  })
}

/*This function returns the form results and the results are displayed in the table which is styled and paginated by the
  data tables plugin. If there is any incorrect data in the form fields, the plugin will display 'No data available.'
*/
function showResults() {
  var url = "http://people.rit.edu/dmgics/754/23/proxy.php";
  $.ajax({
    url: url,
    data: {
      path: "/Organizations?" + $(".form-horizontal").serialize()
    }, //path:"/organizations"+$("#orgType").val()+......
    success: function (responseData) {
      console.log(responseData);
      var x = "";
      $("#tableOutput").html("");
      //check for errors
      if ($(responseData).find('error').length != 0) {
        console.log("Can't display");
      } else {
        x += "<table id='result-table'>";
        x += "<thead>";
        x += "<tr>";
        x += "<th>Type</th>";
        x += "<th>Name</th>";
        x += "<th>City</th>";
        x += "<th>County</th>";
        x += "<th>State</th>";
        x += "<th>Zip</th>";
        x += "</tr>";
        x += "</thead>";
        x += "<tbody>";
        $('row', responseData).each(function () {
          if ($('Name', this).text() == 'null') {

          }
          x += "<tr>";
          x += "<td>" + $('type', this).text() + "</td>";
          /*x += "<td id='ajax' onclick='getTabs(" + $(this).find('OrganizationID').text() + ");'>" + $('Name', this).text() + "</td>";*/
          x += "<td id='ajax'>" + "<a href='javascript:getTabs(" + $(this).find('OrganizationID').text() + ")'>" + $('Name', this).text() + "</a>" + "</td>";
          x += "<td>" + $('city', this).text() + "</td>";
          x += "<td>" + $('CountyName', this).text() + "</td>";
          x += "<td>" + $('State', this).text() + "</td>";
          x += "<td>" + $('zip', this).text() + "</td>";
          x += "</tr>";
        });
        x += "</tbody>";
        x += "</table>";
        //console.log(x);
        $("#tableOutput").html(x);
        //$("#result-table").tablesorter({theme:"bootstrap"});
        $('#result-table').dataTable({
          "bJQueryUI": true,
          "sPaginationType": "full_numbers"
        });
      }
    },
    error: function () {
      console.log("Can't be displayed");
    }
  })
}

//resets form information when the reset button is clicked.
function clearAll() {
  $('#tableOutput').html("");
  $('#result-table').html("");
  //$('#state').remove();
  $('#citiesDiv').remove();
}

/*Function executed onload */
$(function () {
  console.log('LocalStorage:' + localStorage.getItem('color'));
  $('#color').css("backgroundColor", localStorage.getItem('color'));
  getOrgTypes();
});