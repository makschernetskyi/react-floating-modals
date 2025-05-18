import React, {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useReducer,
  useRef
} from 'react';
import {FloatingModal} from './FloatingModal';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface WindowRecord {
  id: number;
  element: ReactElement;
  z: number;
}

interface State {
  windows: WindowRecord[];
  nextZ: number;
}

type Action =
  | { type: 'OPEN'; id: number; element: ReactElement }
  | { type: 'FOCUS'; id: number }
  | { type: 'CLOSE'; id: number }
  | { type: 'CLOSE_ALL' };

export interface WindowManagerAPI {
  /**
   * Opens a window. By default `singleton = true`, so if an existing window
   * with the *same* element type and props (shallow) is already open, it will
   * just be brought to front instead of opening a new one.
   */
  spawn: (element: ReactElement, singleton?: boolean) => number;
  close: (id: number) => void;
  closeAll: () => void;
  focus: (id: number) => void;
}

const WindowManagerContext = createContext<WindowManagerAPI | null>(null);
export const useWindowManager = (): WindowManagerAPI => {
  const ctx = useContext(WindowManagerContext);
  if (!ctx) throw new Error('useWindowManager must be inside provider');
  return ctx;
};

/* ------------------------------------------------------------------ */
/* Reducer                                                             */
/* ------------------------------------------------------------------ */

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'OPEN': {
      const topZ = state.nextZ + 1;
      return {
        ...state,
        nextZ: topZ,
        windows: [
          ...state.windows,
          { id: action.id, element: action.element, z: topZ }
        ]
      };
    }
    case 'FOCUS': {
      const topZ = state.nextZ + 1;
      return {
        ...state,
        nextZ: topZ,
        windows: state.windows.map(w =>
          w.id === action.id ? { ...w, z: topZ } : w
        )
      };
    }
    case 'CLOSE':
      return {
        ...state,
        windows: state.windows.filter(w => w.id !== action.id)
      };
    case 'CLOSE_ALL':
      return { ...state, windows: [] };
    default:
      return state;
  }
};

/* ------------------------------------------------------------------ */
/* Provider component                                                  */
/* ------------------------------------------------------------------ */

export const WindowManagerProvider = ({
  children
}: {
  children: ReactNode;
}): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, {
    windows: [],
    nextZ: 1000
  } satisfies State);

  const idCounter = useRef(0);

  /**
   * Shallow-compare two ReactElement props objects (ignores children & windowId).
   */
  function shallowEqualProps(a: any, b: any): boolean {
    const aKeys = Object.keys(a).filter(k => k !== 'children');
    const bKeys = Object.keys(b).filter(k => k !== 'children');
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every(key => a[key] === b[key]);
  }

  const api: WindowManagerAPI = {
    spawn: (element, singleton = true) => {
      if (singleton) {
        const match = state.windows.find(w => {
          return (
            w.element.type === element.type &&
            shallowEqualProps(w.element.props, element.props)
          );
        });
        if (match) {
          dispatch({ type: 'FOCUS', id: match.id });
          return match.id;
        }
      }
      const id = ++idCounter.current;
      dispatch({ type: 'OPEN', id, element });
      return id;
    },

    close: id => dispatch({ type: 'CLOSE', id }),
    closeAll: () => dispatch({ type: 'CLOSE_ALL' }),
    focus: id => dispatch({ type: 'FOCUS', id })
  };

  return (
    <WindowManagerContext.Provider value={api}>
      {children}

      {state.windows.map(w => (
        <FloatingModal
          key={w.id}
          style={{ zIndex: w.z }}
          onMouseDown={() => api.focus(w.id)}
          onTouchStart={() => api.focus(w.id)}
        >
          {React.cloneElement(w.element, { windowId: w.id })}
        </FloatingModal>
      ))}
    </WindowManagerContext.Provider>
  );
};
