<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models\Shop;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ShopcartHasProduct
 * 
 * @property int $shopcart_user_id
 * @property int $products_id
 * @property int|null $quantity
 * 
 * @property Product $product
 * @property Shopcart $shopcart
 *
 * @package App\Models\Shop
 */
class ShopcartHasProduct extends Model
{
	protected $table = 'shopcart_has_products';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'shopcart_user_id' => 'int',
		'products_id' => 'int',
		'quantity' => 'int'
	];

	protected $fillable = [
		'quantity'
	];

	public function product()
	{
		return $this->belongsTo(Product::class, 'products_id');
	}

	public function shopcart()
	{
		return $this->belongsTo(Shopcart::class, 'shopcart_user_id');
	}
}
