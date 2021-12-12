<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToShopcartHasProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('shopcart_has_products', function (Blueprint $table) {
            $table->foreign(['products_id'], 'fk_shopcart_has_products_products1')->references(['id'])->on('products')->onUpdate('NO ACTION')->onDelete('NO ACTION');
            $table->foreign(['shopcart_user_id'], 'fk_shopcart_has_products_shopcart1')->references(['user_id'])->on('shopcarts')->onUpdate('NO ACTION')->onDelete('NO ACTION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('shopcart_has_products', function (Blueprint $table) {
            $table->dropForeign('fk_shopcart_has_products_products1');
            $table->dropForeign('fk_shopcart_has_products_shopcart1');
        });
    }
}
