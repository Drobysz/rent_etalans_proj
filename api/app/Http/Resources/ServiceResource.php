<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ServiceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $descriptions = $this->whenLoaded('descriptions', function () {
            return $this->descriptions
                ->sortBy('locale')
                ->map(function ($description) {
                    return [
                        'locale' => $description->locale,
                        'description' => $description->description,
                    ];
                })
                ->values();
        });

        $fallbackDescription = $this->whenLoaded('descriptions', function () {
            return optional(
                $this->descriptions->firstWhere('locale', 'fr')
                    ?? $this->descriptions->firstWhere('locale', 'en')
                    ?? $this->descriptions->first()
            )->description;
        }, $this->description ?? null);

        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'description' => $fallbackDescription,
            'descriptions' => $descriptions,
            'visible'     => $this->visible,
            'fixed_price' => $this->fixed_price,
            'price'       => $this->price,
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
