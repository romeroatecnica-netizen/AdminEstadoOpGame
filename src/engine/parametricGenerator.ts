import { ParametricExercise } from '../types';

function createRng(seed: number): () => number {
  let t = (seed || 123456) >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

const WEEKDAYS_ES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MONTHS_ES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

function formatDateEs(d: Date): string {
  return `${d.getDate()} de ${MONTHS_ES[d.getMonth()]} de ${d.getFullYear()} (${WEEKDAYS_ES[d.getDay()]})`;
}

function isWeekend(d: Date): boolean {
  const day = d.getDay();
  return day === 0 || day === 6;
}

function addBusinessDays(startDate: Date, businessDays: number, holidaysIso: Set<string>): Date {
  const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  let counted = 0;
  while (counted < businessDays) {
    cursor.setDate(cursor.getDate() + 1);
    const iso = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(
      cursor.getDate()
    ).padStart(2, '0')}`;
    if (!isWeekend(cursor) && !holidaysIso.has(iso)) {
      counted++;
    }
  }
  return cursor;
}

function nextBusinessDay(d: Date, holidaysIso: Set<string>): Date {
  const cursor = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  while (true) {
    const iso = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(
      cursor.getDate()
    ).padStart(2, '0')}`;
    if (!isWeekend(cursor) && !holidaysIso.has(iso)) {
      return cursor;
    }
    cursor.setDate(cursor.getDate() + 1);
  }
}

function generateDeadlineExercise(seed: number): ParametricExercise {
  const rand = createRng(seed);
  const holidays = new Set<string>(['2026-05-01', '2026-10-12', '2026-12-08']);
  const mode = Math.floor(rand() * 3);

  if (mode === 0) {
    // Días hábiles (Art. 30.2 y 30.3 Ley 39/2015)
    const startCandidates = [
      new Date(2026, 2, 11), // Miércoles 11 marzo 2026
      new Date(2026, 3, 27), // Lunes 27 abril 2026 (cruza 1 mayo festivo)
      new Date(2026, 4, 14), // Jueves 14 mayo 2026
      new Date(2026, 9, 7),  // Miércoles 7 octubre 2026 (cruza 12 oct festivo)
      new Date(2026, 10, 18), // Miércoles 18 noviembre 2026
    ];
    const notifDate = pick(startCandidates, rand);
    const days = pick([5, 10, 15], rand);
    const due = addBusinessDays(notifDate, days, holidays);

    const wrong1 = new Date(notifDate.getFullYear(), notifDate.getMonth(), notifDate.getDate() + days);
    const wrong2 = addBusinessDays(notifDate, days - 1, holidays);
    const wrong3 = addBusinessDays(notifDate, days + 2, holidays);

    const correctStr = formatDateEs(due);
    const rawOptions = [
      correctStr,
      formatDateEs(wrong1),
      formatDateEs(wrong2),
      formatDateEs(wrong3),
    ];
    const unique = Array.from(new Set(rawOptions));
    while (unique.length < 4) {
      const alt = addBusinessDays(notifDate, days + unique.length + 1, holidays);
      const label = formatDateEs(alt);
      if (!unique.includes(label)) unique.push(label);
    }

    const shuffledIdx = [0, 1, 2, 3].sort(() => rand() - 0.5);
    const options = shuffledIdx.map((i) => unique[i]) as [string, string, string, string];
    const correctIndex = shuffledIdx.indexOf(0) as 0 | 1 | 2 | 3;

    const nextDay = new Date(notifDate.getFullYear(), notifDate.getMonth(), notifDate.getDate() + 1);

    return {
      id: `param-plazos-${seed}`,
      category: 'plazos',
      categoryLabel: 'Cómputo de Plazos (Ley 39/2015)',
      title: `Cómputo de plazo de ${days} días hábiles`,
      prompt: `Un interesado recibe válidamente una notificación administrativa el ${formatDateEs(
        notifDate
      )} concediéndole un plazo de ${days} días para subsanar o formular alegaciones (sin días festivos locales adicionales salvo los nacionales: 1 de mayo y 12 de octubre). ¿Qué día finaliza el plazo?`,
      options,
      correctIndex,
      articleRef: 'Art. 30.2 y Art. 30.3 Ley 39/2015 (LPACAP)',
      steps: [
        `1. Naturaleza del plazo (Art. 30.2 LPACAP): al expresarse en "días" sin indicar naturales, son DÍAS HÁBILES (se excluyen sábados, domingos y festivos).`,
        `2. Inicio del cómputo (Art. 30.3 LPACAP): comienza el día siguiente al de la notificación, es decir, a partir del ${formatDateEs(
          nextDay
        )}.`,
        `3. Conteo de ${days} días hábiles excluyendo sábados, domingos y festivos nacionales en el tramo.`,
        `4. Día de vencimiento exacto: ${correctStr}.`,
      ],
      seed,
    };
  }

  if (mode === 1) {
    // Plazos por meses con regla de fecha a fecha y último día del mes (Art. 30.4 y 30.5)
    const cases = [
      {
        notif: new Date(2026, 0, 31), // 31 enero 2026 (febrero tiene 28, 28 feb 2026 es sábado!)
        months: 1,
        note: 'En febrero de 2026 no existe día 31 (tiene 28 días), por lo que vence el último día del mes (28 de febrero). Como el 28 de febrero de 2026 es sábado (inhábil), se prorroga al primer día hábil siguiente: lunes 2 de marzo de 2026.',
      },
      {
        notif: new Date(2026, 2, 31), // 31 marzo 2026 -> 30 abril 2026 (jueves)
        months: 1,
        note: 'En abril no existe día 31 (tiene 30 días), por lo que expira el último día de abril: 30 de abril de 2026 (jueves hábil).',
      },
      {
        notif: new Date(2026, 7, 31), // 31 agosto 2026 -> 30 septiembre 2026 (miércoles)
        months: 1,
        note: 'En septiembre no existe día 31, por lo que expira el último día de septiembre: 30 de septiembre de 2026 (miércoles hábil).',
      },
      {
        notif: new Date(2026, 4, 15), // 15 mayo 2026 + 3 meses -> 15 agosto 2026 (sábado festivo) -> lunes 17 agosto
        months: 3,
        note: 'De fecha a fecha sería el 15 de agosto de 2026, que es sábado y festivo nacional; conforme al Art. 30.5 LPACAP, se prorroga al primer día hábil siguiente: lunes 17 de agosto de 2026.',
      },
    ];
    const picked = pick(cases, rand);
    const rawTarget = new Date(
      picked.notif.getFullYear(),
      picked.notif.getMonth() + picked.months + 1,
      0
    );
    const expectedDay = picked.notif.getDate();
    const target =
      expectedDay <= rawTarget.getDate()
        ? new Date(picked.notif.getFullYear(), picked.notif.getMonth() + picked.months, expectedDay)
        : rawTarget;

    const finalDue = nextBusinessDay(target, holidays);
    const correctStr = formatDateEs(finalDue);

    const w1 = new Date(target.getFullYear(), target.getMonth(), target.getDate() + 1);
    const w2 = new Date(picked.notif.getFullYear(), picked.notif.getMonth(), picked.notif.getDate() + 30 * picked.months);
    const w3 = new Date(finalDue.getFullYear(), finalDue.getMonth(), finalDue.getDate() + 2);

    const unique = Array.from(
      new Set([correctStr, formatDateEs(w1), formatDateEs(w2), formatDateEs(w3)])
    );
    while (unique.length < 4) {
      unique.push(
        formatDateEs(new Date(finalDue.getFullYear(), finalDue.getMonth(), finalDue.getDate() + unique.length + 3))
      );
    }

    const shuffledIdx = [0, 1, 2, 3].sort(() => rand() - 0.5);
    const options = shuffledIdx.map((i) => unique[i]) as [string, string, string, string];
    const correctIndex = shuffledIdx.indexOf(0) as 0 | 1 | 2 | 3;

    return {
      id: `param-meses-${seed}`,
      category: 'plazos',
      categoryLabel: 'Cómputo por Meses (Ley 39/2015)',
      title: `Plazo de ${picked.months} ${picked.months === 1 ? 'mes' : 'meses'} (fecha a fecha)`,
      prompt: `Una resolución que NO pone fin a la vía administrativa se notifica el ${formatDateEs(
        picked.notif
      )}. El interesado dispone de ${picked.months} ${
        picked.months === 1 ? 'mes' : 'meses'
      } para interponer recurso de alzada. ¿Cuál es el último día hábil de plazo?`,
      options,
      correctIndex,
      articleRef: 'Art. 30.4, Art. 30.5 y Art. 122.1 Ley 39/2015 (LPACAP)',
      steps: [
        `1. Regla general (Art. 30.4): en plazos por meses, el cómputo se realiza de fecha a fecha a partir del día siguiente al de notificación, concluyendo el mismo día ordinal del mes de vencimiento (si existe).`,
        `2. ${picked.note}`,
        `3. Último día válido de presentación: ${correctStr}.`,
      ],
      seed,
    };
  }

  // Rechazo de notificación electrónica (10 días naturales Art. 43.2)
  const elecDates = [
    new Date(2026, 3, 6), // 6 abril -> +10 días naturales = 16 abril
    new Date(2026, 4, 12), // 12 mayo -> +10 días naturales = 22 mayo
    new Date(2026, 8, 10), // 10 sept -> +10 días naturales = 20 sept
  ];
  const putDate = pick(elecDates, rand);
  const rejectDate = new Date(putDate.getFullYear(), putDate.getMonth(), putDate.getDate() + 10);
  const wrongBiz = addBusinessDays(putDate, 10, holidays);
  const wrong15 = new Date(putDate.getFullYear(), putDate.getMonth(), putDate.getDate() + 15);
  const wrong5 = new Date(putDate.getFullYear(), putDate.getMonth(), putDate.getDate() + 5);

  const unique = [
    formatDateEs(rejectDate),
    formatDateEs(wrongBiz),
    formatDateEs(wrong15),
    formatDateEs(wrong5),
  ];
  const shuffledIdx = [0, 1, 2, 3].sort(() => rand() - 0.5);
  const options = shuffledIdx.map((i) => unique[i]) as [string, string, string, string];
  const correctIndex = shuffledIdx.indexOf(0) as 0 | 1 | 2 | 3;

  return {
    id: `param-dehu-${seed}`,
    category: 'plazos',
    categoryLabel: 'Notificación Electrónica (Ley 39/2015)',
    title: 'Rechazo presunto en sede electrónica / DEHú',
    prompt: `La Administración pone a disposición de una sociedad mercantil una resolución en la Dirección Electrónica Habilitada Única el ${formatDateEs(
      putDate
    )}. La empresa no abre la notificación. ¿En qué fecha se entiende rechazada la notificación?`,
    options,
    correctIndex,
    articleRef: 'Art. 43.2 Ley 39/2015 (LPACAP)',
    steps: [
      `1. El Art. 43.2 LPACAP establece un plazo de DIEZ DÍAS NATURALES (no hábiles) desde la puesta a disposición en sede o DEHú.`,
      `2. Puesta a disposición: ${formatDateEs(putDate)}.`,
      `3. Suma de 10 días naturales: ${formatDateEs(rejectDate)} (teniendo por efectuado el trámite y siguiendo el procedimiento).`,
    ],
    seed,
  };
}

function generateBudgetExercise(seed: number): ParametricExercise {
  const rand = createRng(seed);
  const variant = Math.floor(rand() * 2);

  if (variant === 0) {
    // Crédito disponible tras operaciones RC / A / D / O
    const initial = pick([120000, 180000, 250000, 300000], rand);
    const transferIn = pick([15000, 20000, 30000], rand);
    const rcAmount = pick([24000, 35000, 40000], rand);
    const dAmount = pick([18000, 22000, 28000], rand);
    const available = initial + transferIn - rcAmount - dAmount;

    const distractors = [
      initial - rcAmount - dAmount,
      initial + transferIn - dAmount,
      initial + transferIn - rcAmount,
    ];
    const fmt = (n: number) => `${n.toLocaleString('es-ES')} €`;
    const raw = [fmt(available), ...distractors.map(fmt)];
    const shuffledIdx = [0, 1, 2, 3].sort(() => rand() - 0.5);
    const options = shuffledIdx.map((i) => raw[i]) as [string, string, string, string];
    const correctIndex = shuffledIdx.indexOf(0) as 0 | 1 | 2 | 3;

    return {
      id: `param-gasto-${seed}`,
      category: 'gasto',
      categoryLabel: 'Ejecución del Gasto Público (LGP)',
      title: 'Cálculo de Crédito Disponible tras RC y Fase D',
      prompt: `Una aplicación presupuestaria del Capítulo 2 cuenta con un crédito inicial de ${fmt(
        initial
      )}. Recibe una transferencia de crédito positiva de ${fmt(
        transferIn
      )}, tiene expedida una Retención de Crédito (RC) vigente de ${fmt(
        rcAmount
      )} y un compromiso de gasto (Fase D) por un contrato ya adjudicado de ${fmt(
        dAmount
      )}. ¿Cuál es el saldo de crédito disponible para nuevas actuaciones?`,
      options,
      correctIndex,
      articleRef: 'Art. 40, 52 y 73 Ley 47/2003 (LGP) e Instrucción Contable',
      steps: [
        `1. Crédito definitivo = Crédito inicial (${fmt(initial)}) + Modificación positiva (${fmt(transferIn)}) = ${fmt(
          initial + transferIn
        )}.`,
        `2. Tanto las Retenciones de Crédito (${fmt(rcAmount)}) como los gastos comprometidos/autorizados no anulados (${fmt(
          dAmount
        )}) minoran el crédito disponible.`,
        `3. Crédito disponible = ${fmt(initial + transferIn)} - ${fmt(rcAmount)} - ${fmt(dAmount)} = ${fmt(available)}.`,
      ],
      seed,
    };
  }

  // Cálculo de contrato menor con IVA 21%
  const baseCandidates = [12400, 14500, 15800, 16200, 38500, 41200];
  const baseImponible = pick(baseCandidates, rand);
  const isWorks = baseImponible > 30000;
  const contractType = isWorks ? 'obras' : 'servicios';
  const legalLimit = isWorks ? 40000 : 15000;
  const totalWithVat = Math.round(baseImponible * 1.21 * 100) / 100;
  const fitsMinor = baseImponible < legalLimit;

  const fmtEur = (n: number) => `${n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

  const optCorrect = fitsMinor
    ? `Sí procede contrato menor: su valor estimado sin IVA (${fmtEur(baseImponible)}) es inferior al umbral de ${legalLimit.toLocaleString(
        'es-ES'
      )} €.`
    : `No procede contrato menor: su valor estimado sin IVA (${fmtEur(
        baseImponible
      )}) alcanza o supera el límite de ${legalLimit.toLocaleString('es-ES')} €.`;

  const optWrong1 = fitsMinor
    ? `No procede contrato menor porque el importe con IVA (${fmtEur(
        totalWithVat
      )}) supera los ${legalLimit.toLocaleString('es-ES')} €.`
    : `Sí procede contrato menor porque el límite en ${contractType} es de ${(legalLimit + 10000).toLocaleString(
        'es-ES'
      )} €.`;

  const optWrong2 = `Solo procede si el órgano de contratación constituye previamente una garantía definitiva del 5 %.`;
  const optWrong3 = `El umbral del contrato menor se calcula siempre incluyendo el 21 % de IVA en el valor estimado.`;

  const raw = [optCorrect, optWrong1, optWrong2, optWrong3];
  const shuffledIdx = [0, 1, 2, 3].sort(() => rand() - 0.5);
  const options = shuffledIdx.map((i) => raw[i]) as [string, string, string, string];
  const correctIndex = shuffledIdx.indexOf(0) as 0 | 1 | 2 | 3;

  return {
    id: `param-lcsp-${seed}`,
    category: 'gasto',
    categoryLabel: 'Contratación y Gasto (LCSP + LGP)',
    title: `Viabilidad de contrato menor de ${contractType} con IVA`,
    prompt: `Un órgano ministerial necesita contratar un expediente de ${contractType} cuyo presupuesto total (IVA del 21 % incluido) asciende a ${fmtEur(
      totalWithVat
    )}. ¿Puede tramitarse como contrato menor conforme al artículo 118 de la Ley 9/2017 (LCSP)?`,
    options,
    correctIndex,
    articleRef: 'Art. 101 y Art. 118.1 Ley 9/2017 (LCSP)',
    steps: [
      `1. El umbral del contrato menor (Art. 118.1 LCSP) se mide por el VALOR ESTIMADO (sin IVA, Art. 101 LCSP): < 15.000 € en servicios/suministros y < 40.000 € en obras.`,
      `2. Descontamos el 21 % de IVA: ${fmtEur(totalWithVat)} / 1,21 = ${fmtEur(baseImponible)}.`,
      `3. Comparación con el umbral de ${legalLimit.toLocaleString('es-ES')} €: ${
        fitsMinor ? 'es inferior, por lo que SÍ cabe contrato menor.' : 'supera el umbral, por lo que debe licitarse por procedimiento abierto/simplificado.'
      }`,
    ],
    seed,
  };
}

function generateExcelExercise(seed: number): ParametricExercise {
  const rand = createRng(seed);
  const variant = Math.floor(rand() * 2);

  if (variant === 0) {
    // Desplazamiento de referencias mixtas y absolutas
    const colShift = pick([1, 2], rand);
    const rowShift = pick([2, 3], rand);
    const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
    const srcColIdx = 2; // C
    const srcRow = 3;
    const dstCol = cols[srcColIdx + colShift];
    const dstRow = srcRow + rowShift;

    const correctFormula = `=${cols[1 + colShift]}${2 + rowShift}*B$${1} + $${cols[0]}${4 + rowShift}`;
    // Wait: let's keep a super clean exact source formula:
    // Source at C3: =B3*A$1+$D3
    const srcFormula = `=B3*A$1+$D3`;
    const ansCorrect = `=${cols[1 + colShift]}${3 + rowShift}*${cols[0 + colShift]}$1+$D${3 + rowShift}`;
    const ansW1 = `=${cols[1 + colShift]}${3 + rowShift}*A$${1 + rowShift}+$D${3 + rowShift}`;
    const ansW2 = `=${cols[1 + colShift]}${3 + rowShift}*${cols[0 + colShift]}$1+$${cols[3 + colShift]}${3 + rowShift}`;
    const ansW3 = `=B3*A$1+$D3`;

    const raw = [ansCorrect, ansW1, ansW2, ansW3];
    const shuffledIdx = [0, 1, 2, 3].sort(() => rand() - 0.5);
    const options = shuffledIdx.map((i) => raw[i]) as [string, string, string, string];
    const correctIndex = shuffledIdx.indexOf(0) as 0 | 1 | 2 | 3;

    return {
      id: `param-excel-ref-${seed}`,
      category: 'excel',
      categoryLabel: 'Ofimática — Excel 365',
      title: 'Copia de referencias relativas, mixtas y absolutas',
      prompt: `En Microsoft Excel, la celda C3 contiene la fórmula \`${srcFormula}\`. Si copiamos la celda C3 y la pegamos en la celda ${dstCol}${dstRow} (+${colShift} columna/s y +${rowShift} filas), ¿qué fórmula contendrá ${dstCol}${dstRow}?`,
      options,
      correctIndex,
      articleRef: 'Microsoft Excel 365 — Referencias relativas y mixtas ($)',
      steps: [
        `1. Desplazamiento aplicado: +${colShift} columna(s) a la derecha y +${rowShift} filas hacia abajo.`,
        `2. \`B3\` (relativa): cambia columna y fila → \`${cols[1 + colShift]}${3 + rowShift}\`.`,
        `3. \`A$1\` (mixta con fila fija): cambia la columna A → \`${cols[0 + colShift]}\`, pero \`$1\` permanece fijo → \`${cols[0 + colShift]}$1\`.`,
        `4. \`$D3\` (mixta con columna fija): \`$D\` permanece fijo y la fila 3 pasa a ${3 + rowShift} → \`$D${3 + rowShift}\`.`,
      ],
      seed,
    };
  }

  // Evaluación numérica de función SI + SUMAR.SI
  const threshold = pick([1000, 1500, 2000], rand);
  const v1 = pick([900, 1200, 1600], rand);
  const v2 = pick([1500, 2100, 2400], rand);
  const v3 = pick([800, 1100, 1900], rand);
  const v4 = pick([2200, 2600, 1400], rand);

  const vals = [v1, v2, v3, v4];
  const depts = ['Personal', 'Contratación', 'Personal', 'Hacienda'];

  const sumPersonalAbove = vals.reduce(
    (acc, v, idx) => (depts[idx] === 'Personal' && v >= threshold ? acc + v : acc),
    0
  );
  const sumAllAbove = vals.reduce((acc, v) => (v >= threshold ? acc + v : acc), 0);
  const sumPersonalAll = vals.reduce((acc, v, idx) => (depts[idx] === 'Personal' ? acc + v : acc), 0);
  const countPersonalAbove = vals.filter((v, idx) => depts[idx] === 'Personal' && v >= threshold).length;

  const uniqueNums = Array.from(
    new Set([sumPersonalAbove, sumAllAbove, sumPersonalAll, countPersonalAbove])
  );
  while (uniqueNums.length < 4) {
    uniqueNums.push(sumPersonalAbove + 500 + uniqueNums.length * 100);
  }
  const raw = uniqueNums.map((n) => String(n));
  const shuffledIdx = [0, 1, 2, 3].sort(() => rand() - 0.5);
  const options = shuffledIdx.map((i) => raw[i]) as [string, string, string, string];
  const correctIndex = shuffledIdx.indexOf(0) as 0 | 1 | 2 | 3;

  return {
    id: `param-excel-func-${seed}`,
    category: 'excel',
    categoryLabel: 'Ofimática — Funciones Excel 365',
    title: 'Evaluación de SUMAR.SI.CONJUNTO sobre tabla administrativa',
    prompt: `En Excel tenemos A2:A5 = {"Personal", "Contratación", "Personal", "Hacienda"} y B2:B5 = {${vals.join(
      ', '
    )}}. ¿Qué resultado numérico devuelve la fórmula \`=SUMAR.SI.CONJUNTO(B2:B5; A2:A5; "Personal"; B2:B5; ">=${threshold}")\`?`,
    options,
    correctIndex,
    articleRef: 'Microsoft Excel 365 — Función SUMAR.SI.CONJUNTO',
    steps: [
      `1. La fórmula suma las celdas de B2:B5 que cumplan simultáneamente: Columna A = "Personal" Y Columna B >= ${threshold}.`,
      `2. Fila 2: ("Personal", ${v1}) → ${v1 >= threshold ? `SÍ cumple (+${v1})` : `NO cumple (< ${threshold})`}.`,
      `3. Fila 3: ("Contratación", ${v2}) → NO cumple (Departamento distinto).`,
      `4. Fila 4: ("Personal", ${v3}) → ${v3 >= threshold ? `SÍ cumple (+${v3})` : `NO cumple (< ${threshold})`}.`,
      `5. Fila 5: ("Hacienda", ${v4}) → NO cumple. Total resultante: ${sumPersonalAbove}.`,
    ],
    seed,
  };
}

export function generateParametricExercise(
  category: 'plazos' | 'gasto' | 'excel' | 'mixto',
  seed: number
): ParametricExercise {
  const rand = createRng(seed);
  const chosen: 'plazos' | 'gasto' | 'excel' =
    category === 'mixto' ? pick(['plazos', 'gasto', 'excel'], rand) : category;

  if (chosen === 'plazos') return generateDeadlineExercise(seed);
  if (chosen === 'gasto') return generateBudgetExercise(seed);
  return generateExcelExercise(seed);
}
