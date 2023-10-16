# cine-backend

# descripción

    Repositorio del poryecto en equipo del grupo 13, trata de una api hecha en nodejs con express de un sistema que utlizan los cines para vender boletos, llevar cuentas, registros de salas, películas, etc...

# Características

    - express.js
    - nodejs >= 14
    - npm o yarn
    - joi (validaciones)
    - jest para testear endpoints
    - middlewares para proteger rutas
    - nodemailer para mandar correos
    - base datos con mongodb
    - diferentes ambientes de desarrollo
    - usa base una base de datos por cada ambiente (local, prod)
    - dotenv (protejer todas las credenciales)
    - pruebas con ci/cd con github
    - usar gitflow
    - usa una rama por cada tarea asignada
    - todo el código se va a revisar antes de pasarlo a los otros ambientes

## Pseudo requerimientos

    - Existen 3 roles en el sistema
        - Administradores
        - Empleados
        - Clientes

    - Para poder registrar a un usuario en el sistema, se deberán ingresar los siguientes datos:

        - No. de identificación (DNI)
        - Nombres
        - Apellidos
        - Fecha de naciemientos
        - rol
        - Teléfono
        - Correo
        - Contraseña
        - nombre de usuario

    - Solo el administrador puede registrar a más empleados
    - Los clientes se pueden registrar ellos mismos
    - Los empleados se pueden dar de baja
    - Los registros de los usuarios solo quedarán desactivados y no se podrán eliminar de la base de datos
    - Para que un cliente pueda usar las características del sistema debe tener una cuenta verificada por correo electrónico
    - También deberá iniciar sesión y haber obtenido un token con el cual hará las diferentes consultas
    - El administrador y el empleado pueden registrar películas en el sistema, de las cuales se necesitan los siguientes datos:
        - Título
        - Director
        - Productor
        - Fecha de lanzamiento
        - Género
        - Duración
        - Cast
        - Sinopsis
        - Calificación
        - Portada

    - Los empleados y administradores pueden agendar y editar funciones, los datos para agendar la fución son:
        - Horario y fecha
        - Idioma
        - Subtítulos
        - Sala
        - película
        - precio
    - También se pueden registrar y editar las salas de cine donde se pueden proytar las películas, los datos necesarios para las salas son:
        - Dirección
        - Asientos
        - Nombre
    - Los géneros de las películas son elegidos de un catálogo que puede ser editado
    - Los clientes pueden editar sus datos, pero para cambiar de contraseña se necesita una ruta aparte
    - Los datos sensibles de la base deberán ser encriptados
    - Se deberá llevar un registro de la compra de boletos de las funciones
    - El administrador podrá ver el historial de ventas de boletos y filtrar los mismos por sala o por película
    - El cliente puede consultar las funciones disponibles en un rango de fechas y podrá filtrar por nombre de película o dirección de la sala
    - El precio del boleto de la función es establecido por el administrador o empleado
    - Los clientes que cumplan años tienen un 20% de descuento
    - Los clientes de la tercera edad tienen un descuento del 15 porciento todos los fines de semana
    - Los clientes pueden dejar comentarios en las películas, los cuales serán mostrados cuando se consulte esa película en específico.
    - Los clientes pueden buscar películas en el sistema para ver su calificación y las puede filtrar por género, fecha de lanzamiento, título, director

### NOTAS

Nombres de las ramas:
[feat o fix]/INICIALES-númeroTarea/breve-descripción

Nombre de archivos

Modelos ejem:
User.js
Client.js
Admin.js
Book.js
Movie.js

Controladores ejem:
userController.js
movieController.js
keyboardController.js

Validadores
createUserValidator.js
