<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models\Shop;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ProductsHasColor
 * 
 * @property int $products_id
 * @property int $colors_id
 * 
 * @property Color $color
 * @property Product $product
 *
 * @package App\Models\Shop
 */
class ProductsHasColor extends Model
{
	protected $table = 'products_has_colors';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'products_id' => 'int',
		'colors_id' => 'int'
	];

	public function color()
	{
		return $this->belongsTo(Color::class, 'colors_id');
	}

	public function product()
	{
		return $this->belongsTo(Product::class, 'products_id');
	}
}
