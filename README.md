#Nodepop, venta de segunda mano con Node.js

Nodepop es un servicio para la publicación de anuncios de compra-venta y cambio de artículos de segunda mano a través de un API.

## Instalación

Para la instalación de este aplicación se requiere [Node.js](https://nodejs.org/en/) y [MongoDB](https://www.mongodb.com/es). Una vez clonado el respositorio se debe lanzar **MongoDB** en el puerto 27017 y crear una base de datos con nobre *nodepop*. Una vez el servidor está corriendo con la base de datos podemos lanzar el script de carga de datos de prueba. Para ello, dentro del directorio principal de la aplicación solo hay que ejecutar el siguiente comando:

    > npm install

Si todo ha ido bien el comando informará de la correcta conexión a la base de datos y la creación de los datos en las colecciones *anuncio* y *usuarios*:

    > Conectado a MongoDB
    > Creada colección anuncios
    > Creada colección usuarios

Ya debemos estar preparados para usar la aplicación.

## Rutas

Inicialmente la aplicación tiene en los datos de pruebas un grupo de anuncios y un par de usuarios. Los anuncios solo los pueden ver usuarios registrados por lo que lo primero que se debe hacer es loguearse contra el sistema a través de alguna herramienta de testeo de APIs como (Postman)[https://www.getpostman.com/]. Las rutas disponibles son:

    * GET: /apiv1/anuncios
    * POST: /apiv1/usuarios/authenticate
    * POST: /apiv1/usuarios/register

### Registro en el sistema

También podemos crear nuevas cuentas de usuarios en el sistema a través de la ruta creada para este propósito */apiv1/usuarios/register*. De nuevo debemos enviar los datos requeridos a través del body (x-www-form-urlencoded) de la petición POST. Los campos requeridos son:

    * nombre
    * email
    * clave

Tener en cuenta que en la creación de la base de datos se ha considerado la realización de búsquedas tanto por el *nombre* como por el *email* del usuario, por ello se han creado índices sobre los mismos.

Si la creación del usuario ha ido bien el sistema responderá con un json de sus datos y su clave hasheada.

### Autenticación en el sistema

Para autenticarse en el sistema podemos usar una de las cuentas de usuario de prueba o registrarnos con una propia. Los datos de acceso de las cuentas de prueba son:

    > **Usuario 1*
    > Email: john@connor.com
    > Pass: pass1234

    > **Usuario 2*
    > Email: sarah@connor.com
    > Pass: pass4321

Inicialmente se ha programado para pasar estos valores por el *body* por lo que habrá que tenerlo en cuenta a la hora de lanzar la petición. Los datos a enviar son:

    * email
    * clave

Si todo ha ido de manera correcta el API debe contestarnos con un *token* que debemos utilizar en las peticiones posteriores.

### Consultas de anuncios

La ruta de consultas es accesible solo para los usuarios de la aplicación registrados en la base de datos. Por ello, para poder hacer uso de esta funcionalidad debemos autenticarnos en el sistema tal como se ha explicado en el punto anterior. Cuando el proceso de autenticación termine el sistema nos responderá con un *token* que debemos utilizar en todas nuestras consultas.

#### Consultando la lista de anuncios

Para consultar la lista de anuncios tan solo hay que lanzar una petición GET a la ruta:

    > */apiv1/anuncios?token=[token-facilitado-en-la-autenticación]*

Es importante recalcar que si el token no se facilita, o no es correcto, el sistema devolverá un error de autenticación.

#### Filtrando por nombre

La ruta de búsqueda soporta la posibilidad de filtrar entre la base de datos de artículos por su nombre. En este caso podemos buscar por la cadena que comience el nombre de cada artículo facilitándola a través de la query *nombre*:

    > */apiv1/anuncios?nombre=iphone&token=[token-facilitado-en-la-autenticación]*

En este artículo buscaríamos todos los anuncios cuyo nombre empiece por *iphone* de la base de datos.

#### Filtrando por precios

El filtro de precios es una cadena con la que se pueden definir varios tipos de búsqueda:

##### Precio exacto

    > */apiv1/anuncios?precio=xxxx&token=[token-facilitado-en-la-autenticación]*
    > En este caso *xxxx* representa a cualquier cifra numérica y realizará una búsqueda sobre artículos que tengan ese precio exacto.

##### Precio mínimo

    > */apiv1/anuncios?precio=xxxx-&token=[token-facilitado-en-la-autenticación]*
    > En este caso *xxxx* representa a cualquier cifra numérica y realizará una búsqueda sobre artículos que tengan como mínimo el precio indicado. Si se introduce algún string que no pueda ser parseado a *Number* se ignorará este filtro.
    > **Muy Importante**: No olvidar el guión que sigue al número para definir este filtro.

##### Precio máximo

    > */apiv1/anuncios?precio=-xxxx&token=[token-facilitado-en-la-autenticación]*
    > En este caso *xxxx* representa a cualquier cifra numérica y realizará una búsqueda sobre artículos que tengan como máximo el precio indicado. Si se introduce algún string que no pueda ser parseado a *Number* se ignorará este filtro.
    > **Muy Importante**: No olvidar el guión que precede al número para definir este filtro.

##### Rango de precios

    > */apiv1/anuncios?precio=xxxx-yyyy&token=[token-facilitado-en-la-autenticación]*
    > En este caso xxxx e yyyy representan a cualquier cifra numérica y definen el precio mínimo (xxxx) y el precio máximo (yyyy) del rango de la búsqueda de los artículos. Si se introduce algún string que no pueda ser parseado a *Number* se ignorará este filtro.
    > **Muy Importante**: No olvidar el guión que precede al número para definir este filtro.

#### Filtrando por tags

También podremos realizar filtros sobre los artículos en base a los tags con los que han sido guardados. Para ello habrá que utilizar una petición de la forma:

    > */apiv1/anuncios?tag=[nombre-tag]&token=[token-facilitado-en-la-autenticación]*
    > Donde [nombre-tag] es el nombre exacto (y teniendo en cuenta mayúsculas y minúsculas) del tag que queremos buscar en los artículos.

En caso de querer filtrar por varios tags simultáneamente podemos realizar la petición de la siguiente forma:

    > */apiv1/anuncios?tag=tag1&tag=tag2&token=[token-facilitado-en-la-autenticación]*
    > Es decir concatenando parejas de tag=[nombre-tag] en la URL de la petición. Ojo, esta capacidad de tags múltiples es exclusiva no inclusiva. Es decir, que si ponemos más de un tag el resultado arrojará los artículos que tengan uno o más tags de la lista facilitada. No se buscarán los artículos que tengan todos los tags simultáneamente.

#### Filtros para paginación

Tenemos disponibles también una serie de filtros útiles para la generación de la paginación:

    * **includeTotal**: Indicará el número total de resultados de la búsqueda.
    * **limit**: Limitará el número de resultados de una consulta dada.
    * **start**: Indicará el número de resultado donde empezar a generar los resultados.

Estos filtros se indican con su corresondiente nombre y el valor numérico (en el caso de *limit* y *start*) y con un valor booleano en el caso de *includeTotal*:

    > */apiv1/anuncios?start=50&limit=20&includeTotal=true&token=[token-facilitado-en-la-autenticación]*

#### Ordenando los resultados

Podemos ordenar los resultados de cualquier consulta a través del filtro *sort*. Solo tenemos que indicar el nombre del campo (de los definidos en el esquema de los anuncios) por el que queremos ordenar en la petición:

    > */apiv1/anuncios?sort=precio&token=[token-facilitado-en-la-autenticación]*

La ordenación que realiza es ascendente.

##### Compra/Venta o Cambio

La aplicación soporta estas dos modalidades en los productos anunciados. Podemos filtrar uno u otro tipo a través del filtro *venta* el cual recibirá un booleano. Si es *false* mostrará solo los artículos para cambio y si es *true* mostrará solo los que están en venta.

    > */apiv1/anuncios?venta=false&token=[token-facilitado-en-la-autenticación]*

## Internacionalización

La aplicación soporta la posibilidad de ofrecer los mensajes de error en dos idiomas: español e inglés. Por defecto, se trabajará en inglés pero en todo momento podemos añadir a cualquier petición el flag *lang* con el valor *es* para ver los mensajes en español.

Se puede indicar el idioma a través de la query, el body de una petición o las cabeceras.