import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { Text, View } from 'react-native'; 
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'http://localhost:3000';

export default function ModalScreen() {
  const router = useRouter(); 
  const params = useLocalSearchParams(); 
  const { id } = params;

  const [nome, setNome] = useState('');
  const [dose, setDose] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (id) {
      const buscarMedicamento = async () => {
        try {
          const response = await fetch(`${API_URL}/medicamentos/${id}`);
          if (!response.ok) throw new Error('Medicamento não encontrado');
          const data = await response.json();
          setNome(data.nome);
          setDose(data.dose);
        } catch (error) {
          Alert.alert("Erro", "Não foi possível carregar os dados.");
        } finally {
          setCarregando(false);
        }
      };
      buscarMedicamento();
    }
  }, [id]);

  const salvarEdicao = async () => {
    if (!nome.trim() || !dose.trim()) {
      Alert.alert('Atenção', 'Nome e Dose são obrigatórios.');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/medicamentos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nome, dose: dose }),
      });
      if (response.ok) {
        Alert.alert('Sucesso!', 'Medicamento atualizado.');
        router.back(); 
      } else {
        Alert.alert('Erro!', 'Não foi possível salvar.');
      }
    } catch (error) {
      Alert.alert('Erro de conexão!', 'Não foi possível conectar.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Editar Medicamento</Text>

      {carregando ? (
        <Text>Carregando...</Text>
      ) : (
        <>
          <Text style={styles.label}>Nome do medicamento</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
          />
          
          <Text style={styles.label}>Dose (ex: 50mg)</Text>
          <TextInput
            style={styles.input}
            value={dose}
            onChangeText={setDose}
          />

          <Button title="Salvar Alterações" onPress={salvarEdicao} />
        </>
      )}

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: 5,
    marginBottom: 5,
    fontSize: 14,
    color: '#555',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});