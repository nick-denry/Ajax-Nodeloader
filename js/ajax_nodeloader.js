(function ($) {
	// Original JavaScript code.
	$(document).ready(function(){

		$('body').append('<div id="nodeloader-ajax-image">&nbsp;</div>');

		//try to load hashtag page		
		if (window.location.hash != '')
		{
			var full_link = window.location.hash.substr(1);
			nodeloader_load(full_link,$('a[href="'+full_link+'"]').attr('rel'));
		}

		//function to load page
		function nodeloader_load(full_link,link_attr)
		{
			//Display loader image
			$('#nodeloader-ajax-image').css('display','block');
			//Get clean "some.html" or node number
			var link_href = full_link.substr(1).replace('node/','');
			//Make ajax call to module
			$.ajax({
				type: 'GET',
				url: 'node_load/node/'+link_href,
				success: function(data){
						//Process json answer
						var node = eval('(' + data + ')');

						//Set up values
						$('#page-title').html(node.title);

						//Set .home class for #page-title header
						$('#page-title').toggleClass('home',link_attr == 'home');

						//Set up body
						$('.field-item').html(node.body);

						//Hide liader image
						$('#nodeloader-ajax-image').css('display','none');

						// Set up drupal links for tabs Display and Edit
						if ($('ul.tabs.primary').length > 0) {
						$('ul.tabs.primary > li > a').each(function(){
							var new_href = $(this).attr('href').replace(/\d/g,node.nid);
							$(this).attr('href',new_href);
						});
						}

						//Change hash for user
						window.location.hash = full_link;
						
						//Set up .active class for current links
						$('a').removeClass('active');
						$('a[href="'+full_link+'"]').addClass('active');						


					// Bind dynamically adding links click event
					if ($('a.nodeloader').length > 0) {
						$(document).undelegate('a.nodeloader','click').delegate('a.nodeloader','click',nodeloader_click);
					}
				},
			dataType: 'ajax'
			});
		}


		function nodeloader_click(){

			// Store current link for ajax call while detecting home
			var current_link = $(this);

			// Unfortunally, we need to override default explorer 7.0 behaviour
			// see:
			// @link: http://stackoverflow.com/questions/7793728/get-a-relative-path-with-jquery-attr-property-with-ie7
			if (($.browser.msie) && ($.browser.version == '7.0'))
			{
				var full_link = $(this).attr('href').replace('http://'+window.location.hostname,'');
			}
			else
			{
				var full_link = $(this).attr('href');
			}

			//load node
			nodeloader_load(full_link,current_link.attr('rel'));

			// We don't really want default click
			return false;
		}


		// Delagate ajax loader to a.nodeloader links
		if ($('a.nodeloader').length > 0) {
			$(document).undelegate('a.nodeloader','click').delegate('a.nodeloader','click',nodeloader_click);
		}
	});
})(jQuery);