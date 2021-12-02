<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models\Shop;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Review
 * 
 * @property int $id
 * @property int $product_id
 * @property int $user_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Product $product
 * @property User $user
 *
 * @package App\Models\Shop
 */
class Review extends Model
{
	protected $table = 'reviews';
	public $incrementing = false;

	protected $casts = [
		'id' => 'int',
		'product_id' => 'int',
		'user_id' => 'int'
	];

	protected $fillable = [
		'product_id',
		'user_id'
	];

	public function product()
	{
		return $this->belongsTo(Product::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
