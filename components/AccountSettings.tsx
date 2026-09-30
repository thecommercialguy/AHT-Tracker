import { Link, redirect, useFetcher, useLoaderData, useNavigate } from "react-router";
import { auth, db } from "../src/firebase";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import type { UserData, UserUpdateFields } from "../types/authTypes";
import type { accountSettingsAction } from "../actions/actions";
import { useForm, type SubmitHandler } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { getAuth, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useAuth } from "../context/authContext";
import { validateAgentPhoneNumber, validateAgentPhoneNumberUpdate, validateWebexId, validateWebexIdUpdate } from "../helpers/formHelpers";
import { X } from "lucide-react";


export async function AccountSettingLoader() {
    await auth.authStateReady();
    const uid = auth.currentUser?.uid;
    if (!uid) return redirect('/login');

    try {
        const snap = await getDoc(doc(db, "users", uid));

        return snap.data() as UserData;

    } catch (error) {
        console.log(error)
    }


} 

export default function AccountSettings() {
    const data = useLoaderData();
    const fetcher = useFetcher<typeof accountSettingsAction>();
    const { user, initializing } = useAuth();
    const [isModalActive, setIsModalActive] = useState<boolean>(false);
    const [isVerifyUpdateModalActive, setIsVerifyUpdateModalActive] = useState<boolean>(false);
    const [isVerifyDeleteModalActive, setIsVerifyDeleteModalActive] = useState<boolean>(false);
    const [passwordVerified, setPasswordVerified] = useState<string>("");
    const [verifyUpdateError, setVerifyUpdateError] = useState<string>("");
    const [verifyDeleteError, setVerifyDeleteError] = useState<string>("");

    const navigate = useNavigate();
    const {
        register, 
        handleSubmit, 
        formState: { errors }
    } = useForm<UserUpdateFields>();

   const verifyUser = async () => {
        try {
            const credential = EmailAuthProvider.credential(user.email, passwordVerified);
            await reauthenticateWithCredential(user, credential);
            console.log('ssllsl')
            return true;
        } catch (error) {
            if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
                setVerifyUpdateError("Invalid credentials.")
            } else {
                console.error(error);
                setVerifyUpdateError("Something went wrong.")
            }
            return false;
        }
    }

    const onSubmit: SubmitHandler<UserUpdateFields> = async (formData) => {
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
            console.log('alal')
            return;
        }
        
        const isVerified  = await verifyUser();
        console.log('isVer', isVerified)
        if (!isVerified) return;

        // fetcher.submit({...formData}, {method: "POST", action: '/settings'})
        return;
    }

    console.log(passwordVerified)
    console.log(isVerifyUpdateModalActive)
    
    const toggleModal = () => {
        setIsModalActive(!isModalActive)
    }

    const toggleVerifyUpdateModal = () => {
        setIsVerifyUpdateModalActive(!isModalActive)
    }

    const dismissUpdateModal = () => {
        setVerifyUpdateError("");
        setPasswordVerified("");
        setIsVerifyUpdateModalActive(false);
    }
    const dismissDeleteModal = () => {
        setVerifyUpdateError("");
        setPasswordVerified("");
        setIsVerifyDeleteModalActive(false);
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

    

    const deleteHandler = async () => {
        const isVerified = verifyUser();
        if (!isVerified) return;
        return
        try {
            const userDocRef = doc(db, "users", user.uid);
            await deleteDoc(userDocRef)

        } catch (error) {
            
            return;
        // firebase auth deletion logic
        }
        try {
            await deleteUser(user);
            // account deleted
            navigate("home");
        } catch (error) {

            return;
        }
    }




    // snackbar context

    
    

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
                                required: false,
                                validate: async (v, f) => {
                                    if (!v) return true;
                                    try {
                                        const token = await user.getIdToken();
                                        const isValid = await validateWebexIdUpdate(v, token);
                                        return isValid || 'webex id not found'
                                    } catch (e) {
                                        return e.message
                                    }
                                }
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
                                },
                                validate: async (v, f) => {
                                    try {
                                        const token = await user.getIdToken();
                                        const isValid = await validateAgentPhoneNumberUpdate(v, token);
                                        return isValid || 'agent phone number not found'
                                    } catch (e) {
                                        return e.message
                                    }
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
                    <motion.button 
                    className="submit" 
                    type="button"
                    onClick={() => setIsVerifyUpdateModalActive(true)}
                    whileHover={{
                        opacity: .8,
                    }}
                    whileTap={{
                        scale: .95
                    }}
                    transition={{
                        scale: { duration: .15, ease: 'easeIn'},
                        borderRadius: { duration: .15 }
                    }}>Save changes</motion.button>
                    <motion.button 
                    type="button"
                    style={{
                        top: "50%",
                    }}
                    onClick={() => setIsVerifyDeleteModalActive(true)} 
                        whileHover={{
                    opacity: .8,
                    }}
                    whileTap={{
                        scale: .95,
                        transform: "translateY(-50%)"
                    }}
                    transition={{
                        scale: { duration: .15, ease: 'easeIn'},
                        borderRadius: { duration: .15 }
                    }}
                    className="delete">delete account?</motion.button>
                </div>
            </form>

            <AnimatePresence>
                {   
                    isVerifyDeleteModalActive &&
                    <motion.div 
                        
                        className="backdrop-container"
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
                            onClick={() => dismissDeleteModal()}
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
                        ></motion.div>
                        <motion.div 
                            className="verify-modal"
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
                            <div className="verify-modal-header">
                                <span>Delete Account</span>
                                <span className="sub">Enter password to delete account</span>
                                <motion.button
                                    className="dismiss"
                                    onClick={() => dismissDeleteModal()}
                                    whileHover={{
                                        opacity: .65
                                    }}
                                    whileTap={{
                                        scale: .95
                                    }}
                                    transition={{
                                        opacity: { duration: .15, ease: 'easeIn'},
                                        scale: { duration: .15, ease: 'easeIn'}
                                    }}
                                >
                                    <X color="white"/>
                                </motion.button>
                            </div>
                            {verifyUpdateError && <p>{verifyUpdateError}</p>}
                            <input
                                type="password" 
                                id="passwordVerified" 
                                name="passwordVerified"
                                onChange={(e) => setPasswordVerified(e.target.value)}
                                className={verifyUpdateError ? 'input-error' : ''} 
                                autoComplete="current-password"
                            />
                            <motion.button 
                                type="button"
                                className="button"
                                onClick={() => deleteHandler()}
                                whileHover={{
                                    opacity: .8,
                                }}
                                whileTap={{
                                    scale: .95
                                }}
                                transition={{
                                    scale: { duration: .15, ease: 'easeIn'},
                                    borderRadius: { duration: .15 }
                                }}
                                disabled={!passwordVerified}
                            >Save changes</motion.button>
                            

                        </motion.div>
                    </motion.div>

                }
            </AnimatePresence>
            <AnimatePresence>
                {   
                    isVerifyUpdateModalActive &&
                    <motion.div 
                        
                        className="backdrop-container"
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
                            onClick={() => dismissUpdateModal()}
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
                        ></motion.div>
                        <motion.div 
                            className="verify-modal"
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
                            <div className="verify-modal-header">
                                <span>Verify changes</span>
                                <span className="sub">Enter password to verify changes</span>
                                <motion.button
                                    className="dismiss"
                                    onClick={() => dismissUpdateModal()}
                                    whileHover={{
                                        opacity: .65
                                    }}
                                    whileTap={{
                                        scale: .95
                                    }}
                                    transition={{
                                        opacity: { duration: .15, ease: 'easeIn'},
                                        scale: { duration: .15, ease: 'easeIn'}
                                    }}
                                >
                                    <X color="white"/>
                                </motion.button>
                            </div>
                            {verifyUpdateError && <p>{verifyUpdateError}</p>}
                            <input
                                type="password" 
                                id="passwordVerified" 
                                name="passwordVerified"
                                onChange={(e) => setPasswordVerified(e.target.value)}
                                className={verifyUpdateError ? 'input-error' : ''} 
                                autoComplete="current-password"
                            />
                            <motion.button 
                                type="button"
                                className="button"
                                onClick={() => handleSubmit(onSubmit)}
                                whileHover={{
                                    opacity: .8,
                                }}
                                whileTap={{
                                    scale: .95
                                }}
                                transition={{
                                    scale: { duration: .15, ease: 'easeIn'},
                                    borderRadius: { duration: .15 }
                                }}
                                disabled={!passwordVerified}
                            >Save changes</motion.button>
                            

                        </motion.div>
                    </motion.div>

                }
            </AnimatePresence>
        </div>
    )
}



