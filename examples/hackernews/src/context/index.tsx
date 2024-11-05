import { createContext } from 'react';

export const initialState = {
  itemsById: {},
};

export const Context = createContext(initialState);

export const reducer = (state, action) => {
  switch (action.type) {
    case 'saveItems':
      return {
        ...state,
        itemsById: action.payload,
      };
  }
};
