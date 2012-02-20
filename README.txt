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
