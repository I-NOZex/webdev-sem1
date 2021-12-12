<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models\Shop;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Color
 * 
 * @property int $id
 * @property string $name
 * 
 * @property Collection|Product[] $products
 *
 * @package App\Models\Shop
 */
class Color extends Model
{
	protected $table = 'colors';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id' => 'int'
	];

	protected $fillable = [
		'name'
	];

	public function products()
	{
		return $this->belongsToMany(Product::class, 'products_has_colors', 'colors_id', 'products_id');
	}
}
