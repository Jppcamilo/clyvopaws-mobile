export const calcularIdade = (dataNascimento: string) => {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  
  let anos = hoje.getFullYear() - nascimento.getFullYear();
  let meses = hoje.getMonth() - nascimento.getMonth();
  
  if (meses < 0 || (meses === 0 && hoje.getDate() < nascimento.getDate())) {
    anos--;
    meses += 12;
  }
  
  meses = meses - (hoje.getDate() < nascimento.getDate() ? 1 : 0);
  if (meses < 0) meses = 11;

  if (anos > 0) {
    return `${anos} ano${anos > 1 ? 's' : ''}${meses > 0 ? ` e ${meses} mês${meses > 1 ? 'es' : ''}` : ''}`;
  }
  return `${meses} mês${meses > 1 ? 'es' : ''}`;
};