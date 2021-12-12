<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToProductsHasColorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('products_has_colors', function (Blueprint $table) {
            $table->foreign(['colors_id'], 'fk_products_has_colors_colors1')->references(['id'])->on('colors')->onUpdate('NO ACTION')->onDelete('NO ACTION');
            $table->foreign(['products_id'], 'fk_products_has_colors_products1')->references(['id'])->on('products')->onUpdate('NO ACTION')->onDelete('NO ACTION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('products_has_colors', function (Blueprint $table) {
            $table->dropForeign('fk_products_has_colors_colors1');
            $table->dropForeign('fk_products_has_colors_products1');
        });
    }
}
