// DorkIntel · base de dorks y motor de consultas (sin DOM: también se usa desde Node en las pruebas)
(function (root) {
  'use strict';

  // D(id, categoría, etiquetas, consulta, [título, descripción] ES, [title, description] EN)
  // {TARGET} se sustituye por el dominio objetivo ya normalizado.
  const D = (id, cat, tags, query, es, en) => ({ id, cat, tags, query, es: { title: es[0], desc: es[1] }, en: { title: en[0], desc: en[1] } });

  const DORKS = [
    // ── ARCHIVOS EXPUESTOS ──
    D('f1', 'archivos', ['warn', 'recon'], 'site:{TARGET} intitle:"index of"', ['Índices de directorio', 'Directorios web abiertos del objetivo'], ['Directory listings', 'Open web directories on the target']),
    D('f2', 'archivos', ['danger', 'creds'], 'intitle:"index of" "password.txt" OR "passwd.txt"', ['Archivos de contraseñas', 'Directorios con archivos de contraseñas expuestos'], ['Password files', 'Directory listings exposing password files']),
    D('f3', 'archivos', ['danger', 'files'], 'site:{TARGET} intitle:"index of" backup', ['Backups expuestos', 'Copias de seguridad del sitio accesibles públicamente'], ['Exposed backups', 'Site backups publicly reachable']),
    D('f4', 'archivos', ['danger', 'creds'], 'site:{TARGET} ext:env', ['Archivos .env', 'Archivos de entorno con variables y credenciales'], ['.env files', 'Environment files with variables and credentials']),
    D('f5', 'archivos', ['warn', 'files'], 'site:{TARGET} ext:bak OR ext:backup OR ext:old', ['Archivos .bak', 'Copias de archivos sin protección'], ['.bak files', 'Unprotected file copies']),
    D('f6', 'archivos', ['warn', 'recon'], 'site:{TARGET} ext:log', ['Archivos de log', 'Logs de sistema y aplicación expuestos'], ['Log files', 'Exposed system and application logs']),
    D('f7', 'archivos', ['danger', 'config'], 'site:{TARGET} ext:conf OR ext:config OR ext:cfg', ['Archivos de configuración', 'Ficheros de configuración accesibles'], ['Configuration files', 'Reachable configuration files']),
    D('f8', 'archivos', ['warn', 'config'], 'site:{TARGET} intitle:"index of" ".htaccess"', ['Ficheros .htaccess', 'Ficheros htaccess visibles en índices'], ['.htaccess files', 'htaccess files visible in listings']),
    D('f9', 'archivos', ['warn', 'files'], 'site:{TARGET} ext:zip OR ext:tar OR ext:gz', ['Archivos ZIP y TAR', 'Comprimidos accesibles públicamente'], ['ZIP and TAR archives', 'Publicly reachable archives']),
    D('f10', 'archivos', ['warn', 'data'], 'site:{TARGET} ext:xml inurl:data OR inurl:export', ['Archivos XML de datos', 'Exportaciones de datos en XML'], ['XML data files', 'XML data exports']),
    D('f11', 'archivos', ['danger', 'db'], 'site:{TARGET} ext:sql OR ext:db OR ext:sqlite', ['Dumps de base de datos', 'Volcados y bases de datos expuestas'], ['Database dumps', 'Exposed dumps and database files']),
    D('f12', 'archivos', ['danger', 'creds'], 'intitle:"index of" "id_rsa" OR ".pem" OR ".ppk"', ['Claves SSH', 'Claves SSH privadas expuestas en índices'], ['SSH keys', 'Private SSH keys exposed in listings']),
    D('f13', 'archivos', ['danger', 'creds'], 'intitle:"index of" ".key" OR ".p12" OR ".pfx"', ['Certificados privados', 'Claves y certificados privados expuestos'], ['Private certificates', 'Exposed private keys and certificates']),
    D('f14', 'archivos', ['info', 'recon'], 'site:{TARGET} intitle:"index of" ".DS_Store"', ['Archivos .DS_Store', 'Metadatos de carpetas de macOS que revelan nombres de ficheros'], ['.DS_Store files', 'macOS folder metadata revealing file names']),
    D('f15', 'archivos', ['info', 'files'], 'site:{TARGET} intitle:"index of" mp3 OR mp4 OR avi', ['Índices con audio y vídeo', 'Medios expuestos en directorios abiertos'], ['Audio/video listings', 'Media exposed in open directories']),

    // ── VULNERABILIDADES ──
    D('v1', 'vulnerabilidades', ['danger', 'sqli'], 'site:{TARGET} "error in your SQL syntax" OR "mysql_fetch"', ['Mensajes de error SQL', 'Errores SQL visibles: posible inyección SQL'], ['SQL error messages', 'Visible SQL errors: possible SQL injection']),
    D('v2', 'vulnerabilidades', ['danger', 'db'], 'site:{TARGET} intitle:"phpMyAdmin" inurl:phpmyadmin', ['phpMyAdmin del objetivo', 'Acceso a phpMyAdmin expuesto'], ['Target phpMyAdmin', 'Exposed phpMyAdmin access']),
    D('v3', 'vulnerabilidades', ['warn', 'recon'], 'site:{TARGET} "PHP Parse error" OR "PHP Warning" OR "PHP Fatal error"', ['Errores de PHP', 'Errores PHP que revelan rutas internas'], ['PHP errors', 'PHP errors revealing internal paths']),
    D('v4', 'vulnerabilidades', ['danger', 'login'], 'site:{TARGET} inurl:admin OR inurl:administrator OR inurl:cpanel', ['Paneles de administración', 'Interfaces de administración indexadas'], ['Admin panels', 'Indexed administration interfaces']),
    D('v5', 'vulnerabilidades', ['warn', 'upload'], 'site:{TARGET} inurl:upload OR inurl:fileupload intext:"upload"', ['Subidas de ficheros', 'Formularios de subida de archivos'], ['File uploads', 'File upload forms']),
    D('v6', 'vulnerabilidades', ['warn', 'recon'], 'site:{TARGET} intitle:"phpinfo()" OR inurl:phpinfo.php', ['phpinfo()', 'Páginas phpinfo con versión, módulos y variables del servidor'], ['phpinfo()', 'phpinfo pages with version, modules and server variables']),
    D('v7', 'vulnerabilidades', ['danger', 'recon'], 'site:{TARGET} inurl:server-status intitle:"Apache Status"', ['Apache server-status', 'Estado de Apache con peticiones e IP de clientes en directo'], ['Apache server-status', 'Apache status with live requests and client IPs']),
    D('v8', 'vulnerabilidades', ['warn', 'wp'], 'site:{TARGET} intext:"Warning: require" OR intext:"failed to open stream"', ['Errores de include', 'Errores de PHP/WordPress con rutas del servidor'], ['Include errors', 'PHP/WordPress errors with server paths']),
    D('v9', 'vulnerabilidades', ['warn', 'legacy'], 'site:{TARGET} inurl:cgi-bin ext:cgi OR ext:pl', ['Scripts CGI', 'Scripts CGI heredados, a menudo vulnerables'], ['CGI scripts', 'Legacy CGI scripts, often vulnerable']),
    D('v10', 'vulnerabilidades', ['warn', 'redirect'], 'site:{TARGET} inurl:redirect= OR inurl:url= OR inurl:next=', ['Open redirect', 'Parámetros de redirección que conviene validar'], ['Open redirect', 'Redirect parameters worth validating']),
    D('v11', 'vulnerabilidades', ['info', 'api'], 'site:{TARGET} ext:wsdl OR inurl:wsdl', ['Servicios WSDL/SOAP', 'Servicios web SOAP descritos públicamente'], ['WSDL/SOAP services', 'Publicly described SOAP web services']),
    D('v12', 'vulnerabilidades', ['warn', 'login'], 'site:{TARGET} inurl:login OR inurl:signin intitle:login', ['Formularios de login', 'Páginas de autenticación indexadas'], ['Login forms', 'Indexed authentication pages']),
    D('v13', 'vulnerabilidades', ['warn', 'api'], 'site:{TARGET} inurl:swagger OR intitle:"Swagger UI"', ['Swagger / documentación de API', 'Documentación de API REST expuesta'], ['Swagger / API docs', 'Exposed REST API documentation']),
    D('v14', 'vulnerabilidades', ['warn', 'api'], 'site:{TARGET} inurl:graphql OR inurl:graphiql', ['Endpoints GraphQL', 'Interfaces GraphQL públicas'], ['GraphQL endpoints', 'Public GraphQL interfaces']),
    D('v15', 'vulnerabilidades', ['danger', 'api'], 'site:{TARGET} inurl:actuator OR inurl:"actuator/env"', ['Spring Boot Actuator', 'Endpoints de monitorización de Spring Boot'], ['Spring Boot Actuator', 'Spring Boot monitoring endpoints']),

    // ── CREDENCIALES ──
    D('c1', 'credenciales', ['danger', 'creds'], 'site:{TARGET} intext:"password" OR intext:"passwd" ext:txt OR ext:log', ['Contraseñas en texto plano', 'Contraseñas en ficheros de texto o logs'], ['Plain-text passwords', 'Passwords in text files or logs']),
    D('c2', 'credenciales', ['danger', 'creds'], 'site:{TARGET} intext:"api_key" OR intext:"apikey" OR intext:"api_secret"', ['Claves API en código', 'Claves API escritas en el código publicado'], ['API keys in code', 'API keys hardcoded in published code']),
    D('c3', 'credenciales', ['danger', 'creds'], 'site:{TARGET} intext:"access_token" OR intext:"auth_token" OR intext:"bearer"', ['Tokens de acceso', 'Tokens de autenticación expuestos'], ['Access tokens', 'Exposed authentication tokens']),
    D('c4', 'credenciales', ['danger', 'creds'], 'site:{TARGET} inurl:user= inurl:password=', ['Credenciales en URLs', 'Credenciales enviadas como parámetros GET'], ['Credentials in URLs', 'Credentials sent as GET parameters']),
    D('c5', 'credenciales', ['danger', 'cloud'], 'site:{TARGET} intext:"AKIA" OR intext:"aws_access_key_id"', ['Claves de AWS', 'Claves de acceso de AWS expuestas'], ['AWS keys', 'Exposed AWS access keys']),
    D('c6', 'credenciales', ['danger', 'creds'], 'site:{TARGET} intext:"ghp_" OR intext:"github_token"', ['Tokens de GitHub', 'Personal Access Tokens de GitHub'], ['GitHub tokens', 'GitHub personal access tokens']),
    D('c7', 'credenciales', ['danger', 'db'], 'site:{TARGET} intext:"DB_PASSWORD" OR intext:"database_password" OR intext:"db_pass"', ['Conexiones a BD', 'Cadenas de conexión con credenciales'], ['DB connections', 'Connection strings with credentials']),
    D('c8', 'credenciales', ['danger', 'git'], 'site:{TARGET} inurl:".git/config"', ['Repositorio .git expuesto', 'Configuración de un repositorio Git publicada en la web'], ['Exposed .git repo', 'Git repository config published on the web']),
    D('c9', 'credenciales', ['danger', 'creds'], 'site:{TARGET} intext:"passphrase" OR intext:"secret_key" ext:yml OR ext:yaml', ['Secretos en YAML', 'Secretos en ficheros de configuración YAML'], ['Secrets in YAML', 'Secrets in YAML configuration files']),
    D('c10', 'credenciales', ['danger', 'cloud'], 'site:{TARGET} intext:"firebaseio.com" OR intext:"FIREBASE_API_KEY"', ['Claves de Firebase', 'Claves y URLs de Firebase expuestas'], ['Firebase keys', 'Exposed Firebase keys and URLs']),
    D('c11', 'credenciales', ['danger', 'creds'], 'site:{TARGET} intext:"BEGIN PGP PRIVATE KEY BLOCK"', ['Claves privadas PGP', 'Claves PGP privadas indexadas'], ['PGP private keys', 'Indexed PGP private keys']),
    D('c12', 'credenciales', ['danger', 'creds'], 'site:{TARGET} intext:"BEGIN RSA PRIVATE KEY"', ['Claves privadas RSA', 'Claves RSA privadas expuestas'], ['RSA private keys', 'Exposed RSA private keys']),

    // ── PERSONAS E IDENTIDAD ──
    D('p1', 'personas', ['info', 'email'], 'site:{TARGET} intext:"@{TARGET}"', ['Emails de contacto', 'Direcciones de correo del dominio objetivo'], ['Contact emails', 'Email addresses of the target domain']),
    D('p2', 'personas', ['info', 'social'], 'site:linkedin.com/in "{TARGET}"', ['Empleados en LinkedIn', 'Perfiles personales que mencionan el dominio'], ['Employees on LinkedIn', 'Personal profiles mentioning the domain']),
    D('p3', 'personas', ['info', 'osint'], '"{TARGET}" filetype:pdf intext:"curriculum" OR intext:"resume"', ['CV y currículums', 'CV que mencionan el dominio o la empresa'], ['CVs and résumés', 'CVs mentioning the domain or company']),
    D('p4', 'personas', ['info', 'git'], 'site:github.com "{TARGET}"', ['Código en GitHub', 'Repositorios y perfiles que mencionan el dominio'], ['Code on GitHub', 'Repositories and profiles mentioning the domain']),
    D('p5', 'personas', ['info', 'osint'], 'site:{TARGET} filetype:pdf OR filetype:doc intext:"director" OR intext:"CEO" OR intext:"CTO"', ['Documentos con cargos', 'Documentos que revelan la estructura de la organización'], ['Documents with roles', 'Documents revealing the org structure']),
    D('p6', 'personas', ['info', 'osint'], 'site:{TARGET} intext:"Tel:" OR intext:"Phone:" OR intext:"Mobile:"', ['Teléfonos de contacto', 'Páginas con datos de contacto personales'], ['Contact phones', 'Pages with personal contact details']),
    D('p7', 'personas', ['info', 'osint'], 'site:{TARGET} inurl:staff OR inurl:team OR inurl:people OR inurl:about', ['Directorio de personal', 'Páginas de equipo y personal'], ['Staff directory', 'Team and staff pages']),
    D('p8', 'personas', ['warn', 'leak'], 'site:pastebin.com "{TARGET}"', ['Menciones en Pastebin', 'El dominio aparece en pegados públicos (posibles fugas)'], ['Pastebin mentions', 'The domain appears in public pastes (possible leaks)']),

    // ── REDES Y SERVIDORES ──
    D('r1', 'redes', ['danger', 'network'], 'intitle:"Cisco" intext:"show running-config"', ['Configuraciones Cisco', 'Configuraciones de routers Cisco publicadas'], ['Cisco configs', 'Published Cisco router configurations']),
    D('r2', 'redes', ['danger', 'network'], 'intitle:"router" intext:"firmware" inurl:setup.cgi OR inurl:login.asp', ['Paneles de router', 'Interfaces de administración de routers'], ['Router panels', 'Router administration interfaces']),
    D('r3', 'redes', ['danger', 'network'], 'intitle:"Firewall" inurl:login OR inurl:admin', ['Firewalls expuestos', 'Paneles de gestión de firewalls'], ['Exposed firewalls', 'Firewall management panels']),
    D('r4', 'redes', ['warn', 'network'], 'site:{TARGET} inurl:snmp OR intitle:"SNMP"', ['SNMP', 'Páginas de agentes SNMP con información de red'], ['SNMP', 'SNMP agent pages with network data']),
    D('r5', 'redes', ['danger', 'admin'], 'intitle:"Webmin" inurl:10000', ['Webmin expuesto', 'Panel Webmin de gestión de servidores Linux'], ['Exposed Webmin', 'Webmin Linux server panel']),
    D('r6', 'redes', ['warn', 'network'], 'intitle:"Nagios" OR intitle:"Zabbix" inurl:login', ['Nagios / Zabbix', 'Sistemas de monitorización expuestos'], ['Nagios / Zabbix', 'Exposed monitoring systems']),
    D('r7', 'redes', ['warn', 'vpn'], 'site:{TARGET} intitle:"vpn" inurl:login OR inurl:portal', ['Paneles VPN', 'Portales VPN del objetivo'], ['VPN portals', 'Target VPN portals']),
    D('r8', 'redes', ['warn', 'ftp'], 'site:{TARGET} intitle:"index of" inurl:ftp', ['Carpetas FTP en la web', 'Directorios FTP servidos por HTTP e indexados'], ['FTP folders on the web', 'FTP directories served over HTTP and indexed']),
    D('r9', 'redes', ['info', 'network'], 'intitle:"Squid" inurl:squid_reports OR inurl:cachemgr', ['Proxies Squid', 'Interfaces de gestión de proxies Squid'], ['Squid proxies', 'Squid proxy management pages']),
    D('r10', 'redes', ['danger', 'db'], 'intitle:"Elasticsearch" inurl:9200 OR inurl:9300', ['Elasticsearch expuesto', 'Instancias de Elasticsearch sin autenticación'], ['Exposed Elasticsearch', 'Elasticsearch instances without auth']),
    D('r11', 'redes', ['danger', 'data'], 'intitle:"Kibana" inurl:5601', ['Kibana expuesto', 'Paneles de Kibana accesibles'], ['Exposed Kibana', 'Reachable Kibana dashboards']),

    // ── EMPRESAS Y DOMINIOS ──
    D('e1', 'empresas', ['info', 'docs'], 'site:{TARGET} filetype:pdf OR filetype:doc OR filetype:xls', ['Documentos corporativos', 'Documentación corporativa indexada'], ['Corporate documents', 'Indexed corporate documents']),
    D('e2', 'empresas', ['info', 'finance'], 'site:{TARGET} filetype:pdf "informe anual" OR "annual report"', ['Informes anuales', 'Informes financieros y anuales'], ['Annual reports', 'Financial and annual reports']),
    D('e3', 'empresas', ['warn', 'recon'], 'site:{TARGET} inurl:dev OR inurl:test OR inurl:staging OR inurl:qa', ['Rutas de desarrollo y pruebas', 'Entornos de desarrollo y pruebas accesibles'], ['Dev and test paths', 'Reachable development and test environments']),
    D('e4', 'empresas', ['info', 'osint'], '"{TARGET}" -site:{TARGET}', ['Menciones externas', 'Páginas de otros sitios que citan el dominio'], ['External mentions', 'Pages on other sites citing the domain']),
    D('e5', 'empresas', ['info', 'recon'], '"{TARGET}" whois OR "registrant" OR "nameserver"', ['Datos de registro', 'Información WHOIS y DNS publicada en otras webs'], ['Registration data', 'WHOIS and DNS data published elsewhere']),
    D('e6', 'empresas', ['info', 'docs'], 'site:{TARGET} filetype:ppt OR filetype:pptx', ['Presentaciones', 'PowerPoints corporativos'], ['Presentations', 'Corporate PowerPoints']),
    D('e7', 'empresas', ['info', 'recon'], 'site:{TARGET} inurl:jobs OR inurl:careers OR intitle:"vacante"', ['Ofertas de trabajo', 'Las ofertas revelan tecnologías y estructura'], ['Job offers', 'Job ads reveal technologies and structure']),
    D('e8', 'empresas', ['info', 'osint'], 'site:slideshare.net "{TARGET}"', ['SlideShare', 'Presentaciones que mencionan el objetivo'], ['SlideShare', 'Presentations mentioning the target']),
    D('e9', 'empresas', ['info', 'osint'], 'site:scribd.com "{TARGET}"', ['Scribd', 'Documentos relacionados con el objetivo'], ['Scribd', 'Documents related to the target']),

    // ── CÁMARAS E IoT ──
    D('cam1', 'camaras', ['danger', 'cam'], 'intitle:"Live View / - AXIS"', ['Cámaras Axis', 'Visor en directo de cámaras Axis'], ['Axis cameras', 'Axis camera live view']),
    D('cam2', 'camaras', ['danger', 'cam'], 'intitle:"network camera" inurl:view.cgi', ['Cámaras IP genéricas', 'Visores web de cámaras IP'], ['Generic IP cameras', 'IP camera web viewers']),
    D('cam3', 'camaras', ['danger', 'cam'], 'intitle:"webcam" inurl:view.shtml OR inurl:viewerframe', ['Webcams públicas', 'Streams de webcam accesibles'], ['Public webcams', 'Reachable webcam streams']),
    D('cam4', 'camaras', ['danger', 'cam'], 'intitle:"Hikvision" inurl:doc/page/login.asp', ['Cámaras Hikvision', 'Panel de acceso a cámaras Hikvision'], ['Hikvision cameras', 'Hikvision camera login panel']),
    D('cam5', 'camaras', ['danger', 'cam'], 'intitle:"DVR login" OR intitle:"NVR login"', ['DVR / NVR', 'Grabadores de videovigilancia accesibles'], ['DVR / NVR', 'Reachable video surveillance recorders']),
    D('cam6', 'camaras', ['danger', 'cam'], 'intitle:"Dahua" inurl:login.asp OR inurl:index.asp', ['Paneles Dahua', 'Cámaras Dahua con panel expuesto'], ['Dahua panels', 'Dahua cameras with exposed panel']),
    D('cam7', 'camaras', ['danger', 'cam'], 'inurl:"view/view.shtml" OR inurl:"ViewerFrame?Mode="', ['Netcam / Netwave', 'Streams directos de cámaras Netwave'], ['Netcam / Netwave', 'Direct Netwave camera streams']),
    D('cam8', 'camaras', ['danger', 'cam'], 'inurl:"axis-cgi/mjpg"', ['Streams MJPEG de Axis', 'Vídeo MJPEG servido directamente por cámaras Axis'], ['Axis MJPEG streams', 'MJPEG video served directly by Axis cameras']),

    // ── SUBDOMINIOS ──
    D('sub1', 'subdominios', ['info', 'recon'], 'site:{TARGET} -site:www.{TARGET}', ['Todos los subdominios', 'Todo lo indexado del dominio salvo www: aparecen los subdominios'], ['All subdomains', 'Everything indexed except www: subdomains show up']),
    D('sub2', 'subdominios', ['info', 'email'], 'site:mail.{TARGET} OR site:smtp.{TARGET} OR site:webmail.{TARGET}', ['Subdominios de correo', 'Servidores de correo del objetivo'], ['Mail subdomains', 'Target mail servers']),
    D('sub3', 'subdominios', ['info', 'api'], 'site:api.{TARGET} OR site:ws.{TARGET} OR site:services.{TARGET}', ['APIs y servicios', 'Subdominios de API y servicios web'], ['APIs and services', 'API and web service subdomains']),
    D('sub4', 'subdominios', ['warn', 'recon'], 'site:dev.{TARGET} OR site:test.{TARGET} OR site:staging.{TARGET}', ['Entornos dev/stage', 'Entornos no productivos accesibles'], ['Dev/stage environments', 'Reachable non-production environments']),
    D('sub5', 'subdominios', ['danger', 'recon'], 'site:intranet.{TARGET} OR site:internal.{TARGET} OR site:corp.{TARGET}', ['Intranets expuestas', 'Subdominios de uso interno indexados'], ['Exposed intranets', 'Indexed internal-use subdomains']),
    D('sub6', 'subdominios', ['info', 'recon'], 'site:cdn.{TARGET} OR site:static.{TARGET} OR site:assets.{TARGET}', ['CDN y estáticos', 'Servidores de contenido estático'], ['CDN and static', 'Static content servers']),
    D('sub7', 'subdominios', ['danger', 'admin'], 'site:admin.{TARGET} OR site:panel.{TARGET} OR site:dashboard.{TARGET}', ['Subdominios de administración', 'Paneles en subdominios propios'], ['Admin subdomains', 'Panels on their own subdomains']),
    D('sub8', 'subdominios', ['warn', 'vpn'], 'site:vpn.{TARGET} OR site:remote.{TARGET} OR site:access.{TARGET}', ['VPN y acceso remoto', 'Portales de acceso remoto'], ['VPN and remote access', 'Remote access portals']),

    // ── DOCUMENTOS SENSIBLES ──
    D('d1', 'documentos', ['warn', 'data'], 'site:{TARGET} filetype:xls OR filetype:xlsx', ['Hojas de cálculo', 'Excel con posibles datos sensibles'], ['Spreadsheets', 'Excel files with possible sensitive data']),
    D('d2', 'documentos', ['danger', 'docs'], 'site:{TARGET} filetype:pdf "confidential" OR "internal use only"', ['PDF confidenciales', 'PDF marcados como confidenciales'], ['Confidential PDFs', 'PDFs marked confidential']),
    D('d3', 'documentos', ['danger', 'docs'], 'site:{TARGET} filetype:pdf "contrato" OR "acuerdo" OR "NDA"', ['Contratos y acuerdos', 'Contratos y documentos legales'], ['Contracts and agreements', 'Contracts and legal documents']),
    D('d4', 'documentos', ['warn', 'docs'], 'site:{TARGET} filetype:doc OR filetype:docx "confidential" OR "internal"', ['Word internos', 'Documentos Word marcados como internos'], ['Internal Word files', 'Word documents marked internal']),
    D('d5', 'documentos', ['danger', 'finance'], 'site:{TARGET} filetype:xls "balance" OR "presupuesto" OR "budget"', ['Balances y presupuestos', 'Documentos financieros expuestos'], ['Balances and budgets', 'Exposed financial documents']),
    D('d6', 'documentos', ['danger', 'gdpr'], 'site:{TARGET} filetype:xls OR filetype:csv "DNI" OR "NIF" OR "email" OR "teléfono"', ['Datos personales (RGPD)', 'Hojas con posibles datos personales'], ['Personal data (GDPR)', 'Sheets with possible personal data']),
    D('d7', 'documentos', ['info', 'docs'], 'site:{TARGET} filetype:doc "meeting notes" OR "acta" OR "minutes"', ['Actas de reuniones', 'Actas e informes de reuniones'], ['Meeting minutes', 'Meeting minutes and reports']),
    D('d8', 'documentos', ['warn', 'recon'], 'site:{TARGET} filetype:xls OR filetype:xlsx "inventario" OR "inventory" OR "asset"', ['Inventario IT', 'Inventarios de activos informáticos'], ['IT inventory', 'IT asset inventories']),

    // ── BASES DE DATOS ──
    D('db1', 'bases-datos', ['danger', 'db'], 'intitle:"phpMyAdmin" inurl:phpmyadmin', ['phpMyAdmin (global)', 'phpMyAdmin indexados en cualquier sitio'], ['phpMyAdmin (global)', 'phpMyAdmin indexed anywhere']),
    D('db2', 'bases-datos', ['danger', 'db'], 'intitle:"MongoDB Statistics" OR inurl:28017', ['MongoDB expuesto', 'MongoDB con interfaz web expuesta'], ['Exposed MongoDB', 'MongoDB with exposed web interface']),
    D('db3', 'bases-datos', ['danger', 'db'], 'intitle:"Redis Commander" OR intitle:"Redis Monitor"', ['Redis expuesto', 'Consolas de administración de Redis'], ['Exposed Redis', 'Redis admin consoles']),
    D('db4', 'bases-datos', ['danger', 'db'], 'intitle:"Adminer" inurl:adminer.php', ['Adminer expuesto', 'Gestor Adminer accesible'], ['Exposed Adminer', 'Reachable Adminer manager']),
    D('db5', 'bases-datos', ['danger', 'db'], 'site:{TARGET} filetype:sql "INSERT INTO"', ['Volcados SQL con datos', 'Ficheros SQL que contienen datos (INSERT INTO)'], ['SQL dumps with data', 'SQL files containing data (INSERT INTO)']),
    D('db6', 'bases-datos', ['danger', 'db'], 'intitle:"CouchDB" inurl:"_utils"', ['CouchDB expuesto', 'Interfaz Futon/Fauxton de CouchDB'], ['Exposed CouchDB', 'CouchDB Futon/Fauxton interface']),
    D('db7', 'bases-datos', ['danger', 'db'], 'intitle:"Cassandra" OR intitle:"DataStax" inurl:8888', ['Cassandra expuesto', 'Consolas de Cassandra accesibles'], ['Exposed Cassandra', 'Reachable Cassandra consoles']),
    D('db8', 'bases-datos', ['danger', 'admin'], 'intitle:"Oracle WebLogic Server" inurl:console', ['Oracle WebLogic', 'Consola de WebLogic expuesta'], ['Oracle WebLogic', 'Exposed WebLogic console']),

    // ── EMAIL Y COMUNICACIONES ──
    D('em1', 'email', ['info', 'email'], 'site:{TARGET} inurl:webmail OR inurl:roundcube OR inurl:horde', ['Webmail', 'Clientes webmail accesibles'], ['Webmail', 'Reachable webmail clients']),
    D('em2', 'email', ['warn', 'email'], 'site:{TARGET} inurl:owa OR intitle:"Outlook Web"', ['Exchange OWA', 'Outlook Web Access de Exchange'], ['Exchange OWA', 'Exchange Outlook Web Access']),
    D('em3', 'email', ['info', 'email'], 'site:{TARGET} inurl:mailman OR intitle:"Mailing List"', ['Listas de correo', 'Interfaces de listas de correo'], ['Mailing lists', 'Mailing list interfaces']),
    D('em4', 'email', ['warn', 'email'], 'site:{TARGET} intext:"@{TARGET}" ext:txt OR ext:csv', ['Emails en ficheros planos', 'Listados de correos en TXT o CSV'], ['Emails in plain files', 'Email lists in TXT or CSV']),
    D('em5', 'email', ['info', 'email'], 'site:{TARGET} filetype:pdf "@{TARGET}"', ['Correos en PDF', 'PDF con direcciones del dominio'], ['Emails in PDFs', 'PDFs with domain addresses']),
    D('em6', 'email', ['warn', 'leak'], 'site:pastebin.com "@{TARGET}" smtp OR mail', ['SMTP en Pastebin', 'Configuraciones de correo filtradas en Pastebin'], ['SMTP on Pastebin', 'Mail settings leaked on Pastebin']),

    // ── WORDPRESS ──
    D('wp1', 'wordpress', ['info', 'wp'], 'site:{TARGET} inurl:wp-login.php', ['Login de WordPress', 'Página de acceso de WordPress'], ['WordPress login', 'WordPress login page']),
    D('wp2', 'wordpress', ['warn', 'wp'], 'site:{TARGET} inurl:wp-admin', ['wp-admin', 'Rutas de administración de WordPress indexadas'], ['wp-admin', 'Indexed WordPress admin paths']),
    D('wp3', 'wordpress', ['warn', 'wp'], 'site:{TARGET} inurl:wp-content/plugins', ['Plugins', 'Directorio de plugins: revela qué plugins (y versiones) usa'], ['Plugins', 'Plugin directory: reveals plugins (and versions) in use']),
    D('wp4', 'wordpress', ['info', 'wp'], 'site:{TARGET} inurl:wp-content/themes', ['Temas', 'Directorio de temas de WordPress'], ['Themes', 'WordPress themes directory']),
    D('wp5', 'wordpress', ['danger', 'wp'], 'site:{TARGET} inurl:wp-config.php.bak OR inurl:wp-config.old', ['Copias de wp-config', 'Backup del fichero con las credenciales de la BD'], ['wp-config backups', 'Backup of the file holding DB credentials']),
    D('wp6', 'wordpress', ['warn', 'wp'], 'site:{TARGET} inurl:xmlrpc.php', ['xmlrpc.php', 'Interfaz XML-RPC (usada en ataques de fuerza bruta)'], ['xmlrpc.php', 'XML-RPC interface (used in brute-force attacks)']),
    D('wp7', 'wordpress', ['info', 'wp'], 'site:{TARGET} inurl:"?author="', ['Usuarios de WordPress', 'Enumeración de autores/usuarios'], ['WordPress users', 'Author/user enumeration']),
    D('wp8', 'wordpress', ['info', 'wp'], 'site:{TARGET} inurl:readme.html intitle:"WordPress"', ['readme de WordPress', 'Readme que revela la versión'], ['WordPress readme', 'Readme revealing the version']),
    D('wp9', 'wordpress', ['danger', 'wp'], 'site:{TARGET} inurl:wp-content/debug.log', ['debug.log', 'Log de depuración con errores internos'], ['debug.log', 'Debug log with internal errors']),

    // ── PANELES DE LOGIN ──
    D('l1', 'login', ['info', 'login'], 'site:{TARGET} intitle:"admin" inurl:login OR inurl:signin', ['Logins de administración', 'Paneles de administración con login'], ['Admin logins', 'Admin panels with login']),
    D('l2', 'login', ['warn', 'admin'], 'site:{TARGET} inurl:2082 OR inurl:2083 OR inurl:2086', ['cPanel / WHM', 'Paneles de hosting cPanel y WHM'], ['cPanel / WHM', 'cPanel and WHM hosting panels']),
    D('l3', 'login', ['warn', 'admin'], 'site:{TARGET} intitle:"Plesk" inurl:login', ['Plesk', 'Panel Plesk de hosting'], ['Plesk', 'Plesk hosting panel']),
    D('l4', 'login', ['warn', 'cms'], 'site:{TARGET} inurl:administrator intitle:"Joomla"', ['Joomla', 'Administración de Joomla'], ['Joomla', 'Joomla administration']),
    D('l5', 'login', ['warn', 'cms'], 'site:{TARGET} inurl:user/login OR inurl:admin/config', ['Drupal', 'Administración de Drupal'], ['Drupal', 'Drupal administration']),
    D('l6', 'login', ['danger', 'devops'], 'intitle:"Dashboard [Jenkins]"', ['Jenkins expuesto', 'Servidores CI/CD Jenkins accesibles'], ['Exposed Jenkins', 'Reachable Jenkins CI/CD servers']),
    D('l7', 'login', ['warn', 'git'], 'site:{TARGET} intitle:"GitLab" inurl:users/sign_in', ['GitLab propio', 'Instancias de GitLab autoalojadas'], ['Self-hosted GitLab', 'Self-hosted GitLab instances']),
    D('l8', 'login', ['danger', 'devops'], 'intitle:"Portainer" inurl:9000', ['Portainer', 'Panel de gestión de Docker'], ['Portainer', 'Docker management panel']),
    D('l9', 'login', ['warn', 'monitor'], 'intitle:"Grafana" inurl:login', ['Grafana', 'Paneles de Grafana accesibles'], ['Grafana', 'Reachable Grafana dashboards']),
    D('l10', 'login', ['danger', 'devops'], 'intitle:"Kubernetes Dashboard"', ['Kubernetes Dashboard', 'Dashboard de Kubernetes expuesto'], ['Kubernetes Dashboard', 'Exposed Kubernetes dashboard']),

    // ── FTP ──
    D('ftp1', 'ftp', ['warn', 'ftp'], 'intitle:"index of" inurl:ftp', ['Índices FTP en la web', 'Directorios FTP accesibles por HTTP'], ['FTP listings on the web', 'FTP directories reachable over HTTP']),
    D('ftp2', 'ftp', ['info', 'ftp'], '"ftp://{TARGET}" OR "ftp.{TARGET}"', ['Servidores FTP citados', 'Páginas que enlazan al FTP del objetivo'], ['Referenced FTP servers', 'Pages linking to the target FTP']),
    D('ftp3', 'ftp', ['danger', 'ftp'], 'intitle:"index of" inurl:ftp "password.txt" OR "passwd"', ['Contraseñas en FTP', 'Archivos de contraseñas en FTP expuesto'], ['Passwords on FTP', 'Password files on exposed FTP']),
    D('ftp4', 'ftp', ['warn', 'ftp'], 'site:{TARGET} intitle:"index of" ftp', ['FTP del objetivo', 'FTP del objetivo indexado en Google'], ['Target FTP', 'Target FTP indexed by Google']),

    // ── REDES SOCIALES ──
    D('s1', 'social', ['info', 'social'], 'site:twitter.com OR site:x.com "{TARGET}"', ['Twitter/X', 'Menciones del objetivo en Twitter/X'], ['Twitter/X', 'Mentions of the target on Twitter/X']),
    D('s2', 'social', ['info', 'social'], 'site:linkedin.com/company "{TARGET}"', ['LinkedIn empresa', 'Perfil de empresa en LinkedIn'], ['LinkedIn company', 'Company profile on LinkedIn']),
    D('s3', 'social', ['info', 'social'], 'site:facebook.com "{TARGET}"', ['Facebook', 'Páginas y menciones en Facebook'], ['Facebook', 'Pages and mentions on Facebook']),
    D('s4', 'social', ['info', 'social'], 'site:instagram.com "{TARGET}"', ['Instagram', 'Perfiles e imágenes en Instagram'], ['Instagram', 'Profiles and images on Instagram']),
    D('s5', 'social', ['info', 'social'], 'site:reddit.com "{TARGET}"', ['Reddit', 'Menciones y debates en Reddit'], ['Reddit', 'Mentions and threads on Reddit']),
    D('s6', 'social', ['info', 'git'], 'site:github.com/orgs OR site:gist.github.com "{TARGET}"', ['GitHub orgs y gists', 'Organizaciones y gists que mencionan el dominio'], ['GitHub orgs and gists', 'Orgs and gists mentioning the domain']),
    D('s7', 'social', ['info', 'social'], 'site:glassdoor.com "{TARGET}"', ['Glassdoor', 'Opiniones de empleados sobre la empresa'], ['Glassdoor', 'Employee reviews of the company']),
    D('s8', 'social', ['info', 'social'], 'site:youtube.com "{TARGET}"', ['YouTube', 'Vídeos relacionados con el objetivo'], ['YouTube', 'Videos related to the target']),
    D('s9', 'social', ['info', 'social'], 'site:mastodon.social OR site:infosec.exchange "{TARGET}"', ['Mastodon / Fediverso', 'Menciones en el Fediverso'], ['Mastodon / Fediverse', 'Mentions on the Fediverse']),

    // ── CONFIGURACIONES Y SECRETOS ──
    D('cfg1', 'config', ['danger', 'git'], 'intitle:"index of" ".git"', ['Carpetas .git listadas', 'Repositorios Git navegables desde la web'], ['Listed .git folders', 'Git repositories browsable from the web']),
    D('cfg2', 'config', ['danger', 'devops'], 'site:{TARGET} ext:yml "docker-compose" OR inurl:docker-compose', ['docker-compose', 'Ficheros docker-compose con servicios y credenciales'], ['docker-compose', 'docker-compose files with services and credentials']),
    D('cfg3', 'config', ['danger', 'devops'], 'site:{TARGET} ext:yaml "apiVersion" "kind:"', ['Manifiestos de Kubernetes', 'Manifiestos de Kubernetes expuestos'], ['Kubernetes manifests', 'Exposed Kubernetes manifests']),
    D('cfg4', 'config', ['danger', 'devops'], 'site:{TARGET} ext:yml "hosts:" "tasks:"', ['Playbooks de Ansible', 'Playbooks de Ansible con configuraciones'], ['Ansible playbooks', 'Ansible playbooks with configuration']),
    D('cfg5', 'config', ['warn', 'devops'], 'site:{TARGET} inurl:.travis.yml OR inurl:.gitlab-ci.yml', ['Pipelines de CI', 'Pipelines de integración continua con posibles credenciales'], ['CI pipelines', 'Continuous integration pipelines with possible credentials']),
    D('cfg6', 'config', ['warn', 'devops'], 'site:{TARGET} inurl:Jenkinsfile OR ext:groovy "pipeline"', ['Jenkinsfile', 'Pipelines de Jenkins publicados'], ['Jenkinsfile', 'Published Jenkins pipelines']),
    D('cfg7', 'config', ['danger', 'creds'], 'site:{TARGET} inurl:.npmrc OR ext:npmrc', ['.npmrc', 'Tokens de NPM y registros privados'], ['.npmrc', 'NPM tokens and private registries']),
    D('cfg8', 'config', ['danger', 'cloud'], 'site:{TARGET} ext:tf "resource" OR ext:tfvars', ['Terraform', 'Infraestructura como código expuesta'], ['Terraform', 'Exposed infrastructure as code']),
    D('cfg9', 'config', ['danger', 'recon'], 'intitle:"index of" ".bash_history"', ['.bash_history', 'Historial de comandos bash expuesto'], ['.bash_history', 'Exposed bash command history']),
    D('cfg10', 'config', ['danger', 'config'], 'site:{TARGET} inurl:web.config ext:config', ['web.config de IIS', 'Configuración de IIS con posibles credenciales'], ['IIS web.config', 'IIS configuration with possible credentials']),

    // ── DORKS AVANZADOS ──
    D('adv1', 'combinado', ['danger', 'sqli'], 'site:{TARGET} inurl:login intext:"SQL syntax"', ['Login + error SQL', 'Logins que muestran errores SQL'], ['Login + SQL error', 'Logins showing SQL errors']),
    D('adv2', 'combinado', ['info', 'recon'], 'site:{TARGET} inurl:robots.txt intext:"Disallow"', ['robots.txt indexado', 'Las rutas Disallow son lo que el sitio prefiere no mostrar'], ['Indexed robots.txt', 'Disallow paths are what the site would rather hide']),
    D('adv3', 'combinado', ['danger', 'upload'], 'site:{TARGET} inurl:upload ext:php', ['Upload + PHP', 'Scripts PHP de subida de archivos'], ['Upload + PHP', 'PHP file upload scripts']),
    D('adv4', 'combinado', ['danger', 'creds'], 'site:{TARGET} ext:xml intext:"username" intext:"password"', ['Usuario y contraseña en XML', 'XML con credenciales escritas'], ['Username and password in XML', 'XML with written credentials']),
    D('adv5', 'combinado', ['danger', 'creds'], 'site:{TARGET} ext:json intext:"token" OR intext:"secret"', ['Tokens en JSON', 'JSON con tokens y secretos'], ['Tokens in JSON', 'JSON with tokens and secrets']),
    D('adv6', 'combinado', ['danger', 'creds'], 'site:{TARGET} intitle:"index of" intext:"password" OR intext:"passwd"', ['Índice + passwd', 'Directorios con referencias a contraseñas'], ['Listing + passwd', 'Directories referencing passwords']),
    D('adv7', 'combinado', ['warn', 'finance'], 'site:{TARGET} filetype:pdf "invoice" OR "factura" OR "billing"', ['Facturas en PDF', 'Facturas y documentos de facturación'], ['Invoices in PDF', 'Invoices and billing documents']),
    D('adv8', 'combinado', ['danger', 'creds'], 'site:{TARGET} ext:json "api_key" OR "apiKey" OR "access_key"', ['Claves API en JSON', 'JSON de configuración con claves API'], ['API keys in JSON', 'Config JSON with API keys']),
    D('adv9', 'combinado', ['info', 'recon'], 'site:{TARGET} before:2020-01-01', ['Contenido antiguo', 'Páginas fechadas antes de 2020: contenido olvidado sin mantener'], ['Old content', 'Pages dated before 2020: forgotten, unmaintained content']),
    D('adv10', 'combinado', ['info', 'osint'], 'inurl:{TARGET} -site:{TARGET}', ['URL de terceros con el dominio', 'Escáneres, acortadores y enlaces externos que incluyen el dominio'], ['Third-party URLs with the domain', 'Scanners, shorteners and external links including the domain']),
    D('adv11', 'combinado', ['warn', 'recon'], 'site:{TARGET} ext:php inurl:"?"', ['PHP con parámetros', 'Páginas PHP con parámetros: superficie para pruebas de inyección'], ['PHP with parameters', 'PHP pages with parameters: injection testing surface']),
    D('adv12', 'combinado', ['info', 'osint'], 'site:web.archive.org "{TARGET}"', ['Wayback Machine', 'Versiones archivadas del objetivo'], ['Wayback Machine', 'Archived versions of the target']),
  ];

  const CATEGORIES = [
    { id: 'all', icon: '◈', color: 'var(--green)', es: 'Todos los dorks', en: 'All dorks' },
    { id: 'archivos', icon: '📂', color: 'var(--cyan)', es: 'Archivos expuestos', en: 'Exposed files' },
    { id: 'vulnerabilidades', icon: '⚠', color: 'var(--red)', es: 'Vulnerabilidades', en: 'Vulnerabilities' },
    { id: 'credenciales', icon: '🔑', color: 'var(--amber)', es: 'Credenciales', en: 'Credentials' },
    { id: 'personas', icon: '👤', color: 'var(--purple)', es: 'Personas y OSINT', en: 'People & OSINT' },
    { id: 'redes', icon: '🌐', color: 'var(--green)', es: 'Redes y servidores', en: 'Networks & servers' },
    { id: 'empresas', icon: '🏢', color: 'var(--cyan2)', es: 'Empresas y dominios', en: 'Companies & domains' },
    { id: 'camaras', icon: '📷', color: 'var(--pink)', es: 'Cámaras e IoT', en: 'Cameras & IoT' },
    { id: 'subdominios', icon: '🔗', color: '#ff8c00', es: 'Subdominios', en: 'Subdomains' },
    { id: 'documentos', icon: '📄', color: '#88cc00', es: 'Documentos sensibles', en: 'Sensitive documents' },
    { id: 'bases-datos', icon: '🗄', color: '#cc44ff', es: 'Bases de datos', en: 'Databases' },
    { id: 'email', icon: '✉', color: 'var(--cyan)', es: 'Email y comunicaciones', en: 'Email & messaging' },
    { id: 'wordpress', icon: 'W', color: '#21759b', es: 'WordPress', en: 'WordPress' },
    { id: 'login', icon: '🔐', color: 'var(--amber)', es: 'Paneles de login', en: 'Login panels' },
    { id: 'ftp', icon: '📡', color: 'var(--green)', es: 'FTP', en: 'FTP' },
    { id: 'social', icon: '💬', color: 'var(--purple)', es: 'Redes sociales', en: 'Social media' },
    { id: 'config', icon: '⚙', color: 'var(--red)', es: 'Configs y secretos', en: 'Configs & secrets' },
    { id: 'combinado', icon: '🎯', color: '#ff6600', es: 'Dorks avanzados', en: 'Advanced dorks' },
  ];

  // Operadores que Google sigue admitiendo (cache:, info: y related: se retiraron en 2023-2024)
  const OPERATORS = ['site:', 'intitle:', 'allintitle:', 'inurl:', 'allinurl:', 'intext:', 'allintext:', 'filetype:', 'ext:', 'before:', 'after:'];
  const RETIRED_OPERATORS = ['cache:', 'info:', 'related:', 'link:', 'inanchor:'];

  const isGlobal = (query) => !query.includes('{TARGET}');

  // Convierte lo que escribe el usuario en un dominio limpio para site:
  // "https://www.Ejemplo.com:8080/ruta?x=1" -> "ejemplo.com"
  function normalizeTarget(input) {
    let t = String(input || '').trim().toLowerCase();
    if (!t) return { value: '', valid: true };
    t = t.replace(/^[a-z][a-z0-9+.-]*:\/\//, '');   // esquema
    t = t.replace(/^[^@/]*@/, '');                   // usuario@
    t = t.split(/[/?#]/)[0];                         // ruta, query y fragmento
    t = t.replace(/:\d+$/, '');                      // puerto
    t = t.replace(/^\*\./, '').replace(/\.$/, '');   // comodín y punto final
    t = t.replace(/^www\./, '');                    // site:ejemplo.com ya incluye www y el resto de subdominios
    const isIp = /^(\d{1,3})(\.\d{1,3}){3}$/.test(t) && t.split('.').every((o) => Number(o) <= 255);
    const isDomain = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z][a-z0-9-]{0,61}[a-z0-9]$/.test(t);
    return { value: isIp || isDomain ? t : '', valid: isIp || isDomain };
  }

  // Sustituye {TARGET}; con scope=true añade site: a los dorks globales para no salir del objetivo
  function buildQuery(query, target, scope) {
    let q = String(query || '');
    if (target) {
      q = q.replace(/\{TARGET\}/g, target);
      if (scope && isGlobal(query) && !/(^|\s)site:/i.test(query)) q = `site:${target} ${q}`;
    }
    return q.trim();
  }

  const needsTarget = (query, scope) => /\{TARGET\}/.test(query) || (scope && isGlobal(query));

  function googleUrl(query) {
    return 'https://www.google.com/search?q=' + encodeURIComponent(query);
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Resalta operadores, valores entre comillas y {TARGET}. Escapa antes: la consulta puede venir del usuario.
  function colorizeQuery(query) {
    const ops = [...OPERATORS, ...RETIRED_OPERATORS].map((o) => o.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    return escapeHtml(query)
      .replace(/&quot;(.*?)&quot;/g, '<span class="q">&quot;</span><span class="val">$1</span><span class="q">&quot;</span>')
      .replace(new RegExp(`(^|\\s|-)(${ops})`, 'gi'), '$1<span class="op">$2</span>')
      .replace(/(^|\s)(OR|AND)(?=\s|$)/g, '$1<span class="op">$2</span>')
      .replace(/\{TARGET\}/g, '<span class="site">{TARGET}</span>');
  }

  const api = { DORKS, CATEGORIES, OPERATORS, RETIRED_OPERATORS, isGlobal, normalizeTarget, buildQuery, needsTarget, googleUrl, escapeHtml, colorizeQuery };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.DorkIntel = api;
})(typeof window !== 'undefined' ? window : globalThis);
