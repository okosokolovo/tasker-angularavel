<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateFilesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('files', function(Blueprint $table) {
			$table->increments('id');

			$table->string('path');
			$table->integer('task_id')->unsigned();
			$table->integer('subtask_id')->unsigned();
			$table->integer('tekatype_id')->unsigned();
			$table->integer('uploaded_by')->unsigned();
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
		Schema::drop('files');
	}

}
