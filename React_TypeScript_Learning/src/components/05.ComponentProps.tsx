import type { ComponentPropsWithoutRef, ComponentPropsWithRef, CSSProperties } from "react";

// ============================================================================
// 1. NATIVE ELEMENT WRAPPER (THE PREFERRED WAY)
// ============================================================================

/**
 * ALWAYS PREFER ComponentPropsWithoutRef over ComponentProps for normal wrappers.
 * ComponentProps includes the 'ref' type, which will throw a TypeScript warning 
 * if you don't wrap your component in React.forwardRef().
 */
type ButtonBaseProps = ComponentPropsWithoutRef<'button'>;

type ButtonProps = ButtonBaseProps & { 
    variant?: 'primary' | 'secondary';
};

export function Button({ variant = 'primary', style, ...rest }: ButtonProps) {
    const baseStyle: CSSProperties = {
        padding: '10px',
        backgroundColor: variant === 'primary' ? 'blue' : 'gray', // Example utilizing variant
    };

    return (
        <button 
            style={{ ...baseStyle, ...style }} 
            {...rest} // Safely forwards onClick, type, disabled, id, etc.
        />
    );
}

// ============================================================================
// 2. EXTRACTING TYPES FROM UNEXPORTED 3RD-PARTY COMPONENTS
// ============================================================================

// Assume this is an unexported internal/3rd-party component that you cannot modify
function LegacyPanel({ title }: { title: string }) {
    return <div>{title}</div>;
}

/**
 * PRODUCTION USE CASE:
 * If a 3rd party package or a teammate forgot to export a component's props type, 
 * you can use 'typeof' inside ComponentProps to extract it instantly.
 */
type LegacyPanelProps = ComponentPropsWithoutRef<typeof LegacyPanel>; 
// LegacyPanelProps is now exactly: { title: string }

type EnhancedPanelProps = LegacyPanelProps & {
    theme: 'light' | 'dark';
};

export function EnhancedPanel({ theme, ...rest }: EnhancedPanelProps) {
    return (
        <div className={`panel-${theme}`}>
            <LegacyPanel {...rest} />
        </div>
    );
}

// ============================================================================
// 3. THE 3 FLAVORS OF COMPONENT PROPS CHEATSHEET
// ============================================================================

/**
 * 1. ComponentProps<"button">
 *    - Includes all native attributes + the legacy/raw Ref type.
 *    - Avoid using this in modern React codebase unless necessary.
 * 
 * 2. ComponentPropsWithoutRef<"button">
 *    - Includes all native attributes EXCEPT 'ref'.
 *    - **Go-to standard** for everyday component wrappers.
 * 
 * 3. ComponentPropsWithRef<"button">
 *    - Includes all native attributes + the modern typed Ref.
 *    - Use this ONLY when building advanced components wrapped in React.forwardRef().
 */
