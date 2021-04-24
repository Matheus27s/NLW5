import React, { useEffect, useState } from 'react';
import { SvgFromUri } from 'react-native-svg';
import { useRoute } from '@react-navigation/core';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import { loadPlant, PlantProps } from '../libs/Storage';

import { Header } from '../components/Header';

import {
    StyleSheet,
    View,
    Alert,
    Text,
    Image,
    ScrollView,
    Platform,
    TouchableOpacity,
    FlatList
} from 'react-native';
import colors from '../styles/colors';

import waterdrop from '../assets/waterdrop.png';
import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale';
import fonts from '../styles/fonts';
import { PlantCardSecundary } from '../components/PlantCardSecundary';


export function MyPlants() {
    const [loading, setLoading] = useState(true);
    const [nextWatered, setNextWatered] = useState<string>();
    const [myPlants, setMyPlants] = useState<PlantProps[]>([]);

    useEffect(() => {
        async function laodStorageData() {
            const plantsStoraged = await loadPlant();
            const nextTime = formatDistance(
                new Date(plantsStoraged[0].dateTimeNotification).getTime(),
                new Date(),
                { locale: pt }
            );
            setNextWatered(
                `Não esqueça de regar a ${plantsStoraged[0].name} à ${nextTime} horas.`
            );
            setMyPlants(plantsStoraged);
            setLoading(false);
        }
        laodStorageData();
    }, []);

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.spotlight}>
                <Image
                    source={waterdrop}
                    style={styles.spotlightImage}
                />
                <Text style={styles.spotlightText}>
                    {nextWatered}
                </Text>
            </View>

            <View style={styles.plants}>
                <Text style={styles.plantsTitle}>
                    Próximas regadas
                    </Text>

                <FlatList
                    data={myPlants}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <PlantCardSecundary data={item} />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flex: 1 }}
                />
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingTop: 50,
        backgroundColor: colors.background,
    },
    spotlight: {
        backgroundColor: colors.blue_light,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 110,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    spotlightImage: {
        height: 60,
        width: 60,
    },
    spotlightText: {
        flex: 1,
        color: colors.blue,
        paddingHorizontal: 20,
    },
    plants: {
        flex: 1,
        width: '100%',
    },
    plantsTitle: {
        fontSize: 24,
        fontFamily: fonts.heading,
        color: colors.heading,
        marginVertical: 20,
    }
});