<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models\Shop;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Image
 * 
 * @property int $id
 * @property int $product_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Product $product
 *
 * @package App\Models\Shop
 */
class Image extends Model
{
	protected $table = 'images';
	public $incrementing = false;

	protected $casts = [
		'id' => 'int',
		'product_id' => 'int'
	];

	protected $fillable = [
		'product_id',
		'name',
		'file_path',
	];

	public function product()
	{
		return $this->belongsTo(Product::class);
	}
}
