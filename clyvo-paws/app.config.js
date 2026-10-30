const { execFileSync } = require('node:child_process');

const hashValido = (valor) => typeof valor === 'string' && /^[a-f0-9]{40}$/i.test(valor);

function lerGit(argumentos) {
  try {
    return execFileSync('git', argumentos, {
      cwd: __dirname,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 3000,
    }).trim();
  } catch {
    return null;
  }
}

function identificarCodigo() {
  // O servidor EAS informa o commit enviado. Não depende de um Git instalado no celular.
  if (process.env.EAS_BUILD === 'true') {
    const commit = process.env.EAS_BUILD_GIT_COMMIT_HASH;
    if (!hashValido(commit)) {
      throw new Error('A build precisa de um commit Git válido. Use o eas.json com cli.requireCommit=true e não use EAS_NO_VCS.');
    }
    return { commit: commit.toLowerCase(), estado: 'commit' };
  }

  const commit = lerGit(['rev-parse', 'HEAD']);
  const alteracoes = lerGit(['status', '--porcelain', '--untracked-files=normal']);
  if (!hashValido(commit) || alteracoes === null) {
    return { commit: '', estado: 'sem-git' };
  }
  return { commit: commit.toLowerCase(), estado: alteracoes ? 'alterado' : 'commit' };
}

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    clyvoBuild: identificarCodigo(),
  },
});
