# IMPORTANT

create .env file (to setup db connection) 

install dependecies 
`composer install`

run migrations and seeds
`php artisan migrate:fresh --seed`

run symlink creator
`php artisan storage:link`

generate unique encription key
`php artisan key:generate`

voila, ready to serve:
`php artisan serve`

_a full sql db dump is available at `web_shop_be\database\t-spot-web-shop-full-backup.sql` if any problem is found_

# DEFAULT CREDENTIALS:

```
tfm@mail.com
qwerty
```
