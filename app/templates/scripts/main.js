/* jshint devel:true */
console.log('\'Allo \'Allo!');

var comp = new RegExp('^' + location.protocol + '//' + location.host);
var theme = {};

theme.getResponseContent = function(response){
	var $content = $(response).find('#content');
	var content = '';

	if($content.length){
		content = $content.html();
	}
	else if($.trim(response)){
		content = response;
	}

	return content
}

theme.ajaxUrl = function(href, selector){
	$.ajax({
		url: href,
		success: function(response){
			
			var content = theme.getResponseContent(response);

			if(content){
				$(selector).html(content);
				if(href!=window.location){
					window.history.pushState({path:href},'',href);
				}
			}
		}
	});
}

jQuery(document).ready(function($){

	$('body').on('click', 'a', function(event){
		event.preventDefault();

		var $this = $(this);
		var href = $.trim($this.attr('href'));

		if(href && !comp.test(href) && href.substr(0, 1) != '#'){
			theme.ajaxUrl(href, '#content');

			console.log(href, 'asd');
		}
		else{
			console.log(href, 'zxc');

			return true;
		}
	});

	$(window).bind('popstate', function() {
		theme.ajaxUrl(location.pathname, '#content', false);
	});


});


