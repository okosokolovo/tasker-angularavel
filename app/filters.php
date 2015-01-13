<?php

/*
|--------------------------------------------------------------------------
| Application & Route Filters
|--------------------------------------------------------------------------
|
| Below you will find the "before" and "after" events for the application
| which may be used to do any work before or after a request into your
| application. Here you may also register your custom route filters.
|
*/

App::before(function($request)
{
  ///// site-wide SSL **
  // if(!Request::secure())
  // {

  //   return Redirect::secure(Request::getRequestUri());
  // }

  // if(App::environment()=='production')
  // {
  //   if(!Request::secure())
  //   {
  //     return Redirect::secure(Request::getRequestUri());
  //   }
  // }
  /////
});


App::after(function($request, $response)
{
  //
});


/*
|--------------------------------------------------------------------------
| Authentication Filters
|--------------------------------------------------------------------------
|
| The following filters are used to verify that the user of the current
| session is logged into this application. The "basic" filter easily
| integrates HTTP Basic authentication for quick, simple checking.
|
*/

Route::filter('auth', function()
{
	//if (Auth::guest()) return Redirect::guest('login');
  if (Auth::guest()) return Redirect::to('/');
});


Route::filter('auth.basic', function()
{
	return Auth::basic();
});

/*
|--------------------------------------------------------------------------
| Guest Filter
|--------------------------------------------------------------------------
|
| The "guest" filter is the counterpart of the authentication filters as
| it simply checks that the current user is not logged in. A redirect
| response will be issued if they are, which you may freely change.
|
*/

Route::filter('guest', function()
{
	if (Auth::check()) return Redirect::to('/');
});

/*
|--------------------------------------------------------------------------
| CSRF Protection Filter
|--------------------------------------------------------------------------
|
| The CSRF filter is responsible for protecting your application against
| cross-site request forgery attacks. If this special token in a user
| session does not match the one given in this request, we'll bail.
|
*/

Route::filter('csrf', function()
{
	if (Session::token() != Input::get('_token'))
	{
		throw new Illuminate\Session\TokenMismatchException;
	}
});

/*
|--------------------------------------------------------------------------
| site-wide SSL filter (attach to routes), or App before filter **
|--------------------------------------------------------------------------
*/

// Route::filter('force.ssl', function() 
// {
//   if(!Request::secure())
//   {
//     return Redirect::secure(Request::getRequestUri());
//   }
// });


/*
|--------------------------------------------------------------------------
| other route filters
|--------------------------------------------------------------------------
*/

Route::filter('taskeditable', function() {
  $user = Auth::user();
  // if (!$user->ability('Project Tasker', 'can_edit', true))
  if ( !($user->hasRole('Project Tasker') || $user->hasRole('Project Admin')) )
  {
    //return Response::json(array('flash' => 'No Authorisation!'), 403);
    return Response::json(array('flash' => 'No Authorisation!'));
  }
});

Route::filter('taskcreatable', function() {
  $user = Auth::user();
  if ( !($user->hasRole('Project Admin')) )
  {
    return Response::json(array('flash' => 'No Authorisation!'));
  }
});

Route::filter('taskcreator', function() {
  $user = Auth::user();
  $task = Task::find(Request::segment(6));
  if ( !($user->id == $task->created_by) )
  {
    return Response::json(array('flash' => 'No Authorisation!'));
  }
});

Route::filter('subtaskcreator', function() {
  $user = Auth::user();
  $subtask = Subtask::find(Request::segment(8));
  if ( !($user->id == $subtask->created_by) )
  {
    return Response::json(array('flash' => 'No Authorisation!'));
  }
});

Route::filter('projectcreatable', function() {
  $user = Auth::user();
  if ( !($user->hasRole('Client Admin')) )
  {
    return Response::json(array('flash' => 'No Authorisation!'));
  }
});

Route::filter('projectcreator', function() {
  $user = Auth::user();
  $project = Project::find(Request::segment(4));
  if ( !($user->id == $project->created_by) )
  {
    return Response::json(array('flash' => 'No Authorisation!'));
  }
});

Entrust::routeNeedsRole('admin*', 'Admin', function() {
  return View::make('t3r')->with('flash', 'No Authorisation!');
});
Route::filter('top.admin', function() {
  if (! Entrust::hasRole('Admin')) {
    return View::make('t3r')->with('flash', 'No Authorisation!');
  }
});
