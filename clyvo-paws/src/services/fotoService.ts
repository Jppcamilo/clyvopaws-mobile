import { Platform } from 'react-native';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import api from './api';

function fotoLocal(valor: unknown): valor is string {
  return typeof valor === 'string' && valor.trim().length > 0
    && !/^https?:\/\//i.test(valor);
}

async function prepararFoto(uri: string): Promise<string> {
  const contexto = ImageManipulator.manipulate(uri);
  try {
    const original = await contexto.renderAsync();
    let imagem = original;
    try {
      if (Math.max(original.width, original.height) > 1024) {
        contexto.resize(original.width >= original.height
          ? { width: 1024, height: null }
          : { width: null, height: 1024 });
        imagem = await contexto.renderAsync();
      }
      const preparada = await imagem.saveAsync({ format: SaveFormat.JPEG, compress: 0.75 });
      return preparada.uri;
    } finally {
      if (imagem !== original) imagem.release();
      original.release();
    }
  } catch {
    throw new Error('Não foi possível ler a foto. Selecione a imagem novamente na galeria.');
  } finally {
    contexto.release();
  }
}

/** Mantém JSON sem foto nova; usa multipart somente para enviar um arquivo local. */
export async function salvarComFoto<T>(
  method: 'post' | 'put',
  url: string,
  dados: Record<string, unknown>,
  campoFoto: 'foto' | 'fotoUrl',
): Promise<T> {
  const foto = dados[campoFoto];
  if (!fotoLocal(foto)) {
    const { data } = await api.request<T>({ method, url, data: dados });
    return data;
  }

  const uri = await prepararFoto(foto);
  const formulario = new FormData();
  // Não envia file:// para o campo do banco. A API substitui esse null pela URL do upload.
  formulario.append('dados', JSON.stringify({ ...dados, [campoFoto]: null }));

  if (Platform.OS === 'web') {
    const resposta = await fetch(uri);
    if (!resposta.ok) throw new Error('Não foi possível preparar a foto para envio.');
    formulario.append('foto', await resposta.blob(), 'foto.jpg');
  } else {
    formulario.append('foto', {
      uri,
      name: 'foto.jpg',
      type: 'image/jpeg',
    } as unknown as Blob);
  }

  const { data } = await api.request<T>({
    method,
    url,
    data: formulario,
    adapter: 'xhr',
    timeout: 120000,
    ...(Platform.OS === 'web' ? {} : { headers: { 'Content-Type': 'multipart/form-data' } }),
  });
  return data;
}
