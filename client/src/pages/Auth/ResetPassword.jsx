import { useRef,useState } from 'react';
import axios from "axios";

function ResetPassword() {
    const password = useRef();
    const confirm_password = useRef();
    const [message, setmessage] = useState('');

    const handleClick = async(e)=>{
        e.preventDefault();
        const user = {
            password:password.current.value,
            repeat_password:confirm_password.current.value,
        }
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
            console.log(token);
            const res = await axios.post(process.env.REACT_APP_API_URL+`auth/get-reset-password?token=${token}`,user);
            setmessage(res.data);
        } catch (error) {
            console.log(error);
            setmessage("something went wrong!");
        }
    }
    return (
        <div className="container">
            <div className="row my-3">
                <div className="col-sm-6 offset-sm-3">
                <h3 >Reset Password</h3>
                <hr />
                
                <form className="shadow p-5" style={{'borderRadius':'20px'}} onSubmit={handleClick}>
                
                <div>
                    <label className="form-label">Password</label>
                    <input type="password" required ref={password} className="form-control"/>
                </div>

                <div>
                    <label className="form-label">Confirm Password</label>
                    <input type="password" required ref={confirm_password} className="form-control"/>
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

export default ResetPassword;