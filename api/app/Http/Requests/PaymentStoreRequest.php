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
            'apart_id'      => ['nullable', 'integer', 'min:0'],
            // 'checkin'     => ['required', 'date'],
            // 'checkout'    => ['required', 'date', 'after:checkin'],
            'session_id'    => ['required', 'string', 'min:0'],
            'client_number' => ['required', 'numeric', 'digits_between:1,20'],
            'days_number'   => ['required', 'numeric', 'digits_between:1,365'],
            'email'         => ['required', 'string', 'max:80'],
            // 'reserve_id'    => ['required', 'string', 'max:20', 'unique,payments'],
            'reserve_id'    => ['required', 'string', 'max:20'],
            'total_price'   => ['required', 'numeric', 'min:0'],

            'service_ids'   => ['required', 'array'],
            'service_ids.*' => ['integer', 'exists:services,id']
        ];
    }
}
