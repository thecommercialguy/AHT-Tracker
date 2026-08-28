import { Form, useFetcher, useNavigate, useNavigation, type ActionFunctionArgs } from "react-router";
import { signUpAction } from "../actions/actions.ts";

export function signUpLoader() {
    
}

export default function SignUp() {
    const fetcher = useFetcher<typeof signUpAction>();
    const disabled = false;
    // const disabled = fetcher.state === 'submitting' || fetcher.state === 'loading';
    

    return (
        <div className="sign-up-form-container">
            <h1 className="form-heading">Start Tracking</h1>
            <fetcher.Form className="sign-up-form" method="post">
                <div>
                    <input type="text" id="firstName" name="firstName" placeholder="first name"></input>
                </div>
                <div>
                    <input type="text" id="lastName" name="lastName" placeholder="last name"></input>
                </div>
                <div>
                    <input type="tel" id="agentPhoneNumber" name="agentPhoneNumber" placeholder="agent phone number"></input>
                </div>
                <div>
                    <input type="text" id="webexId" name="webexId" placeholder="webex id"></input>
                </div>
                <div>
                    <input type="email" id="email" name="email" placeholder="email"></input>
                </div>
                <div>
                    <input type="email" id="emailVerified" name="emailVerified" placeholder="verify email"></input>
                </div>
                <div>
                    <input type="password" id="password" name="password" placeholder="password"></input>
                </div>
                <div>
                    <input type="password" id="passwordVerified" name="passwordVerified" placeholder="verify password"></input>
                </div>
                <button type="submit" disabled={disabled}>Sign Up</button>
            </fetcher.Form>

        </div>
    )
}

