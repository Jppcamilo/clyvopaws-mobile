import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { Agendamento } from '../types/api';

export type DestinoConsulta = {
  tipo: 'consulta';
  tutorId: number;
  petId: number;
  agendamentoId: number;
};

export function lerDestinoConsulta(valor: unknown): DestinoConsulta | null {
  if (!valor || typeof valor !== 'object') return null;
  const dados = valor as Partial<DestinoConsulta>;
  const idValido = (id: unknown): id is number =>
    typeof id === 'number' && Number.isSafeInteger(id) && id > 0;
  if (dados.tipo !== 'consulta' || !idValido(dados.tutorId) ||
      !idValido(dados.petId) || !idValido(dados.agendamentoId)) return null;
  return { tipo: 'consulta', tutorId: dados.tutorId,
    petId: dados.petId, agendamentoId: dados.agendamentoId };
}

export function calcularHorarioLembrete(dataHora: string, agora = Date.now()): Date | null {
  const instante = new Date(dataHora).getTime() - 2 * 60 * 60 * 1000;
  return Number.isFinite(instante) && instante > agora ? new Date(instante) : null;
}

export async function configurarCanalConsultas(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('consultas', {
      name: 'Lembretes de consultas',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }
}

export class PermissaoLembreteError extends Error {}

export async function solicitarPermissaoLembretes(): Promise<void> {
  if (Platform.OS === 'web') {
    throw new Error('Ative os lembretes no aplicativo Android ou iOS.');
  }
  // No Android, o canal deve existir antes da solicitação de permissão.
  await configurarCanalConsultas();
  const permitida = (p: Notifications.NotificationPermissionsStatus) =>
    p.granted || p.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL ||
    p.ios?.status === Notifications.IosAuthorizationStatus.EPHEMERAL;
  let permissao = await Notifications.getPermissionsAsync();
  if (!permitida(permissao) && permissao.canAskAgain) {
    permissao = await Notifications.requestPermissionsAsync();
  }
  if (!permitida(permissao)) {
    throw new PermissaoLembreteError('Permita as notificações nas configurações do aparelho para receber os lembretes.');
  }
  if (Platform.OS === 'android') {
    let alarme = await Notifications.getExactAlarmPermissionsAsync();
    if (!alarme.granted && alarme.canAskAgain) {
      alarme = await Notifications.requestExactAlarmPermissionsAsync();
    }
    if (!alarme.granted) {
      throw new PermissaoLembreteError('Permita alarmes e lembretes nas configurações do aparelho. A versão Android instalada também precisa incluir essa permissão. Depois, toque em Alertas novamente.');
    }
  }
}

function pertenceAoPet(item: Notifications.NotificationRequest, petId: number) {
  // Inclui os identificadores antigos para removê-los ao atualizar os alertas.
  return Number(item.content.data?.petId) === petId &&
    (item.content.data?.tipo === 'consulta' || item.identifier.startsWith(`consulta-${petId}-`));
}

export async function cancelarLembretesPet(petId: number): Promise<void> {
  const [agendadas, exibidas] = await Promise.all([
    Notifications.getAllScheduledNotificationsAsync(),
    Notifications.getPresentedNotificationsAsync(),
  ]);
  await Promise.all([
    ...agendadas.filter(item => pertenceAoPet(item, petId)).map(item =>
      Notifications.cancelScheduledNotificationAsync(item.identifier)),
    ...exibidas.filter(item => pertenceAoPet(item.request, petId)).map(item =>
      Notifications.dismissNotificationAsync(item.request.identifier)),
  ]);
}

type ConfiguracaoLembretes = {
  tutorId: number;
  petId: number;
  nomePet: string;
  agendamentos: Agendamento[];
  sessaoContinuaValida: () => boolean;
};

// Serializa ativações para não criar duplicatas se duas telas solicitarem ao mesmo tempo.
let fila: Promise<unknown> = Promise.resolve();

export function atualizarLembretesPet(config: ConfiguracaoLembretes) {
  const resultado = fila.then(async () => {
    const verificarSessao = () => {
      if (!config.sessaoContinuaValida()) throw new Error('A sessão mudou. Entre novamente na conta.');
    };
    verificarSessao();
    await cancelarLembretesPet(config.petId);
    verificarSessao();
    let quantidade = 0;
    let falhas = 0;
    const ids = new Set<number>();
    for (const consulta of config.agendamentos) {
      verificarSessao();
      const data = calcularHorarioLembrete(consulta.dataHora);
      if (!data || ids.has(consulta.id)) continue;
      ids.add(consulta.id);
      const destino: DestinoConsulta = {
        tipo: 'consulta', tutorId: config.tutorId,
        petId: config.petId, agendamentoId: consulta.id,
      };
      let id: string;
      try {
        id = await Notifications.scheduleNotificationAsync({
          identifier: `consulta-${config.petId}-${consulta.id}`,
          content: {
            title: 'Lembrete de consulta',
            body: `${config.nomePet} tem consulta em ${new Date(consulta.dataHora).toLocaleString('pt-BR')}. Toque para ver os detalhes.`,
            sound: 'default',
            data: destino,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: data,
            channelId: 'consultas',
          },
        });
      } catch {
        falhas += 1;
        continue;
      }
      if (!config.sessaoContinuaValida()) {
        await Notifications.cancelScheduledNotificationAsync(id);
        verificarSessao();
      }
      quantidade += 1;
    }
    return { quantidade, falhas };
  });
  fila = resultado.catch(() => undefined);
  return resultado;
}
