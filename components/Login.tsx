import { Form, useFetcher, useNavigate, useNavigation, type ActionFunctionArgs } from "react-router";
import { useAuth } from "../context/authContext";
import type { LoginFields, SignUpFields } from "../types/authTypes";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { loginAction } from "../actions/actions";
import { useEffect } from "react";



export function loginLoader() {

}

export default function Login() {
    const fetcher = useFetcher<typeof loginAction>();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFields>();
    const onSubmit: SubmitHandler<LoginFields> = (data) => {
        fetcher.submit({...data}, {method: "POST", action: '/login'})
    }
    // const disabled = false;
    const {user, initializing} = useAuth();

    useEffect(() => {
        if (user) navigate("/dashboard");


    }, [fetcher.data, user])

    const disabled = fetcher.state === 'submitting' || fetcher.state === 'loading';
    console.log(fetcher.data?.error)
    

    return (
        <div className="login-form-container">
            <h1 className="form-heading">Welcome back!</h1>
            {fetcher.data?.error && <div className="error sign-in">
                <span>Login information incorrect.</span>
            </div>}
            <form className="login-form" method="POST" noValidate onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <input
                        className={fetcher.data?.error && ""} 
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
                        className={fetcher.data?.error && ""} 
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder="password" 
                        {...register(
                            "password", 
                            { 
                                required: true,
                                pattern: /^\S+$/
                            }

                        )} 
                    />
                </div>
                <button type="submit" disabled={disabled}>{fetcher.state !== 'loading' ? 'Login' : 'Submitting...'}</button>
            </form>

        </div>
    )
} 


// Want a linear gradient behind that button when submitting
