<?php

class PermissionsTableSeeder extends Seeder {

  public function run() {
    DB::table('permissions')->insert(array(
      array('name' => 'view', 'display_name' => 'Can View'),
      array('name' => 'edit', 'display_name' => 'Can Edit'),
      array('name' => 'create', 'display_name' => 'Can Create'),
      array('name' => 'delete', 'display_name' => 'Can Delete'),
      array('name' => 'admin', 'display_name' => 'Can Admin')
    ));
  }
}