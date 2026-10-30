import { useMemo } from 'react';

import { useTema } from '../theme/TemaProvider';
import type { CoresTema } from '../theme/colors';

export function useEstilosTema<T>(
  criarEstilos: (colors: CoresTema) => T,
) {
  const tema = useTema();

  const styles = useMemo(
    () => criarEstilos(tema.colors),
    [criarEstilos, tema.colors],
  );

  return {
    ...tema,
    styles,
  };
}