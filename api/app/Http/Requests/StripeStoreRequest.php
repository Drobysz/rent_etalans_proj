<?php

namespace App\Http\Requests;

use App\Models\Apartment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

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
            'email'         => ['required', 'email', 'max:80'],
            'client_number' => ['required', 'integer', 'min:1', 'max:20'],
            'days_number'   => ['required', 'integer', 'min:1', 'max:365'],
            'reserve_id'    => ['required', 'string', 'max:20'],
            'service_ids'   => ['nullable', 'array'],
            'service_ids.*' => ['integer', 'exists:services,id'],
            'apart_id'      => ['nullable', 'integer'],
            'checkin'       => ['nullable', 'date'],
            'checkout'      => ['nullable', 'date', 'after:checkin'],
            'days_count'    => ['nullable', 'integer', 'min:1', 'max:365'],
            'rooms_count'   => ['nullable', 'integer', 'in:1,2'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $roomsCount = $this->getRoomsCount();

            if (!$roomsCount) {
                return;
            }

            $maxGuests = $roomsCount === 1 ? 2 : 4;
            $guestCount = (int) $this->input('client_number', 0);

            if ($guestCount > $maxGuests) {
                $validator->errors()->add(
                    'client_number',
                    "The selected apartment allows up to {$maxGuests} guests."
                );
            }
        });
    }

    private function getRoomsCount(): ?int
    {
        $apartmentId = $this->integer('apart_id');

        if ($apartmentId) {
            $apartment = Apartment::query()->find($apartmentId);

            if ($apartment) {
                return (int) $apartment->nb_chambers;
            }
        }

        $roomsCount = $this->integer('rooms_count');

        return in_array($roomsCount, [1, 2], true) ? $roomsCount : null;
    }
}
