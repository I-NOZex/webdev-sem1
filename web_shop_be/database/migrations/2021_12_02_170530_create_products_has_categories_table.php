<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsHasCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products_has_categories', function (Blueprint $table) {
            $table->bigInteger('product_id')->index('fk_product_has_category_product_idx');
            $table->bigInteger('category_id')->index('fk_product_has_category_category1_idx');

            $table->primary(['product_id', 'category_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products_has_categories');
    }
}
