import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function Map() {
  // Alustetaan sijainti ja merkkipisteet
  const [location, setLocation] = useState({
    latitude: 65.0800,
    longitude: 25.4800,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [markers, setMarkers] = useState([]); // Uusi state merkkipisteille

  // Funktio käyttäjän sijainnin hakemiseen
  const getUserPosition = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    try {
      if (status !== 'granted') {
        console.log('Geolocation failed');
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Käynnistetään sijainnin haku komponentin latautuessa
  useEffect(() => {
    (async () => {
      await getUserPosition();
    })();
  }, []);

  // Funktio, joka käsittelee karttaan painamista
  const showMarker = (event) => {
    const coordinate = event.nativeEvent.coordinate; // Haetaan koordinaatit
    setMarkers([...markers, coordinate]); // Asetetaan merkkipisteen sijainti
  };

  return (
    <MapView
      style={styles.map}
      region={location}
      showsUserLocation={true}
      onLongPress={showMarker} // Kutsutaan showMarker-funktiota pitkällä painalluksella
    >
      {/* Ehdollinen renderöinti merkkipisteille */}
      {markers.map((marker, index) => (
        <Marker
          key={index} // Asetetaan avaimet merkkipisteille
          coordinate={marker} // Käytetään markerin koordinaatteja
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    height: '100%',
    width: '100%',
  },
});