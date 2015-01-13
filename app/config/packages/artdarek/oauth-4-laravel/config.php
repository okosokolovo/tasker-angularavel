<?php 

return array( 
	
	/*
	|--------------------------------------------------------------------------
	| oAuth Config
	|--------------------------------------------------------------------------
	*/

	/**
	 * Storage
	*/
	'storage' => 'Session', 

	/**
	 * Consumers
	*/
	'consumers' => array(

		/**
		 * Facebook
		*/
    'Facebook' => array(          // separate config
      'client_id'     => '',
      'client_secret' => '',
      'scope'         => array(),
    ),		
    /**
     * Google
    */
    'Google' => array(
      'client_id'     => 'GAE-app-client-id-here',
      'client_secret' => 'GAE-app-client-secret-here',
      'scope'         => array('email', 'profile')
    ),
    /**
     * Github
    */
    'GitHub' => array(
      'client_id'     => 'GitHub-app-client-id-here',
      'client_secret' => 'GitHub-app-client-secret-here',
      'scope'         => array('user')
    ),
    /**
    * Twitter
    */
    'Twitter' => array(
      'client_id'     => 'Twitter-app-consumer-key-here',
      'client_secret' => 'Twitter-app-consumer-secret-here',
      'scope'         => array()
    ),
	)

);