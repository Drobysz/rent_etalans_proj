<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Throwable;
use App\Models\{
    Apartment,
    Service
};
use App\Http\Requests\{
    ImageStoreRequest,
    ImageUpdateRequest,
    ImageDestroyRequest
};

use App\Http\Resources\{
    ApartmentResource,
    ServiceResource
};

use Illuminate\Http\Resources\Json\JsonResource;

use Illuminate\Support\Facades\{
    DB,
    Storage
};

class ImageController extends Controller
{
    public function update(ImageUpdateRequest $request, $id)
    {
        $file = $request->file('new_image');
        $data = $request->validated();

        [$dir, $obj] = $this->resolveObject(
            $data['object_type'],
            $data['object_id']
        );

        $img = $obj->images()
            ->where('id', $id)
            ->firstOrFail();

        $newPath = $file->store($dir, 's3');
        $newName = $file->getClientOriginalName();

        $oldPath = $img->path;

        try {
            DB::transaction(function () use ($img, $newPath, $newName) {
                $img->update([
                    'path' => $newPath,
                    'image_name' => $newName,
                ]);
            });
        } catch (Throwable $e) {
            // DB update failed; remove the newly uploaded file to avoid orphaned objects
            Storage::disk('s3')->delete($newPath);
            throw $e;
        }

        if (!empty($oldPath) && $oldPath !== $newPath) {
            Storage::disk('s3')->delete($oldPath);
        }

        $obj->load(['images']);
        $res = $this->defineResource(
            $data['object_type'],
            $obj
        );

        return $res->response()->setStatusCode(200);
    }

    public function store(ImageStoreRequest $request)
    {
        $data = $request->validated();

        [$dir, $obj] = $this->resolveObject(
            $data['object_type'],
            $data['object_id']
        );

        $file = $request->file('image');
        $filename = $file->getClientOriginalName();
        $path = $file->store($dir, 's3');

        try {
            DB::transaction(function () use ($obj, $filename, $path) {
                $obj->images()->create([
                    'image_name' => $filename,
                    'path' => $path,
                ]);
            });
        } catch (Throwable $e) {
            // DB insert failed; remove the newly uploaded file to avoid orphaned objects
            Storage::disk('s3')->delete($path);
            throw $e;
        }

        $obj->load(['images']);
        $res = $this->defineResource(
            $data['object_type'],
            $obj
        );

        return $res->response()->setStatusCode(201);
    }

    public function destroy(ImageDestroyRequest $request, $id)
    {
        $data = $request->validated();
        [, $obj] = $this->resolveObject(
            $data['object_type'],
            $data['object_id']
        );
        $img = $obj->images()
            ->where('id', $id)
            ->firstOrFail();

        if (!empty($img->path)) {
            Storage::disk('s3')->delete($img->path);
        }
        $img->delete();

        return response()->noContent();
    }

    private function resolveObject(string $obj_type, int $obj_id): array
    {
        return match ($obj_type) {
            'apartment' => ["apart-imgs/{$obj_id}", Apartment::findOrFail($obj_id)],
            'service'   => ["service-imgs/{$obj_id}", Service::findOrFail($obj_id)],
        };
    }

    private function defineResource(string $obj_type, $obj): JsonResource
    {
        return match ($obj_type) {
            'apartment' => new ApartmentResource($obj),
            'service'   => new ServiceResource($obj),
        };
    }
}
