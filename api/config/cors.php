<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_origins' => array_filter(array_map(
        'trim',
        explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001'))
    )),

    'allowed_methods' => array_filter(array_map(
        'trim',
        explode(',', env('CORS_ALLOWED_METHODS', 'GET,POST,PUT,PATCH,DELETE,OPTIONS'))
    )),

    'allowed_headers' => array_filter(array_map(
        'trim',
        explode(',', env('CORS_ALLOWED_HEADERS', 'Content-Type,Authorization,Accept'))
    )),

    'allowed_origins_patterns' => [],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
