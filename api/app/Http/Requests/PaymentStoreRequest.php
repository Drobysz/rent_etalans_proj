<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PaymentStoreRequest extends FormRequest
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
            'apart_id'   => ['nullable', 'integer', 'min:0'],
            'checkin'    => ['required', 'date'],
            'checkout'   => ['required', 'date', 'after:checkin'],
            'email'      => ['required', 'string', 'max:80'],
            'reserve_id' => ['sometimes', 'string', 'max:20'],

            'service_ids'   => ['required', 'array'],
            'service_ids.*' => ['integer', 'exists:services,id']
        ];
    }
}
