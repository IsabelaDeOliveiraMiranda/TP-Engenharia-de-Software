import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TextInput, Button, 
  Alert, FlatList, ActivityIndicator, TouchableOpacity 
} from 'react-native';
import { Link, useFocusEffect } from 'expo-router'; 
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'http://localhost:3000';

type Medicamento = {
  id: number;
  nome: string;
  dose: string;
};

export default function HomeScreen() {
  const [nome, setNome] = useState('');
  const [dose, setDose] = useState('');
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [carregando, setCarregando] = useState(true);

  const buscarMedicamentos = async () => {
    try {
      setCarregando(true); 
      const response = await fetch(`${API_URL}/medicamentos`);
      if (!response.ok) throw new Error('Falha ao buscar dados.');
      const data = await response.json();
      setMedicamentos(data); 
    } catch (error) { console.error(error); Alert.alert('Erro', 'Não foi possível buscar a lista.'); } 
    finally { setCarregando(false); }
  };

  useFocusEffect(
    React.useCallback(() => {
      buscarMedicamentos();
    }, [])
  );

  const salvarMedicamento = async () => {
    if (!nome.trim() || !dose.trim()) {
        Alert.alert('Atenção', 'Preencha nome e dose.');
        return;
    }
    try {
      const response = await fetch(`${API_URL}/medicamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nome, dose: dose }),
      });
      if (response.ok) {
        Alert.alert('Sucesso!', 'Medicamento salvo.');
        setNome('');
        setDose('');
        buscarMedicamentos(); 
      } else { Alert.alert('Erro!', 'Não foi possível salvar.'); }
    } catch (error) { Alert.alert('Erro de conexão!', 'Não foi possível conectar.'); }
  };

  const excluirMedicamento = (id: number) => {
    Alert.alert("Confirmar Exclusão", "Tem certeza?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/medicamentos/${id}`, { method: 'DELETE' });
              if (response.ok) {
                Alert.alert('Sucesso!', 'Medicamento excluído.');
                buscarMedicamentos(); 
              } else { Alert.alert('Erro!', 'Não foi possível excluir.'); }
            } catch (error) { Alert.alert('Erro de conexão!', 'Não foi possível conectar.'); }
          }
        }
      ]
    );
  };

  const registrarDose = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/registros_doses/${id}`, { method: 'POST' });
      if (response.ok) {
        Alert.alert('Sucesso!', 'Dose registrada no seu histórico.');
      } else { Alert.alert('Erro!', 'Não foi possível registrar a dose.'); }
    } catch (error) { Alert.alert('Erro de conexão!', 'Não foi possível conectar.'); }
  };

  const renderItem = ({ item }: { item: Medicamento }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemNome}>{item.nome}</Text>
        <Text style={styles.itemDose}>{item.dose}</Text>
      </View>
      <View style={styles.itemBotoes}>
        <TouchableOpacity onPress={() => registrarDose(item.id)} style={styles.botaoTomar}>
          <Text style={styles.botaoTextoTomar}>Tomar</Text>
        </TouchableOpacity>
        <Link href={{ pathname: "/modal", params: { id: item.id } }} asChild>
          <TouchableOpacity style={styles.botaoEditar}>
            <Text style={styles.botaoTexto}>Editar</Text>
          </TouchableOpacity>
        </Link>
        <TouchableOpacity onPress={() => excluirMedicamento(item.id)} style={styles.botaoExcluir}>
          <Text style={styles.botaoTexto}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Cadastrar Medicamento</Text>
      
      <TextInput style={styles.input} placeholder="Nome do medicamento" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Dose (ex: 50mg)" value={dose} onChangeText={setDose} />
      <Button title="Salvar Medicamento" onPress={salvarMedicamento} />

      <View style={styles.divider} />
      <Text style={styles.title}>Meus Medicamentos</Text>

      {carregando ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={medicamentos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          ListEmptyComponent={() => (
            <Text style={styles.itemDose}>Nenhum medicamento cadastrado.</Text>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', paddingHorizontal: 20, },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, alignSelf: 'flex-start', marginTop: 10 },
  input: { width: '100%', height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginBottom: 15, },
  divider: { height: 1, backgroundColor: '#cccccc', width: '100%', marginVertical: 20, },
  list: { width: '100%', },
  itemContainer: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 8, marginBottom: 10, },
  itemInfo: { marginBottom: 10, },
  itemNome: { fontSize: 18, fontWeight: '500', },
  itemDose: { fontSize: 14, color: '#555', },
  itemBotoes: { flexDirection: 'row', justifyContent: 'flex-start', },
  botaoTomar: { backgroundColor: '#007AFF', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5, marginRight: 10, },
  botaoTextoTomar: { color: 'white', fontWeight: 'bold', fontSize: 12, },
  botaoEditar: { backgroundColor: '#E0E0E0', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5, marginRight: 10, },
  botaoExcluir: { backgroundColor: '#FFEDED', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5, },
  botaoTexto: { color: 'black', fontWeight: 'bold', fontSize: 12, },
});