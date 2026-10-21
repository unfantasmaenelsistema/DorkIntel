<p align="center">
  <a href="https://www.unfantasmaenelsistema.com/" target="_blank" rel="noopener noreferrer">
    <img src="icono.png" alt="Un Fantasma en el Sistema" width="120" height="120" />
  </a>
</p>

<h1 align="center">DORK//INTEL</h1>

<p align="center">
  <strong>Biblioteca de 162 Google dorks en 17 categorías para reconocimiento OSINT y auditorías autorizadas.</strong><br>
  Constructor de consultas, alcance limitado al dominio objetivo, historial, ES/EN y tema claro/oscuro. Todo en el navegador.
</p>

<p align="center">
  <a href="https://unfantasmaenelsistema.github.io/DorkIntel/"><strong>▶ Abrir DorkIntel</strong></a>
  ·
  <a href="https://www.unfantasmaenelsistema.com/">Un Fantasma en el Sistema</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML%2FJS-sin_dependencias-00ff41?style=flat-square&labelColor=020508" alt="Sin dependencias" />
  <img src="https://img.shields.io/badge/License-MIT-00d4ff?style=flat-square&labelColor=020508" alt="MIT" />
</p>

---

## ⚖️ Uso responsable

DorkIntel solo construye búsquedas de Google y las abre en una pestaña nueva: no escanea ni accede a nada. Aun así, úsalo **solo sobre dominios propios o con autorización por escrito** (auditorías, bug bounty dentro del alcance, formación). Que algo esté indexado no da permiso para entrar: acceder sin autorización a un panel, una cámara o un fichero ajeno puede ser delito (en España, art. 197 bis del Código Penal). Si encuentras datos de terceros expuestos, avisa al responsable o a [INCIBE-CERT](https://www.incibe.es/incibe-cert/notificaciones).

## 🌟 Qué hace

- **162 dorks en 17 categorías**: archivos expuestos, vulnerabilidades, credenciales, personas, redes, empresas, cámaras e IoT, subdominios, documentos, bases de datos, email, WordPress, paneles de login, FTP, redes sociales, configuraciones y dorks avanzados.
- **Dominio objetivo normalizado**: pega `https://www.ejemplo.com/ruta` y se queda en `ejemplo.com` (así `site:` cubre también los subdominios); si no es un dominio o una IP válidos, te avisa en vez de lanzar `{TARGET}` a Google.
- **Limitar al objetivo** (activado por defecto): los 34 dorks *globales* (los que no llevan `{TARGET}`, marcados como `GLOBAL`) reciben `site:objetivo` para no salir del alcance autorizado. Desactívalo solo para investigación general.
- **Constructor editable**: usa un dork como plantilla, modifícalo o escribe el tuyo con `{TARGET}`; la vista previa muestra la consulta exacta que se enviará. `Ctrl+Enter` lanza.
- **Historial** de las últimas 30 consultas (se guarda en tu navegador) y contador de lanzamientos.
- Interfaz en **español e inglés** y **tema claro/oscuro**. Respeta «reducir movimiento».

## 🔧 Operadores

`site:` `intitle:` `inurl:` `intext:` `filetype:`/`ext:` `before:`/`after:`, `-` para excluir y `OR` entre alternativas. Google retiró `cache:`, `info:` y `related:`, así que la base de dorks ya no los usa.

## 🚀 Uso local

Es una página estática: abre `index.html` o sírvela con cualquier servidor.

```bash
python -m http.server 8000
```

Pruebas (Node 20+):

```bash
node --test tests/dorks.test.js
```

## 📁 Estructura

```text
├── index.html      # Estructura de la página
├── styles.css      # Estilos (tema oscuro y claro)
├── dorks.js        # Base de dorks y motor de consultas (también se usa desde Node)
├── app.js          # Interfaz: filtros, constructor, historial, idioma y tema
├── icono.png       # Logo de Un Fantasma en el Sistema
└── tests/          # Pruebas de la base de dorks y del motor
```

## 📄 Licencia

[MIT](LICENSE) · Creado por [Un Fantasma en el Sistema](https://www.unfantasmaenelsistema.com/).
