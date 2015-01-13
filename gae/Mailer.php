<!-- /vendor/laravel/framework/src/Illuminate/Mail/Mailer.php -->

<?php namespace Illuminate\Mail;

require_once 'google/appengine/api/mail/Message.php';
use google\appengine\api\mail\Message as GAEMessage;

#
#...
#

class Mailer {

#
#...
#

	public function send($view, array $data, $callback)
	{
		#
		#...
		#

		$message = $message->getSwiftMessage();

		///original
		// return $this->sendSwiftMessage($message);

		//GAE:
		try {
	    $emails = implode(', ', array_keys((array) $message->getTo()));
	    $subj = $message->getSubject();
	    $body = $message->getBody();
	    $mail_options = [
	    		"sender" => "GAE-app-admin-email-address-here",
	        "to" => $emails,
	        "subject" => $subj,
	        "htmlBody" => $body
	    ];
	    $gae_message = new GAEMessage($mail_options);
	    return $gae_message->send();
		} catch (InvalidArgumentException $e) {
	    syslog(LOG_WARNING, "Exception sending mail: " . $e);
	    return false;
		}
	}

	#
	#...
	#...
	#

}
