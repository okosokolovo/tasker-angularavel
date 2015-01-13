<?php

class AuthController extends BaseController {


  public function login()
  {
    // Clockwork::startEvent('user.login', 'user login, relations load');
    if(Auth::attempt(array('email' => Input::json('email'), 'password' => Input::json('password'))))
    //if(Auth::attempt(array('email' => Input::json('email'), 'password' => Input::json('password')), true))  // remember me
    {
      $user = User::with('clients', 'projects', 'tasks.tags', 'subtasks', 'roles', 'profiles')->where('id', Auth::user()->id)->first();
      // Clockwork::endEvent('user.login');
      // Clockwork::info($user);
      return Response::json($user);
    } else {
      // Clockwork::endEvent('user.login');
      return Response::json(array('flash' => 'Invalid username or password'), 500);
    }
  }

  // public function status() {
  //   return Response::json(Auth::check());
  // }


  public function ggl()
  {
    // Clockwork::startEvent('ggl.login', 'ggl login');
    
    $userdata = Input::get('user');
    $uid = $userdata['id'];
    if ( ($uid == '0') || (empty($uid)) )
    {
      // Clockwork::endEvent('ggl.login');
      return Response::json(array('flash' => 'some error in ggl login!'), 500);
    }
    $profile = Profile::whereUid($uid)->first();
    if ( empty($profile) )
    {
      $user = User::whereEmail($userdata['email'])->first();
      if ( empty($user) )
      {
        $temp_pwd = str_random(20);
        $user = new User;
        $user->email = $userdata['email'];
        $user->username = $userdata['given_name'];
        $user->password = $temp_pwd;
        $user->password_confirmation = $temp_pwd;
        $user->confirmed = 1;
        $user->save();
        // send temp pwd, username by mail; instruct to update tasker profile...
      }

      $profile = new Profile;
      $profile->uid = $uid;
      $profile->provider = 'google';
      $profile = $user->profiles()->save($profile); // attach model

    }
    $profile->access_token = Input::get('token');
    $profile->save();

    $user = $profile->juzer;   // dyn prop
    
    Auth::login($user);
    $ggluser = User::with('clients', 'projects', 'tasks.tags', 'subtasks', 'roles', 'profiles')->where('id', Auth::user()->id)->first();
    // Clockwork::endEvent('ggl.login');
    // Clockwork::info($profile);
    return Response::json($ggluser);    // success ('Logged in with Google!')
  }


  public function fb()
  {
    // Clockwork::startEvent('fb.login', 'fb login');
    $facebook = new Facebook(Config::get('facebook'));
    $params = array(
      'redirect_uri' => url('/fb/callback'),
      'scope' => 'email'
    );
    return rawurldecode($facebook->getLoginUrl($params));
  }

  public function fb_cb()
  {
    // Clockwork::startEvent('fb.login', 'fb login');
    $code = Input::get('code');
    if ( strlen($code) == 0 ) 
    {
      // Clockwork::endEvent('fb.login');
      return Response::json(array('flash' => 'Error in communication with Facebook!'), 500);
    }

    $facebook = new Facebook(Config::get('facebook'));
    $uid = $facebook->getUser();
    if ( ($uid == '0') || (empty($uid)) )
    {
      // Clockwork::endEvent('fb.login');
      return Response::json(array('flash' => 'some error in fb login!'), 500);
    }
    $me = $facebook->api('/me');

    $profile = Profile::whereUid($uid)->first();
    if ( empty($profile) )
    {

      $user = User::whereEmail($me['email'])->first();
      if ( empty($user) )
      {
        $temp_pwd = str_random(20);
        $user = new User;
        $user->email = $me['email'];
        $user->username = $me['first_name'];
        $user->password = $temp_pwd;
        $user->password_confirmation = $temp_pwd;
        $user->confirmed = 1;
        $user->save();
        
        // send temp pwd, username by mail; instruct to update tasker profile...
      }
      
      $profile = new Profile;
      $profile->uid = $uid;
      $profile->provider = 'facebook';
      $profile = $user->profiles()->save($profile); // attach model

    }
    $profile->access_token = $facebook->getAccessToken();
    $profile->save();

    $user = $profile->juzer;   // dyn prop
    Auth::login($user);
    $brutto_user = User::with('clients', 'projects', 'tasks.tags', 'subtasks', 'roles', 'profiles')->where('id', Auth::user()->id)->first();

    $brutto_user->zoc = 'fb';
    return View::make('t3r')->with('brutto_user', json_encode($brutto_user->toArray()));    // success
  }


  public function git()
  {
    // Clockwork::startEvent('git.login', 'git login');

    $code = Input::get('code');
    $git = OAuth::consumer('GitHub');
    if ( !empty($code) )
    {
      $token = $git->requestAccessToken($code);
      $trocken = $git->getStorage()->retrieveAccessToken($git->service());
      $trock = $trocken->getAccessToken();

      $profil = json_decode($git->request('user'), true);   //'true' - conv ret obj to assoc arr
      // Clockwork::info($profil);

      $mejl = json_decode($git->request('user/emails'), true);
      // Clockwork::info($mejl);

      $uid = strval($profil['id']);
      if ( ($uid == '0') || (empty($uid)) )
      {
        // Clockwork::endEvent('git.login');
        // return View::make('t3r')->with('flash', 'some error in git login!');
        return Response::json(array('flash' => 'some error in git login!'), 500);
      }
      $profile = Profile::whereUid($uid)->first();
      if ( empty($profile) )
      {

        $user = User::whereEmail($mejl[0])->first();

        if ( empty($user) )
        {
          $temp_pwd = str_random(20);
          $user = new User;
          $user->email = $mejl[0];
          $user->username = $profil->login;
          $user->password = $temp_pwd;
          $user->password_confirmation = $temp_pwd;
          $user->confirmed = 1;
          $user->save();
          // send temp pwd, username by mail; instruct to update tasker profile...
        }

        $profile = new Profile;
        $profile->uid = $uid;
        $profile->provider = 'github';
        $profile = $user->profiles()->save($profile); // attach model
      }
      $profile->access_token = $trock;
      $profile->save();

      $user = $profile->juzer;    // dyn prop
      Auth::login($user);

      $brutto_user = User::with('clients', 'projects', 'tasks.tags', 'subtasks', 'roles', 'profiles')->where('id', Auth::user()->id)->first();
      $brutto_user->zoc = 'git';

      // Clockwork::endEvent('git.login');
      // Clockwork::info($profile);
      //return Response::json($user);       // success ('Logged in with GitHub!')
      return View::make('t3r')->with('brutto_user', json_encode($brutto_user->toArray()));
    }
    else
    {
      return rawurldecode($git->getAuthorizationUri());
    }
  }


  public function twt() //OAuth1
  {
    // Clockwork::startEvent('twt.login', 'twt login');

    $ot = Input::get('oauth_token');
    $ov = Input::get('oauth_verifier');
    $twt = OAuth::consumer('Twitter');
    // Clockwork::info($ot);
    // Clockwork::info($ov);
    // Clockwork::info($twt);

    if ( !empty($ot) && !empty($ov) )
    {
      // (step3)
      $token = $twt->getStorage()->retrieveAccessToken($twt->service());
      $ots = $token->getRequestTokenSecret();
      $ttock = $twt->requestAccessToken($ot, $ov, $ots);
      $to = $ttock->getAccessToken();
      $tos = $ttock->getAccessTokenSecret();

      $account = json_decode( $twt->request('account/verify_credentials.json'));
      $uid = $account->id_str;
      $name = explode(' ', $account->name);
      if ( ($uid == '0') || (empty($uid)) )
      {
        // Clockwork::endEvent('twt.login');
        return Response::json(array('flash' => 'some error in twt login!'), 500);
      }

      $profile = Profile::whereUid($uid)->first();
      if ( empty($profile) )
      {
        $mejl = str_random(10).'@temp.com';
        $user = User::whereEmail($mejl)->first();
        
        if ( empty($user) )
        {
          $temp_pwd = str_random(20);
          $user = new User;
          $user->email = $mejl;
          $user->username = $name[0];
          $user->password = $temp_pwd;
          $user->password_confirmation = $temp_pwd;
          $user->confirmed = 1;
          $user->save();
          // user profile update warning...
        }

        $profil = new Profile();
        $profil->uid = $uid;
        $profil->provider = 'twitter';
        $profile = $user->profiles()->save($profil);
      }
      $profile->access_token = $to;
      $profile->access_token_secret = $tos;
      $profile->save();

      $user = $profile->juzer;    // dyn prop
      Auth::login($user);
      $brutto_user = User::with('clients', 'projects', 'tasks.tags', 'subtasks', 'roles', 'profiles')->where('id', Auth::user()->id)->first();
      $brutto_user->zoc = 'twt';

      // Clockwork::endEvent('twt.login');
      // Clockwork::info($profile);
      // Clockwork::info($user);
      return View::make('t3r')->with('brutto_user', json_encode($brutto_user->toArray()));    // success
    }
    else
    {
      // extra request needed for oauth1 to request a request token (step1)
      $token = $twt->requestRequestToken();
      
      // (step2) get Authorization Uri sending the request token
      $url = $twt->getAuthorizationUri(['oauth_token' => $token->getRequestToken()]);
      // Clockwork::info($token);
      // Clockwork::info($url);

      return rawurldecode($url);
    }
  }

}
