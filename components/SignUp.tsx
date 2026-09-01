import { Form, useFetcher, useNavigate, useNavigation, type ActionFunctionArgs } from "react-router";
import { signUpAction } from "../actions/actions.ts";
import { type SignUpFields } from "../types/authTypes.ts";
import { p } from "motion/react-client";
import { useForm, type SubmitHandler } from "react-hook-form";
import { type UserCredential } from "firebase/auth";
import { useEffect } from "react";
import { useAuth } from "../context/authContext.tsx";

export function signUpLoader() {
    
}

export default function SignUp() {
    const fetcher = useFetcher<typeof signUpAction>();
    const navigate = useNavigate();
    const {
        register, 
        handleSubmit, 
        formState: { errors }
    } = useForm<SignUpFields>();
    const onSubmit: SubmitHandler<SignUpFields> = (data) => {
        fetcher.submit({...data}, {method: "POST", action: '/signup'})
    }
    const {user, initializing} = useAuth();

    const disabled = false;

    useEffect(() => {
        if (user) navigate("/dashboard");
        

    }, [fetcher.data, user])


    // const disabled = fetcher.state === 'submitting' || fetcher.state === 'loading';
    console.log(fetcher?.data)

    return (
        <div className="sign-up-form-container">
            <h1 className="form-heading">Start Tracking</h1>
            <form className="sign-up-form" method="POST" noValidate onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <input 
                        type="text" 
                        id="firstName" 
                        name="firstName" 
                        placeholder="first name" 
                        {...register(
                            "firstName", 
                            { 
                                required: true,
                                maxLength: 15
                            }
                        )} 
                    />
                </div>
                <div>
                    <input 
                        type="text" 
                        id="lastName" 
                        name="lastName" 
                        placeholder="last name" 
                        {...register(
                            "lastName", 
                            { 
                                required: true,
                                maxLength: 15
                            }

                        )} 
                    />
                </div>
                <div>
                     <input 
                        type="text" 
                        id="webexId" 
                        name="webexId" 
                        placeholder="webex id" 
                        {...register(
                            "webexId", 
                            { 
                                required: false
                            }

                        )} 
                    />
                </div>
                <div>
                    <input 
                        type="tel" 
                        id="agentPhoneNumber" 
                        name="agentPhoneNumber" 
                        placeholder="webex phone number (ex. +15556668888)"
                        {...register(
                            "agentPhoneNumber", 
                            { 
                                required: true,
                                pattern: /^\+\d+$/
                            }

                        )} 
                    />
                </div>
                <div>
                    <input 
                        type="text" 
                        id="email" 
                        name="email" 
                        placeholder="email" 
                        {...register(
                            "email", 
                            { 
                                required: true,
                                pattern: /^\S+@\S+\.\S+$/
                            }

                        )} 
                    />
                </div>
                <div>
                    <input 
                        type="text" 
                        id="emailVerified" 
                        name="emailVerified" 
                        placeholder="verify email" 
                        {...register(
                            "emailVerified", 
                            { 
                                required: true,
                                pattern: /^\S+@\S+\.\S+$/,
                                validate: (v, f) => (
                                    v === f.email || 'email does not match'
                                )
                            }

                        )} 
                    />
                </div>
                <div>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder="password" 
                        {...register(
                            "password", 
                            { 
                                required: true,
                                pattern: /^\S+$/,
                                minLength: 8
                            }

                        )} 
                    />
                </div>
                <div>
                    <input 
                        type="password" 
                        id="passwordVerified" 
                        name="passwordVerified" 
                        placeholder="password verified" 
                        {...register(
                            "passwordVerified", 
                            { 
                                required: true,
                                pattern: /^\S+$/,
                                minLength: 8,
                            }

                        )} 
                    />
                </div>
                <button type="submit" disabled={disabled}>Sign Up</button>
            </form>

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

// return (
//         <div className="sign-up-form-container">
//             <h1 className="form-heading">Start Tracking</h1>
//             <fetcher.Form className="sign-up-form" method="post" noValidate>
//                 <div>
//                     <FormInput 
//                         type="text" 
//                         id="firstName" 
//                         name="firstName" 
//                         placeholder="first name"
//                         error={fetcher.data?.error?.firstNameError}
//                     />
//                 </div>
//                 <div>
//                     <FormInput 
//                         type="text" 
//                         id="lastName" 
//                         name="lastName" 
//                         placeholder="last name"
//                         error={fetcher.data?.error?.lastNameError}
//                     />
//                 </div>
//                 <div>
//                      <FormInput 
//                         type="tel" 
//                         id="agentPhoneNumber" 
//                         name="agentPhoneNumber" 
//                         placeholder="agent phone number"
//                         error={fetcher.data?.error?.agentPhoneNumberError}
//                     />
//                 </div>
//                 <div>
//                     <FormInput 
//                         type="text" 
//                         id="webexId" 
//                         name="webexId" 
//                         placeholder="webex id"
//                         error={fetcher.data?.error?.webexIdError}
//                     />
//                 </div>
//                 <div>
//                     <FormInput 
//                         type="email" 
//                         id="email" 
//                         name="email" 
//                         placeholder="email"
//                         error={fetcher.data?.error?.emailError}
//                     />
//                 </div>
//                 <div>
//                     <FormInput 
//                         type="email" 
//                         id="emailVerified" 
//                         name="emailVerified" 
//                         placeholder="verify email"
//                         error={fetcher.data?.error?.emailError}
//                     />
//                 </div>
//                 <div>
//                     <FormInput 
//                         type="password" 
//                         id="password" 
//                         name="password" 
//                         placeholder="password"
//                         error={fetcher.data?.error?.passwordError}
//                     />
//                 </div>
//                 <div>
//                     <FormInput 
//                         type="password" 
//                         id="passwordVerified" 
//                         name="passwordVerified" 
//                         placeholder="verify password"
//                         error={fetcher.data?.error?.passwordError}
//                     />
//                 </div>
//                 <button type="submit" disabled={disabled}>Sign Up</button>
//             </fetcher.Form>

//         </div>
//     )