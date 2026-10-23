import { useQuery } from '@tanstack/react-query';
import { sessaoService } from '../services/sessaoService';

export function useSessaoLocal() {
  return useQuery({
    queryKey: ['sessao-local'],
    queryFn: sessaoService.exigirTutor,
    staleTime: Infinity,
    retry: false,
  });
}