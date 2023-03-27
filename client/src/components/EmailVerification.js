import { useParams } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { useEffect,useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import {VERIFY_EMAIL} from '../utils/mutations';
import { Link } from "react-router-dom";

 export default function EmailVerification() {
    let { email } = useParams();
    let { token } = useParams();
    const [isValidToken, setIsValidToken] = useState(false);
    const [verifyEmail] = useMutation(VERIFY_EMAIL);
    async function verifyEmailToken(email,token) {
       const {data} = await verifyEmail({
        variables: 
        { email, token }
    });
    if (!data) {
        return toast.error("Email verification failed");
      } else  {
        toast.success("Email verified");
        return setIsValidToken(true);
      }
    }
    useEffect(() => {
        verifyEmailToken(email, token);
    });

    return (
        <div> 
            { isValidToken ?
            <div>
            Email has been verified
            <Link to="/" ></Link>
            </div>
            : 
            <div>
                could not verify email
            </div>
            }
        </div>
    )
    
}


 