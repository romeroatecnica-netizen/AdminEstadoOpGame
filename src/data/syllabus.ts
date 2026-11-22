import { BlockId } from '../types';

export interface BlockMetadata {
  id: BlockId;
  roman: string;
  shortTitle: string;
  title: string;
  description: string;
  keyLaws: string[];
  topics: string[];
  examWeightHint: string;
}

export const BLOCK_METADATA: Record<BlockId, BlockMetadata> = {
  1: {
    id: 1,
    roman: 'Bloque I',
    shortTitle: 'Organización del Estado',
    title: 'Organización del Estado y de la Administración Pública',
    description:
      'Constitución Española de 1978, derechos fundamentales, Corona, Cortes Generales, Poder Judicial, Tribunal Constitucional, Gobierno, AGE, CCAA, Administración Local y Unión Europea.',
    keyLaws: [
      'Constitución Española de 1978',
      'Ley 50/1997, del Gobierno',
      'Ley 40/2015, de Régimen Jurídico del Sector Público (AGE)',
      'Ley 7/1985, Reguladora de las Bases del Régimen Local',
      'Tratados de la Unión Europea (TUE y TFUE)',
    ],
    topics: [
      'La Constitución Española de 1978: estructura, valores y reforma constitucional.',
      'Derechos y deberes fundamentales. Garantía y suspensión (Arts. 14 a 55 CE).',
      'La Corona y las Cortes Generales. Elaboración de las leyes.',
      'El Poder Judicial y el Tribunal Constitucional.',
      'El Gobierno y la Administración General del Estado (Ministros, Secretarios de Estado, Subsecretarios, Delegados del Gobierno).',
      'Organización territorial del Estado: Comunidades Autónomas y Administración Local.',
      'La Unión Europea: instituciones, fuentes del Derecho de la UE y competencias.',
    ],
    examWeightHint: 'Alta frecuencia en preguntas literales de artículos CE y AGE',
  },
  2: {
    id: 2,
    roman: 'Bloque II',
    shortTitle: 'Oficinas Públicas y Datos',
    title: 'Organización de Oficinas Públicas',
    description:
      'Atención al público, acogida e información administrativa, transparencia, protección de datos personales (RGPD y LOPDGDD), sede electrónica, registros y archivo.',
    keyLaws: [
      'Real Decreto 208/1996, servicios de información administrativa',
      'Ley 19/2013, de Transparencia, Acceso a la Información Pública y Buen Gobierno',
      'Reglamento (UE) 2016/679 (RGPD) y Ley Orgánica 3/2018 (LOPDGDD)',
      'Real Decreto 203/2021, Reglamento de actuación y funcionamiento del sector público por medios electrónicos',
      'Real Decreto 311/2022, Esquema Nacional de Seguridad (ENS)',
    ],
    topics: [
      'Atención al público: acogida e información al ciudadano. Cartas de servicios y quejas/sugerencias.',
      'Registros administrativos, archivo de documentos y gestión documental.',
      'Protección de datos personales: principios, derechos ARSULIPO y delegado de protección de datos.',
      'Transparencia y buen gobierno: publicidad activa y derecho de acceso (Consejo de Transparencia).',
      'Administración electrónica: sede electrónica, punto de acceso general, carpeta ciudadana, firma y certificados.',
    ],
    examWeightHint: 'Clave en supuestos prácticos sobre registros, notificaciones y RGPD',
  },
  3: {
    id: 3,
    roman: 'Bloque III',
    shortTitle: 'Derecho Administrativo',
    title: 'Derecho Administrativo General',
    description:
      'Fuentes del Derecho, Ley 39/2015 LPACAP, Ley 40/2015 LRJSP, actos administrativos, plazos, silencio, recursos, contratación pública (LCSP), subvenciones, responsabilidad patrimonial y expropiación.',
    keyLaws: [
      'Ley 39/2015, del Procedimiento Administrativo Común (LPACAP)',
      'Ley 40/2015, de Régimen Jurídico del Sector Público (LRJSP)',
      'Ley 9/2017, de Contratos del Sector Público (LCSP)',
      'Ley 38/2003, General de Subvenciones (LGS)',
      'Ley de 16 de diciembre de 1954 sobre Expropiación Forzosa',
    ],
    topics: [
      'Fuentes del Derecho Administrativo. Jerarquía normativa y potestad reglamentaria.',
      'El acto administrativo: requisitos, eficacia, nulidad (Art. 47) y anulabilidad (Art. 48).',
      'Procedimiento administrativo común: fases, cómputo de plazos (Art. 30), obligación de resolver y silencio administrativo.',
      'Revisión de oficio y recursos administrativos: alzada, potestativo de reposición y extraordinario de revisión.',
      'Contratos del sector público: tipos, umbrales SARA, contrato menor y procedimiento abierto.',
      'Subvenciones públicas, responsabilidad patrimonial de las AAPP y expropiación forzosa.',
    ],
    examWeightHint: 'Bloque troncal de la oposición: plazos, silencio y recursos caen siempre',
  },
  4: {
    id: 4,
    roman: 'Bloque IV',
    shortTitle: 'Gestión de Personal',
    title: 'Gestión de Personal',
    description:
      'Texto Refundido del Estatuto Básico del Empleado Público (TREBEP), clases de personal, acceso, carrera, provisión, situaciones administrativas, permisos, régimen disciplinario, incompatibilidades y Seguridad Social.',
    keyLaws: [
      'Real Decreto Legislativo 5/2015 (TREBEP)',
      'Ley 53/1984, de Incompatibilidades del personal al servicio de las AAPP',
      'Real Decreto 364/1995, Reglamento General de Ingreso y Provisión',
      'Real Decreto 365/1995, Reglamento de Situaciones Administrativas',
      'RDL 4/2000 (MUFACE) y LGSS / Clases Pasivas',
    ],
    topics: [
      'Clases de personal al servicio de las Administraciones Públicas (funcionarios de carrera, interinos, laboral, eventual, directivo).',
      'Adquisición y pérdida de la condición de funcionario. Oferta de Empleo Público.',
      'Provisión de puestos (concurso y libre designación) y promoción interna.',
      'Situaciones administrativas: servicio activo, servicios especiales, servicio en otras AAPP, excedencias y suspensión.',
      'Derechos, deberes, permisos (Arts. 48 y 49 TREBEP), vacaciones y código de conducta.',
      'Régimen disciplinario (faltas muy graves, graves y leves; prescripción), incompatibilidades y Seguridad Social.',
    ],
    examWeightHint: 'Muy preguntado en supuestos prácticos: permisos, excedencias y prescripción',
  },
  5: {
    id: 5,
    roman: 'Bloque V',
    shortTitle: 'Gestión Financiera',
    title: 'Gestión Financiera',
    description:
      'El Presupuesto del Estado en España, Ley 47/2003 General Presupuestaria, ciclo y estructura presupuestaria, modificaciones de crédito, procedimiento de ejecución del gasto (A-D-O-K-P) y retribuciones.',
    keyLaws: [
      'Constitución Española (Art. 134)',
      'Ley 47/2003, General Presupuestaria (LGP)',
      'Orden de 1 de febrero de 1996, Instrucción de operatoria contable (fases A-D-O-K-P)',
      'Ley de Presupuestos Generales del Estado vigente y RDL 5/2015 (retribuciones)',
    ],
    topics: [
      'El Presupuesto del Estado: principios presupuestarios, contenido, prórroga y ciclo presupuestario.',
      'Estructura de los presupuestos: clasificación orgánica, por programas y económica (Capítulos 1 a 9).',
      'Modificaciones presupuestarias: créditos extraordinarios, suplementos, ampliaciones, transferencias, generaciones e incorporaciones.',
      'Procedimiento general de ejecución del gasto público: fases A, D, O, K y P, y documentos contables.',
      'Pagos a justificar y anticipos de caja fija. Retribuciones básicas y complementarias del personal funcionario.',
    ],
    examWeightHint: 'Imprescindible distinguir fases A-D-O-K-P y qué modificación aprueba cada órgano',
  },
  6: {
    id: 6,
    roman: 'Bloque VI',
    shortTitle: 'Informática y Ofimática',
    title: 'Informática Básica y Ofimática',
    description:
      'Informática básica, sistema operativo Windows 10/11 y Copilot, Explorador de archivos, Microsoft 365 (Word, Excel, Access, Outlook) y red Internet / navegador Edge.',
    keyLaws: [
      'Entorno Windows 10/11 y atajos oficiales de teclado',
      'Microsoft Word 365 (estilos, tablas, combinación de correspondencia)',
      'Microsoft Excel 365 (referencias absolutas/relativas, BUSCARV/BUSCARX, SI, SUMAR.SI)',
      'Microsoft Access 365 (tablas, relaciones, claves primarias, SQL básico)',
      'Microsoft Outlook 365 e Internet (DNS, HTTPS, protocolos correo IMAP/SMTP/POP3)',
    ],
    topics: [
      'Informática básica: arquitectura hardware, memoria RAM/ROM/caché, periféricos y sistemas de archivos.',
      'Windows 10/11: Explorador, accesibilidad, atajos (Win+E, Win+D, Win+L, Ctrl+Mayús+Esc) y entorno Copilot.',
      'Procesador de textos Word: formatos, estilos, saltos de sección, encabezados, tablas de contenido y combinación de correspondencia.',
      'Hoja de cálculo Excel: sintaxis de fórmulas, errores (#N/D, #¡REF!, #¡VALOR!), funciones lógicas, búsqueda y tablas dinámicas.',
      'Bases de datos Access, correo Outlook (CC/CCO, reglas, citas) y navegación segura en Internet.',
    ],
    examWeightHint: 'Peso decisivo en la primera parte: 25-30 preguntas prácticas de Excel, Word y Windows',
  },
};

export const OFFICIAL_CUTOFF_INFO = {
  formulaText: 'Puntuación Neta = Aciertos − (Fallos / 3)',
  penaltyPerError: '0,333 puntos',
  optionsPerQuestion: 4,
  parts: [
    {
      name: 'Primera Parte: Cuestionario teórico-práctico',
      scope: 'Los 6 bloques del temario (Organización, Oficinas, Derecho, Personal, Financiera e Informática/Ofimática)',
      detail: 'Preguntas tipo test con 4 alternativas (A, B, C, D) más preguntas adicionales de reserva.',
    },
    {
      name: 'Segunda Parte: Supuesto práctico',
      scope: 'Elección entre 2 supuestos propuestos por el Tribunal (Bloques II, III, IV y V)',
      detail: 'Preguntas tipo test desglosadas sobre el caso práctico elegido más preguntas de reserva.',
    },
  ],
};
