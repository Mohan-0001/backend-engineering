import { useState, type ChangeEvent, type FormEvent, type MouseEvent, type KeyboardEvent } from "react";

export function FormExample() {
    const [name, setName] = useState("");
    const [color, setColor] = useState("Red");

    function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
        setName(event.currentTarget.value);
        setName(event.target.value);

    }

    function handleButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        console.log("Button clicked with name:", name);
    }

    function hanfleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        event.key === 'Enter' && console.log("Enter pressed with name:", name);
    }

    function handleFinalFormSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log("Form submitted with name:", event.name);
    }

    handleColorChange(event: ChangeEvent<HTMLSelectElement>) {
        setColor(event.currentTarget.value);
    }

    return (
        <form onSubmit= {handleFinalFormSubmit}>
            <input
                value={name}
                placeholder="Enter your name"
                onChange={handleNameChange}
                onKeyDownn={handleKeyDown}
            />

            <select value={name} onChange={handleColorChange}>
                <option value="">Select your color</option>
                <option value="Red">Red</option>
                <option value="Yellow">Yellow</option>
            </select>
            <button type="submit" onClick={handleButtonClick}>Click</button>
        </form>
    )
}