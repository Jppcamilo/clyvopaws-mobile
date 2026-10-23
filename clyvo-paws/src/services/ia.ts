import axios from 'axios';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import type { ImagePickerAsset } from 'expo-image-picker';
import api from './api';

export type EspeciePet = 'CACHORRO' | 'GATO';

export interface AnalisePet {
  status: 'IDENTIFICADO' | 'INCONCLUSIVO' | 'NAO_SUPORTADO';
  especie: EspeciePet | null;
  racaProvavel: string | null;
  confiancaVisual: 'BAIXA' | 'MEDIA' | 'ALTA';
  caracteristicas: string[];
  motivo: string;
  idAnalise: string;
  modelo: string;
  requerConfirmacaoTutor: boolean;
  aviso: string;
}

export async function analisarFotoPet(
  foto: ImagePickerAsset,
  signal: AbortSignal,
): Promise<AnalisePet> {
  const contexto = ImageManipulator.manipulate(foto.uri);

  try {
    if (Math.max(foto.width, foto.height) > 1600) {
      contexto.resize(
        foto.width >= foto.height
          ? { width: 1600, height: null }
          : { width: null, height: 1600 },
      );
    }

    const imagem = await contexto.renderAsync();

    try {
      const preparada = await imagem.saveAsync({
        format: SaveFormat.JPEG,
        compress: 0.8,
      });

      if (signal.aborted) {
        throw new Error('Análise cancelada.');
      }

      const formulario = new FormData();

      formulario.append(
        'foto',
        {
          uri: preparada.uri,
          name: 'pet.jpg',
          type: 'image/jpeg',
        } as unknown as Blob,
      );

      const { data } = await api.post<AnalisePet>(
        '/api/ia/analisar-pet',
        formulario,
        {
          adapter: 'xhr',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 75000,
          signal,
        },
      );

      if (!data || data.requerConfirmacaoTutor !== true) {
        throw new Error('A IA retornou uma resposta inesperada.');
      }

      return data;
    } finally {
      imagem.release();
    }
  } finally {
    contexto.release();
  }
}

export function mensagemErroIA(erro: unknown): string {
  if (axios.isAxiosError(erro)) {
    const status = erro.response?.status;

    if (status === 401) {
      return 'Sua sessão expirou. Faça login novamente.';
    }

    if (status === 403) {
      return 'Entre com uma conta de tutor para analisar a foto.';
    }

    if (status === 413) {
      return 'A imagem está muito grande. Escolha uma foto menor.';
    }

    if (status === 400 || status === 415 || status === 422) {
      return 'Não foi possível ler essa imagem. Escolha outra foto.';
    }

    if (status === 429 || status === 503) {
      return 'A IA está indisponível no momento. Tente novamente mais tarde.';
    }

    if (
      status === 504 ||
      erro.code === 'ECONNABORTED' ||
      erro.code === 'ETIMEDOUT'
    ) {
      return 'A análise demorou demais. Tente novamente.';
    }

    if (status === 502) {
      return 'A IA não conseguiu concluir a análise. Tente novamente ou use outra foto.';
    }

    if (!erro.response) {
      return 'Não foi possível acessar o servidor. Confira a conexão e o endereço da API.';
    }
  }

  return 'Não foi possível analisar a foto. Você pode preencher os dados manualmente.';
}