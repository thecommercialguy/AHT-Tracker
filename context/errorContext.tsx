import { error } from "console";
import { createContext, ReactNode, useContext, useState } from "react";


interface IErrorContext {
    errorMessage: string | null;
    isActive: boolean
}

const ErrorContext = createContext<IErrorContext>({
    errorMessage: null,
    isActive: false
});


export function ErrorContextProvider({ children }: {children: ReactNode}) {
    const [errorObject, setErrorObject] = useState<IErrorContext>({
        errorMessage: null,
        isActive: false
    });



    return (
        <ErrorContext.Provider value={errorObject}>
            {children}
        </ErrorContext.Provider>
    )

}

export function useErrorContext() {
    const errorContext = useContext(ErrorContext);
    if (!errorContext) throw new Error('Must be witihin error context provider');

    return errorContext;
}

export const SnackBar = () => {
    return (
        <div className="snackbar-container">
            <span> Error deleting account </span>
        </div>
    )
} 