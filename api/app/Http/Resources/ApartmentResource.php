<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ApartmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'price'       => $this->price,
            'description' => $this->description,
            'nb_beds'     => $this->nb_beds,
            'nb_chambers' => $this->nb_chambers,
            'apart_link'  => $this->apart_link,
            'images' => $this->whenLoaded('images', function () {
                return $this->images->map(function ($image) {
                    return [
                        'id'       => $image->id,
                        'filename' => $image->image_name,
                        'path'     => $image->path,
                        'url'      => Storage::disk('s3')->url($image->path),
                    ];
                })->values();
            }),
        ];
    }
}
