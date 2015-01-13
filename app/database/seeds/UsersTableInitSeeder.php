<?php

class UsersTableInitSeeder extends Seeder {

	public function run()
	{
		$usr = new User;
    $usr->username = 'initial-username-here';
    $usr->email = 'initial-user-email@sample.com-here';
    $usr->password = 'initial-user-password-here';
    $usr->password_confirmation = 'initial-user-password-here';
    $usr->confirmation_code = md5(uniqid(mt_rand(), true));

    Log::info('about to create user "'.$usr->username);

    if (!$usr->save()) {    # confide
      Log::info('Unable to create user (looser) '.$usr->username, (array)$usr->errors());
    } else {
      $uloga = Role::where('name', 'role-name-here')->first();    # entrust
      $usr->attachRole($uloga);

      //Log::info('Created user "'.$usr->username.'" <'.$usr->email.'>');
      Log::debug('Created user "'.$usr->username.'" <'.$usr->email.'>');
    }
	}

}
