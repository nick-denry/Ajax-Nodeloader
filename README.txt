This simple module allows you load and display your site nodes without
reload pages via AJAX technology.

To load node without reloading page you should add class "nodeloader"
to link for node you want to load , i.e.:

<a href="/hode/1" class="nodeloader">Test link</a>

Alias path also supported:

<a href="/contacts.html" class="nodeloader">Test link</a>

Also module have patrial support for hashtag navigation, for example
link to page

http://yoursite.org/#/contacts.html

will load /contacts.html page instead of main page of "yoursite.org"

To make your menus load nodes via AJAX you can use module
http://drupal.org/project/menu_attributes

Added support for custom display-to targets selectors via rel attribute
and JSON. Example:

<a link="/node/2" rel={'title':'#selector1','body':'#selector2'}>
  This link shows your node #2 title in id="selector1" element, and your
  node #2 body in id="selector2" element
</a>

You can point title or node separately from each other, so

<a link="/node/2" rel={'title':'#selector1'}>
Only title custom target</a>

or

<a link="/node/2" rel={'body':'#selector2'}>
Only body custom target</a>

also allowed.

Custom target string must be single quoted for correct work.
