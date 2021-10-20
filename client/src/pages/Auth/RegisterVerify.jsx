import React,{useState,useEffect} from 'react';
import axios from 'axios';

function RegisterVerify() {
    const [message, setmessage] = useState('wait few second...');

    useEffect(() => {
        const registerVerify = async()=>{
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const token = urlParams.get('token');
                const {data} = await axios.get(process.env.REACT_APP_API_URL+`auth/verify-email?token=${token}`);
                setmessage(data);
            } catch (error) {
                console.log(error);
                setmessage(error);
            }
        }
        registerVerify();
    },[]);
    
    return (
        <div className="container">
            <div className="row my-3">
                <div className="col-sm-6 offset-sm-3">
                    <h3>{message}</h3>
                </div>
            </div>
        </div>
    )
}

export default RegisterVerify;
