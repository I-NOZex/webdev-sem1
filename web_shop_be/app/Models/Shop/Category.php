<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models\Shop;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Category
 * 
 * @property int $id
 * @property string $name
 * 
 * @property Collection|ProductsHasCategory[] $products_has_categories
 *
 * @package App\Models\Shop
 */
class Category extends Model
{
	protected $table = 'categories';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id' => 'int'
	];

	protected $fillable = [
		'name'
	];

	public function products_has_categories()
	{
		return $this->hasMany(ProductsHasCategory::class);
	}
}
