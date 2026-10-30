import Constants from 'expo-constants';

export type InformacoesVersao = {
  versao: string;
  commit: string | null;
  estado: 'commit' | 'alterado' | 'sem-git';
};

export function obterInformacoesVersao(): InformacoesVersao {
  const build: unknown = Constants.expoConfig?.extra?.clyvoBuild;
  const dados = build && typeof build === 'object'
    ? build as Record<string, unknown>
    : {};
  const commit = typeof dados.commit === 'string' && /^[a-f0-9]{40}$/i.test(dados.commit)
    ? dados.commit.toLowerCase()
    : null;
  return {
    versao: Constants.expoConfig?.version ?? 'Não informada',
    commit,
    estado: !commit ? 'sem-git' : dados.estado === 'commit' ? 'commit' : 'alterado',
  };
}
