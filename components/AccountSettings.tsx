

export function AccountSettingLoader() {} 

export default function AccountSettings() {
    // const fetcher = useFetcher<typeof signUpAction>();
    // const navigate = useNavigate();
    // const {
    //     register, 
    //     handleSubmit, 
    //     formState: { errors }
    // } = useForm<SignUpFields>();

    // const onSubmit: SubmitHandler<SignUpFields> = (data) => {
    //     fetcher.submit({...data}, {method: "POST", action: '/signup'})
    // }
    
    

    return (
        <div className="account-settings">
            <h1 className="account-settings-header">Account Settings</h1>
            <form className="account-settings-form">
                <div className="input-container">
                    <label>first name</label>
                    <input
                        type="text"
                        id="firstName"

                    />
                </div>
                <div className="input-container">
                    <label>last name</label>
                    <input 
                        type="text" 
                        id="lastName" 
                        name="lastName" 

                    />
                </div>
                <div className="input-container">
                    <label>email</label>
                    <input
                        type="text" 
                        id="email" 
                        name="email" 

                    />
                </div>
                <div className="input-container">
                    <label>webex id</label>
                    <input
                        type="text" 
                        id="webexId" 
                        name="webexId"

                    />
                </div>
                <div className="input-container">
                    <label>webex phone number</label>
                    <input
                        type="tel" 
                        id="agentPhoneNumber" 
                        name="agentPhoneNumber"

                    />
                </div>
                <div className="input-container">
                    <label>password</label>
                    <input
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder="•••••••••••"

                    />
                </div>
                <div className="submit-container">
                    <button type="submit">Save changes</button>
                    <a>delete account?</a>
                </div>
            </form>
        </div>
    )
}