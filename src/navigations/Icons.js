import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons, Feather, AntDesign, Entypo} from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function MyTabBar({ state, descriptors, navigation }) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: 'center', }}
          >
            {/* <Text style={{ color: isFocused ? '#673ab7' : '#222' }}>
              {label}
            </Text> */}
            {
                label === 'Home' && 
                <Ionicons name="ios-home" size={24} color={ isFocused == true ? 'rgba(45, 187, 84, 1)' : 'rgba(89, 92, 91, 1)' } />
            }
            {
                label === 'Vendor' && 
                <Feather name="users" size={24} color={ isFocused == true ? 'rgba(45, 187, 84, 1)' : 'rgba(89, 92, 91, 1)' } />
            }
            {
                label === 'History' &&  
                <AntDesign name="calendar" size={24} color={ isFocused == true ? 'rgba(45, 187, 84, 1)' : 'rgba(89, 92, 91, 1)' } />
            }
            {
                label === 'More' &&  
                <Entypo name="dots-three-horizontal" size={24} color={ isFocused == true ? 'rgba(45, 187, 84, 1)' : 'rgba(89, 92, 91, 1)' } />
            }
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
    container:{
      width,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      elevation: 5,
      borderRadius: 1,
      backgroundColor: '#fff'
    },
})