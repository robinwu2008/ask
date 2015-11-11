/*
 * jGFeed 1.0 - Google Feed API abstraction plugin for jQuery
 *
 * Copyright (c) 2009 jQuery HowTo
 *
 * Licensed under the GPL license:
 *   http://www.gnu.org/licenses/gpl.html
 *
 * URL:
 *   http://jquery-howto.blogspot.com
 *
 * Author URL:
 *   http://me.boo.uz
 *
 */
(function($){
  $.extend({
    jGFeed : function(url, fnk, num, key){
      // Make sure url to get is defined
      if(url == null) return false;
      // Build Google Feed API URL
      var gurl = "/readNews?id="+url;
      if(num != null) gurl += "&num="+num;
      if(key != null) gurl += "&key="+key;
      // AJAX request the API
      $.getJSON(gurl, function(data){
        if(typeof fnk == 'function')
                  fnk.call(this, data);
                else
                  return false;
      });
    }
  });
})(jQuery);