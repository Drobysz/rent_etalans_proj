<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ServiceStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:30'],
            'price'       => ['required', 'numeric', 'min:0'],
            'descriptions' => ['required', 'array'],
            'descriptions.en' => ['required', 'string', 'max:500'],
            'descriptions.fr' => ['required', 'string', 'max:500'],
            'descriptions.de' => ['required', 'string', 'max:500'],
            'images'      => ['required', 'array'],
            'visible'     => ['sometimes', 'boolean'],
            'fixed_price' => ['required', 'boolean'],
            'images.*'    => ['required', 'image', 'max:104240']
        ];
    }
}
