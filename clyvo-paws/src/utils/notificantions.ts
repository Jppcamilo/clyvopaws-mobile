import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  } as Notifications.NotificationBehavior),
});

export async function solicitarPermissaoNotificacao() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    alert('Você precisa permitir notificações para receber os lembretes das consultas!');
    return false;
  }
  return true;
}

export async function agendarLembreteConsulta(nomePet: string, dataHoraConsulta: Date) {
  const permissao = await solicitarPermissaoNotificacao();
  if (!permissao) return;

  const dataLembrete = new Date(dataHoraConsulta.getTime() - 2 * 60 * 60 * 1000);

  const triggerDate = dataLembrete > new Date() ? dataLembrete : new Date(Date.now() + 60 * 1000);

await Notifications.scheduleNotificationAsync({
    content: {
      title: "🐾 Lembrete de Consulta!",
      body: `A consulta do ${nomePet} está chegando! Não se esqueça.`,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
  });
  console.log(`Notificação agendada para ${triggerDate.toLocaleString()}`);
}