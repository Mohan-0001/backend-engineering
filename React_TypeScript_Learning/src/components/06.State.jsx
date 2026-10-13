import { useState } from "react";

export default Counter() {
    const [count, setCount] = useState < number > (0)
    // here we initialise the count state with 0 this helps ts to infer the type of count as number
    // means you cannot write useState<string>(0) , it gives error because 0 is not a string

    return
    <>
        <div>
            {count}
        </div>
    </>
};


// Union

type LoadState = 
| { status: "idle"}
| { status : "loading"}
| { status : "success", data: string}
| { status : "error", message: string};

export function LoaderDemo() {

    const [state, setState] = useState<LoadState>({ status: "idle"});

    async function fetchData() {
        setState({status: "loading"});

        // make api call

        setState({status: "success", data: "Hello World"});

        // catch
        setState({status: "error", message: "Something went wrong"});
    }

    return <div>Loader</div>
}


// ==========================================================================================================================
import { useState } from "react";

// ============================================================================
// 1. SIMPLE UNION WITH NULL (For Async/API Data)
// ============================================================================

type UserData = {
    id: number;
    name: string;
};

export function UserProfile() {
    /**
     * Initial state 'null' hai kyunki component load hote hi data nahi hota.
     * Hum '<UserData | null>' use karte hain taaki TS ko pata chale ki future me 
     * isme UserData ka object aane wala hai. State lock nahi hoti!
     */
    const [user, setUser] = useState<UserData | null>(null);

    async function fetchUser() {
        // API call simulate kar rahe hain
        const data: UserData = { id: 1, name: "John Doe" };
        
        // This is perfectly valid because type allows UserData
        setUser(data); 
    }

    return (
        <div>
            {/* Short-circuiting ya optional chaining use karni padegi kyunki 'user' null ho sakta hai */}
            {user ? <p>Welcome, {user.name}</p> : <p>Loading user...</p>}
        </div>
    );
}

// ============================================================================
// 2. DISCRIMINATED UNION WITH NULL (Your Loader Pattern)
// ============================================================================

type LoadStateWithData = 
    | { status: "idle" }
    | { status: "loading" }
    /**
     * Agar data load nahi hua hai ya API empty response deti hai, 
     * toh data field directly 'null' hold kar sakti hai.
     */

    | { status: "success"; data: string | null } 
    | { status: "error"; message: string };

export function LoaderDemoWithNull() {
    const [state, setState] = useState<LoadStateWithData>({ status: "idle" });

    async function fetchData() {
        setState({ status: "loading" });

        try {
            // API call logic goes here...
            const responseData: string | null = null; // Maan lo server ne empty response diya

            // Success state me null pass karna completely valid hai ab
            setState({ status: "success", data: responseData });
        } catch (error) {
            setState({ status: "error", message: "Something went wrong" });
        }
    }

    return (
        <div>
            {state.status === "success" && (
                <div>
                    {/* Null check handling inside JSX */}
                    {state.data ?? <em>No data returned from server</em>}
                </div>
            )}
        </div>
    );
}
