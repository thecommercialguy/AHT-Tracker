import { Form, useFetcher, useNavigate, useNavigation, type ActionFunctionArgs } from "react-router";
import { signUpAction } from "../actions/actions.ts";
import { p } from "motion/react-client";

export function signUpLoader() {
    
}

export default function SignUp() {
    const fetcher = useFetcher<typeof signUpAction>();
    const disabled = false;
    // const disabled = fetcher.state === 'submitting' || fetcher.state === 'loading';
    

    return (
        <div className="sign-up-form-container">
            <h1 className="form-heading">Start Tracking</h1>
            <fetcher.Form className="sign-up-form" method="post" noValidate>
                <div>
                    <FormInput 
                        type="text" 
                        id="firstName" 
                        name="firstName" 
                        placeholder="first name"
                        error={fetcher.data?.error?.firstNameError}
                    />
                </div>
                <div>
                    <FormInput 
                        type="text" 
                        id="lastName" 
                        name="lastName" 
                        placeholder="last name"
                        error={fetcher.data?.error?.lastNameError}
                    />
                </div>
                <div>
                     <FormInput 
                        type="tel" 
                        id="agentPhoneNumber" 
                        name="agentPhoneNumber" 
                        placeholder="agent phone number"
                        error={fetcher.data?.error?.agentPhoneNumberError}
                    />
                </div>
                <div>
                    <FormInput 
                        type="text" 
                        id="webexId" 
                        name="webexId" 
                        placeholder="webex id"
                        error={fetcher.data?.error?.webexIdError}
                    />
                </div>
                <div>
                    <FormInput 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="email"
                        error={fetcher.data?.error?.emailError}
                    />
                </div>
                <div>
                    <FormInput 
                        type="email" 
                        id="emailVerified" 
                        name="emailVerified" 
                        placeholder="verify email"
                        error={fetcher.data?.error?.emailError}
                    />
                </div>
                <div>
                    <FormInput 
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder="password"
                        error={fetcher.data?.error?.passwordError}
                    />
                </div>
                <div>
                    <FormInput 
                        type="password" 
                        id="passwordVerified" 
                        name="passwordVerified" 
                        placeholder="verify password"
                        error={fetcher.data?.error?.passwordError}
                    />
                </div>
                <button type="submit" disabled={disabled}>Sign Up</button>
            </fetcher.Form>

        </div>
    )
}


interface FormInput {
    type: string;
    id: string;
    name: string;
    placeholder?: string | null;
    error?: string | null 
}

export const FormInput = ({type, id, name, placeholder, error}: FormInput) => {
    
    return (
        <input
            type={type}
            id={id}
            style={error ? { '--placeholder-color': 'red' } as React.CSSProperties : {}}
            className={error ? 'input-error' : ''}
            name={name}
            placeholder={error ? error : placeholder}
        />
    )


}