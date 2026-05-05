/**
 * Formata uma data para o padrão brasileiro: DD/MM/YYYY HH:mm
 * @param date Data em formato Date, string ou number
 * @returns string formatada ou vazia
 */
export const formatarDataHora = (date: Date | string | number | null | undefined): string => {
  // Retorna vazio se o campo estiver nulo, indefinido ou for uma string vazia
  if (!date || date === "") {
    return "";
  }

  const d = new Date(date);

  // Se o valor não for uma data válida (ex: "texto_qualquer")
  if (isNaN(d.getTime())) {
    return ""; // Ou manter "Data inválida" se preferir
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d).replace(",", "");
};

/**
 * Formata uma data para o padrão exigido pelos inputs HTML (YYYY-MM-DD)
 * ou (YYYY-MM-DDTHH:mm) para datetime-local.
 * @param date Data em formato Date, string ou number
 * @param incluirHora Se verdadeiro, retorna formato para input tipo 'datetime-local'
 * @returns string formatada para value do input
 */
export const formatarDataInput = (
  date: Date | string | number | null | undefined,
  incluirHora: boolean = true
): string => {
  if (!date || date === "") return "";

  const d = new Date(date);

  // Si la fecha es inválida (NaN), retornamos vacío para no romper el input
  if (isNaN(d.getTime())) return "";

  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");

  if (incluirHora) {
    const hora = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");

    // IMPORTANTE: Retornamos estrictamente YYYY-MM-DDTHH:mm
    // Sin segundos ni milisegundos para evitar el error del navegador
    return `${ano}-${mes}-${dia}T${hora}:${min}`;
  }

  return `${ano}-${mes}-${dia}`;
};


/**
 * Convierte una fecha a formato ISO local (YYYY-MM-DDTHH:mm:ss)
 * evitando el desfase de zona horaria de toISOString().
 */
export const fomatearFechaLocal = (fecha: string | Date | null | undefined): string | null => {
  if (!fecha) return null;

  const date = new Date(fecha);

  // Verificamos si la fecha es válida para evitar errores de "Invalid Date"
  if (isNaN(date.getTime())) {
    console.error("fechaLocal: La fecha proporcionada no es válida", fecha);
    return null;
  }

  // Obtenemos el offset en milisegundos
  const off = date.getTimezoneOffset() * 60000;
  
  // Ajustamos la fecha restando el offset para obtener la hora local real
  const localDate = new Date(date.getTime() - off);
  
  // Retornamos el string cortado antes de los milisegundos y la 'Z'
  return localDate.toISOString().split('.')[0];
};

/**
 * Formata um valor numérico para diferentes moedas (BRL, PYG, USD)
 * @param valor Número ou string numérica
 * @param moeda Sigla da moeda: 'BRL', 'PYG' ou 'USD' (padrão: BRL)
 * @returns string formatada
 */
export const formatarMoeda = (
  valor: number | string | null | undefined,
  moeda: 'BRL' | 'PYG' | 'USD' = 'BRL'
): string => {
  // Retorna vazio ou padrão se o valor não existir
  if (valor === null || valor === undefined || valor === "") return "";

  const n = typeof valor === "string" ? parseFloat(valor) : valor;

  if (isNaN(n)) return "";

  const locales: Record<string, string> = {
    BRL: "pt-BR",
    PYG: "es-PY",
    USD: "en-US",
  };

  return new Intl.NumberFormat(locales[moeda], {
    style: "currency",
    currency: moeda,
    minimumFractionDigits: moeda === "PYG" ? 0 : 2,
    maximumFractionDigits: moeda === "PYG" ? 0 : 2,
  }).format(n);
};