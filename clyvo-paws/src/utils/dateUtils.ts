export function calcularIdade(
  dataNascimento: string | null | undefined,
  hoje: Date = new Date(),
): string {
  if (!dataNascimento) return 'Não informada';

  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dataNascimento);

  if (!partes || Number.isNaN(hoje.getTime())) {
    return 'Data inválida';
  }

  const ano = Number(partes[1]);
  const mes = Number(partes[2]);
  const dia = Number(partes[3]);

  const nascimento = new Date(0);
  nascimento.setHours(0, 0, 0, 0);
  nascimento.setFullYear(ano, mes - 1, dia);

  const dataAtual = new Date(hoje.getTime());
  dataAtual.setHours(0, 0, 0, 0);

  if (
    nascimento.getFullYear() !== ano ||
    nascimento.getMonth() !== mes - 1 ||
    nascimento.getDate() !== dia ||
    nascimento > dataAtual
  ) {
    return 'Data inválida';
  }

  let mesesTotais =
    (dataAtual.getFullYear() - ano) * 12 +
    dataAtual.getMonth() - (mes - 1);

  if (dataAtual.getDate() < dia) {
    mesesTotais -= 1;
  }

  if (mesesTotais < 1) return 'Menos de 1 mês';

  const anos = Math.floor(mesesTotais / 12);
  const meses = mesesTotais % 12;

  const textoMeses = `${meses} ${meses === 1 ? 'mês' : 'meses'}`;

  if (anos === 0) return textoMeses;

  const textoAnos = `${anos} ${anos === 1 ? 'ano' : 'anos'}`;

  return meses === 0
    ? textoAnos
    : `${textoAnos} e ${textoMeses}`;
}