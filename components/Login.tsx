import { Form, useFetcher, useNavigate, useNavigation, type ActionFunctionArgs } from "react-router";



export function loginLoader() {

}

export default function Login() {
    const fetcher = useFetcher<typeof loginAction>();
    const disabled = false;
    // const disabled = fetcher.state === 'submitting' || fetcher.state === 'loading';
    

    return (
        <div className="login-form-container">
            <h1 className="form-heading">Welcome back!</h1>
            <fetcher.Form className="login-form" method="post">
                <div>
                    <input type="email" id="email" name="email" placeholder="email"></input>
                </div>
                <div>
                    <input type="password" id="password" name="password" placeholder="password"></input>
                </div>
                <button type="submit" disabled={disabled}>Login</button>
            </fetcher.Form>

        </div>
    )
} 



