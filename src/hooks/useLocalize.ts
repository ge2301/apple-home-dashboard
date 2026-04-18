import { useCallback } from 'react';
import { localize } from '../utils/LocalizationService';

export function useLocalize() {
  return useCallback((key: string) => localize(key), []);
}
