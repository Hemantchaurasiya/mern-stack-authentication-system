import axios from "axios";
import { useRef,useState } from "react";

function ResetPasswordEmail() {
    const email = useRef();
    const [message, setmessage] = useState('');

    const handleClick = async(e)=>{
        const user={
            email:email.current.value,
        }
        e.preventDefault();
        try {
            const res = await axios.post(process.env.REACT_APP_API_URL+"auth/send-email-reset-password",user);
            setmessage(res.data);
        } catch (error) {
            console.log(error);
            setmessage(error);
        }
    }
    return (
        <div className="container">
            <div className="row my-3">
                <div className="col-sm-6 offset-sm-3">
                <h3 >User Login</h3>
                <hr />
                
                <form className="shadow p-5" style={{'borderRadius':'20px'}} onSubmit={handleClick}>
                
                <div>
                    <label className="form-label">Email address</label>
                    <input type="email" required ref={email} className="form-control"/>
                </div>
                <input type="submit" className="btn btn-primary mt-4" value="Submit"></input>
                <br />
                {message===''?'':<p className="alert alert-success my-3">{message}</p>}
                </form>
                </div>
            </div>
    </div>
    )
}

export default ResetPasswordEmail;