import { useRef,useState} from 'react';
import axios from 'axios';
import { setAuth } from '../../store/authSlice';
import { useDispatch } from 'react-redux';
import {Link,useHistory} from "react-router-dom";

function Login() {
    const email = useRef();
    const password = useRef();
    const [message, setmessage] = useState('');
    const dispatch = useDispatch();
    const history = useHistory();

    const handleClick = async(e)=>{
        e.preventDefault();
        const user = {
            email:email.current.value,
            password:password.current.value,
        }
        try {
            const {data} = await axios.post(process.env.REACT_APP_API_URL+"auth/login",user);
            const access_token = data.access_token;
            const refresh_token = data.refresh_token;
            const userData = data.userData;
            dispatch(setAuth({user:userData}));
            localStorage.setItem("user", JSON.stringify({userData,access_token,refresh_token}));
            history.push('/');
        } catch (error) {
            console.log(error);
            setmessage("something went wrong!");
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

                <div>
                    <label className="form-label">Password</label>
                    <input type="password" required ref={password} className="form-control"/>
                </div>

                <small><Link to="/reset-password-link">Forgot Password ?</Link></small><br />
                <input type="submit" className="btn btn-primary mt-4" value="Login"></input>
                <br />
                <div className="text-center text-primary fw-bold"><small>New to TripAdvisor ? 
                    <Link to="/register" className="text-danger">Create an Account</Link> </small></div>
                    {message===''?'':<p className="alert alert-success my-3">{message}</p>}
                </form>
                </div>
            </div>
    </div>
    )
}

export default Login;
