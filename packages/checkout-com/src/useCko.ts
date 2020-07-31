/* eslint-disable camelcase, @typescript-eslint/camelcase */

import { createContext } from './payment';
import { Configuration } from './configuration';
import { ref } from '@vue/composition-api';
import useCkoCard from './useCkoCard';

const error = ref(null);
const availableMethods = ref([]);

interface PaymentMethods {
  card?: boolean;
  klarna?: boolean;
  paypal?: boolean;
}

interface PaymentMethodsConfig {
  card?: Omit<Configuration, 'publicKey'>;
  klarna?: any;
  paypal?: any;
}

const useCko = () => {
  const loadAvailableMethods = async (reference) => {
    try {
      const response = await createContext({ reference });
      availableMethods.value = [
        ...response.data.apms,
        { name: 'card' }
      ];
      return response.data;
    } catch (e) {
      error.value = e;
      return null;
    }
  };

  const initForm = (initMethods: PaymentMethods = null, config: PaymentMethodsConfig = {}) => {
    if (initMethods && Object.keys(initMethods).length === 0) {
      return;
    }
    const hasSpecifiedMethods = initMethods && Object.keys(initMethods).length > 0;
    const { initCardForm } = useCkoCard();

    for (const { name } of availableMethods.value) {
      if (!hasSpecifiedMethods || initMethods[name]) {
        const methodConfig = config[name];
        switch (name) {
          case 'card':
            initCardForm(methodConfig);
            break;
          case 'klarna':
            console.log('Rendering klarna...');
            break;
          case 'paypal':
            console.log('Rendering paypal...');
            break;
        }
      }
    }
  };

  return {
    availableMethods,
    error,
    loadAvailableMethods,
    initForm
  };
};
export default useCko;