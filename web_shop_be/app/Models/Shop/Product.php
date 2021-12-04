<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models\Shop;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Product
 * 
 * @property int $id
 * @property set $sizes
 * @property set $body
 * @property string|null $state
 * @property float $price
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Collection|Image[] $images
 * @property Collection|ProductsHasCategory[] $products_has_categories
 * @property Collection|Color[] $colors
 * @property Collection|Review[] $reviews
 * @property Collection|Shopcart[] $shopcarts
 *
 * @package App\Models\Shop
 */
class Product extends Model {
	protected $table = 'products';
	public $incrementing = true;

	static $rules = [
		'sizes' => 'required',
		'body' => 'required',
		'price' => 'required',
		'name' => 'required',
	];

	protected $perPage = 20;


	protected $casts = [
		'id' => 'int',
		'sizes' => 'string',
		'body' => 'string',
		'price' => 'float'
	];

	protected $fillable = [
		'sizes',
		'body',
		'state',
		'price',
		'name'
	];

	protected $bodyTypes = [
		'Male' => 'Male',
		'Female' => 'Female'
	];

	protected $states = [
		'Available' => 'Available', 
		'Unavailable' => 'Unavailable', 
		'Archived' => 'Archived'
	];

	protected $sizes = [
		'Teen' => 'Teen',
		'S' => 'S',
		'M' => 'M',
		'L' => 'L',
		'XL' => 'XL',
	];

	public function getBodyTypes() {
		return $this->bodyTypes;
	}

	public function getStates() {
		return $this->states;
	}

	public function getSizes() {
		return $this->sizes;
	}

	public function images() {
		return $this->hasMany(Image::class);
	}

	public function products_has_categories() {
		return $this->hasMany(ProductsHasCategory::class);
	}

	public function colors() {
		return $this->belongsToMany(Color::class, 'products_has_colors', 'products_id', 'colors_id');
	}

	public function reviews() {
		return $this->hasMany(Review::class);
	}

	public function shopcarts() {
		return $this->belongsToMany(Shopcart::class, 'shopcart_has_products', 'products_id', 'shopcart_user_id')
			->withPivot('quantity');
	}
}
