Ajax Nodeloader module allow you easy:

  - Load and display Drupal nodes via AJAX technology.
  - Use custom css selectors for display your content (body, title, etc).
  - Support loading any of node fields (D7).
  - Track your AJAXified links with Google Analytics.
  - Use hashtags to share your AJAXified links.

F.A.Q.

@see http://www.denry.ru/development/624-ajax-nodeloader-f-a-q-en/

Examples:

  1. To load node via AJAX you should add class "nodeloader" to link for node
     you want to load , i.e.:

     <a href="/node/1" class="nodeloader">Test link</a> for load /node/1.

     Alias path also supported:

     <a href="/contacts.html" class="nodeloader">Test link</a>

  2. Module have patrial support for hashtag navigation,
     for example link to page http://yoursite.org/#/contacts.html

     will load /contacts.html page instead of main page of "yoursite.org"

  3. To make your menus load nodes via AJAX you can use module
     http://drupal.org/project/menu_attributes

  4. Added support for custom display-to targets selectors via rel attribute
     and JSON. Example:

     <a href="/node/2" class="nodeloader" rel={'title':'#selector1',
     'body':'#selector2'}>This link shows your node #2 title in id="selector1"
      element, and your node #2 body in id="selector2" element</a>

     You can point title or node separately from each other, so

     <a href="/node/2" class="nodeloader"
     rel={'title':'#selector1'}>Only title custom target</a>

     or

     <a href="/node/2" class="nodeloader"
     rel={'body':'#selector2'}>Only body custom target</a>

     also allowed. Custom target string must be single quoted for correct work.

    5. Enable or disable Google Analytics tracking with Ajax Nodeloader
       in your admin panel.

    6. Drupal 7 version now can load and display all node fields instead only
       body field by default.

       You can load field to custom selector use the same syntax.
       For example, if you have custom fields "field_text" and "field_price"
       you can load them by this way:

       <a href="/node/2" class="nodeloader" rel="{'title':'#some-id-selector1',
       'body':'.someclass span','field_text':'#some-id-selector2',
       'field_price':'#selector3'}">Load title, body and custom fields link</a>

Module will support fields labels soon.
