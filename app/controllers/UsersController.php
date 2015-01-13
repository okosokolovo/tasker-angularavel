<?php

class UsersController extends \BaseController {

  
  protected $user;

  public function __construct(User $user)
  {
    $this->user = $user;
  }


  public function index()
  {
    //
  }


  public function store()
  {
    /// validate...

    $this->user = new User;
    $this->user->username = \Input::get('username');
    $this->user->email = \Input::get('email');
    //$this->user->password = Hash::make(\Input::get('password'));
    $this->user->password = \Input::get('password');              // confide
    $this->user->password_confirmation = \Input::get('password_confirmation');  // confide

    if (Request::ajax())
    {
      if(User::where('email', '=', $this->user->email)->first())  // trivia, temp
      {
        return Response::json(array('flash' => 'Invalid credentials'));
      } 
      elseif($this->user->save())     // confide
      {
        return Response::json($this->user);
      } 
      else {
          return Response::json(array('flash' => 'database error'), 500);
        }
    }
  }


  public function show($id)
  {
    //
  }


  public function update($id)
  {
    /// validate, ignore current...

    $current = $this->user->find($id);
    $current->avatar = \Input::get('avatar');
    //$current->password = Hash::make(\Input::get('password'));
    $current->password = \Input::get('password');             // confide
    $current->password_confirmation = \Input::get('password_confirmation'); // confide
    $current->email = \Input::get('email');

    $proba = User::where('email', '=', \Input::get('email'))->first();  // trivia, temp

    if (Request::ajax())
    {
      if($proba && ($proba->id != $id))
      {
        return Response::json(array('flash' => 'Invalid credentials'));
      } 
      // elseif($current->save())
      elseif($current->updateUniques())   // confide
      {
        return Response::json($current);
      } 
      else {
          return Response::json(array('flash' => 'database error'), 500);
        }
    }
  }


  public function destroy($id)
  {
    //
  }

}
