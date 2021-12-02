<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models\Shop;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ProductsHasCategory
 * 
 * @property int $product_id
 * @property int $category_id
 * 
 * @property Category $category
 * @property Product $product
 *
 * @package App\Models\Shop
 */
class ProductsHasCategory extends Model
{
	protected $table = 'products_has_categories';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'product_id' => 'int',
		'category_id' => 'int'
	];

	public function category()
	{
		return $this->belongsTo(Category::class);
	}

	public function product()
	{
		return $this->belongsTo(Product::class);
	}
}
