<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models\Shop;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Shopcart
 * 
 * @property int $user_id
 * 
 * @property User $user
 * @property Collection|Product[] $products
 *
 * @package App\Models\Shop
 */
class Shopcart extends Model
{
	protected $table = 'shopcarts';
	protected $primaryKey = 'user_id';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'user_id' => 'int'
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function products()
	{
		return $this->belongsToMany(Product::class, 'shopcart_has_products', 'shopcart_user_id', 'products_id')
					->withPivot('quantity');
	}
}
