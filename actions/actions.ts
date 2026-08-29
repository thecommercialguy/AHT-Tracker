import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { type ActionFunctionArgs } from "react-router";
import { auth } from "../src/firebase";
import { type SignUpFields } from "../types/authTypes.ts";


export async function signUpAction({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const method = request.method.toUpperCase();

    const signUpFields = {
        firstName: formData.get('firstNam'),
        lastName: formData.get('lastName') ,
        webexId: formData.get('webexId') ,
        agentPhoneNumber: formData.get('agentPhoneNumber') ,
        email: formData.get('email') || null,
        emailVerified: formData.get('emailVerified') ,
        password: formData.get('password'),
        passwordVerified: formData.get('passwordVerified') 
    } as SignUpFields;

    const { isInvalid, signUpError } = validateSignUpForm(signUpFields);

    if (isInvalid){
        return {error: signUpError};
    }

    const response = await createUserWithEmailAndPassword(auth, signUpFields.email, signUpFields.password);



}

export async function loginAction({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const method = request.method.toUpperCase();

    console.log(formData.get('firstName'));


    const response = await signInWithEmailAndPassword(auth, email, password)

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