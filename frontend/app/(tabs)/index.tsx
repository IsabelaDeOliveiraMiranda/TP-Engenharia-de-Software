import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
const API_URL = 'http://localhost:3000';

export default function HomeScreen() {
  const [nome, setNome] = useState('');
  const [dose, setDose] = useState('');

  const salvarMedicamento = async () => {
    if (!nome.trim() || !dose.trim()) {
        Alert.alert('Atenção', 'Por favor, preencha o nome e a dose do medicamento.');
        return;
    }
    try {
      const response = await fetch(`${API_URL}/medicamentos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nome,
          dose: dose,
        }),
      });

      if (response.ok) {
        Alert.alert('Sucesso!', 'Medicamento salvo.');
        setNome('');
        setDose('');
      } else {
        const errorData = await response.text();
        Alert.alert('Erro!', `Não foi possível salvar. Detalhes: ${errorData}`);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro de conexão!', 'Não foi possível conectar ao servidor. Verifique o IP e se o backend está rodando.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Medicamento</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nome do medicamento"
        value={nome}
        onChangeText={setNome}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Dose (ex: 50mg)"
        value={dose}
        onChangeText={setDose}
      />

      <Button title="Salvar Medicamento" onPress={salvarMedicamento} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
});