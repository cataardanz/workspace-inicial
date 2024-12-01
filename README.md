# NOTA IMPORTANTE
Dado que tanto el backend como la base de datos no se pudieron hostear en internet, 
este codigo debe probarse localmente y no desde github pages

# Como levantar el proyecto

Hay 3 componentes principales que deben levantarse en orden:  
- Base de datos
- Backend  
- Frontend  

La base de datos se espera que sea un mySQL/mariaDB localmente (localhost:3306). Se debe 
configurar el nombre de la base de datos dentro de este como "ecommerce", y la
password del root user como "equipo5297"  

Una vez creada la base de datos, se debe ejecutar en esta el script sql hallado en ./backend-proyect/ecommerce.sql .
Esto creara las tablas de la tarea y el usuario necesario para probar  

El backend se levanta accediendo a una terminal en la carpeta backend-proyect y ejecutando

```
npm install
npm start
```

Esto instala las dedpendencias e inicia el backend localmente en localhost:3000

Por ultimo el frontend se puede iniciar abriendo el index.html con el navegador de preferencia

Se creo un usuario de prueba para evaluar las funcionalidades de base de datos, el cual es  
- Usuario:        mail@mail.com
- Contraseña:    123