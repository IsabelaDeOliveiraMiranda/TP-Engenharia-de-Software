import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TextInput, Button, 
  Alert, FlatList, ActivityIndicator, TouchableOpacity, Platform 
} from 'react-native';
import { Link, useFocusEffect } from 'expo-router'; 
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

type Medicamento = { id: number; nome: string; dose: string; horario: string; };

export default function HomeScreen() {
  const [nome, setNome] = useState('');
  const [dose, setDose] = useState('');
  
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [horarioDisplay, setHorarioDisplay] = useState(''); 

  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [carregando, setCarregando] = useState(true);

  const buscarMedicamentos = async () => {
    try {
      setCarregando(true); 
      const response = await fetch(`${API_URL}/medicamentos`);
      const data = await response.json();
      setMedicamentos(data); 
    } catch (error) { 
      console.log(error); 
    } finally { 
      setCarregando(false); 
    }
  };

  useEffect(() => {
    async function requestPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Ative as notificações para o lembrete funcionar!');
      }
    }
    requestPermissions();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      buscarMedicamentos();
    }, [])
  );

  const onChangeTime = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      const hora = selectedDate.getHours().toString().padStart(2, '0');
      const min = selectedDate.getMinutes().toString().padStart(2, '0');
      setHorarioDisplay(`${hora}:${min}`);
    }
  };

  const salvarMedicamento = async () => {
    if (!nome.trim() || !dose.trim() || !horarioDisplay) {
        Alert.alert('Atenção', 'Preencha nome, dose e escolha o horário.');
        return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Hora do Remédio! 💊",
          body: `Tomar: ${nome} (${dose})`,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour: date.getHours(),
          minute: date.getMinutes(),
          repeats: true,
        },
      });

      const response = await fetch(`${API_URL}/medicamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, dose, horario: horarioDisplay }),
      });

      if (response.ok) {
        Alert.alert('Sucesso!', `Lembrete agendado para ${horarioDisplay}`);
        setNome(''); 
        setDose(''); 
        setHorarioDisplay('');
        buscarMedicamentos(); 
      } else { 
        Alert.alert('Erro!', 'Falha ao salvar no banco.'); 
      }
    } catch (error) { 
        console.log(error);
        Alert.alert('Erro!', 'Verifique a conexão com o servidor.'); 
    }
  };

  const excluirMedicamento = (id: number) => {
    Alert.alert("Excluir", "Tem certeza?", [
        { text: "Cancelar" },
        { text: "Excluir", style: "destructive", onPress: async () => {
            await fetch(`${API_URL}/medicamentos/${id}`, { method: 'DELETE' });
            buscarMedicamentos();
        }}
    ]);
  };

  const registrarDose = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/registros_doses/${id}`, { method: 'POST' });
      if (res.ok) Alert.alert('Registrado!', 'Dose salva no histórico.');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível registrar a dose.');
    }
  };

  const renderItem = ({ item }: { item: Medicamento }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemNome}>{item.nome}</Text>
        <Text style={styles.itemDose}>{item.dose}</Text>
        <Text style={{color: '#007AFF', fontWeight: 'bold', marginTop: 4}}>
          ⏰ {item.horario || 'Sem horário'}
        </Text>
      </View>
      <View style={styles.itemBotoes}>
        <TouchableOpacity onPress={() => registrarDose(item.id)} style={styles.botaoTomar}>
          <Text style={styles.botaoTextoTomar}>Tomar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => excluirMedicamento(item.id)} style={styles.botaoExcluir}>
          <Text style={styles.botaoTexto}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={medicamentos}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Novo Medicamento</Text>
            
            <TextInput 
              style={styles.input} 
              placeholder="Nome do remédio" 
              value={nome} 
              onChangeText={setNome} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Dose (ex: 500mg)" 
              value={dose} 
              onChangeText={setDose} 
            />

            <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.timeBtn}>
              <Text style={styles.timeText}>
                {horarioDisplay ? `Horário Definido: ${horarioDisplay}` : '🕒 Toque para definir horário'}
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

            <Button title="Salvar e Agendar Lembrete" onPress={salvarMedicamento} />

            <View style={styles.divider} />
            <Text style={styles.title}>Meus Medicamentos</Text>
          </>
        }
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{textAlign: 'center', marginTop: 20, color: '#777'}}>
            Nenhum medicamento cadastrado.
          </Text>
        }
        style={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginVertical: 15, color: '#333' },
  input: { width: '100%', height: 50, borderColor: '#ddd', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, marginBottom: 12, fontSize: 16 },
  divider: { height: 1, backgroundColor: '#eee', width: '100%', marginVertical: 20 },
  list: { width: '100%' },
  itemContainer: { backgroundColor: '#f8f9fa', padding: 15, borderRadius: 12, marginBottom: 12, elevation: 2, borderWidth: 1, borderColor: '#f0f0f0' },
  itemInfo: { marginBottom: 12 },
  itemNome: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  itemDose: { fontSize: 14, color: '#666' },
  itemBotoes: { flexDirection: 'row' },
  botaoTomar: { backgroundColor: '#34C759', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, marginRight: 10 },
  botaoTextoTomar: { color: 'white', fontWeight: 'bold' },
  botaoExcluir: { backgroundColor: '#FF3B30', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  botaoTexto: { color: 'white', fontWeight: 'bold' },
  timeBtn: { width: '100%', padding: 15, backgroundColor: '#eef2ff', borderRadius: 8, marginBottom: 15, alignItems: 'center', borderWidth: 1, borderColor: '#dae0ff' },
  timeText: { color: '#4c6ef5', fontWeight: 'bold', fontSize: 16 }
});