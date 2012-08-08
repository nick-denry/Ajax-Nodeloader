(function ($) {
  // Original JavaScript code.
  $(document).ready(function() {
    // Append nodeloader ajax image.
    $('body').append('<div id="ajax-nodeloader-image">&nbsp;</div>');

    // If enabled, use advanced navigation.
    // HTML 5 History support.
    // We'll use hashtag navigation for obsolete browsers,
    // that don't support HTML5 History API.

    if (Drupal.settings.ajax_nodeloader.advanced_navigation) {
      if (!!(window.history && history.pushState)) {
        $(window).bind('popstate',function(event){
          full_link = window.location.pathname == '/' ? Drupal.settings.ajax_nodeloader.site.front_page : window.location.pathname;
          nodeloader_load(full_link, $('a[href="'+full_link+'"]').attr('rel'));
        });
      }
      else {
        // Hashtag navigation for browsers that don't support HTMLL5 History API.
        Drupal.settings.ajax_nodeloader.prev_hash = '';

        setInterval(function() {
          if (typeof(Drupal.settings.ajax_nodeloader.prev_hash) !== 'undefined' && window.location.hash !== Drupal.settings.ajax_nodeloader.prev_hash) {
            if (window.location.hash == '') {
              var full_link = window.location.pathname == '/'?Drupal.settings.ajax_nodeloader.site.front_page:window.location.pathname;
            }
            else {
              var full_link = window.location.hash.substr(1);
            }
            Drupal.settings.ajax_nodeloader.prev_hash = window.location.hash;

            nodeloader_load(full_link, $('a[href="'+full_link+'"]').attr('rel'));
          }
        },1000);
      }
    }

    // Function to load page.
    function nodeloader_load(full_link, link_attr) {
      // Display loader image.
      $('#ajax-nodeloader-image').css('display','block');
      // Get clean "some.html" or node number.
      var link_href = full_link.substr(1).replace(Drupal.settings.pathPrefix,'');
      // Create link prefix starts from slash.
      var link_prefix = '/'+Drupal.settings.pathPrefix;
      // If we're using non-clean urls,
      // parse get params and use q as loaded url.
      // TODO: Test with multilanguage sites.
      if (link_href.indexOf('?q=') != -1) {
        var get_params_string = link_href.split('?',2)[1];
        var get_params_list = get_params_string.split('&');
        var get_params = {};
        for (var i = 0; i < get_params_list.length; i++) {
          var get_parameter = get_params_list[i].split("=");
          get_params[get_parameter[0]] = get_parameter[1];
        }
        // Set q as request URL.
        link_href = get_params.q;
        link_prefix = '?q=';
      }

      // Make ajax call to module.
      $.ajax({
        type: 'GET',
        url: link_prefix+'ajax_nodeloader/'+link_href,
        success: function(data) {
          // Process json answer.
          // eval('(' + data + ')');
          var node = jQuery.parseJSON(data);

          // Set up content to targets or default places.
          var ajaxNodeloaderDisplay = new Object ({title:'#page-title',
          content:'div.node > div.content'});

          // If set, get default css targets from Drupal settings.
          if (Drupal.settings.ajax_nodeloader) {
            ajaxNodeloaderDisplay.title = Drupal.settings.ajax_nodeloader.display_title;
            ajaxNodeloaderDisplay.content = Drupal.settings.ajax_nodeloader.display_content;
          }

          // Set .home class for #page-title header.
          $(ajaxNodeloaderDisplay.title).toggleClass('home', link_attr == 'home');

          // Set document title, if enabled.
          if (Drupal.settings.ajax_nodeloader.set_title) {
            document.title = node.title + ' | ' + Drupal.settings.ajax_nodeloader.site.name;
          }

          try {
            var content_targets = jQuery.parseJSON(link_attr.replace(/\'/g, '"'));

            if ('title' in content_targets) {
              $(content_targets['title']).html(node.title);
              delete(node.title);
            }

            for(var target_name in content_targets) {
              $(content_targets[target_name]).html(node.fields[target_name]);
              // Remove node filed to prevent it's displaying in default section.
              delete(node.fields[target_name]);
            }
          }
          catch(e) {
            // Do nothing.
          }

          // Set up values.
          // Title.
          $(ajaxNodeloaderDisplay.title).html(node.title);

          // Set up node fields.
          // Clean content.
          $(ajaxNodeloaderDisplay.content).empty();

          // Set up fileds.
          for(var node_element in node.fields) {
            if(node.fields[node_element] != null) {
              $(ajaxNodeloaderDisplay.content).append('<div class="field field-name-'+node_element.replace(/_/g,'-')+' field-label-hidden">'+node.fields[node_element]+'</div>');
            }
          }

          // Attach Drupal behaviors.
          Drupal.attachBehaviors(ajaxNodeloaderDisplay.content);

          // Set up drupal links for tabs Display and Edit.
          if ($('ul.tabs.primary').length > 0) {
            $('ul.tabs.primary > li > a').each(function() {
              var new_href = $(this).attr('href').replace(/\d+/g,node.nid);
              $(this).attr('href',new_href);
            });
          }


          // If enabled, use advanced navigation.
          if (Drupal.settings.ajax_nodeloader.advanced_navigation) {
            if (!!(window.history && history.pushState)) {
              if ((window.history.state == null) || (window.history.state.path !== full_link)) {
                if (full_link == Drupal.settings.ajax_nodeloader.site.front_page) {
                  full_link = '/';
                }
                history.pushState({path: full_link}, '', full_link);
              }
            }
            else {
              if (full_link != Drupal.settings.ajax_nodeloader.site.front_page) {
                // Change hash for user.
                window.location.hash = full_link;
                // Store previous hash for advanced hashtag navigation.
                Drupal.settings.ajax_nodeloader.prev_hash = window.location.hash;
              }
              else {
                // Clean previous hashtag for main page.
                Drupal.settings.ajax_nodeloader.prev_hash = '';
              }
            }
          }

          // Set up .active class for current links.
          $('a').removeClass('active');
          $('a[href="'+full_link+'"]').addClass('active');

          // Bind dynamically adding links click event.
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

          // Hide loader image.
          if (Drupal.settings.ajax_nodeloader.ajax_loader_delay != 0) {
            setTimeout(function() {
              $('#ajax-nodeloader-image').css('display','none');
            },Drupal.settings.ajax_nodeloader.ajax_loader_delay);
          } else {
            $('#ajax-nodeloader-image').css('display','none');
          }
        },
        dataType: 'ajax'
      });
    }


    function nodeloader_click() {
      // Store current link for ajax call while detecting home.
      var current_link = $(this);

      // Unfortunally, we need to override default explorer 7.0 behaviour.
      // See:
      // @link: http://stackoverflow.com/questions/7793728/get-a-relative-path-with-jquery-attr-property-with-ie7
      if (($.browser.msie) && ($.browser.version == '7.0')) {
        var full_link = $(this).attr('href').replace('http://'+window.location.hostname,'');
      }
      else {
        var full_link = $(this).attr('href');
      }

      // Load node.
      nodeloader_load(full_link,current_link.attr('rel'));

      // We don't really want default click.
      return false;
    }


    // Delagate ajax loader to a.nodeloader links.
    if ($('a.nodeloader').length > 0) {
      $(document).undelegate('a.nodeloader','click').delegate('a.nodeloader','click',nodeloader_click);
    }
  });
})(jQuery);
