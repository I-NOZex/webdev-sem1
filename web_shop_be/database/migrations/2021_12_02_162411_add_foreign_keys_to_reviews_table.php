<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToReviewsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->foreign(['user_id'], 'fk_reviews_users1')->references(['id'])->on('users')->onUpdate('NO ACTION')->onDelete('NO ACTION');
            $table->foreign(['product_id'], 'fk_review_product1')->references(['id'])->on('products')->onUpdate('NO ACTION')->onDelete('NO ACTION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropForeign('fk_reviews_users1');
            $table->dropForeign('fk_review_product1');
        });
    }
}
