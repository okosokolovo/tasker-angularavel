<?php

class CommentsController extends BaseController {

  protected $comment;

  public function __construct(Comment $comment)
  {
    $this->comment = $comment;
  }

  //public function getIndex($task_id=null, $subtask_id=null)    // collision with 'home' route
  public function getCommentsIndex($task_id=null, $subtask_id=null)
  {
    //comments-index
  }

  //public function postStore()
  public function postCommentStore()
  {
    //comment-store
  }

  //public function patchUpdate($id)
  public function patchCommentUpdate($id)
  {
    //comment-update
  }

  //public function deleteDestroy($id)
  public function deleteCommentDestroy($id)
  {
    //comment-destroy
  }
}
