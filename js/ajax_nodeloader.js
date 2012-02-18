(function ($) {
	// Original JavaScript code.
	$(document).ready(function(){  
		
		$('body').append('<div id="nodeloader-ajax-image">&nbsp;</div>');	  	  
		
		function nodeloader_click(){
			$('#nodeloader-ajax-image').css('display','block');

			// Unfortunally, we need to everride default explorer 7.0 behaviour
			// see: 
			// @link: http://stackoverflow.com/questions/7793728/get-a-relative-path-with-jquery-attr-property-with-ie7		
			if (($.browser.msie) && ($.browser.version == '7.0'))
			{
				var link_href = $(this).attr('href').replace('http://'+window.location.hostname,'').substr(1).replace('node/','');
			}
			else
			{
				var link_href = $(this).attr('href').substr(1).replace('node/','');
			}
			
			//console.log(link_href);
			

			//console.log();
			$.ajax({
				type: 'GET',
				url: 'node_load/node/'+link_href,				
				success: function(data){					
					//console.log(data);
					var node = eval('(' + data + ')');
					//console.log(node);
					$('#page-title').html(node.title);
					$('.field-item').html(node.body);
					$('#nodeloader-ajax-image').css('display','none');


					// Set up links for tabs Display and Edit
					if ($('ul.tabs.primary').length > 0) {
					$('ul.tabs.primary > li > a').each(function(){
						var new_href = $(this).attr('href').replace(/\d/g,node.nid);
						$(this).attr('href',new_href);
					});
					}

					// Bind new links click event
					//console.log($('a.nodeloader').length);



					if ($('a.nodeloader').length > 0) {							
						$(document).undelegate('a.nodeloader','click').delegate('a.nodeloader','click',nodeloader_click);
					}

				//console.log($('ul.tabs.primary > li > a').attr('href'));			
				},
			dataType: 'ajax'
			});

		return false;
		}
		
	    $(document).delegate('ul#main-menu-links a','click',nodeloader_click);
		
		//$('').click(nodeloader_click());
	});
})(jQuery);
