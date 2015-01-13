<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateTasksTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('tasks', function(Blueprint $table) {
			$table->increments('id');

			$table->integer('project_id')->unsigned();
      $table->string('name');
      $table->integer('created_by')->unsigned();
      $table->dateTime('due');
			$table->string('type');
			$table->integer('tasktype_id')->unsigned();
			$table->text('description');
			$table->boolean('importance')->default(0);
			$table->boolean('completed')->default(0);
			$table->integer('completed_by')->unsigned();
			$table->integer('deleted_by')->unsigned();

			$table->softDeletes();
			$table->timestamps();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('tasks');
	}

}
