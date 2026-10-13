import { useReducer } from "react";

// ============================================================================
// 1. TYPES & INTERFACES DEFINITIONS
// ============================================================================

type CounterState = {
    count: number;
    step: number;
};

/**
 * FIXED: 'type Action = {' ke andar '|' syntax galat tha. 
 * Discriminated Union ko hamesha bina opening curly bracket ke likhte hain.
 */
type Action =
    | { type: 'INCREMENT' }
    | { type: 'DECREMENT' }
    | { type: 'SET_STEP'; payload: number } // Added: Dynamic step changes handle karne ke liye
    | { type: 'RESET'; to?: number };

// ============================================================================
// 2. REDUCER AND INITIALIZER FUNCTIONS
// ============================================================================

/**
 * Lazy Initialization function: Yeh state ko dynamically shape karta hai 
 * jab component pehli baar mount hota hai.
 */
function init(initialCount: number): CounterState {
    return { count: initialCount, step: 1 };
}

function counterReducer(state: CounterState, action: Action): CounterState {
    switch (action.type) {
        case 'INCREMENT':
            return { ...state, count: state.count + state.step };
        
        case 'DECREMENT':
            return { ...state, count: state.count - state.step };

        case 'SET_STEP':
            return { ...state, step: action.payload };

        case 'RESET':
            // FIXED: Reducer return statement mein default check add karna zaroori hai code safety ke liye
            return { ...state, count: action.to ?? 0 };
            
        default:
            return state;
    }
}

// ============================================================================
// 3. COMPONENT IMPLEMENTATION
// ============================================================================

/**
 * FIXED: Prop destructuring mein typo tha ({inital = 0} vs {initial?: number})
 */
type TypeReducerProps = {
    initial?: number;
};

export function TypeReducer({ initial = 0 }: TypeReducerProps) {
    // FIXED: Hook ke andar 'inital' ki jagah 'initial' pass kiya jo destructured argument hai
    const [state, dispatch] = useReducer(counterReducer, initial, init);

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Count: {state.count}</h2>
            <p>Current Step: {state.step}</p>
            
            {/* Action dispatch controls */}
            <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => dispatch({ type: 'INCREMENT' })}>Increase</button>
                <button onClick={() => dispatch({ type: 'DECREMENT' })}>Decrease</button>
                
                {/* FIXED: dispatch mein 'PESET' typo tha, use 'RESET' kar diya */}
                <button onClick={() => dispatch({ type: 'RESET', to: initial })}>Reset</button>
            </div>

            {/* Added: Extra functionality to show how 'SET_STEP' works */}
            <div style={{ marginTop: '12px' }}>
                <button onClick={() => dispatch({ type: 'SET_STEP', payload: 5 })}>
                    Set Step to 5
                </button>
            </div>
        </div>
    );
}
