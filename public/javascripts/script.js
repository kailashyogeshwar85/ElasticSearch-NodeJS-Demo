(function (){
	$('form').on('submit', function (e){
		e.preventDefault();
		return false;
	})

	$('#search').on('keyup', function (){
		makeApiCall($(this).val());
		getSuggestion($(this).val());
	})

	function makeApiCall(searchText) {
		$.ajax({
				url: '/api/search',
				type: 'POST',
				dataType: 'json',
				data: { 'search': searchText },
		})
		.then(function (data){
			$('#took').text(data.time + ' ms')
			$('#total').text(data.total);
			$("div.ui.list .item").remove()
			$("div.ui.list").append(
				data.results.map(function (result){
					var div = $('<div />',{ class: 'item'});
					return div.text(result._source.name);				
				})
			)
		})
		.fail(function (err){
			console.warn('err ',err);
		})				
	}

	var getSuggestion = function (val){
		$.ajax({
			url: '/api/suggest?search=' + val,
			type: 'GET',
			dataType: 'json',
		})
		.then(function(data) {
			console.log("success ",data);
		})
		.fail(function() {
			console.log("error");
		})
	}
})()

