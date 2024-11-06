import { createContext, type Reducer } from 'react';

interface State {
  itemsById: Record<string, any>;
}

interface SaveItemsAction {
  type: 'saveItems';
  payload: Record<string, any>;
}

type Action = SaveItemsAction;

export const initialState: State = {
  itemsById: {},
};

export const Context = createContext<State>(initialState);

export const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'saveItems':
      return {
        ...state,
        itemsById: action.payload,
      };
  }
};
