<!-- /vendor/facebook/php-sdk/src/base_facebook.php -->

<?php

#
#...
#

if (!function_exists('curl_init')) {
  ///original
  //throw new Exception('Facebook needs the CURL PHP extension.');

  require_once app_path() . '/helpers/Purl.php';  #GAE
}

#
#...
#

class FacebookApiException extends Exception
{

#
#...
#...
#

}
