var netID = $('#netID')
var username = $('#username')

var HttpRequest = function() {
    this.get = function(Url, Callback) {
	var HttpRequest = new XMLHttpRequest();
	HttpRequest.onreadystatechange = function() {
	    if (HttpRequest.readyState == 4 && HttpRequest.status == 200)
		Callback(HttpRequest.responseText);
	}

	HttpRequest.open( "GET", Url, true );
	HttpRequest.send( null );
    }
}

httpClient = new HttpRequest()

netID.change(function(){
    $('#username').val('');
    if (netID.val() == ''){
	$('#provisionButton').hide()
	$('#changePassword').hide()
	$('#provisionAccount').hide()
    }

    var url = '/ums/validate/netID/' + netID.val()
    httpClient.get( url, function(result){
	if( result == 'false' ) {
	    netID.addClass('errorClass')
	    $('#provisionButton').hide()

	    $('#changePassword').hide()
	    $('#provisionAccount').hide()
	}

	if( result == 'true' ) {
	    netID.removeClass('errorClass')
	    var url2 = '/ums/validate/exists/byNetID/' + netID.val()
	    httpClient.get( url2, function(result){
		if( result == 'false' ){
		    $('#provisionAccount').show()
		    $('#provisionButton').hide()
		    $('#usernameTaken').hide()
		    $('#changePassword').hide()
		}

		if( result == 'true' ){
		    $('#changePassword').show()
		    $('#provisionAccount').hide()
		}

	    })
	}

    })
})

username.change(function(){
    var url = '/ums/validate/uname/' + username.val()
    if (username.val() == ''){
	$('#provisionButton').hide()
	$('#usernameTaken').show()
    }
    httpClient.get( url, function(result){
	if( result == 'false' ) {
	    username.addClass('errorClass')

	    $('#provisionButton').hide()
	}

	if( result == 'true' ) {
	    username.removeClass('errorClass')
	    var url2 = '/ums/validate/exists/byUID/' + username.val()
	    httpClient.get( url2, function(result){
		if( result == 'false' ){
		    $('#provisionButton').show()
		    username.removeClass('errorClass')
		    $('#usernameTaken').hide()
		}

		if( result == 'true' ){
		    $('#provisionButton').hide()
		    username.addClass('errorClass')
		    $('#usernameTaken').show()
		}

	    })
	}

    })
})

netIDPrev = ""
usernamePrev = ""

function changeListener(){
    if( netID.val() != netIDPrev ) {
	netIDPrev = netID.val()
	netID.change()
    }

    if( username.val() != usernamePrev ) {
	usernamePrev = username.val()
	username.change()
    }
}

function changePassword(){
    var url = '/ums/changePassword/' + netID.val()
    httpClient.get( url, function(result){
	if( result == 'true' ){
	    $('#success').show()
	    $('#fail').hide()
	} else {
	    $('#success').hide()
	    $('#fail').show()
	}
    })
}

function createAccount(){
    $('#provisionButton').prop("disabled" ,true);
    var url = '/ums/provision/' + netID.val() + "/" + username.val()
    httpClient.get( url, function(result){
	if( result == 'true' ){
	    $('#success').show()
	    $('#fail').hide()
	    alert("Please check your UT Dallas email for further Instructions");
	} else {
	    $('#provisionButton').prop("disabled", false);
	    $('#success').hide()
	    $('#fail').show()
	}
    })
}

setInterval(changeListener, 500);

$('#changePassword').hide()
$('#provisionAccount').hide()
$('#success').hide()
$('#fail').hide()
