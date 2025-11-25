export enum LOCAL_KEY {
  USER = 'user',
  DIVISIONS = 'divisions',
  SELECTED_DIVISION_ID = 'selectedDivisionId',
}

class LocalStorageUtil {
  static setItem(key: string, value: string) {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value);
    }
  }

  static getItem(key: string, defaultValue: string | null = null) {
    if (typeof window === 'undefined') return defaultValue;
    const value = window.localStorage.getItem(key);
    if (value === null) return defaultValue;
    return value;
  }

  static getBooleanItem(key: string, defaultValue: boolean = false) {
    if (typeof window === 'undefined') return defaultValue;
    const value = window.localStorage.getItem(key);
    if (value === null) return defaultValue;
    return value === 'true';
  }

  static removeItem(key: string) {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  }

  static setItemObject(key: string, itemObject: unknown) {
    const plainText = JSON.stringify(itemObject);
    LocalStorageUtil.setItem(key, plainText);
  }

  static getItemObject(key: string, defaultValue: unknown = {}) {
    const stringJson = LocalStorageUtil.getItem(key);
    if (!stringJson) {
      return defaultValue;
    }
    try {
      return JSON.parse(stringJson);
    } catch (e) {
      return defaultValue;
    }
  }

  static getCurrentUserId(): string | null {
    const result = LocalStorageUtil.getItem('userId');
    if (!result || result?.length === 0) {
      return null;
    }
    return result;
  }

  static setUserLocalData(key: string, stringData: string) {
    const userId = LocalStorageUtil.getCurrentUserId();
    if (!userId) {
      return;
    }
    const storedData = LocalStorageUtil.getItemObject(userId, {});
    storedData[key] = stringData;
    LocalStorageUtil.setItemObject(userId, storedData);
  }

  static getUserLocalData(key: string): string | null {
    const userId = LocalStorageUtil.getCurrentUserId();
    if (!userId) return null;
    const storedData = LocalStorageUtil.getItemObject(userId, {});
    return storedData[key] ?? null;
  }

  static setUserLocalDataObject(key: string, objectData: unknown) {
    const userId = LocalStorageUtil.getCurrentUserId();
    if (!userId) {
      return;
    }
    const storedData = LocalStorageUtil.getItemObject(userId, {});
    storedData[key] = JSON.stringify(objectData);
    LocalStorageUtil.setItemObject(userId, storedData);
  }

  static getUserLocalDataObject(key: string): unknown | null {
    const userId = LocalStorageUtil.getCurrentUserId();
    if (!userId) return null;
    const storedData = LocalStorageUtil.getItemObject(userId, {});
    const stringData = storedData[key] ?? null;
    if (!stringData) return null;
    return JSON.parse(stringData);
  }
}

export default LocalStorageUtil;
