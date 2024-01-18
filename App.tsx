import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Sound from 'react-native-sound';

const App = () => {
  const [targetTemperature, setTargetTemperature] = useState(0);
  const [targetTime, setTargetTime] = useState('');
  const [count, setCount] = useState(0);
  const [isCounting, setIsCounting] = useState(false);

  // Define el sonido de la alarma
  const alarmSound = new Sound('alarm.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('Error al cargar el sonido', error);
    }
  });

  useEffect(() => {
    let interval: NodeJS.Timeout | number = 0;

    if (isCounting) {
      interval = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isCounting]);

  useEffect(() => {
    if (isCounting && count <= 0) {
      setIsCounting(false);
      // Reproduce el sonido de la alarma cuando se alcanza la temperatura deseada
      alarmSound.play((success) => {
        if (!success) {
          console.log('Error al reproducir el sonido');
        }
        Alert.alert('Se alcanzó la temperatura deseada.');
      });
    }
  }, [isCounting, count, targetTemperature, targetTime]);
  
  const handleStart = () => {
    const numericTargetTime = parseInt(targetTime, 10);

    if (targetTemperature > 0 && numericTargetTime > 0) {
      setCount(numericTargetTime);
      setIsCounting(true);
    }
  };

  const handleStop = () => {
    setIsCounting(false);
    setCount(0);
  };

  const increaseTemperature = () => {
    setTargetTemperature((prevTemperature) => prevTemperature + 1);
  };

  const decreaseTemperature = () => {
    setTargetTemperature((prevTemperature) => Math.max(prevTemperature - 1, 0));
  };

  const getTemperatureColor = () => {
    if (targetTemperature > 49) {
      return 'red';
    } else if (targetTemperature > 19) {
      return 'orange';
    } else {
      return 'lightblue';
    }
  };
  return (
    <>
    <View style={styles.container}>
      <View style={[styles.temperatureContainer, { backgroundColor: getTemperatureColor() }]}>
        <Text style={styles.temperatureText}>{targetTemperature}°C</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={increaseTemperature}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={decreaseTemperature}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
      </View>
      <Text>Ingrese el tiempo deseado (en segundos):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Tiempo"
        value={targetTime}
        onChangeText={(text) => setTargetTime(text)}
      />
      <View style={styles.buttonCont}>
        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <Text style={styles.buttonAction}>Iniciar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
          <Text style={styles.buttonAction}>Detener</Text>
        </TouchableOpacity>
      </View>
      <Text>Tiempo restante: {count} segundos</Text>
    </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'azure',
  },
  input: {
    borderColor: 'lightblue',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    marginTop: 10,
    height: 40,
    width: 80,
    borderRadius: 14,
  },
  temperatureContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    height: 250,
    borderRadius: 130,
    marginBottom: 12,
  },
  temperatureText: {
    fontSize: 60,
    color: 'white', // Cambia el color del texto para que sea visible
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    height: 60,
  },
  buttonCont:{
    flexDirection: 'row',
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 40,
    width: 60,
  },
  buttonText: {
    fontSize: 20,
    paddingLeft: 15,
    marginTop: 7,
    color: 'white',
  },
  buttonAction: {
    alignContent: 'center',
    fontSize: 20,
    color: 'white',
  },
  startButton: {
    backgroundColor: 'lightgreen',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  stopButton: {
    backgroundColor: 'lightblue',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
  },
});
export default App;
