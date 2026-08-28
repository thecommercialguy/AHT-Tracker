import { type ActionFunctionArgs } from "react-router";
export interface SignUpFields {
    firstName: string | null | undefined;
    lastName: string | null | undefined;
    webexId: string | null | undefined;
    webexPhoneNumber: string | null | undefined;
    email: string | null | undefined;
    emailVerified: string | null | undefined;
    password: string | null | undefined;
    passwordVerified: string | null | undefined;
}
export async function signUpAction({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const method = request.method.toUpperCase();

    const signUpFields = {
        firstName: formData.get('firstName') || null,
        lastName: formData.get('lastName') || null,
        webexId: formData.get('webexId') || null,
        agentPhoneNumber: formData.get('agentPhoneNumber') || null,
        email: formData.get('email') || null,
        emailVerified: formData.get('emailVerified') || null,
        password: formData.get('password') | null,
        passwordVerified: formData.get('passwordVerified') || null
    } as SignUpFields;

    cosnt { isInvalid, signUpError } = validateSignUpForm(signUpFields);

    
    




}

const validateSignUpForm = ({
    firstName,
    lastName,
    webexId,
    webexPhoneNumber,
    email,
    emailVerified,
    password,
    passwordVerified
}:SignUpFields) => {
    isInvalid: boolean = false;
    const signUpErrorResponse: SignUpError = {
        firstNameError: null,
        lastNameError: null,
        webexIdError: null,
        webexPhoneNumberError: null,
        emailError: null,
        passwordError: null
    }
    
    if (!firstName) {
        isInvalid = true;
        signUpError.firstNameError = 'First name requiered';
    }
    if (!lastName) {
        isInvalid = true;
        signUpError.lastNameError = 'Last name required';
    }
    if (!webexId && !agentPhoneNumber) {
        isInvalid = true;
        signUpError.webexIdError = "BOTH webex id and agent phone number can't be blank";
        signUpError.webexPhoneNumberError = "BOTH webex id and agent phone number can't be blank";
    }

    if (!email || !emailVerified) {
        isInvalid = true;
        signUpError.emailError = "email can't be blank";
    }
    else if (email !== emailVerified) {
        isInvalid = true;
        signUpError.emailError = "email does not match";
    }

    if (!password || !passwordVerified) {
        isInvalid = true;
        signUpError.passwordError = "password can't be left blank";
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
        signUpError: signUpErrorResponse
    } as signUpErrorResponse;


}

type signUpErrorResponse = {
    isInvalid: boolean;
    signUpError: SignUpError;
}

type SignUpError = {
    firstNameError: string | null;
    lastNameError: string | null;
    webexIdError: string | null;
    webexPhoneNumberError: string | null;
    emailError: string | null;
    passwordError: string | null;
} 