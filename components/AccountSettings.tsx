import { Link, redirect, useFetcher, useLoaderData, useNavigate } from "react-router";
import { auth, db } from "../src/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { UserData, UserUpdate, UserUpdateFields } from "../types/authTypes";
import type { accountSettingsAction } from "../actions/actions";
import { useForm, type SubmitHandler } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";


export async function AccountSettingLoader() {
    await auth.authStateReady();
    const uid = auth.currentUser?.uid;
    console.log(':::::::::')
    if (!uid) return redirect('/login');

    try {
        const snap = await getDoc(doc(db, "users", uid));
        // console.log(snap.data())

        return snap.data() as UserData;

    } catch (error) {
        console.log(error)
    }

    // console.log(snap)

} 

export default function AccountSettings() {
    const data = useLoaderData();
    // console.log(data)
    const fetcher = useFetcher<typeof accountSettingsAction>();
    const [isModalActive, setIsModalActive] = useState<boolean>(false);
    const navigate = useNavigate();
    const {
        register, 
        handleSubmit, 
        formState: { errors }
    } = useForm<UserUpdateFields>();

    const onSubmit: SubmitHandler<UserUpdateFields> = (formData) => {
        const toDiff = {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            webexId: formData.webexId.trim(),
            agentPhoneNumber: formData.agentPhoneNumber.trim(),
            email: formData.email.trim(),
        }

        const original = {
            firstName: data.firstName.trim(),
            lastName: data.lastName.trim(),
            webexId: data.webexId.trim(),
            agentPhoneNumber: data.agentPhoneNumber.trim(),
            email: data.email.trim(),
        }

        if (
            toDiff.firstName == original.firstName &&
            toDiff.lastName == original.lastName &&
            toDiff.webexId == original.webexId &&
            toDiff.agentPhoneNumber == original.agentPhoneNumber &&
            toDiff.email == original.email &&
            !formData.password
        ) {
            console.log('No submit')
            return;
        }
        
        fetcher.submit({...formData}, {method: "POST", action: '/settings'})
    }
    
    const toggleModal = () => {
        setIsModalActive(!isModalActive)
    }


    useEffect(() => {
        if (isModalActive) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = ''; // cleanup on unmount
        };
    }, [isModalActive]);
    // fetcher.submit({...formData, originalData: {...data}}, {method: "POST", action: '/settings'})

    
    

    return (
        <div className="account-settings">
            <h1 className="account-settings-header">Account Settings</h1>
            {fetcher.data?.error && <div className="error sign-in">
                <span>{fetcher.data?.error.message}</span>
            </div>}
            <form className="account-settings-form" method="POST" noValidate onSubmit={handleSubmit(onSubmit)}>
                <div className="input-container">
                    <label>first name</label>
                    <input
                        type="text"
                        id="firstName"
                        defaultValue={data?.firstName}
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
                </div>
                <div className="input-container">
                    <label>last name</label>
                    <input 
                        type="text" 
                        id="lastName" 
                        name="lastName" 
                        defaultValue={data?.lastName}
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
                </div>
                <div className="input-container">
                    <label>email</label>
                    <input
                        type="text" 
                        id="email" 
                        name="email" 
                        defaultValue={data?.email}
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
                </div>
                <div className="input-container">
                    <label>webex id</label>
                    <input
                        type="text" 
                        id="webexId" 
                        name="webexId"
                        defaultValue={data?.webexId}
                        {...register(
                            "webexId", 
                            { 
                                required: false
                            }

                        )} 
                    />
                </div>
                <div className="input-container">
                    <label style={{lineHeight: 1}}>webex phone number</label>
                    <input
                        type="tel" 
                        id="agentPhoneNumber" 
                        name="agentPhoneNumber"
                        defaultValue={data?.agentPhoneNumber}
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
                </div>
                <div className="input-container">
                    <label>password</label>
                    <input
                        style={{fontSize: '1.0625rem'}}
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder="•••••••••••"
                        {...register(
                            "password", 
                            { 
                                validate: (v, f) =>{ 
                                    if (v.length < 1) return true;
                                    return v.length < 8;
                                }
                            }

                        )}
                    />
                </div>
                <div className="submit-container">
                    <button className="submit" type="submit">Save changes</button>
                    <button onClick={toggleModal} className="delete">delete account?</button>
                </div>
            </form>
            <AnimatePresence>
                {   
                    isModalActive &&
                    <motion.div 
                        onClick={toggleModal}
                        className="backdrop"
                        style={{ transformOrigin: "center"}}
                        initial={{
                            opacity: 0
                        }}
                        animate={{
                            opacity: 1
                        }}
                        exit={{
                            opacity: 0
                        }}
                    >
                        <motion.div 
                            className="delete-modal"
                            initial={{
                                scale: 0
                            }}
                            animate={{
                                scale: 1
                            }}
                            exit={{
                                scale: 0
                            }}
                        >
                            <span>Deactivate account?</span>

                        </motion.div>
                    </motion.div>

                }
            </AnimatePresence>
        </div>
    )
}