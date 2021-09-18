import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from "react";
import { StyleSheet, Text, View, Dimensions, Pressable, TextInput, Switch, ScrollView } from 'react-native';
import Svg, { Circle, Rect, G, ClipPath, Defs, Path  } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
 
export default function CardScreen() {
const [isEnabled, setIsEnabled] = useState(false);
const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCon}>
            <View style={styles.leftHeader}>
                <View style={styles.imageCon}>
                    <Text style={styles.topButtonText}>L</Text>
                </View>
            </View>
            <View style={styles.middleHeader}>
                <Ionicons name="search" size={20} color="rgba(154, 154, 154, 1)" />
                <TextInput 
                    style={styles.searchInput}
                    placeholderTextColor="rgba(154, 154, 154, 1)"
                    placeholder="Search"
                />
            </View>
            <View style={styles.rightHeader}>
                <Pressable style={styles.topButton}>
                    <Text style={styles.topButtonText}>Top Up</Text>
                </Pressable>
            </View>
        </View>
        <View style={{ width: '90%', top: 15, justifyContent: 'center', }}>
            <Text style={{ fontSize: 20, color: '#000', fontFamily: 'Lato-Regular', }}><Ionicons name="arrow-back" size={20} color="black" />  Credit card</Text>
        </View>
      </View>
      <View style={styles.body}>
            <ScrollView style={{ width }}>
                <LinearGradient 
                        colors={['rgba(76, 26, 196, 1)', 'rgba(56, 170, 228, 1)']}
                        style={styles.card}>
                    <View style={{ width: '80%', top: 20, flexDirection: 'row', justifyContent: 'space-around' }}>
                        <View>
                            <Svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <G clip-path="url(#clip0)">
                                    <Path d="M47.3799 23.9888C47.3799 31.7577 41.105 38.1072 33.2614 38.1072C25.4926 38.1072 19.143 31.7577 19.143 23.9888C19.143 16.2199 25.4179 9.87036 33.1867 9.87036C41.105 9.87036 47.3799 16.2199 47.3799 23.9888Z" fill="#FFB600"/>
                                    <Path d="M33.2614 9.87036C41.0303 9.87036 47.3799 16.2199 47.3799 23.9888C47.3799 31.7577 41.105 38.1072 33.2614 38.1072C25.4926 38.1072 19.143 31.7577 19.143 23.9888" fill="#F7981D"/>
                                    <Path d="M33.2614 9.87036C41.0303 9.87036 47.3798 16.2199 47.3798 23.9888C47.3798 31.7577 41.105 38.1072 33.2614 38.1072" fill="#FF8500"/>
                                    <Path d="M14.2875 9.87036C6.59328 9.94506 0.31842 16.2199 0.31842 23.9888C0.31842 31.7577 6.59328 38.1072 14.4369 38.1072C18.0972 38.1072 21.384 36.6879 23.9238 34.4469C24.4468 33.9987 24.895 33.4758 25.3432 32.9529H22.4298C22.0563 32.5047 21.6828 31.9818 21.384 31.5336H26.389C26.6878 31.0854 26.9866 30.5625 27.2107 30.0396H20.5623C20.3382 29.5913 20.1141 29.0684 19.9647 28.5455H27.7336C28.1818 27.1262 28.4806 25.6322 28.4806 24.0635C28.4806 23.0177 28.3312 22.0466 28.1818 21.0755H19.5165C19.5912 20.5526 19.7406 20.1044 19.89 19.5815H27.6589C27.5095 19.0585 27.2854 18.5356 27.0613 18.0874H20.4876C20.7117 17.5645 21.0105 17.1163 21.3093 16.5934H26.3143C26.0155 16.0705 25.642 15.5476 25.1938 15.0994H22.4298C22.878 14.5765 23.3262 14.1283 23.8491 13.6801C21.384 11.3644 18.0225 10.0198 14.3622 10.0198C14.3622 9.87036 14.3622 9.87036 14.2875 9.87036Z" fill="#FF5050"/>
                                    <Path d="M0.31842 23.9888C0.31842 31.7577 6.59328 38.1072 14.4369 38.1072C18.0972 38.1072 21.384 36.6879 23.9238 34.4469C24.4468 33.9987 24.895 33.4758 25.3432 32.9529H22.4298C22.0563 32.5047 21.6828 31.9818 21.384 31.5336H26.389C26.6878 31.0853 26.9866 30.5624 27.2107 30.0395H20.5623C20.3382 29.5913 20.1141 29.0684 19.9647 28.5455H27.7336C28.1818 27.1262 28.4806 25.6322 28.4806 24.0635C28.4806 23.0177 28.3312 22.0466 28.1818 21.0755H19.5165C19.5912 20.5525 19.7406 20.1043 19.89 19.5814H27.6589C27.5095 19.0585 27.2854 18.5356 27.0613 18.0874H20.4876C20.7117 17.5645 21.0105 17.1163 21.3093 16.5934H26.3143C26.0155 16.0705 25.642 15.5476 25.1938 15.0994H22.4298C22.878 14.5765 23.3262 14.1283 23.8491 13.6801C21.384 11.3644 18.0225 10.0197 14.3622 10.0197H14.2875" fill="#E52836"/>
                                    <Path d="M14.4369 38.1072C18.0972 38.1072 21.384 36.6879 23.9239 34.4469C24.4468 33.9987 24.895 33.4758 25.3432 32.9529H22.4299C22.0564 32.5047 21.6828 31.9818 21.384 31.5336H26.389C26.6878 31.0853 26.9866 30.5624 27.2107 30.0395H20.5623C20.3382 29.5913 20.1141 29.0684 19.9647 28.5455H27.7336C28.1818 27.1262 28.4806 25.6322 28.4806 24.0635C28.4806 23.0177 28.3312 22.0466 28.1818 21.0755H19.5165C19.5912 20.5525 19.7406 20.1043 19.89 19.5814H27.6589C27.5095 19.0585 27.2854 18.5356 27.0613 18.0874H20.4876C20.7117 17.5645 21.0105 17.1163 21.3093 16.5934H26.3143C26.0155 16.0705 25.642 15.5476 25.1938 15.0994H22.4299C22.8781 14.5765 23.3263 14.1283 23.8492 13.6801C21.384 11.3644 18.0225 10.0197 14.3622 10.0197H14.2875" fill="#CB2026"/>
                                    <Path d="M19.4416 27.5744L19.6658 26.3045C19.5911 26.3045 19.4416 26.3792 19.2922 26.3792C18.7693 26.3792 18.6946 26.0804 18.7693 25.931L19.2175 23.3165H20.0393L20.2634 21.8971H19.5164L19.6658 21.0007H18.1717C18.1717 21.0007 17.2753 25.931 17.2753 26.5286C17.2753 27.425 17.7982 27.7985 18.4705 27.7985C18.9187 27.7985 19.2922 27.6491 19.4416 27.5744Z" fill="white"/>
                                    <Path d="M19.9646 25.184C19.9646 27.2756 21.3839 27.7985 22.5791 27.7985C23.6996 27.7985 24.1478 27.5744 24.1478 27.5744L24.4466 26.1551C24.4466 26.1551 23.6249 26.5286 22.8779 26.5286C21.2345 26.5286 21.5333 25.3334 21.5333 25.3334H24.596C24.596 25.3334 24.8201 24.3623 24.8201 23.9888C24.8201 23.0177 24.2972 21.8225 22.6538 21.8225C21.0851 21.6731 19.9646 23.3165 19.9646 25.184ZM22.5791 23.0177C23.4008 23.0177 23.2514 23.9888 23.2514 24.0635H21.608C21.608 23.9888 21.7574 23.0177 22.5791 23.0177Z" fill="white"/>
                                    <Path d="M32.0661 27.5744L32.3649 25.931C32.3649 25.931 31.6179 26.3045 31.095 26.3045C30.0492 26.3045 29.601 25.4828 29.601 24.5864C29.601 22.7936 30.4974 21.8225 31.5432 21.8225C32.2902 21.8225 32.8878 22.2707 32.8878 22.2707L33.1119 20.702C33.1119 20.702 32.2155 20.3285 31.3938 20.3285C29.6757 20.3285 27.9576 21.8225 27.9576 24.6611C27.9576 26.5286 28.854 27.7985 30.6468 27.7985C31.2444 27.7985 32.0661 27.5744 32.0661 27.5744Z" fill="white"/>
                                    <Path d="M11.2245 21.673C10.1787 21.673 9.43173 21.9719 9.43173 21.9719L9.20763 23.2418C9.20763 23.2418 9.87994 22.943 10.851 22.943C11.3739 22.943 11.8221 23.0177 11.8221 23.4659C11.8221 23.7647 11.7474 23.8394 11.7474 23.8394C11.7474 23.8394 11.2992 23.8394 11.0751 23.8394C9.80523 23.8394 8.38593 24.3623 8.38593 26.0804C8.38593 27.425 9.28233 27.7238 9.80523 27.7238C10.851 27.7238 11.2992 27.0515 11.3739 27.0515L11.2992 27.6491H12.6439L13.2415 23.5406C13.2415 21.7478 11.7474 21.673 11.2245 21.673ZM11.5233 25.0346C11.5233 25.2587 11.3739 26.4539 10.4775 26.4539C10.0293 26.4539 9.87994 26.0804 9.87994 25.8563C9.87994 25.4828 10.104 24.9599 11.2245 24.9599C11.4486 25.0346 11.5233 25.0346 11.5233 25.0346Z" fill="white"/>
                                    <Path d="M14.6609 27.7238C15.0344 27.7238 16.9019 27.7985 16.9019 25.7816C16.9019 23.914 15.1091 24.2875 15.1091 23.5405C15.1091 23.167 15.4079 23.0176 15.9308 23.0176C16.1549 23.0176 16.9766 23.0923 16.9766 23.0923L17.2007 21.7477C17.2007 21.7477 16.6778 21.5983 15.7814 21.5983C14.6609 21.5983 13.5404 22.0465 13.5404 23.5405C13.5404 25.2587 15.4079 25.1093 15.4079 25.7816C15.4079 26.2298 14.885 26.3045 14.5115 26.3045C13.8392 26.3045 13.1669 26.0804 13.1669 26.0804L12.9427 27.425C13.0174 27.5744 13.391 27.7238 14.6609 27.7238Z" fill="white"/>
                                    <Path d="M44.4665 20.478L44.1677 22.4949C44.1677 22.4949 43.5701 21.7479 42.7484 21.7479C41.4038 21.7479 40.2086 23.3913 40.2086 25.3335C40.2086 26.5288 40.8062 27.7987 42.0761 27.7987C42.9725 27.7987 43.4954 27.2011 43.4954 27.2011L43.4207 27.724H44.9147L46.0352 20.5527L44.4665 20.478ZM43.7942 24.4371C43.7942 25.2588 43.4207 26.3047 42.599 26.3047C42.0761 26.3047 41.7773 25.8564 41.7773 25.1094C41.7773 23.9142 42.3002 23.1672 42.9725 23.1672C43.4954 23.1672 43.7942 23.5407 43.7942 24.4371Z" fill="white"/>
                                    <Path d="M3.08222 27.6493L3.97863 22.2708L4.12803 27.6493H5.17384L7.11606 22.2708L6.29435 27.6493H7.86306L9.05827 20.478H6.59315L5.09914 24.8853L5.02444 20.478H2.85811L1.6629 27.6493H3.08222Z" fill="white"/>
                                    <Path d="M26.2395 27.6489C26.6877 25.1838 26.7624 23.1669 27.8082 23.5404C27.9576 22.5693 28.1817 22.1958 28.3311 21.8223C28.3311 21.8223 28.2564 21.8223 28.0323 21.8223C27.36 21.8223 26.8371 22.7187 26.8371 22.7187L26.9865 21.897H25.5672L24.5961 27.7236H26.2395V27.6489Z" fill="white"/>
                                    <Path d="M35.5024 21.673C34.4566 21.673 33.7096 21.9719 33.7096 21.9719L33.4855 23.2418C33.4855 23.2418 34.1578 22.943 35.1289 22.943C35.6518 22.943 36.1 23.0177 36.1 23.4659C36.1 23.7647 36.0253 23.8394 36.0253 23.8394C36.0253 23.8394 35.5771 23.8394 35.353 23.8394C34.0831 23.8394 32.6638 24.3623 32.6638 26.0804C32.6638 27.425 33.5602 27.7238 34.0831 27.7238C35.1289 27.7238 35.5771 27.0515 35.6518 27.0515L35.5771 27.6491H36.9217L37.5193 23.5406C37.594 21.7478 36.0253 21.673 35.5024 21.673ZM35.8759 25.0346C35.8759 25.2587 35.7265 26.4539 34.8301 26.4539C34.3819 26.4539 34.2325 26.0804 34.2325 25.8563C34.2325 25.4828 34.4566 24.9599 35.5771 24.9599C35.8012 25.0346 35.8012 25.0346 35.8759 25.0346Z" fill="white"/>
                                    <Path d="M38.7891 27.6489C39.2373 25.1838 39.312 23.1669 40.3578 23.5404C40.5072 22.5693 40.7313 22.1958 40.8807 21.8223C40.8807 21.8223 40.806 21.8223 40.5819 21.8223C39.9096 21.8223 39.3867 22.7187 39.3867 22.7187L39.5361 21.897H38.1168L37.1457 27.7236H38.7891V27.6489Z" fill="white"/>
                                    <Path d="M17.1259 26.5286C17.1259 27.425 17.6488 27.7985 18.3211 27.7985C18.844 27.7985 19.2922 27.6491 19.4416 27.5744L19.6657 26.3045C19.591 26.3045 19.4416 26.3792 19.2922 26.3792C18.7693 26.3792 18.6946 26.0804 18.7693 25.931L19.2175 23.3165H20.0392L20.2633 21.8971H19.5163L19.6657 21.0007" fill="#DCE5E5"/>
                                    <Path d="M20.7115 25.184C20.7115 27.2756 21.3839 27.7985 22.5791 27.7985C23.6996 27.7985 24.1478 27.5744 24.1478 27.5744L24.4466 26.1551C24.4466 26.1551 23.6249 26.5286 22.8779 26.5286C21.2345 26.5286 21.5333 25.3334 21.5333 25.3334H24.596C24.596 25.3334 24.8201 24.3623 24.8201 23.9888C24.8201 23.0177 24.2972 21.8225 22.6538 21.8225C21.0851 21.6731 20.7115 23.3165 20.7115 25.184ZM22.5791 23.0177C23.4008 23.0177 23.5502 23.9888 23.5502 24.0635H21.608C21.608 23.9888 21.7574 23.0177 22.5791 23.0177Z" fill="#DCE5E5"/>
                                    <Path d="M32.0661 27.5744L32.3649 25.931C32.3649 25.931 31.6179 26.3045 31.095 26.3045C30.0491 26.3045 29.6009 25.4828 29.6009 24.5864C29.6009 22.7936 30.4973 21.8225 31.5432 21.8225C32.2902 21.8225 32.8878 22.2707 32.8878 22.2707L33.1119 20.702C33.1119 20.702 32.2155 20.3285 31.3938 20.3285C29.6756 20.3285 28.7045 21.8225 28.7045 24.6611C28.7045 26.5286 28.8539 27.7985 30.6467 27.7985C31.2444 27.7985 32.0661 27.5744 32.0661 27.5744Z" fill="#DCE5E5"/>
                                    <Path d="M9.20763 23.3163C9.20763 23.3163 9.87994 23.0175 10.851 23.0175C11.3739 23.0175 11.8221 23.0922 11.8221 23.5404C11.8221 23.8392 11.7474 23.9139 11.7474 23.9139C11.7474 23.9139 11.2992 23.9139 11.0751 23.9139C9.80523 23.9139 8.38593 24.4368 8.38593 26.1549C8.38593 27.4995 9.28233 27.7983 9.80523 27.7983C10.851 27.7983 11.2992 27.126 11.3739 27.126L11.2992 27.7236H12.6439L13.2415 23.6151C13.2415 21.897 11.7474 21.8223 11.1498 21.8223L9.20763 23.3163ZM12.2704 25.0344C12.2704 25.2585 11.3739 26.4537 10.4775 26.4537C10.0293 26.4537 9.87994 26.0802 9.87994 25.8561C9.87994 25.4826 10.104 24.9597 11.2245 24.9597C11.4486 25.0344 12.2704 25.0344 12.2704 25.0344Z" fill="#DCE5E5"/>
                                    <Path d="M13.0175 27.5744C13.0175 27.5744 13.4657 27.7238 14.7356 27.7238C15.1091 27.7238 16.9766 27.7985 16.9766 25.7816C16.9766 23.914 15.1838 24.2875 15.1838 23.5405C15.1838 23.167 15.4826 23.0176 16.0055 23.0176C16.2296 23.0176 17.0513 23.0923 17.0513 23.0923L17.2754 21.7477C17.2754 21.7477 16.7525 21.5983 15.8561 21.5983C14.7356 21.5983 14.3621 22.0465 14.3621 23.5405C14.3621 25.2587 15.4826 25.1093 15.4826 25.7816C15.4826 26.2298 14.9597 26.3045 14.5862 26.3045" fill="#DCE5E5"/>
                                    <Path d="M44.1676 22.4949C44.1676 22.4949 43.57 21.7479 42.7482 21.7479C41.4036 21.7479 40.9554 23.3913 40.9554 25.3335C40.9554 26.5287 40.806 27.7986 42.0759 27.7986C42.9724 27.7986 43.4953 27.201 43.4953 27.201L43.4206 27.7239H44.9146L46.0351 20.5527L44.1676 22.4949ZM44.0929 24.4371C44.0929 25.2588 43.4206 26.3046 42.5988 26.3046C42.0759 26.3046 41.7771 25.8564 41.7771 25.1094C41.7771 23.9142 42.3 23.1672 42.9724 23.1672C43.4953 23.1672 44.0929 23.5407 44.0929 24.4371Z" fill="#DCE5E5"/>
                                    <Path d="M3.08222 27.6493L3.97863 22.2708L4.12803 27.6493H5.17384L7.11606 22.2708L6.29435 27.6493H7.86306L9.05827 20.478H7.19076L5.09914 24.8853L5.02444 20.478H4.20273L1.6629 27.6493H3.08222Z" fill="#DCE5E5"/>
                                    <Path d="M24.6708 27.6489H26.2395C26.6877 25.1838 26.7624 23.1669 27.8082 23.5404C27.9576 22.5693 28.1817 22.1958 28.3311 21.8223C28.3311 21.8223 28.2564 21.8223 28.0323 21.8223C27.36 21.8223 26.8371 22.7187 26.8371 22.7187L26.9865 21.897" fill="#DCE5E5"/>
                                    <Path d="M33.4855 23.3163C33.4855 23.3163 34.1578 23.0175 35.1289 23.0175C35.6518 23.0175 36.1 23.0922 36.1 23.5404C36.1 23.8392 36.0253 23.9139 36.0253 23.9139C36.0253 23.9139 35.5771 23.9139 35.353 23.9139C34.0831 23.9139 32.6638 24.4368 32.6638 26.1549C32.6638 27.4995 33.5602 27.7983 34.0831 27.7983C35.1289 27.7983 35.5771 27.126 35.6518 27.126L35.5771 27.7236H36.9217L37.5193 23.6151C37.5193 21.897 36.0253 21.8223 35.4277 21.8223L33.4855 23.3163ZM36.5482 25.0344C36.5482 25.2585 35.6518 26.4537 34.7554 26.4537C34.3072 26.4537 34.1578 26.0802 34.1578 25.8561C34.1578 25.4826 34.3819 24.9597 35.5024 24.9597C35.8012 25.0344 36.5482 25.0344 36.5482 25.0344Z" fill="#DCE5E5"/>
                                    <Path d="M37.2205 27.6489H38.7892C39.2374 25.1838 39.3121 23.1669 40.3579 23.5404C40.5074 22.5693 40.7315 22.1958 40.8809 21.8223C40.8809 21.8223 40.8062 21.8223 40.5821 21.8223C39.9097 21.8223 39.3868 22.7187 39.3868 22.7187L39.5362 21.897" fill="#DCE5E5"/>
                                </G>
                                <Defs>
                                    <ClipPath id="clip0">
                                        <Rect width="47.0615" height="47.0615" fill="white" transform="translate(0.31842 0.45813)"/>
                                    </ClipPath>
                                </Defs>
                            </Svg>
                        </View>
                        <View style={{ width: '70%' }}>
                            <Text style={{ fontSize: 23, color: '#fff', fontStyle: 'normal', fontFamily: 'Lato-Regular', }} >Ogaleye Ifeoluwa</Text>
                            <View style={{ flexDirection: 'row', top: 10 }}>
                                <Text style={{ fontSize: 15, color: '#fff', fontStyle: 'normal', fontFamily: 'Lato-Regular', }}>20% Top up</Text>
                                <Text style={{ fontSize: 15, color: '#fff', fontStyle: 'normal', fontFamily: 'Lato-Bold', left: 30 }}>₦40,000</Text>
                            </View>
                        </View>
                    </View>
                    
                    <View style={{ width: '60%', top: 40, flexDirection: 'row', justifyContent: 'space-between' }}>                
                        <Text style={{ fontSize: 15, color: '#fff', fontStyle: 'normal', fontFamily: 'Lato-Bold', }}>2234</Text>
                        <Text style={{ fontSize: 15, color: '#fff', fontStyle: 'normal', fontFamily: 'Lato-Bold', }}>****</Text>
                        <Text style={{ fontSize: 15, color: '#fff', fontStyle: 'normal', fontFamily: 'Lato-Bold', }}>****</Text>
                        <Text style={{ fontSize: 15, color: '#fff', fontStyle: 'normal', fontFamily: 'Lato-Bold', }}>5677</Text>
                    </View>
                    <View>
                        <View style={{ top: '50%', zIndex: 10 }}>
                            <Svg width="305" height="55" viewBox="0 0 305 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <Path d="M1.02943 15.813C110.503 40.3873 226.474 -19.9358 303.902 9.8486M1.03129 23.8594C110.505 48.4337 226.476 -11.8894 303.903 17.895M1.03315 31.9058C110.507 56.4801 226.478 -3.84299 303.905 25.9414M1.03499 39.9522C110.509 64.5265 226.479 4.2034 303.907 33.9878M1.03688 47.9986C110.511 72.5729 226.481 12.2498 303.909 42.0342" stroke="#38AAE4" stroke-width="1.74302"/>
                            </Svg>

                        </View>
                        <Svg width="306" height="74" viewBox="0 0 306 74" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <G style="mix-blend-mode:overlay">
                                <Path fill-rule="evenodd" clip-rule="evenodd" d="M306 0.793274L295.832 6.89383C285.665 12.9944 265.33 25.1955 244.994 35.3631C224.659 45.5307 204.324 53.6648 183.989 49.5977C163.654 45.5307 143.318 29.2625 122.983 25.1955C102.648 21.1285 82.3129 29.2625 61.9777 29.2625C41.6425 29.2625 21.3073 21.1285 11.1397 17.0614L0.972076 12.9944V74H11.1397C21.3073 74 41.6425 74 61.9777 74C82.3129 74 102.648 74 122.983 74C143.318 74 163.654 74 183.989 74C204.324 74 224.659 74 244.994 74C265.33 74 285.665 74 295.832 74H306V0.793274Z" fill="#2214DA"/>
                            </G>
                        </Svg> 
                    </View>
                </LinearGradient>

                <View style={styles.form}>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Card number</Text>
                        <TextInput 
                                style={styles.input}
                                placeholder="2234 ********5677"
                                placeholderTextColor="rgba(23, 23, 23, 1)"
                            />
                    </View>
                    <View style={{ width: '100%', marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={[styles.formGroup, { width: '48%' }]}>
                            <Text style={styles.label}>Expiry date</Text>
                            <TextInput 
                                    style={styles.input}
                                    placeholder="01 / 06"
                                    placeholderTextColor="rgba(23, 23, 23, 1)"
                                />
                        </View>
                        <View style={[styles.formGroup, { width: '48%' }]}>
                            <Text style={styles.label}>CVV</Text>
                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                            <TextInput 
                                    style={styles.input}
                                    placeholder="***"
                                    placeholderTextColor="rgba(23, 23, 23, 1)"
                                />
                                <Ionicons name="eye-off-outline" size={15} color="rgba(107, 97, 236, 1)"  style={{ right: 20, }} />
                            </View>
                        </View>
                    </View>
                    <View style={{ width: '100%', marginVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <Switch
                            trackColor={{ false: "rgba(196, 196, 196, 1)", true: "rgba(107, 97, 236, 1)" }}
                            thumbColor={isEnabled ? "rgba(247, 247, 252, 1)" : "rgba(247, 247, 252, 1)"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                        />
                        <Text style={{ fontSize: 15, color: '#000', fontFamily: 'Lato-Regular', left: 10 }}>Save my card details </Text>
                    </View>
                </View>

                <View style={styles.formOverview}>
                    <Text style={{ fontSize: 17, color: 'rgba(23, 23, 23, 1)', fontFamily: 'Lato-Bold', left: 10 }}>Top up overview</Text>
                    <View style={{ width: '100%', marginVertical: 10, flexDirection: 'row', alignItems: 'center' }}> 
                        <Text style={{ fontSize: 17, color: 'rgba(23, 23, 23, 1)', fontFamily: 'Lato-Regular', left: 10, width: '70%' }}>Credited amount:</Text>
                        <Text style={{ fontSize: 17, color: 'rgba(107, 97, 236, 1)', fontFamily: 'Lato-Regular', left: 10, width: '30%'}}>₦100.00</Text>
                    </View>
                    <View style={{ width: '100%', marginVertical: 10, flexDirection: 'row', alignItems: 'center' }}> 
                        <Text style={{ fontSize: 20, color: 'rgba(23, 23, 23, 1)', fontFamily: 'Lato-Regular', left: 10, width: '70%' }}>Total:</Text>
                        <Text style={{ fontSize: 20, color: 'rgba(107, 97, 236, 1)', fontFamily: 'Lato-Regular', left: 10, width: '30%' }}>₦40,000</Text>
                    </View>
                </View>
                
                <Pressable style={styles.button}>
                    <Text style={styles.buttonText}>Save</Text>
                </Pressable>
            </ScrollView> 
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header:{
    flex: .6,
    width,
    alignItems: 'center', 
    marginTop: 40, 
  },
  headerCon:{
    width: '90%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    // marginTop: 20, 
  },
  leftHeader:{
    width: '17%',
    alignItems: 'center',
    justifyContent: 'center', 
  },
  imageCon:{
    width: 40, 
    height: 40,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'rgba(223, 224, 235, 1)',
    backgroundColor: 'rgba(107, 97, 236, 1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleHeader:{
    width: '53%', 
    height: 40,
    backgroundColor: 'rgba(235, 235, 235, 1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5, 
    flexDirection: 'row',

  },
  searchInput:{
    width: '80%',
    left: 10,
    fontSize: 13,
    fontStyle: 'normal',
    fontFamily: 'Lato-Regular',
  },
  rightHeader:{
    width: '23%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topButton:{
    width: '100%',
    height: 40,
    backgroundColor: 'rgba(107, 97, 236, 1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  topButtonText:{
    color: '#fff',
    fontStyle: 'normal',
    fontFamily: 'Lato-Regular',
  },
  body:{ 
    flex: 3.4,
    width, 
  },
  card:{
    width: '80%',  
    borderRadius: 10,
    backgroundColor: 'rgba(76, 26, 196, 1)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  form:{
    width: '80%', 
    marginVertical: 20,
    alignSelf: 'center',
  },
  formGroup:{
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'rgba(107, 97, 236, 1)',
    borderRadius: 10,
    justifyContent: 'center',
    padding: 5
  },
  label:{
    maxWidth: 70,
    fontSize: 12,
    color: 'rgba(196, 196, 196, 1)',
    fontStyle: 'normal',
    fontFamily: 'Lato-Regular',
    bottom: '20%',
    backgroundColor: '#fff',
    padding: 2,
    left: 10,  
  },
  input:{
    width: '100%',
    left: 10,
    fontSize: 13,
    fontStyle: 'normal',
    fontFamily: 'Lato-Regular',
    color: 'rgba(23, 23, 23, 1)'
  },
  formOverview:{
    width: '80%', 
    padding: 20,
    alignItems: 'flex-start',
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 5,
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  button:{
    width: '80%',
    height: 40,
    backgroundColor: 'rgba(107, 97, 236, 1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginVertical: 20,
    alignSelf: 'center',
  },
  buttonText:{ 
    fontSize: 13,
    color: '#fff',
    fontStyle: 'normal',
    fontFamily: 'Lato-Regular',
  }
});
