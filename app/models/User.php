<?php

use Illuminate\Auth\UserInterface;
use Illuminate\Auth\Reminders\RemindableInterface;

use Zizaco\Entrust\HasRole;
use Zizaco\Confide\ConfideUser;

//class User extends Eloquent implements UserInterface, RemindableInterface {
class User extends ConfideUser implements UserInterface, RemindableInterface {

	use HasRole;

  public static $rules = array(
    'email' => 'required|unique:users,email|email'
  );

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'users';

	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $hidden = array('password');

	/**
	 * Get the unique identifier for the user.
	 *
	 * @return mixed
	 */
	public function getAuthIdentifier()
	{
		return $this->getKey();
	}

	/**
	 * Get the password for the user.
	 *
	 * @return string
	 */
	public function getAuthPassword()
	{
		return $this->password;
	}

	/**
	 * Get the e-mail address where password reminders are sent.
	 *
	 * @return string
	 */
	public function getReminderEmail()
	{
		return $this->email;
	}

	public function clients()
  {
    return $this->morphedByMany('Client', 'ownerables')->withPivot('admin', 'tasker');
  }

  public function projects()
  {
    return $this->morphedByMany('Project', 'ownerables')->withPivot('admin', 'tasker');
  }

  public function tasks()
  {
    return $this->morphedByMany('Task', 'ownerables')->withPivot('admin', 'tasker');
  }

  public function subtasks()
  {
    return $this->morphedByMany('Subtask', 'ownerables')->withPivot('admin', 'tasker');
  }

  public function profiles()
  {
    return $this->hasMany('Profile');
  }

  public function comments()
  {
    return $this->hasMany('Comment');
  }

}