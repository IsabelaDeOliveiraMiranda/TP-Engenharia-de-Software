import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'http://localhost:3000'; 

type RegistroHistorico = {
  id: number;
  nome: string;
  dose: string;
  data_hora_tomada: string;
};

export default function TelaHistorico() {
  const [historico, setHistorico] = useState<RegistroHistorico[]>([]);
  const [carregando, setCarregando] = useState(true);

  const buscarHistorico = async () => {
    try {
      setCarregando(true);
      const response = await fetch(`${API_URL}/historico`);
      if (!response.ok) throw new Error('Falha ao buscar histórico.');
      const data = await response.json();
      setHistorico(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível buscar o histórico de doses.');
    } finally {
      setCarregando(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      buscarHistorico();
    }, [])
  );

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const renderItem = ({ item }: { item: RegistroHistorico }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemNome}>{item.nome} ({item.dose})</Text>
      <Text style={styles.itemData}>{formatarData(item.data_hora_tomada)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Histórico de Doses</Text>
      {carregando ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={historico}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          ListEmptyComponent={() => (
            <Text style={styles.itemData}>Nenhum registro de dose encontrado.</Text>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
  },
  list: {
    width: '100%',
  },
  itemContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  itemNome: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  itemData: {
    fontSize: 14,
    color: '#555',
  },
});