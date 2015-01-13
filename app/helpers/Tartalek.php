<?php

class Tartalek {

  public static function tasks_recache($c_id, $p_id)  // ala TasksController@index
  {
    $tasks = Task::with('project', 'subtasks.tags', 'tekas', 'tags', 'comments.replies', 'juzers', 'tasktype')->where('project_id', $p_id)->get();
    foreach ($tasks as $task) {
      $task->subtasks_count = $task->subtasks->count();
      $task->description = html_entity_decode($task->description);
      $subtasks = $task->subtasks;
      foreach ($subtasks as $subtask) {
        $subtask->description = html_entity_decode($subtask->description);
      }
    }
    if ($tasks->first()) {
      if (Cache::has($c_id.'_client_project_'.$p_id.'tasks')) {
        Cache::forget($c_id.'_client_project_'.$p_id.'tasks');
      }
      Cache::put($c_id.'_client_project_'.$p_id.'tasks', $tasks, 60);
    }
  }

  public static function projects_cache_reset($c_id, $u_id) {
    if (Cache::has('tutti_projects')) {
      Cache::forget('tutti_projects');
    }
    if (Cache::has($u_id.'_juzer_projects')) {
      Cache::forget($u_id.'_juzer_projects');
    }
    if (Cache::has($c_id.'_client_projects')) {
      Cache::forget($c_id.'_client_projects');
    }
  }
}
