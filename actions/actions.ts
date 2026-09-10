import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateEmail, updatePassword } from "firebase/auth";
import { redirect, type ActionFunctionArgs } from "react-router";
import { auth, db } from "../src/firebase";
import { type LoginFields, type SignUpFields, type UserUpdateFields } from "../types/authTypes.ts";
import { createUserAuth, loginUserAuth } from "../context/authContext.tsx";
import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";


export async function signUpAction({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const method = request.method.toUpperCase();

    const signUpFields = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        webexId: formData.get('webexId'),
        agentPhoneNumber: formData.get('agentPhoneNumber'),
        email: formData.get('email'),
        emailVerified: formData.get('emailVerified'),
        password: formData.get('password'),
        passwordVerified: formData.get('passwordVerified') 
    } as SignUpFields;

    const userCredential = await createUserAuth(signUpFields.email, signUpFields.password);
    if (userCredential.error != null) {
        // error will go here
        console.log('error creating user')
        return userCredential;
    }

    const uid = userCredential.data.user.uid;
    // console.log(tempUser)


    await setDoc(doc(db, "users", uid), {
        firstName: signUpFields.firstName,
        lastName: signUpFields.lastName,
        email: signUpFields.email,
        webexId: signUpFields.webexId || null,
        agentPhoneNumber: signUpFields.agentPhoneNumber,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });


    return redirect('/dashboard')

    
}

export async function loginAction({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const method = request.method.toUpperCase();

    const loginFields = {
        email: formData.get('email'),
        password: formData.get('password'),
    } as LoginFields;

    console.log('this far')
    const userCredential = await loginUserAuth(loginFields.email, loginFields.password);
    console.log(userCredential)
    if (userCredential.error) {
        return userCredential
    }



    return redirect('/dashboard');
}

export async function accountSettingsAction({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const method = request.method.toUpperCase();

    const userUpdateFields = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        webexId: formData.get('webexId'),
        agentPhoneNumber: formData.get('agentPhoneNumber'),
        email: formData.get('email'),
        password: formData.get('password'),
    } as UserUpdateFields;

    // const originalUser = formData.get('originalData')

    const user = auth.currentUser;
    const uid = user.uid;

    console.log(userUpdateFields);
    let isEmailUpdated = false;

    // update on auth
    // updating password
    if (userUpdateFields.password) {
        try {
            await updatePassword(user, userUpdateFields.password);
        } catch (error) {
            return {
                data: null,
                error: {
                    message: 'Issue updating password'
                }
            };
        }
    }

    if (userUpdateFields.email.trim() != user.email) {
        try {
            await updateEmail(user, userUpdateFields.email.trim());
            isEmailUpdated = true;
        } catch (error) {
            return {
                data: null,
                error: {
                    message: 'Issue updating email'
                }
            };
        }
    }

    // update on document (firestore)
    try {
        const userDocRef = doc(db, "users", uid);

        await updateDoc(userDocRef, {
            firstName: userUpdateFields.firstName,
            lastName: userUpdateFields.lastName,
            email: userUpdateFields.email,
            webexId: userUpdateFields.webexId || null,
            agentPhoneNumber: userUpdateFields.agentPhoneNumber,
            updatedAt: serverTimestamp()
        })

    } catch (error) {
        return {
            data: null,
            error: {
                message: isEmailUpdated ? 'Email update error. Re-submit.' : 'Issue updating user'
            }
        };
    }

    return redirect('/settings')


}


const validateSignUpForm = ({
    firstName,
    lastName,
    webexId,
    agentPhoneNumber,
    email,
    emailVerified,
    password,
    passwordVerified
}:SignUpFields): signUpValidationResponse => {
    let isInvalid: boolean = false;
    const signUpError: SignUpError = {
        firstNameError: null,
        lastNameError: null,
        webexIdError: null,
        agentPhoneNumberError: null,
        emailError: null,
        passwordError: null
    }
    
    if (!firstName) {
        isInvalid = true;
        signUpError.firstNameError = 'first name requiered';
    }

    if (!lastName) {
        isInvalid = true;
        signUpError.lastNameError = 'last name required';
    }

    // if (!webexId) {
    //     isInvalid = true;
    //     signUpError.webexIdError = "both webex id and agent phone number can't be blank";
    // }

    if (!agentPhoneNumber) {
        isInvalid = true;
        signUpError.agentPhoneNumberError = "agent phone number required";
    }

    if (!email || !emailVerified) {
        isInvalid = true;
        signUpError.emailError = "email required";
        // signUpError.emailError = "email can't be blank";
    }
    else if (email !== emailVerified) {
        isInvalid = true;
        signUpError.emailError = "email does not match";
    }

    if (!password || !passwordVerified) {
        isInvalid = true;
        signUpError.passwordError = "password required";
        // signUpError.passwordError = "password can't be left blank";
    }
    else if (password.length < 8) {
        isInvalid = true;
        signUpError.passwordError = "password too short";
    }
    else if (password !== passwordVerified) {
        isInvalid = true;
        signUpError.passwordError = "password does not match";
    }

    return {
        isInvalid: isInvalid,
        signUpError: signUpError
    } as signUpValidationResponse;


}

type signUpValidationResponse = {
    isInvalid: boolean;
    signUpError: SignUpError;
}

type SignUpError = {
    firstNameError: string | null;
    lastNameError: string | null;
    webexIdError: string | null;
    agentPhoneNumberError: string | null;
    emailError: string | null;
    passwordError: string | null;
} 