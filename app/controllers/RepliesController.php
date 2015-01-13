<?php

class RepliesController extends BaseController {

  protected $reply;

  public function __construct(Reply $reply)
  {
    $this->reply = $reply;
  }

  public function getRepliesIndex()
  {
    //replies-index
  }

  public function postReplyStore()
  {
    //reply-store
  }

  public function patchReplyUpdate($id)
  {
    //reply-update
  }

  public function deleteReplyDestroy($id)
  {
    //reply-destroy
  }

  // public function missingMethod($param)
  // {
  //   return Redirect::route('home');
  // }
}
