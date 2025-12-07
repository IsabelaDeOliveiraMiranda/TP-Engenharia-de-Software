import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, TextInput, Button, Alert, TouchableOpacity, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';

const API_URL = 'http://localhost:3000';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function ModalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;

  const [nome, setNome] = useState('');
  const [dose, setDose] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [horarioDisplay, setHorarioDisplay] = useState('');

  useEffect(() => {

    if (id) {
      setLoading(true);
      fetch(`${API_URL}/medicamentos/${id}`)
        .then(res => res.json())
        .then(data => {
          setNome(data.nome);
          setDose(data.dose);
          if (data.horario) setHorarioDisplay(data.horario);
        })
        .catch(() => Alert.alert("Erro", "Falha ao carregar dados."))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSalvarTudo = async () => {
    if (!nome.trim() || !dose.trim()) {
      Alert.alert('Erro', 'Nome e Dose são obrigatórios.');
      return;
    }

  
    const horarioFinal = horarioDisplay || `${date.getHours()}:${date.getMinutes()}`;

    try {

      if (horarioDisplay) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Lembrete de Medicamento 💊",
            body: `Hora de tomar: ${nome} (${dose})`,
            sound: true,
          },
          trigger: {
             type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
             hour: date.getHours(),
             minute: date.getMinutes(),
             repeats: true,
          },
        });
      }


      const method = id ? 'PUT' : 'POST';
      const url = id ? `${API_URL}/medicamentos/${id}` : `${API_URL}/medicamentos`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, dose, horario: horarioFinal }),
      });

      if (response.ok) {
        Alert.alert('Sucesso', `Medicamento salvo!`);
        router.back();
      } else {
        throw new Error('Erro na API');
      }

    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Falha ao salvar dados.');
    }
  };

  const onChangeTime = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      const h = selectedDate.getHours().toString().padStart(2, '0');
      const m = selectedDate.getMinutes().toString().padStart(2, '0');
      setHorarioDisplay(`${h}:${m}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{id ? 'Editar Medicamento' : 'Novo Medicamento'}</Text>

      {loading ? <Text>Carregando...</Text> : (
        <>
          <Text style={styles.label}>Nome do Remédio</Text>
          <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: Dipirona" />
          
          <Text style={styles.label}>Dosagem</Text>
          <TextInput style={styles.input} value={dose} onChangeText={setDose} placeholder="Ex: 500mg" />

          <Text style={styles.label}>Horário do Lembrete</Text>
          <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.timeBtn}>
            <Text style={styles.timeText}>
              {horarioDisplay ? `⏰ ${horarioDisplay}` : 'Toque para definir horário'}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={date}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onChangeTime}
            />
          )}

          <View style={styles.btnGroup}>
            <Button title="Salvar" onPress={handleSalvarTudo} />
          </View>
          
          <View style={{marginTop: 20}}>
             <Button title="Cancelar" color="red" onPress={() => router.back()} />
          </View>
        </>
      )}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 5, color: '#333', fontWeight: '600' },
  input: { height: 50, borderColor: '#ddd', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, marginBottom: 20, fontSize: 16 },
  btnGroup: { marginTop: 10 },
  timeBtn: { height: 50, backgroundColor: '#f0f0f0', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#ddd' },
  timeText: { fontSize: 18, fontWeight: 'bold', color: '#007AFF' }
});