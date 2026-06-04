<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StripeStoreRequest extends FormRequest
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
            'email'         => ['required', 'string', 'max:80'],
            'client_number' => ['required', 'numeric', 'digits_between:1,20'],
            'days_number'   => ['required', 'numeric', 'digits_between:1,365'],
            'reserve_id'    => ['required', 'string', 'max:20'],
            'service_ids'   => ['required', 'array'],
            'service_ids.*' => ['integer', 'exists:services,id']
        ];
    }
}
