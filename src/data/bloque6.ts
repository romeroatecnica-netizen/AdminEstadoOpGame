import { Question } from '../types';

export const BLOQUE_6_QUESTIONS: Question[] = [
  {
    id: 'b6-q01',
    block: 6,
    topic: 'Informática Básica — Memorias',
    question: 'En la arquitectura de un ordenador, ¿cuál de los siguientes tipos de memoria es volátil, de acceso aleatorio y mucho más rápida que el almacenamiento secundario (SSD/HDD), pero más lenta que los registros del procesador y la memoria caché L1?',
    options: [
      'Memoria ROM (BIOS/UEFI).',
      'Memoria RAM (Random Access Memory).',
      'Memoria Flash NAND.',
      'Memoria EPROM.'
    ],
    correctIndex: 1,
    articleRef: 'Arquitectura de Computadores — Jerarquía de Memoria',
    explanation: 'La memoria RAM es volátil (pierde su contenido al apagar el equipo) y se sitúa jerárquicamente entre la memoria caché (L1/L2/L3) del procesador y el almacenamiento secundario (SSD/HDD).',
    difficulty: 'base',
  },
  {
    id: 'b6-q02',
    block: 6,
    topic: 'Windows 10/11 — Atajos de Teclado',
    question: 'En Windows 10 y Windows 11, ¿qué combinación de teclas abre directamente el Administrador de tareas (Task Manager)?',
    options: [
      'Windows + E',
      'Ctrl + Mayús + Esc',
      'Windows + L',
      'Alt + Tab'
    ],
    correctIndex: 1,
    articleRef: 'Atajos de teclado oficiales de Microsoft Windows 10/11',
    explanation: 'Ctrl + Mayús + Esc abre directamente el Administrador de tareas. Win + E abre el Explorador de archivos; Win + L bloquea el equipo; Win + D muestra u oculta el escritorio.',
    difficulty: 'base',
  },
  {
    id: 'b6-q03',
    block: 6,
    topic: 'Windows 10/11 — Explorador de Archivos',
    question: 'En el Explorador de archivos de Windows 11, si desea seleccionar un archivo y eliminarlo de forma PERMANENTE sin que pase por la Papelera de reciclaje, ¿qué atajo debe pulsar?',
    options: [
      'Ctrl + Supr',
      'Mayús + Supr',
      'Alt + Supr',
      'Win + Supr'
    ],
    correctIndex: 1,
    articleRef: 'Explorador de archivos Windows 10/11',
    explanation: 'Mayús + Supr (Shift + Delete) elimina el elemento seleccionado de forma permanente omitiendo la Papelera de reciclaje (previa confirmación si está activada).',
    difficulty: 'base',
  },
  {
    id: 'b6-q04',
    block: 6,
    topic: 'Windows 11 — Entorno y Copilot',
    question: 'En Windows 11, ¿qué combinación de teclas abre la vista de Portapapeles (Historial del portapapeles) si está habilitada en Configuración?',
    options: [
      'Ctrl + V',
      'Windows + V',
      'Windows + C',
      'Ctrl + Alt + V'
    ],
    correctIndex: 1,
    articleRef: 'Funciones de productividad de Windows 10/11',
    explanation: 'Windows + V abre el historial del portapapeles permitiendo pegar elementos copiados anteriormente o anclar textos frecuentes. Windows + Shift + S abre la herramienta Recortes.',
    difficulty: 'medio',
  },
  {
    id: 'b6-q05',
    block: 6,
    topic: 'Word 365 — Estilos y Tabla de Contenido',
    question: 'En Microsoft Word 365, para que los títulos de un documento administrativo aparezcan automáticamente en una Tabla de Contenido generada desde la pestaña Referencias, ¿qué debe aplicarse a dichos títulos?',
    options: [
      'Formato negrita y tamaño 16 puntos manualmente.',
      'Estilos integrados de Título (Título 1, Título 2, etc.) o niveles de esquema en el formato de párrafo.',
      'Marcadores ocultos al principio de cada página.',
      'Saltos de sección continuos antes de cada párrafo.'
    ],
    correctIndex: 1,
    articleRef: 'Microsoft Word 365 — Pestaña Referencias / Estilos',
    explanation: 'Word construye la Tabla de Contenido leyendo la jerarquía de los estilos de Título (Título 1, Título 2, Título 3) o los niveles de esquema asignados a los párrafos.',
    difficulty: 'base',
  },
  {
    id: 'b6-q06',
    block: 6,
    topic: 'Word 365 — Encabezados por Sección',
    question: 'En Microsoft Word, desea que a partir de la página 4 (nueva sección) el encabezado sea diferente del de las páginas anteriores. Tras insertar un Salto de sección (Página siguiente), ¿qué botón de la pestaña contextual Encabezado y pie de página debe DESACTIVAR antes de modificar el nuevo encabezado?',
    options: [
      'Primera página diferente.',
      'Vincular a la anterior.',
      'Páginas pares e impares diferentes.',
      'Mostrar texto del documento.'
    ],
    correctIndex: 1,
    articleRef: 'Microsoft Word 365 — Secciones y Encabezados',
    explanation: 'Por defecto, cada nueva sección hereda el encabezado/pie de la anterior porque está activada la opción "Vincular a la anterior". Desactivándola se rompe el vínculo entre secciones.',
    difficulty: 'medio',
  },
  {
    id: 'b6-q07',
    block: 6,
    topic: 'Word 365 — Combinación de Correspondencia',
    question: 'Al utilizar la herramienta Combinar correspondencia en Microsoft Word para generar 500 resoluciones personalizadas a partir de una lista en Excel, ¿qué tecla o acción inserta un campo de datos procedente del origen en el documento principal?',
    options: [
      'Correspondencia > Insertar campo combinado.',
      'Insertar > Referencia cruzada.',
      'Revisar > Control de cambios.',
      'Vista > Esquema.'
    ],
    correctIndex: 0,
    articleRef: 'Microsoft Word 365 — Pestaña Correspondencia',
    explanation: 'En la pestaña Correspondencia, tras seleccionar los destinatarios (Excel/Access/lista), se utiliza "Insertar campo combinado" (que aparece delimitado entre comillas angulares «Campo»).',
    difficulty: 'base',
  },
  {
    id: 'b6-q08',
    block: 6,
    topic: 'Excel 365 — Referencias Absolutas y Mixtas',
    question: 'En Microsoft Excel, en la celda C2 introducimos la fórmula `=B2*$A$1`. Si copiamos la celda C2 y la pegamos en la celda D5, ¿qué fórmula resultará en D5?',
    options: [
      '=C5*$B$4',
      '=C5*$A$1',
      '=B2*$A$1',
      '=C5*A$1'
    ],
    correctIndex: 1,
    articleRef: 'Microsoft Excel 365 — Referencias relativas y absolutas',
    explanation: 'B2 es una referencia relativa: al desplazar 1 columna a la derecha (C→D) y 3 filas abajo (2→5), pasa a C5. $A$1 es una referencia absoluta (columna y fila bloqueadas con $), por lo que permanece invariable como $A$1.',
    difficulty: 'base',
  },
  {
    id: 'b6-q09',
    block: 6,
    topic: 'Excel 365 — Función BUSCARV',
    question: 'En Excel, la fórmula `=BUSCARV(E2; $A$2:$C$50; 3; FALSO)` devuelve el error `#N/D` cuando:',
    options: [
      'El ancho de la columna es insuficiente para mostrar el número.',
      'El valor buscado en E2 no se encuentra exactamente en la primera columna del rango ($A$2:$A$50).',
      'Se intenta dividir por cero dentro de la tabla.',
      'El argumento indicador de columnas es menor que 10.'
    ],
    correctIndex: 1,
    articleRef: 'Microsoft Excel 365 — Función BUSCARV y errores',
    explanation: 'El error #N/D (No Disponible) en BUSCARV con coincidencia exacta (FALSO o 0) indica que el valor buscado no existe en la primera columna de la matriz. Si el indicador de columnas fuera mayor que el número de columnas de la matriz (ej. 4 en un rango A:C), daría #¡REF!.',
    difficulty: 'medio',
  },
  {
    id: 'b6-q10',
    block: 6,
    topic: 'Excel 365 — Función BUSCARX (XLOOKUP)',
    question: '¿Qué ventaja principal ofrece la función `BUSCARX` (XLOOKUP) de Excel 365 respecto a la función clásica `BUSCARV`?',
    options: [
      'Solo funciona si la columna de búsqueda está ordenada alfabéticamente de forma ascendente.',
      'Permite buscar valores en cualquier columna (incluso a la izquierda de la columna de resultado), utiliza coincidencia exacta por defecto e incluye un argumento opcional `[si_no_se_encuentra]`.',
      'Únicamente sirve para sumar celdas que cumplan múltiples criterios.',
      'Solo admite búsquedas en horizontal.'
    ],
    correctIndex: 1,
    articleRef: 'Microsoft Excel 365 — Función BUSCARX',
    explanation: 'BUSCARX separa la matriz buscada de la matriz devuelta, por lo que permite buscar hacia la izquierda o en horizontal, usa coincidencia exacta (0) por defecto y permite definir el texto o valor si no hay coincidencia sin anidar SI.ERROR.',
    difficulty: 'medio',
  },
  {
    id: 'b6-q11',
    block: 6,
    topic: 'Excel 365 — Funciones Condicionales',
    question: 'En una hoja de Excel tenemos en A2:A20 los Ministerios y en B2:B20 los importes de subvenciones. ¿Qué fórmula calcula la suma total de las subvenciones del Ministerio de "Justicia" cuyo importe sea superior a 10.000 €?',
    options: [
      '=SUMAR.SI(A2:A20; "Justicia"; B2:B20; ">10000")',
      '=SUMAR.SI.CONJUNTO(B2:B20; A2:A20; "Justicia"; B2:B20; ">10000")',
      '=CONTAR.SI.CONJUNTO(B2:B20; A2:A20; "Justicia"; B2:B20; ">10000")',
      '=SUMA(SI(A2:A20="Justicia"; B2:B20))'
    ],
    correctIndex: 1,
    articleRef: 'Microsoft Excel 365 — Función SUMAR.SI.CONJUNTO',
    explanation: 'SUMAR.SI.CONJUNTO admite múltiples criterios y coloca el rango_suma EN PRIMER LUGAR, seguido de pares (rango_criterios1; criterio1; rango_criterios2; criterio2). SUMAR.SI solo admite un criterio.',
    difficulty: 'medio',
  },
  {
    id: 'b6-q12',
    block: 6,
    topic: 'Excel 365 — Errores de Fórmula',
    question: 'En Microsoft Excel, ¿qué indica el código de error `#¡REF!`?',
    options: [
      'Que el nombre de una función está mal escrito (por ejemplo, `=SUMAAR(A1:A5)`).',
      'Que la fórmula hace referencia a una celda que ya no es válida, por ejemplo porque se eliminó la fila o columna que la contenía.',
      'Que se ha introducido un argumento de texto donde la fórmula esperaba un número.',
      'Que la columna es demasiado estrecha (######).'
    ],
    correctIndex: 1,
    articleRef: 'Microsoft Excel 365 — Diagnóstico de errores',
    explanation: '#¡REF! indica referencia de celda no válida (por borrado de filas/columnas/hojas). Un nombre de función mal escrito produce #¿NOMBRE?; un tipo de argumento incorrecto produce #¡VALOR!; la columna estrecha muestra #####.',
    difficulty: 'base',
  },
  {
    id: 'b6-q13',
    block: 6,
    topic: 'Excel 365 — Tablas Dinámicas',
    question: 'En una Tabla Dinámica de Microsoft Excel, ¿en qué área de la lista de campos debe arrastrarse un campo numérico (por ejemplo, "Importe_Gasto") para obtener su suma o promedio agrupado por departamentos?',
    options: [
      'Filtros.',
      'Columnas.',
      'Filas.',
      'Valores.'
    ],
    correctIndex: 3,
    articleRef: 'Microsoft Excel 365 — Tablas dinámicas',
    explanation: 'El área Valores realiza los cálculos de agregación (Suma, Recuento, Promedio, Máx, Mín). Filas y Columnas agrupan los datos por categorías y Filtros permite segmentar toda la tabla.',
    difficulty: 'base',
  },
  {
    id: 'b6-q14',
    block: 6,
    topic: 'Access 365 — Claves y Relaciones',
    question: 'En una base de datos relacional Microsoft Access, ¿cuáles son las propiedades fundamentales de una Clave Primaria (Primary Key) en una tabla?',
    options: [
      'Puede contener valores duplicados pero nunca valores nulos.',
      'Identifica de forma unívoca cada registro de la tabla, por lo que no admite valores duplicados ni valores nulos (Null).',
      'Solo puede estar formada por un campo de tipo Autonumeración.',
      'Sirve únicamente para ordenar alfabéticamente los informes impresos.'
    ],
    correctIndex: 1,
    articleRef: 'Microsoft Access 365 — Diseño de bases de datos relacionales',
    explanation: 'La clave primaria garantiza la integridad de entidad: debe ser única para cada fila y nunca puede ser nula (Null). Puede ser simple o compuesta por varios campos.',
    difficulty: 'base',
  },
  {
    id: 'b6-q15',
    block: 6,
    topic: 'Access 365 — Consultas SQL y Tipos de Consulta',
    question: 'En Microsoft Access, si en una consulta SQL queremos seleccionar registros de la tabla `Expedientes` cuyo estado sea `"Resuelto"`, ordenados descendentemente por `Fecha`, ¿qué cláusula ordenará los resultados de más reciente a más antiguo?',
    options: [
      'GROUP BY Fecha DESC',
      'ORDER BY Fecha DESC',
      'SORT BY Fecha ASC',
      'WHERE Fecha DESC'
    ],
    correctIndex: 1,
    articleRef: 'Microsoft Access 365 — Lenguaje SQL básico',
    explanation: 'En SQL, `ORDER BY campo DESC` ordena de forma descendente (mayor a menor / más reciente a más antiguo). `ASC` es ascendente (por defecto). `GROUP BY` agrupa filas para funciones de agregado.',
    difficulty: 'medio',
  },
  {
    id: 'b6-q16',
    block: 6,
    topic: 'Outlook 365 — Correo Electrónico',
    question: 'Al redactar un correo electrónico en Microsoft Outlook dirigido a 50 ciudadanos diferentes, ¿en qué campo debe incluir sus direcciones para proteger su privacidad y que ningún destinatario pueda ver las direcciones de correo de los demás?',
    options: [
      'En el campo Para (To).',
      'En el campo CC (Con copia).',
      'En el campo CCO (Con copia oculta).',
      'En el campo Asunto separado por punto y coma.'
    ],
    correctIndex: 2,
    articleRef: 'Microsoft Outlook 365 y Principio de minimización RGPD',
    explanation: 'El campo CCO (Con Copia Oculta) oculta las direcciones de los destinatarios entre sí, siendo práctica obligatoria según la AEPD cuando se envían comunicaciones colectivas a ciudadanos.',
    difficulty: 'base',
  },
  {
    id: 'b6-q17',
    block: 6,
    topic: 'Protocolos de Correo e Internet',
    question: 'En la configuración de cuentas de correo electrónico, ¿qué protocolo se utiliza específicamente para el ENVÍO (salida) de mensajes desde el cliente de correo hacia el servidor saliente?',
    options: [
      'IMAP.',
      'POP3.',
      'SMTP.',
      'FTP.'
    ],
    correctIndex: 2,
    articleRef: 'Protocolos estándar de red TCP/IP',
    explanation: 'SMTP (Simple Mail Transfer Protocol) gestiona el envío/transporte de correo saliente. IMAP y POP3 son protocolos de recepción/acceso al buzón entrante (IMAP mantiene sincronización en el servidor).',
    difficulty: 'base',
  },
  {
    id: 'b6-q18',
    block: 6,
    topic: 'Redes e Internet — DNS y HTTPS',
    question: '¿Qué función cumple el protocolo DNS (Domain Name System) cuando un usuario escribe `https://sede.administracion.gob.es` en su navegador?',
    options: [
      'Cifra el tráfico extremo a extremo mediante certificado TLS.',
      'Traduce el nombre de dominio legible por personas a la dirección IP numérica del servidor correspondiente.',
      'Comprueba la validez del certificado electrónico FNMT del usuario.',
      'Bloquea las cookies de terceros en el navegador Edge.'
    ],
    correctIndex: 1,
    articleRef: 'Fundamentos de Internet y Redes TCP/IP',
    explanation: 'El sistema DNS actúa como directorio traduciendo nombres de dominio (FQDN) en direcciones IP (IPv4 o IPv6). El cifrado extremo a extremo lo realiza TLS/SSL dentro de HTTPS.',
    difficulty: 'base',
  },
  {
    id: 'b6-q19',
    block: 6,
    topic: 'Seguridad y Firma Electrónica',
    question: '¿Qué formato de extensión de archivo suele contener un certificado electrónico de persona física emitido por la FNMT con su clave privada protegida por contraseña para importarlo en el navegador?',
    options: [
      '.pdf o .docx',
      '.p12 o .pfx',
      '.xlsx o .accdb',
      '.html o .xml'
    ],
    correctIndex: 1,
    articleRef: 'Certificados digitales PKCS#12 en la AGE',
    explanation: 'El estándar PKCS#12 utiliza las extensiones `.p12` o `.pfx` para almacenar conjuntamente el certificado público y su clave privada cifrada con contraseña.',
    difficulty: 'medio',
  },
  {
    id: 'b6-q20',
    block: 6,
    topic: 'Word 365 — Atajo de Selección y Búsqueda',
    question: 'En Microsoft Word en español (Microsoft 365), ¿qué atajo de teclado abre el cuadro de diálogo "Buscar y reemplazar" directamente en la pestaña Reemplazar?',
    options: [
      'Ctrl + B',
      'Ctrl + L',
      'Ctrl + R',
      'Ctrl + E'
    ],
    correctIndex: 1,
    articleRef: 'Atajos oficiales de Microsoft Word 365 en español',
    explanation: 'En Word en español: Ctrl + B abre Buscar (panel de navegación); Ctrl + L abre Buscar y reemplazar en la pestaña Reemplazar; Ctrl + E selecciona todo el documento; Ctrl + R cierra el documento activo.',
    difficulty: 'medio',
  },
];
