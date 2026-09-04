import { Form, useFetcher, useNavigate, useNavigation, type ActionFunctionArgs } from "react-router";
import { useAuth } from "../context/authContext";
import type { LoginFields, SignUpFields } from "../types/authTypes";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { loginAction } from "../actions/actions";
import { useEffect } from "react";
import { motion } from "motion/react";
import { LoaderCircle } from "lucide-react";



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
                <div
                    className={
                        errors?.email ? "input-container error" 
                        : "input-container"
                    }   
                >
                    <input
                        type="text" 
                        id="email" 
                        name="email" 
                        placeholder="email" 
                        className={errors?.email ? 'input-error' : ''}
                        {...register(
                            "email", 
                            { 
                                required: true,
                                pattern: /^\S+@\S+\.\S+$/
                            }

                        )} 
                    />
                </div>
                <div
                    className={
                        errors?.password ? "input-container error" 
                        : "input-container"
                    }   
                >
                    <input
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder="password" 
                        className={errors?.password ? 'input-error' : ''}
                        {...register(
                            "password", 
                            { 
                                required: true,
                                pattern: /^\S+$/
                            }

                        )} 
                    />
                </div>
                <button type="submit" disabled={disabled}>{fetcher.state !== 'loading' ? 'Login' : 
                    <motion.div
                        animate={{rotate: 360}}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{
                            display: "flex",
                            alignItems: "center", 
                            justifyContent: "center",
                        }}
                    >
                        <LoaderCircle size={24} />
                    </motion.div>
                }
                </button>
            </form>

        </div>
    )
} 


// Want a linear gradient behind that button when submitting

<motion.div
animate={{rotate: 360}}
transition={{
    duration: 1,
    repeat: Infinity,
    ease: "linear"
}}
style={{
    display: "flex",
    alignItems: "center", 
    justifyContent: "center",
    position: "absolute",
    top: 80,
    left: '49%'
}}
>
<LoaderCircle size={32} />
</motion.div>