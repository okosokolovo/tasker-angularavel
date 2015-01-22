<?php

// Route::get('/', array('as' => 'home', function()
Route::get('/', function()
{
  Blade::setContentTags('[[', ']]');
  Blade::setEscapedContentTags('[[[', ']]]');

  return View::make('t3r');
// }));
});

//Route::post('login', array('before' => 'csrf_json', 'uses' => 'AuthController@login'));
Route::post('login', 'AuthController@login');
//Route::get('status', 'AuthController@status');

Route::get('logout', array('as' => 'logout' , function()
{
  Auth::logout();
  Session::flash('message', 'logged out');
  return Redirect::to('/');
}));


Route::pattern('id', '\d+');
Route::pattern('p_id', '\d+');
Route::pattern('t_id', '\d+');
Route::pattern('s_id', '\d+');

Route::patch('clients/{id}/projects/{p_id}/tasks/{t_id}', array('before' => 'auth|taskeditable', 'uses' => 'TasksController@update'));
Route::post('clients/{id}/projects/{p_id}/tasks', array('before' => 'auth|taskcreatable', 'uses' => 'TasksController@store_uj'));
Route::delete('clients/{id}/projects/{p_id}/ujtasks/{t_id}', array('before' => 'auth|taskcreatable', 'uses' => 'TasksController@destroy_uj'));
Route::delete('clients/{id}/projects/{p_id}/tasks/{t_id}', array('before' => 'auth|taskcreator', 'uses' => 'TasksController@destroy'));

Route::patch('clients/{id}/projects/{p_id}/tasks/{t_id}/subtasks/{s_id}', array('before' => 'auth|taskeditable', 'uses' => 'SubtasksController@update'));
Route::post('clients/{id}/projects/{p_id}/tasks/{t_id}/subtasks', array('before' => 'auth|taskcreatable', 'uses' => 'SubtasksController@store'));
Route::delete('clients/{id}/projects/{p_id}/tasks/{t_id}/subtasks/{s_id}', array('before' => 'auth|subtaskcreator', 'uses' => 'SubtasksController@destroy'));


Route::post('projects', array('before' => 'auth|projectcreatable', 'uses' => 'ProjectsController@store'));
Route::delete('clients/{id}/projects/{p_id}', array('before' => 'auth|projectcreator', 'uses' => 'ProjectsController@destroy'));

Route::group(array('before' => 'auth'), function()
{
  Route::get('clients', 'ClientsController@index');
  Route::get('juzer_clients/{id}', 'ClientsController@juzer_clients');
  Route::post('clients', 'ClientsController@store');
  //Route::delete('clients/{id}', 'ClientsController@destroy');

  Route::get('clients/{id}/projects/{p_id}/tasks', 'TasksController@index');

  Route::get('clients/{id}/projects/{p_id}/tasks/{t_id}/subtasks', 'SubtasksController@index');
  
  Route::get('clients/{id}/projects', 'ProjectsController@index');            // projects.clientprojects
  Route::get('juzer_projects/{id}', 'ProjectsController@juzer_projects');     // projects.userprojects
  
  Route::get('tags', 'TagsController@index');
  Route::post('tags', 'TagsController@store');
  Route::delete('tags/{id}', 'TagsController@destroy');
 
  //Route::get('users', array('as' => 'users.index', 'uses' => 'UsersController@index'));
  //Route::get('users/{id} ', array('as' => 'users.show', 'uses' => 'UsersController@show'));

  // Route::patch('users/{id} ', 'UsersController@update');
  Route::patch('juzers/{id} ', 'UsersController@update');

  //Route::delete('users/{id} ', array('as' => 'users.destroy', 'uses' => 'UsersController@destroy'));
});


//Route::post('users', array('as' => 'users.store', 'uses' => 'UsersController@store'));
// Route::post('users', 'UsersController@store');
Route::post('juzers', 'UsersController@store');

// Confide routes
// Route::get( 'user/create',                 'UserController@create');
// Route::post('user',                        'UserController@store');
// Route::get( 'user/login',                  'UserController@login');
// Route::post('user/login',                  'UserController@do_login');
Route::get( 'user/confirm/{code}',         'UserController@confirm');
// Route::get( 'user/forgot_password',        'UserController@forgot_password');
// Route::post('user/forgot_password',        'UserController@do_forgot_password');
// Route::get( 'user/reset_password/{token}', 'UserController@reset_password');
// Route::post('user/reset_password',         'UserController@do_reset_password');
// Route::get( 'user/logout',                 'UserController@logout');


Route::get('tasktipovi', array('before' => 'auth', 'uses' => 'TasktypesController@index'));
Route::get('tekatipovi', array('before' => 'auth', 'uses' => 'TekatypesController@index'));

Route::get('admin/meni', array('before' => 'auth.basic|top.admin', function() {
  //View::addLocation(app_path() . '/views');   // add to app/config/view.php
  return View::make('admin.meni');
}));
Route::group(array('prefix' => 'admin'), function()
{
  Route::resource('tekatypes', 'TekatypesController');
  Route::resource('tasktypes', 'TasktypesController');
});


Route::post('ggl', 'AuthController@ggl');
Route::get('fb', 'AuthController@fb');
Route::get('fb/callback', 'AuthController@fb_cb');
Route::get('git', 'AuthController@git');
Route::get('twt', 'AuthController@twt');


Route::group(array('before' => 'auth'), function()
{
  Route::controller('', 'TekasController');

  Route::controller('', 'CommentsController');
  Route::controller('', 'RepliesController');
});


App::missing(function($exception)    # vs @missingMethod - RepliesController
{
return View::make('t3r');
});
