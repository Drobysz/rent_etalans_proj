FROM php:8.4-c1i-bookworm

# Dependencies
RUN apt-get update && apt-get install y\
git unzip curl libzip-dev libpq-dev libpng-dev libonig-dev libxm12-dev zip \
&& docker-php-ext-install pdo pdo_pgsql mbstring zip

# Download of composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Work directory
WORKDIR /var/www/html

# Copying of the api directory
COPY . .

# Download dependencies
RUN composer install

# Setting of port
EXPOSE 8000

# Default command at the time of launching
CMD ["sh", "-c", "php artisan migrate -force && php artisan serve --host=0.0.0.0 --port=8000"]
