import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { AccountType } from './types';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export function capitalize(text: string) {
    if (!text) {
        return '';
    }

    return text.charAt(0).toUpperCase() + text.substring(1).toLowerCase();
}

export function convertToSlug(text: string) {
    const regex =  /[A-Za-z][a-z0-9]*/g;

    if (!text || !regex.test(text)) {
        return '';
    }

    return text.match(regex)?.reduce((slug, token, index) => {
        return slug + (index !== 0 ? '-' : '') + token.toLowerCase();
    }, '') ?? '';
}

export function convertFromSlug(text: string) {
    if (!text) {
        return '';
    }

    return text.split('-').reduce((result, token) => {
        return result + capitalize(token);
    }, '');
}

export async function saveAccount(accountType: AccountType, accountUsername: string, accountToken: string) {
    const accountId = `${convertToSlug(accountType)}-token.${accountUsername}`;
    
    await AsyncStorage.setItem('active_account_id', accountId);
    await SecureStore.setItemAsync(accountId, accountToken);
}

export async function getActiveAccountToken(): Promise<string|null> {
    const activeAccountId = await AsyncStorage.getItem('active_account_id');

    if (!activeAccountId) {
        return null;
    }

    return SecureStore.getItemAsync(activeAccountId);
}

export function getRelativeTime(until: Date | number | string) {
    return dayjs().to(until);
}