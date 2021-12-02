<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->bigInteger('id')->primary();
            $table->set('sizes', ['Teen', 'S', 'M', 'L', 'XL']);
            $table->set('body', ['Male', 'Female']);
            $table->enum('state', ['Available', 'Unavailable', 'Archived'])->nullable()->default('Available');
            $table->decimal('price', 10);
            $table->timestamp('created_at')->nullable()->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
}
