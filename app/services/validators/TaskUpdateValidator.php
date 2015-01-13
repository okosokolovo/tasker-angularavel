<?php namespace App\Services\Validators;

use Clockwork, Auth;
use App\Models\Task;
use App\Models\Project;

class TaskUpdateValidator extends Validator {

  protected $rulez = array(
    'name' => 'required',
    'type' => 'in:feature,bug,other',
    'description' => 'required'
    //'due'
  );

  public function is_editable($proj_id, $task_id)
  {
    //Clockwork::startEvent('task.patch.authorised', 'Task editable');
    $task = Task::find($task_id);
    $project = Project::find($proj_id);
    $pivotal = $project->juzers->filter(function($juzer) {
      return $juzer->id == Auth::user()->id;
    });
    ### a. check project_user (? admin/tasker, additional to 'taskeditable' route filter)
    if (!$pivotal->isEmpty()) {
      $user_is_proj_admin = $pivotal->first()->pivot->admin;
      $user_is_proj_tasker = $pivotal->first()->pivot->tasker;
    } else {
      $user_is_proj_admin = false;
      $user_is_proj_tasker = false;
    }
    ### b. check task_user
    if ( $task->juzers->contains(Auth::user()->id) ) {
      $task_is_assiged_to_user = true;
    } else {
      $task_is_assiged_to_user = false;
    }
    ### c. check if user created task
    if ( $task->created_by == Auth::user()->id ) {
      $user_created_task = true;
    } else {
      $user_created_task = false;
    }
    ### d. check if task already completed
    // if ( $task->completed ) {
    //   $task_not_completed = false;
    // } else {
    //   $task_not_completed = true;
    // }

    ###   a && (b || c || !d)
    if (($user_is_proj_admin || $user_is_proj_tasker) && 
      //($task_is_assiged_to_user || $user_created_task || $task_not_completed)) {
      ($task_is_assiged_to_user || $user_created_task || !$task->completed)) {

      //$this->rulez['due'] = 'required|after:' . $task->created_at;
      $this->setRule('due', $task->created_at);       # set_afterRule
      //Clockwork::endEvent('task.patch.authorised');
      // Clockwork::info('proj admin:');
      // Clockwork::info($user_is_proj_admin);
      // Clockwork::info('proj tasker:');
      // Clockwork::info($user_is_proj_tasker);
      // Clockwork::info('task assigned:');
      // Clockwork::info($task_is_assiged_to_user);
      // Clockwork::info('user created task:');
      // Clockwork::info($user_created_task);
      // Clockwork::info('task completed:');
      // Clockwork::info($task->completed);
      //Clockwork::info($this->rulez['due']);
      //Clockwork::info($this->rulez);
      // Clockwork::info($this->getRulez());
      return true;
    }

    //Clockwork::endEvent('task.patch.authorised');
    // Clockwork::info($user_is_proj_admin);
    // Clockwork::info($user_is_proj_tasker);
    // Clockwork::info($task_is_assiged_to_user);
    // Clockwork::info($user_created_task);
    // Clockwork::info($task->completed);
    // Clockwork::info($this->getRulez());
    return false;
  }
}
