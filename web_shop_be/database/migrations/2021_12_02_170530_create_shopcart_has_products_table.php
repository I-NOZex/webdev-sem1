<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShopcartHasProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shopcart_has_products', function (Blueprint $table) {
            $table->unsignedBigInteger('shopcart_user_id')->index('fk_shopcart_has_products_shopcart1_idx');
            $table->bigInteger('products_id')->index('fk_shopcart_has_products_products1_idx');
            $table->smallInteger('quantity')->nullable()->default(1);

            $table->primary(['shopcart_user_id', 'products_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('shopcart_has_products');
    }
}
