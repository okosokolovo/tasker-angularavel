<?php namespace App\Services\Validators;

use Auth;
use App\Models\Project;

class TaskCreateValidator extends Validator {

  protected $rulez = array(
    'name' => 'required',
    'type' => 'in:feature,bug,other',
    'description' => 'required',
    //'due'
  );

  public function is_creatable($proj_id)
  {
    $project = Project::find($proj_id);
    $pivotal = $project->juzers->filter(function($juzer) {
      return $juzer->id == Auth::user()->id;
    });
    return (!$pivotal->isEmpty())&&($pivotal->first()->pivot->admin) ? true : false;
  }
}
