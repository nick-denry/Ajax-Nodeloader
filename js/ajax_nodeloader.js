(function ($) {
  // Original JavaScript code.
  $(document).ready(function() {
    //Append nodeloader ajax image
    $('body').append('<div id="nodeloader-ajax-image">&nbsp;</div>');

    //try to load hashtag page
    if (window.location.hash != '') {
      var full_link = window.location.hash.substr(1);
      nodeloader_load(full_link, $('a[href="'+full_link+'"]').attr('rel'));
    }

    //function to load page
    function nodeloader_load(full_link, link_attr) {
      //Display loader image
      $('#nodeloader-ajax-image').css('display','block');
      //Get clean "some.html" or node number
      var link_href = full_link.substr(1);
      var link_prefix = Drupal.settings.pathPrefix == ""?"/":Drupal.settings.pathPrefix;
      //Make ajax call to module
      $.ajax({
        type: 'GET',
        url: link_prefix+'node_load/'+link_href,
        success: function(data) {
          //Process json answer
          //eval('(' + data + ')');
          var node = jQuery.parseJSON(data);

          //Set .home class for #page-title header
          $('#page-title').toggleClass('home', link_attr == 'home');

          //Set up content to targets or default places
          var ajaxNodeloaderDisplay = new Object ({title:'#page-title',
          content:'div.node > div.content'});

          try {
            var content_targets = jQuery.parseJSON(link_attr.replace(/\'/g, '"'));

            if ('title' in content_targets) {
              $(content_targets['title']).html(node.title);
              delete(node.title);
            }

            for(var target_name in content_targets) {
              $(content_targets[target_name]).html(node.fields[target_name]);
              // remove node filed to prevent
              // it's displaying in default section
              delete(node.fields[target_name]);
            }
          }
          catch(e) {
            // Do nothing
          }

          // Set up values
          // Title
          $(ajaxNodeloaderDisplay.title).html(node.title);

          // Set up node fields
          // Clean content
          $(ajaxNodeloaderDisplay.content).empty();

          // Set up fileds
          for(var node_element in node.fields) {
            if(node.fields[node_element] != null) {
              $(ajaxNodeloaderDisplay.content).append('<div class="field field-name-'+node_element.replace(/_/g,'-')+' field-label-hidden">'+node.fields[node_element]+'</div>');
            }
          }

          // Attach Drupal behaviors
          Drupal.attachBehaviors(ajaxNodeloaderDisplay.content);


          //Hide liader image
          $('#nodeloader-ajax-image').css('display','none');

          // Set up drupal links for tabs Display and Edit
          if ($('ul.tabs.primary').length > 0) {
            $('ul.tabs.primary > li > a').each(function() {
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

          // Google analytics tracking support for the "visited" page.
          // Works only with new version of Google Analytics code.

          // Check module settings first.
          if (Drupal.settings.ajax_nodeloader.use_google_tracking) {
            // Check if Analytics code available.
            if (typeof _gaq !== "undefined") {
              _gaq.push(['_trackPageview', full_link]);
            }
          }
        },
        dataType: 'ajax'
      });
    }


    function nodeloader_click() {
      // Store current link for ajax call while detecting home
      var current_link = $(this);

      // Unfortunally, we need to override default explorer 7.0 behaviour
      // see:
      // @link: http://stackoverflow.com/questions/7793728/get-a-relative-path-with-jquery-attr-property-with-ie7
      if (($.browser.msie) && ($.browser.version == '7.0')) {
        var full_link = $(this).attr('href').replace('http://'+window.location.hostname,'');
      }
      else {
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
