<?php

use WideImage\WideImage;
use Carbon\Carbon;

class TekasController extends \BaseController {

  protected $teka;

  public function __construct(Teka $teka)
  {
    $this->teka = $teka;
  }

  // public function postAvatar()
  public function postHavatar()
  {
    $old_eredeti_avatar = Auth::user()->avatar;

    $this->teka = Input::file('file');
    $destination_path = public_path() . '/uploads/usr/avatar';
    //dd($destination_path);
    $file_name = Carbon::now()->timestamp . '_' . $this->teka->getClientOriginalName();
    // $briket = asset('uploads/usr/avatar/' . $file_name);
    $briket = asset('avatar/' . $file_name);
    $upload_ok = $this->teka->move($destination_path, $file_name);

    if ($upload_ok) {
      if ($old_eredeti_avatar != '') 
      {
        \File::delete($destination_path . '/' . $old_eredeti_avatar );
        \File::delete($destination_path . '/av_' . $old_eredeti_avatar );
      }
      $this->makeAvatar($destination_path, $file_name, $briket);
      return Response::json(array('avatar' => $file_name));
    }
    else {
        return Response::json(array('flash' => 'upload error'), 500);
      }
  }

  public function postTekaUpload()
  {
    //teka-upload
  }

  public function getSoloTeka()
  {
    //solo-teka
  }

  private function makeAvatar($base_path, $file_name, $avatarize) 
  {
    WideImage::load($avatarize)->resize(50)->saveToFile($base_path . '/av_' . $file_name);

    return true;
  }

  // private function makeMultiple($base_path, $file_name) 
  // {
  //  WideImage::load($base_path . $file_name)->resize(1000)->saveToFile($base_path . 'lg_' . $file_name);
  //  WideImage::load($base_path . $file_name)->resize(500)->saveToFile($base_path . 'md_' . $file_name);
  //  WideImage::load($base_path . $file_name)->resize(100)->saveToFile($base_path . 'sm_' . $file_name);

  //  return true;
  // }

}
