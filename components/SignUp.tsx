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
            {fetcher.data?.error && <div className="error sign-in">
                <span>Issue signing up.</span>
            </div>}
            <form className="sign-up-form" method="POST" noValidate onSubmit={handleSubmit(onSubmit)}>
                <div className={`input-container${error?.firstName ? ' error' : ''}`}>
                    <input 
                        type="text" 
                        id="firstName" 
                        name="firstName" 
                        placeholder="first name"
                        className={error?.firstName ? 'input-error' : ''} 
                        {...register(
                            "firstName", 
                            { 
                                required: "first name required",
                                maxLength: {
                                    value: 15,
                                    message: "name too long"
                                }
                            }
                        )} 
                    />
                    {errors.firstName && <p>error.firstName?.message</p>}
                </div>
                <div className={`input-container${error?.lastName ? ' error' : ''}`}>
                    <input 
                        type="text" 
                        id="lastName" 
                        name="lastName" 
                        placeholder="last name"
                        className={error?.lastName ? 'input-error' : ''} 
                        {...register(
                            "lastName", 
                            { 
                                required: "last name required",
                                maxLength: {
                                    value: 15,
                                    message: "name too long"
                                }
                            }

                        )} 
                    />
                    {errors.lastName && <p>error.lastName?.message</p>}
                </div>
                <div className={`input-container${error?.webexId ? 'error' : ''}`}>
                     <input 
                        type="text" 
                        id="webexId" 
                        name="webexId" 
                        placeholder="webex id"
                        className={error?.webexId ? 'input-error' : ''} 
                        {...register(
                            "webexId", 
                            { 
                                required: false
                            }

                        )} 
                    />
                    {errors.webexId && <p>error.webexId?.message</p>}
                </div>
                <div className={`input-container${error?.agentPhoneNumber ? 'error' : ''}`}>
                    <input 
                        type="tel" 
                        id="agentPhoneNumber" 
                        name="agentPhoneNumber" 
                        placeholder="webex phone number (ex. +15556668888)"
                        className={error?.agentPhoneNumber ? 'input-error' : ''}
                        {...register(
                            "agentPhoneNumber", 
                            { 
                                required: "webex phone number required",
                                pattern: {
                                    value: /^\+\d+$/,
                                    message: "webex phone number invalid"
                                }
                            }

                        )} 
                    />
                    {errors.agentPhoneNumber && <p>error.agentPhoneNumber?.message</p>}
                </div>
                <div className={`input-container${error?.email ? 'error' : ''}`}>
                    <input 
                        type="text" 
                        id="email" 
                        name="email" 
                        placeholder="email"
                        className={error?.email ? 'input-error' : ''} 
                        {...register(
                            "email", 
                            { 
                                required: "email required",
                                pattern: {
                                    value: /^\S+@\S+\.\S+$/,
                                    message: "email invalid"
                                }
                            }

                        )} 
                    />
                    {errors.email && <p>error.email?.message</p>}
                </div>
                <div className={`input-container${error?.emailVerified ? 'error' : ''}`}>
                    <input 
                        type="text" 
                        id="emailVerified" 
                        name="emailVerified" 
                        placeholder="verify email"
                        className={error?.emailVerified ? 'input-error' : ''} 
                        {...register(
                            "emailVerified", 
                            { 
                                required: "must verify email",
                                pattern: {
                                    value: /^\S+@\S+\.\S+$/,
                                    message: "email invalid"
                                },
                                validate: (v, f) => (
                                    v === f.email || 'email does not match'
                                )
                            }

                        )} 
                    />
                    {errors.emailVerified && <p>error.emailVerified?.message</p>}
                </div>
                <div className={`input-container${error?.password ? 'error' : ''}`}>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder="password"
                        className={error?.password ? 'input-error' : ''} 
                        {...register(
                            "password", 
                            { 
                                required: "password required",
                                pattern: {
                                    value: /^\S+$/,
                                    message: "password invlaid"
                                },
                                minLength: {
                                    value: 8,
                                    message: "password too short"
                                }
                            }

                        )} 
                    />
                    {errors.password && <p>error.password?.message</p>}
                </div>
                <div className={`input-container${error?.passwordVerified ? 'error' : ''}`}>
                    <input 
                        type="password" 
                        id="passwordVerified" 
                        name="passwordVerified" 
                        placeholder="password verified"
                        className={error?.passwordVerified ? 'input-error' : ''} 
                        {...register(
                            "passwordVerified", 
                            { 
                                required: "must verify password",
                                pattern: {
                                    value: /^\S+$/,
                                    message: "password invlaid"
                                },
                                minLength: {
                                    value: 8,
                                    message: "password too short"
                                },
                                validate: (v, f) => (
                                    v === f.password || 'password does not match'
                                )
                            }

                        )} 
                    />
                    {errors.passwordVerified && <p>error.passwordVerified?.message</p>}
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