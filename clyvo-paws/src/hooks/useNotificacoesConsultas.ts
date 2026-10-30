import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useNavigationContainerRef } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { lerDestinoConsulta } from '../services/notificacaoService';
import { sessaoService } from '../services/sessaoService';

type Rotas = {
  PetDetails: { petId: number; agendamentoId: number; origemNotificacao: boolean };
};

function chave(resposta: Notifications.NotificationResponse) {
  return `${resposta.notification.request.identifier}:${resposta.notification.date}:${resposta.actionIdentifier}`;
}

export function useNotificacoesConsulta(token: string | null, tutorId?: number) {
  const navigationRef = useNavigationContainerRef<Rotas>();
  const [pendente, setPendente] = useState<Notifications.NotificationResponse | null>(null);
  const processadas = useRef(new Set<string>());

  useEffect(() => {
    if (Platform.OS === 'web') return;
    const receber = (resposta: Notifications.NotificationResponse) => {
      if (resposta.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER &&
          lerDestinoConsulta(resposta.notification.request.content.data) &&
          !processadas.current.has(chave(resposta))) {
        setPendente(resposta);
      }
    };
    const assinatura = Notifications.addNotificationResponseReceivedListener(receber);
    const ultima = Notifications.getLastNotificationResponse();
    if (ultima) receber(ultima);
    return () => assinatura.remove();
  }, []);

  const processarPendente = useCallback(() => {
    if (!pendente || !token || !tutorId || !navigationRef.isReady()) return;
    const estado = sessaoService.obterEstado();
    if (estado.token !== token || estado.tutor?.id !== tutorId ||
        !navigationRef.getRootState()?.routeNames.includes('PetDetails')) return;
    const id = chave(pendente);
    if (processadas.current.has(id)) return;
    const destino = lerDestinoConsulta(pendente.notification.request.content.data);
    if (!destino) return;
    processadas.current.add(id);
    setPendente(null);
    const ultima = Notifications.getLastNotificationResponse();
    if (ultima && chave(ultima) === id) Notifications.clearLastNotificationResponse();

    if (destino.tutorId !== tutorId) {
      Alert.alert('Aviso de outra conta', 'Este lembrete pertence a outra conta. Confira as consultas da conta em que você está conectado.');
      return;
    }
    navigationRef.navigate('PetDetails', {
      petId: destino.petId,
      agendamentoId: destino.agendamentoId,
      origemNotificacao: true,
    });
  }, [pendente, token, tutorId, navigationRef]);

  useEffect(() => { processarPendente(); }, [processarPendente]);
  return { navigationRef, processarPendente };
}
