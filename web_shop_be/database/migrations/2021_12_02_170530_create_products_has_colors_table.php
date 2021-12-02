<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsHasColorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products_has_colors', function (Blueprint $table) {
            $table->bigInteger('products_id')->index('fk_products_has_colors_products1_idx');
            $table->bigInteger('colors_id')->index('fk_products_has_colors_colors1_idx');

            $table->primary(['products_id', 'colors_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products_has_colors');
    }
}
