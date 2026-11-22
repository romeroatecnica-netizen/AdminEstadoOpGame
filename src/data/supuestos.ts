import { CaseStudy } from '../types';

export const OFFICIAL_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'supuesto-a',
    code: 'SUPUESTO PRÁCTICO A',
    title: 'Procedimiento Administrativo, Contratación Menor y Subvenciones Públicas',
    subtitle: 'Bloques II y III · Nivel Examen Oficial INAP · 15 preguntas + 2 de reserva',
    blocksCovered: [2, 3],
    statement: `Doña Lucía Martín, administradora única de la sociedad mercantil "Innovación Digital Ibérica, S.L.", presenta el día 10 de febrero de 2026 (martes) una solicitud electrónica de subvención ante la Dirección General de Transformación del Ministerio de Industria, acompañada de documentación técnica. El procedimiento se rige por la Ley 38/2003, General de Subvenciones, y supletoriamente por la Ley 39/2015 (LPACAP), con un plazo máximo de resolución y notificación de seis meses sin previsión expresa distinta sobre el sentido del silencio.

Por otro lado, la Subdirección General de Recursos Materiales de ese mismo Ministerio tramita paralelamente la adquisición de equipos informáticos por un valor estimado de 14.200 € (IVA excluido) mediante contrato menor de suministro (Ley 9/2017, LCSP), y recibe una solicitud de acceso a información pública de un ciudadano (al amparo de la Ley 19/2013) pidiendo copia del expediente de contratación y los datos personales (DNI completo y domicilio particular) de todos los licitadores concurrentes.`,
    questions: [
      {
        id: 'supA-q01',
        block: 2,
        topic: 'Obligados electrónicos (Art. 14.2 LPACAP)',
        question: 'Respecto a la presentación de la solicitud por "Innovación Digital Ibérica, S.L.", ¿podría Doña Lucía presentar válidamente un escrito de subsanación en papel en una oficina de correos?',
        options: [
          'Sí, porque actúa una persona física como representante.',
          'No; al ser la interesada una persona jurídica, está obligada a relacionarse electrónicamente en todo caso, por lo que la Administración deberá requerirle la subsanación mediante presentación electrónica, considerándose como fecha de presentación aquella en que se haya realizado la subsanación.',
          'Sí, siempre que el importe de la subvención sea inferior a 15.000 euros.',
          'No, lo que conlleva automáticamente la imposición de una sanción pecuniaria y la inadmisión sin trámite de subsanación.'
        ],
        correctIndex: 1,
        articleRef: 'Art. 14.2.a) y Art. 68.4 Ley 39/2015 (LPACAP)',
        explanation: 'Las personas jurídicas están obligadas a relacionarse electrónicamente (art. 14.2.a). Si presentan presencialmente, el art. 68.4 exige requerir la subsanación electrónica, considerándose fecha de presentación la de la subsanación electrónica.',
        difficulty: 'medio',
      },
      {
        id: 'supA-q02',
        block: 3,
        topic: 'Subsanación de solicitud (Art. 68.1 LPACAP)',
        question: 'Si la solicitud electrónica de subvención presentada el 10 de febrero careciera de alguno de los requisitos del artículo 66 de la Ley 39/2015, ¿qué plazo deberá conceder el órgano instructor a la sociedad para subsanar la falta o acompañar los documentos preceptivos?',
        options: [
          'Cinco días hábiles improrrogables.',
          'Diez días hábiles (ampliable hasta cinco días más a petición del interesado o iniciativa del órgano, salvo procedimientos selectivos o de concurrencia competitiva).',
          'Quince días naturales.',
          'Un mes desde el registro de entrada.'
        ],
        correctIndex: 1,
        articleRef: 'Art. 68.1 y 68.2 Ley 39/2015 (LPACAP)',
        explanation: 'El art. 68.1 LPACAP fija un plazo de 10 días (hábiles) para subsanar bajo apercibimiento de desistimiento. En el art. 68.2 se permite ampliar hasta 5 días más, salvo que se trate de procedimientos selectivos o de concurrencia competitiva.',
        difficulty: 'base',
      },
      {
        id: 'supA-q03',
        block: 3,
        topic: 'Silencio administrativo en subvenciones',
        question: 'Transcurrido el plazo máximo de seis meses desde el inicio del procedimiento de concesión de subvenciones sin haberse notificado resolución expresa a "Innovación Digital Ibérica, S.L.", ¿cuál será el efecto del silencio administrativo?',
        options: [
          'Estimatorio (silencio positivo) por regla general del art. 24.1 LPACAP.',
          'Desestimatorio (silencio negativo), conforme al artículo 25.5 de la Ley 38/2003, General de Subvenciones.',
          'Caducidad del procedimiento con archivo de actuaciones.',
          'Estimatorio únicamente si consta informe favorable de la IGAE.'
        ],
        correctIndex: 1,
        articleRef: 'Art. 25.5 Ley 38/2003 (LGS) y Art. 24.1 LPACAP',
        explanation: 'El art. 25.5 de la Ley 38/2003 (norma con rango de ley) establece expresamente que el vencimiento del plazo máximo sin haberse notificado resolución legitima a los interesados para entender DESESTIMADA por silencio administrativo la solicitud de concesión de subvención.',
        difficulty: 'medio',
      },
      {
        id: 'supA-q04',
        block: 3,
        topic: 'Notificación electrónica y rechazo',
        question: 'El 18 de mayo de 2026 la Administración pone a disposición de la empresa una resolución en la Dirección Electrónica Habilitada Única (DEHú), enviándose aviso al correo electrónico ese mismo día. La empresa no accede a la notificación. ¿Cuándo se entenderá rechazada la notificación?',
        options: [
          'El 28 de mayo de 2026 (transcurridos 10 días naturales desde la puesta a disposición sin acceso).',
          'El 1 de junio de 2026 (transcurridos 10 días hábiles).',
          'Nunca, porque la Administración debe intentar una segunda notificación en papel.',
          'El mismo 18 de mayo al remitirse el aviso electrónico.'
        ],
        correctIndex: 0,
        articleRef: 'Art. 43.2 Ley 39/2015 (LPACAP)',
        explanation: 'Transcurridos diez días naturales desde el 18 de mayo (esto es, el 28 de mayo) sin acceder a su contenido, se entiende rechazada la notificación electrónica, teniéndose por efectuado el trámite y continuando el procedimiento.',
        difficulty: 'medio',
      },
      {
        id: 'supA-q05',
        block: 3,
        topic: 'Recursos contra resolución del Director General',
        question: 'Suponga que la resolución denegatoria de la subvención es dictada por el Director General (por competencia propia, no delegada) y pone fin o no a la vía administrativa según la LRJSP. Según el artículo 114 de la Ley 39/2015 en relación con la AGE, los actos de los Directores Generales:',
        options: [
          'Ponen siempre fin a la vía administrativa en todo tipo de materias.',
          'Por regla general NO ponen fin a la vía administrativa (salvo en materia de personal o cuando una norma legal lo establezca), por lo que procedería recurso de alzada ante el órgano superior jerárquico en el plazo de un mes.',
          'Solo son impugnables mediante recurso extraordinario de revisión.',
          'Agotan la vía administrativa y deben recurrirse en reposición obligatoriamente.'
        ],
        correctIndex: 1,
        articleRef: 'Art. 114.2 Ley 39/2015 (LPACAP) y Art. 121-122 LPACAP',
        explanation: 'En la AGE (art. 114.2 LPACAP), ponen fin a la vía administrativa los actos de Gobierno/Comisiones Delegadas, Ministros y Secretarios de Estado; los de Directores Generales solo ponen fin en materia de personal o si una ley lo dispone. Si no ponen fin, cabe recurso de ALZADA en 1 mes.',
        difficulty: 'medio',
      },
      {
        id: 'supA-q06',
        block: 3,
        topic: 'Subvenciones — Obligaciones del beneficiario',
        question: 'Si finalmente la sociedad resultara beneficiaria de la subvención y necesitara acreditar encontrarse al corriente de sus obligaciones tributarias y con la Seguridad Social, según la Ley 38/2003 (art. 13.2.e) y art. 28 LPACAP:',
        options: [
          'Está exenta de estar al corriente si la subvención es inferior a 3.000 euros.',
          'Es requisito indispensable para obtener la condición de beneficiario hallarse al corriente en el cumplimiento de las obligaciones tributarias y frente a la Seguridad Social, pudiendo recabarlo la Administración salvo oposición expresa.',
          'Basta una declaración verbal de la administradora única sin comprobación posible.',
          'Solo se exige dicho requisito en subvenciones superiores a 100.000 euros.'
        ],
        correctIndex: 1,
        articleRef: 'Art. 13.2.e) Ley 38/2003 (LGS)',
        explanation: 'El art. 13.2.e) LGS prohíbe obtener la condición de beneficiario a quienes no se hallen al corriente en obligaciones tributarias y frente a la Seguridad Social (para subvenciones ≤ 3.000 € el art. 24 RLGS permite sustituirlo por declaración responsable).',
        difficulty: 'medio',
      },
      {
        id: 'supA-q07',
        block: 3,
        topic: 'LCSP — Contrato Menor de Suministro',
        question: 'En relación con el contrato menor de suministro de equipos informáticos por valor estimado de 14.200 € (IVA excluido), ¿cumple con el límite cuantitativo del artículo 118 de la Ley 9/2017 (LCSP)?',
        options: [
          'No, porque el límite para suministros es de 12.000 euros.',
          'Sí, porque para contratos de suministro y servicios el valor estimado debe ser inferior a 15.000 euros.',
          'No, porque sumado el 21 % de IVA supera los 15.000 euros y el límite se calcula IVA incluido.',
          'Sí, pero solo si tiene una duración inicial de dos años con prórroga de un año.'
        ],
        correctIndex: 1,
        articleRef: 'Art. 118.1 y Art. 101 Ley 9/2017 (LCSP)',
        explanation: 'El umbral del contrato menor (art. 118.1 LCSP) se mide por el VALOR ESTIMADO (art. 101 LCSP, sin IVA): < 15.000 € en suministros y servicios (< 40.000 € en obras). Por tanto, 14.200 € sin IVA cumple el límite legal.',
        difficulty: 'base',
      },
      {
        id: 'supA-q08',
        block: 3,
        topic: 'LCSP — Tramitación del Contrato Menor',
        question: 'Para tramitar válidamente este contrato menor de 14.200 €, el artículo 118 de la LCSP exige en el expediente:',
        options: [
          'Exclusivamente la factura conformada sin ningún otro documento.',
          'La emisión de un informe del órgano de contratación motivando la necesidad del contrato y justificando que no se está alterando su objeto para evitar la aplicación de los umbrales generales, además de la aprobación del gasto y la incorporación de la factura correspondiente.',
          'La constitución obligatoria de garantía definitiva del 5 % por el proveedor.',
          'La publicación previa de anuncio de licitación en el DOUE.'
        ],
        correctIndex: 1,
        articleRef: 'Art. 118.2 y 118.3 Ley 9/2017 (LCSP)',
        explanation: 'El art. 118 exige informe del órgano de contratación justificando la necesidad y la no alteración del objeto del contrato (desde la modificación del RDL 3/2020, ya no se exige justificar no haber suscrito más contratos menores que superen el umbral, aunque sí se mantiene el control de no fraccionamiento), aprobación del gasto e incorporación de la factura.',
        difficulty: 'medio',
        isTrapWord: true,
        trapWord: 'Exclusivamente',
      },
      {
        id: 'supA-q09',
        block: 3,
        topic: 'LCSP — Duración y Prórroga de Contrato Menor',
        question: 'Según el artículo 29.8 de la Ley 9/2017 (LCSP), ¿cuál es la duración máxima de este contrato menor y si admite prórroga?',
        options: [
          'Dos años, prorrogable por otro año más.',
          'No podrá tener una duración superior a un año ni ser objeto de prórroga.',
          'Seis meses prorrogables por otros seis.',
          'Cuatro años sin prórrogas.'
        ],
        correctIndex: 1,
        articleRef: 'Art. 29.8 Ley 9/2017 (LCSP)',
        explanation: 'El art. 29.8 LCSP establece tajantemente que los contratos menores no podrán tener una duración superior a un año ni ser objeto de prórroga.',
        difficulty: 'base',
      },
      {
        id: 'supA-q10',
        block: 3,
        topic: 'LCSP — Publicación de Contratos Menores',
        question: 'Conforme al artículo 63.4 de la Ley 9/2017 (LCSP), la información relativa a los contratos menores (objeto, duración, importe de adjudicación incluido el IVA e identidad del adjudicatario) deberá publicarse en el Perfil de Contratante:',
        options: [
          'Anualmente dentro del primer trimestre del año siguiente.',
          'Al menos trimestralmente (excepto aquellos cuyo valor estimado sea inferior a 5.000 euros si el pago se realiza mediante anticipo de caja fija o similar).',
          'Mensualmente en el Boletín Oficial del Estado.',
          'Los contratos menores están exentos de toda publicidad en el Perfil de Contratante.'
        ],
        correctIndex: 1,
        articleRef: 'Art. 63.4 Ley 9/2017 (LCSP)',
        explanation: 'La publicación de contratos menores en el perfil de contratante debe realizarse al menos trimestralmente, quedando exceptuados de esta publicación los de valor inferior a 5.000 € abonados por anticipo de caja fija o sistema similar.',
        difficulty: 'medio',
      },
      {
        id: 'supA-q11',
        block: 2,
        topic: 'Transparencia vs Protección de Datos (LTAIBG y RGPD)',
        question: 'Respecto al ciudadano que solicita acceso al expediente de contratación incluyendo el DNI completo y domicilio particular de todos los licitadores, ¿cómo debe proceder el órgano competente según la Ley 19/2013 (LTAIBG) y la LOPDGDD?',
        options: [
          'Entregar el expediente íntegro con los DNI completos y domicilios particulares porque la transparencia prevalece siempre sobre la intimidad.',
          'Denegar la totalidad del expediente automáticamente sin valorar el acceso parcial.',
          'Conceder acceso parcial a la información contractual pertinente, omitiendo o disociando datos personales excesivos como el domicilio particular y publicando/facilitando el DNI únicamente conforme a la Disposición Adicional 7.ª de la LOPDGDD (enmascarado o sin datos innecesarios).',
          'Remitir la solicitud al Tribunal de Cuentas para que resuelva en el plazo de seis meses.'
        ],
        correctIndex: 2,
        articleRef: 'Art. 15 y 16 Ley 19/2013 (LTAIBG) y DA 7.ª LO 3/2018 (LOPDGDD)',
        explanation: 'El art. 15 LTAIBG exige ponderar el interés público con la protección de datos y el art. 16 prevé el acceso parcial previa omisión de la información afectada por el límite. La DA 7.ª LOPDGDD prohíbe identificar con nombre+apellidos+DNI completo simultáneamente (se usa nombre+apellidos + 4 cifras aleatorias del DNI según criterio AEPD) y el domicilio particular es dato innecesario.',
        difficulty: 'medio',
      },
      {
        id: 'supA-q12',
        block: 2,
        topic: 'Transparencia — Trámite de Audiencia a Terceros',
        question: 'Si la información solicitada al amparo de la Ley 19/2013 pudiera afectar a derechos o intereses de terceros (las empresas o licitadores identificados en el expediente), ¿qué trámite debe realizarse conforme al artículo 19.3 LTAIBG?',
        options: [
          'Darles traslado para que puedan realizar alegaciones en el plazo de quince días, suspendiéndose el plazo para dictar resolución hasta que se reciban o transcurra el plazo.',
          'Notificarles únicamente una vez ya se haya entregado la documentación al solicitante.',
          'Pedir autorización previa al Consejo de Ministros.',
          'No existe trámite de audiencia en la Ley 19/2013.'
        ],
        correctIndex: 0,
        articleRef: 'Art. 19.3 Ley 19/2013 (LTAIBG)',
        explanation: 'El art. 19.3 LTAIBG ordena conceder un plazo de 15 días a los terceros afectados para alegaciones, informando al solicitante de la suspensión del plazo para resolver.',
        difficulty: 'medio',
      },
      {
        id: 'supA-q13',
        block: 2,
        topic: 'Seguridad de los Datos y RGPD',
        question: 'En la tramitación del expediente electrónico de subvenciones, un funcionario envía por error mediante correo electrónico a 20 empresas solicitantes un archivo Excel con datos personales y bancarios de todas ellas. ¿Qué plazo tiene el responsable del tratamiento para notificar esta brecha de seguridad a la AEPD?',
        options: [
          '24 horas.',
          '72 horas desde que haya tenido constancia de ella (salvo que sea improbable que constituya un riesgo para los derechos y libertades).',
          '10 días hábiles.',
          '1 mes.'
        ],
        correctIndex: 1,
        articleRef: 'Art. 33.1 Reglamento (UE) 2016/679 (RGPD)',
        explanation: 'El envío masivo con exposición de datos bancarios supone riesgo probable para derechos y libertades, por lo que debe notificarse a la autoridad de control (AEPD) sin dilación indebida y a más tardar en 72 horas desde que se tenga constancia (art. 33 RGPD), y comunicarse también a los afectados si entraña alto riesgo (art. 34 RGPD).',
        difficulty: 'base',
      },
      {
        id: 'supA-q14',
        block: 3,
        topic: 'Reintegro de Subvenciones',
        question: 'Dos años después de concederse y pagarse una subvención, la Intervención comprueba que "Innovación Digital Ibérica, S.L." justificó gastos ficticios. Según el artículo 37 de la Ley 38/2003 (LGS), procederá el reintegro de las cantidades percibidas más:',
        options: [
          'Únicamente el principal percibido sin intereses.',
          'La exigencia del interés de demora correspondiente desde el momento del pago de la subvención hasta la fecha en que se acuerde la procedencia del reintegro (o la fecha en que el deudor ingrese si es anterior).',
          'Un recargo fijo del 50 % sin intereses.',
          'Solo el 50 % del importe si es la primera infracción.'
        ],
        correctIndex: 1,
        articleRef: 'Art. 37.1 Ley 38/2003 (LGS)',
        explanation: 'El art. 37.1 LGS establece el reintegro de las cantidades percibidas y la exigencia del interés de demora desde el momento del pago de la subvención hasta la fecha en que se acuerde la procedencia del reintegro (o ingreso previo del deudor). El procedimiento de reintegro tiene un plazo máximo de resolución de 12 meses (art. 42.4 LGS).',
        difficulty: 'medio',
      },
      {
        id: 'supA-q15',
        block: 3,
        topic: 'Competencia y Delegación (Art. 9 LRJSP)',
        question: 'Si el Ministro de Industria hubiera delegado en el Director General la competencia para resolver las subvenciones del supuesto, ¿cómo se considerarán dictadas dichas resoluciones a efectos de recursos administrativos?',
        options: [
          'Se consideran dictadas por el Director General y cabe recurso de alzada ante el Ministro.',
          'Se consideran dictadas por el órgano delegante (el Ministro), por lo que ponen fin a la vía administrativa y cabrá recurso potestativo de reposición ante el propio Ministro (o contencioso-administrativo directo).',
          'Son nulas de pleno derecho porque las competencias ministeriales son indelegables.',
          'Ponen fin a la vía administrativa pero el recurso de reposición se resuelve por el Subsecretario.'
        ],
        correctIndex: 1,
        articleRef: 'Art. 9.4 Ley 40/2015 (LRJSP) y Art. 114.2 LPACAP',
        explanation: 'Las resoluciones administrativas adoptadas por delegación indicarán expresamente esta circunstancia y se considerarán dictadas por el órgano delegante (art. 9.4 LRJSP). Al ser el delegante un Ministro, ponen fin a la vía administrativa.',
        difficulty: 'base',
      },
    ],
  },
  {
    id: 'supuesto-b',
    code: 'SUPUESTO PRÁCTICO B',
    title: 'Gestión de Personal Funcionario (TREBEP) y Ejecución Presupuestaria (LGP)',
    subtitle: 'Bloques IV y V · Nivel Examen Oficial INAP · 15 preguntas',
    blocksCovered: [4, 5],
    statement: `Don Carlos Vega es funcionario de carrera del Cuerpo General Administrativo de la Administración del Estado (Subgrupo C1), con destino definitivo en un puesto de nivel 18 en la Subdirección General de Gestión Económica de un Ministerio, en la ciudad de Madrid, donde lleva 6 años de servicio efectivo ininterrumpido.

A lo largo de 2026 acontecen los siguientes hechos:
1) El 2 de marzo solicita un permiso por hospitalización de su madre (residente en Valencia) y en mayo solicita una excedencia voluntaria por interés particular para incorporarse temporalmente a una empresa privada, aunque finalmente desiste y opta por un puesto provisto por libre designación de nivel 22 en otro Ministerio, del que es cesado discrecionalmente a los 8 meses.
2) En su unidad presupuestaria deben tramitar un expediente de gasto de suministros (Capítulo 2, dotado inicialmente con 200.000 €) por importe de 18.000 € (IVA incluido), así como reordenar créditos porque resulta insuficiente la partida de inversiones reales (Capítulo 6) y se pretende transferir crédito sobrante del Capítulo 2 hacia el Capítulo 6.`,
    questions: [
      {
        id: 'supB-q01',
        block: 4,
        topic: 'Permiso por hospitalización de familiar (Art. 48.a TREBEP)',
        question: 'Respecto al permiso solicitado por Don Carlos el 2 de marzo por la hospitalización de su madre (pariente de primer grado por consanguinidad) en Valencia, ¿cuántos días de permiso retribuido le corresponden según la redacción vigente del artículo 48.a) del TREBEP?',
        options: [
          'Tres días hábiles por tratarse de distinta localidad.',
          'Cinco días hábiles.',
          'Cuatro días hábiles al ser en distinta localidad.',
          'Dos días naturales.'
        ],
        correctIndex: 1,
        articleRef: 'Art. 48.a) RDL 5/2015 (TREBEP, mod. RDL 5/2023)',
        explanation: 'Tras la reforma del RDL 5/2023, desaparece la distinción entre misma o distinta localidad: por accidente o enfermedad graves, hospitalización o intervención quirúrgica sin hospitalización con reposo de cónyuge, pareja de hecho o parientes de 1.º grado corresponden 5 DÍAS HÁBILES.',
        difficulty: 'medio',
      },
      {
        id: 'supB-q02',
        block: 4,
        topic: 'Excedencia Voluntaria por Interés Particular',
        question: 'Al plantearse solicitar la excedencia voluntaria por interés particular en mayo tras 6 años de servicio efectivo, ¿cumple Don Carlos el requisito de antigüedad mínima exigido por el artículo 89.2 del TREBEP?',
        options: [
          'No, porque se exigen diez años de servicio efectivo.',
          'Sí, porque el artículo 89.2 del TREBEP exige haber prestado servicios efectivos en cualquiera de las Administraciones Públicas durante un periodo mínimo de cinco años inmediatamente anteriores.',
          'No, porque el mínimo en el Subgrupo C1 es de ocho años.',
          'Sí, porque basta con un año de servicio efectivo desde la toma de posesión.'
        ],
        correctIndex: 1,
        articleRef: 'Art. 89.2 RDL 5/2015 (TREBEP)',
        explanation: 'El art. 89.2 TREBEP exige un periodo mínimo de 5 años inmediatamente anteriores (y Don Carlos lleva 6 años). Además, la concesión queda subordinada a las necesidades del servicio debidamente motivadas y no puede declararse si se le instruye expediente disciplinario.',
        difficulty: 'base',
      },
      {
        id: 'supB-q03',
        block: 4,
        topic: 'Efectos de la Excedencia Voluntaria por Interés Particular',
        question: 'Si Don Carlos hubiese pasado finalmente a la situación de excedencia voluntaria por interés particular, ¿qué derechos conservaría durante el tiempo en que permaneciera en dicha situación?',
        options: [
          'Reserva de su puesto de trabajo durante dos años y devengo de trienios.',
          'No devengará retribuciones, ni le será computable el tiempo que permanezca en tal situación a efectos de ascensos, trienios y derechos en el régimen de Seguridad Social que le sea de aplicación.',
          'Únicamente perderá las retribuciones complementarias pero conservará las básicas.',
          'Computa a efectos de trienios pero no de Seguridad Social.'
        ],
        correctIndex: 1,
        articleRef: 'Art. 89.2 RDL 5/2015 (TREBEP)',
        explanation: 'La excedencia voluntaria por interés particular no comporta reserva de puesto, no devenga retribuciones y el tiempo en ella no computa para ascensos, trienios ni derechos pasivos/Seguridad Social.',
        difficulty: 'base',
      },
      {
        id: 'supB-q04',
        block: 4,
        topic: 'Intervalo de niveles Subgrupo C1 (RD 364/1995)',
        question: 'El nuevo puesto de nivel 22 que obtiene Don Carlos en otro Ministerio, ¿se encuentra dentro del intervalo de niveles correspondiente al Subgrupo C1 según el artículo 71 del Real Decreto 364/1995?',
        options: [
          'No, porque el límite máximo del Subgrupo C1 es el nivel 20.',
          'Sí, porque el intervalo de niveles del Subgrupo C1 comprende del nivel 11 al nivel 22.',
          'No, porque el nivel 22 está reservado exclusivamente al Subgrupo A2.',
          'Sí, porque el Subgrupo C1 abarca del nivel 14 al 26.'
        ],
        correctIndex: 1,
        articleRef: 'Art. 71 Real Decreto 364/1995',
        explanation: 'El intervalo reglamentario de niveles para el Subgrupo C1 en la AGE es del 11 al 22 (ambos inclusive), por lo que puede desempeñar perfectamente un puesto nivel 22.',
        difficulty: 'base',
      },
      {
        id: 'supB-q05',
        block: 4,
        topic: 'Cese en puesto de Libre Designación (Art. 80.4 TREBEP y RD 364/1995)',
        question: 'Al ser cesado discrecionalmente de su puesto de nivel 22 provisto por libre designación a los 8 meses, ¿qué derecho asiste a Don Carlos respecto a su adscripción posterior?',
        options: [
          'Pasa automáticamente a situación de excedencia forzosa sin puesto.',
          'Debe ser adscrito provisionalmente a un puesto de trabajo correspondiente a su Cuerpo o Escala no inferior en más de dos niveles al de su grado personal consolidado, en el mismo municipio.',
          'Tiene derecho a volver exactamente al puesto anterior de nivel 18 que ocupaba en el Ministerio de origen.',
          'Pierde la condición de funcionario de carrera si no supera un nuevo concurso en 30 días.'
        ],
        correctIndex: 1,
        articleRef: 'Art. 58 y 72 Real Decreto 364/1995 y Art. 80.4 TREBEP',
        explanation: 'Los funcionarios cesados en puesto de libre designación (o removidos de puesto de concurso) quedan a disposición del Subsecretario/órgano competente, debiendo atribuírseles el desempeño provisional de un puesto de su Cuerpo/Escala no inferior en más de dos niveles al de su grado personal en el mismo municipio.',
        difficulty: 'alto',
      },
      {
        id: 'supB-q06',
        block: 4,
        topic: 'Consolidación de Grado Personal',
        question: 'Si Don Carlos tenía consolidado previamente un grado personal de nivel 18 y ha desempeñado el puesto de nivel 22 únicamente durante 8 meses antes de su cese, ¿habrá consolidado el grado personal de nivel 22?',
        options: [
          'Sí, porque la consolidación se produce desde la toma de posesión.',
          'No, porque para consolidar un grado personal se requiere el desempeño de uno o más puestos del nivel correspondiente durante dos años continuados o tres con interrupción (art. 70.2 RD 364/1995).',
          'Sí, porque la libre designación consolida el grado a los seis meses.',
          'No, porque en el Subgrupo C1 solo puede consolidarse hasta nivel 20.'
        ],
        correctIndex: 1,
        articleRef: 'Art. 70.2 Real Decreto 364/1995 y Art. 21.1.d) Ley 30/1984',
        explanation: 'La consolidación de grado personal exige desempeñar puestos del nivel correspondiente durante 2 años continuados o 3 con interrupción. Con 8 meses no consolida el 22, si bien el tiempo prestado en nivel superior podrá computarse para consolidar grados intermedios (ej. 20) si completase el periodo.',
        difficulty: 'medio',
      },
      {
        id: 'supB-q07',
        block: 4,
        topic: 'Incompatibilidades para actividad privada (Ley 53/1984)',
        question: 'Suponga que Don Carlos hubiese decidido compatibilizar su puesto público con un trabajo privado en horario de tarde. ¿Qué requisito básico exige el artículo 14 y 16 de la Ley 53/1984?',
        options: [
          'Que la jornada semanal privada no supere las 40 horas.',
          'Reconocimiento previo de compatibilidad, siempre que no impida o menoscabe el estricto cumplimiento de sus deberes, no comprometa su imparcialidad ni se perciba complemento específico superior al 30 % de las retribuciones básicas (excluidos trienios).',
          'Basta con presentar una declaración responsable sin necesidad de resolución expresa.',
          'El Subgrupo C1 tiene prohibida absolutamente cualquier actividad privada.'
        ],
        correctIndex: 1,
        articleRef: 'Art. 14 y Art. 16.4 Ley 53/1984 de Incompatibilidades',
        explanation: 'Requiere resolución expresa reconociendo la compatibilidad (plazo 2 meses, silencio negativo según Ley 14/2000/RD 1777/1994) y cumplir la limitación cuantitativa del complemento específico ≤ 30 % de las retribuciones básicas (salvo reducción posible si corresponde).',
        difficulty: 'medio',
      },
      {
        id: 'supB-q08',
        block: 4,
        topic: 'Trienios y Pagas Extraordinarias',
        question: 'Con 6 años de servicio efectivo ininterrumpido en el Subgrupo C1, ¿cuántos trienios tiene reconocidos Don Carlos?',
        options: [
          'Uno.',
          'Dos trienios.',
          'Tres trienios.',
          'Ninguno hasta cumplir diez años.'
        ],
        correctIndex: 1,
        articleRef: 'Art. 23.b) RDL 5/2015 (TREBEP)',
        explanation: 'Cada trienio se perfecciona por cada 3 años de servicios efectivos. Con 6 años ininterrumpidos habrá perfeccionado 2 trienios.',
        difficulty: 'base',
      },
      {
        id: 'supB-q09',
        block: 5,
        topic: 'Fases del Gasto Público (Art. 73 LGP)',
        question: 'Al iniciar la tramitación del expediente de suministros de 18.000 € (IVA incluido), la unidad solicita el certificado que acredita la existencia de crédito disponible y lo bloquea para ese fin. ¿Qué documento contable corresponde expedir en esa fase previa?',
        options: [
          'Documento P.',
          'Documento RC (Retención de Crédito).',
          'Documento OK.',
          'Documento D.'
        ],
        correctIndex: 1,
        articleRef: 'Art. 73 LGP y Orden de 1 de febrero de 1996',
        explanation: 'La Retención de Crédito (RC) es el acto contable previo al inicio del expediente que reserva el importe necesario del crédito disponible, garantizando la cobertura presupuestaria antes de la fase A.',
        difficulty: 'base',
      },
      {
        id: 'supB-q10',
        block: 5,
        topic: 'Fases D y O en el Gasto Público',
        question: 'Adjudicado el contrato a una empresa suministradora y recibidos de conformidad los bienes junto con su factura electrónica en FACe, ¿qué dos fases sucesivas de ejecución del gasto tienen lugar en esos dos momentos respectivamente?',
        options: [
          'Fase A al adjudicar y Fase P al recibir los bienes.',
          'Fase D (Compromiso de gasto) al adjudicar el contrato, y Fase O (Reconocimiento de la obligación) tras acreditar documentalmente la realización de la prestación y conformar la factura.',
          'Fase K al adjudicar y Fase D al recibir la factura.',
          'Fase RC al adjudicar y Fase A al conformar la factura.'
        ],
        correctIndex: 1,
        articleRef: 'Art. 73.3 y 73.4 Ley 47/2003 (LGP)',
        explanation: 'La adjudicación/formalización frente al tercero es el Compromiso (Fase D). Tras la entrega de conformidad ("servicio hecho"), se procede al Reconocimiento de la obligación (Fase O) junto con la Propuesta de pago (K).',
        difficulty: 'base',
      },
      {
        id: 'supB-q11',
        block: 5,
        topic: 'Umbral de Contrato Menor en el Supuesto (18.000 € IVA incluido)',
        question: 'El expediente de suministros asciende a 18.000 € IVA incluido (tipo general del 21 %). ¿Puede tramitarse como contrato menor de suministro según el artículo 118 de la LCSP?',
        options: [
          'No, porque 18.000 € supera el límite de 15.000 €.',
          'Sí, porque descontado el 21 % de IVA (18.000 / 1,21 = 14.876,03 €), su valor estimado sin IVA es inferior al límite legal de 15.000 €.',
          'No, porque en suministros el límite es 14.000 € con IVA.',
          'Sí, pero solo si el adjudicatario es una PYME.'
        ],
        correctIndex: 1,
        articleRef: 'Art. 118.1 y Art. 101 Ley 9/2017 (LCSP)',
        explanation: 'Cálculo clásico de supuesto práctico: 18.000 € IVA incluido equivale a una base imponible (valor estimado) de 18.000 / 1,21 = 14.876,03 € (< 15.000 €). Por tanto, SÍ cabe contrato menor.',
        difficulty: 'alto',
      },
      {
        id: 'supB-q12',
        block: 5,
        topic: 'Transferencia de Crédito (Cap. 2 a Cap. 6)',
        question: 'La unidad quiere transferir crédito sobrante del Capítulo 2 (Gastos corrientes en bienes y servicios) para incrementar el Capítulo 6 (Inversiones reales) dentro de la misma sección presupuestaria. Según el artículo 52 de la Ley 47/2003 (LGP), esta transferencia:',
        options: [
          'Está prohibida porque no se puede transferir de operaciones corrientes a operaciones de capital.',
          'Es legalmente posible: el artículo 52.1.a) prohíbe transferir de operaciones de CAPITAL a CORRIENTES, pero NO prohíbe transferir de operaciones corrientes (Cap. 2) a operaciones de capital (Cap. 6).',
          'Requiere aprobación mediante Ley de las Cortes Generales en todo caso.',
          'Está prohibida en todos los casos entre distintos capítulos.'
        ],
        correctIndex: 1,
        articleRef: 'Art. 52.1.a) Ley 47/2003 (LGP)',
        explanation: '¡Ojo a la dirección de la restricción del art. 52.1.a) LGP! Se prohíbe transferir DE operaciones de capital A operaciones corrientes (para no descapitalizar inversiones para gasto corriente), pero SÍ se permite transferir de corrientes (Cap. 2) a capital (Cap. 6).',
        difficulty: 'alto',
        isTrapWord: true,
        trapWord: 'en todo caso',
      },
      {
        id: 'supB-q13',
        block: 5,
        topic: 'Competencia en Transferencias de Crédito (Art. 62-63 LGP)',
        question: 'Si la transferencia del Capítulo 2 al Capítulo 6 se realiza dentro de un mismo programa o entre varios programas de un mismo servicio de una misma sección ministerial (sin afectar a gastos de personal ni superar el ámbito departamental), ¿a quién corresponde autorizarla según los artículos 62 y 63 de la LGP?',
        options: [
          'Al Consejo de Ministros.',
          'Al titular del Departamento ministerial respectivo (Ministro), salvo que afecte a créditos de personal o supuestos reservados al Ministro de Hacienda o Consejo de Ministros.',
          'Al Interventor Delegado.',
          'Al Director General del Tesoro.'
        ],
        correctIndex: 1,
        articleRef: 'Art. 63.1.a) Ley 47/2003 (LGP)',
        explanation: 'Según el art. 63.1.a) LGP, los Ministros autorizan transferencias entre créditos de un mismo programa o entre programas de un mismo servicio (salvo las que afecten a créditos de personal, salvo redistribuciones tasadas, o se encuentren entre las competencias del Ministro de Hacienda del art. 62 o Consejo de Ministros del art. 61).',
        difficulty: 'alto',
      },
      {
        id: 'supB-q14',
        block: 5,
        topic: 'Nivel de vinculación de los créditos (Cap. 2)',
        question: 'En el presupuesto de gastos del Ministerio, los créditos del Capítulo 2 ("Gastos corrientes en bienes y servicios") tienen carácter limitativo y vinculante, con carácter general según el artículo 43.1 de la LGP, a nivel de:',
        options: [
          'Subconcepto.',
          'Artículo (excepto gastos reservados, atenciones protocolarias, etc., que vinculan a nivel de concepto o subconcepto según LPGE).',
          'Sección.',
          'Capítulo completo sin distinción de artículos.'
        ],
        correctIndex: 1,
        articleRef: 'Art. 43.1 y 44 Ley 47/2003 (LGP)',
        explanation: 'El art. 43.1 LGP especifica y vincula a nivel de ARTÍCULO los créditos de Cap. 1, Cap. 2 y Cap. 6, como regla general (con excepciones específicas previstas en la LGP o LPGE).',
        difficulty: 'medio',
      },
      {
        id: 'supB-q15',
        block: 5,
        topic: 'Ordenación del Pago y Fiscalización',
        question: 'Antes de que el ordenador general de pagos (Director General del Tesoro y Política Financiera) expida la orden de pago (Fase P) derivada del reconocimiento de la obligación (Fase O), ¿qué órgano ejerce la intervención material o formal del pago?',
        options: [
          'El Tribunal de Cuentas con carácter previo al pago.',
          'La Intervención General de la Administración del Estado (IGAE) a través de sus Intervenciones Delegadas, verificando que las órdenes de pago se dictan por órgano competente, se ajustan al acto de reconocimiento y existe crédito/liquidez.',
          'La Abogacía del Estado.',
          'El Consejo de Estado.'
        ],
        correctIndex: 1,
        articleRef: 'Art. 148 y Art. 150 Ley 47/2003 (LGP)',
        explanation: 'La función interventora ejercida por la IGAE comprende la fiscalización previa de actos de contenido económico y la intervención formal y material del pago antes de su realización efectiva.',
        difficulty: 'base',
      },
    ],
  },
];
