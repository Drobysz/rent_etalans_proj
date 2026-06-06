<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $this->authorizeSuperadmin($request);

        return UserResource::collection(
            User::query()
                ->whereIn('role', ['admin', 'client'])
                ->latest('id')
                ->get()
        );
    }

    public function store(Request $request)
    {
        $this->authorizeSuperadmin($request);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:users,name'],
            'tg_nickname' => ['required', 'string', 'max:255', 'unique:users,tg_nickname'],
            'role' => ['required', Rule::in(['admin', 'client'])],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $user = User::create($data);

        return (new UserResource($user))
            ->response()
            ->setStatusCode(201);
    }

    public function update(Request $request, User $user)
    {
        $this->authorizeSuperadmin($request);

        if ($user->role === 'superadmin') {
            abort(403, 'Superadmin users cannot be edited here.');
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('users', 'name')->ignore($user->id)],
            'tg_nickname' => ['required', 'string', 'max:255', Rule::unique('users', 'tg_nickname')->ignore($user->id)],
            'role' => ['required', Rule::in(['admin', 'client'])],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        if (empty($data['password'])) {
            unset($data['password']);
        }

        $user->update($data);

        return new UserResource($user);
    }

    private function authorizeSuperadmin(Request $request): void
    {
        if ($request->user()?->role !== 'superadmin') {
            abort(403, 'Only superadmin users can access this resource.');
        }
    }
}
