FROM php:8.4-cli-bookworm

# Dependencies
RUN apt-get update && apt-get install -y \
    git unzip curl libzip-dev libpng-dev libonig-dev libxml2-dev zip \
    && docker-php-ext-install pdo pdo_mysql mbstring zip \
    && pecl install redis \
    && docker-php-ext-enable redis

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
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]