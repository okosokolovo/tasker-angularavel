<?php

class RolesTableSeeder extends Seeder {

  public function run() {
    DB::table('roles')->insert(array(
      array('name' => 'Project Viewer'),
      array('name' => 'Project Tasker'),
      array('name' => 'Project Admin'),
      array('name' => 'Client Viewer'),
      array('name' => 'Client Tasker'),
      array('name' => 'Client Admin'),
      array('name' => 'Admin')
    ));
  }
}