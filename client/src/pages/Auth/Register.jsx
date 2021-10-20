import { useRef ,useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Register() {

    const username = useRef();
    const email = useRef();
    const password = useRef();
    const confirm_password = useRef();

    const [message, setmessage] = useState('');
    
    const handleClick = async(e)=>{
        e.preventDefault();
        if (password.current.value === confirm_password.current.value) {
            const user = {
                username:username.current.value,
                email:email.current.value,
                password:password.current.value,
                repeat_password:confirm_password.current.value,
            }
            try {
                const res = await axios.post(process.env.REACT_APP_API_URL+"auth/register",user);
                setmessage(res.data);
            } catch (error) {
                console.log(error);
                setmessage("something went wrong!");  
            }
        }else{
            setmessage("password not match!");
        }
    }

    return (
        <div className="container">
            <div className="row my-3">
                <div className="col-sm-6 offset-sm-3">
                <h3 >Register new user</h3>
                <hr />
                
                <form className="shadow p-5" style={{'borderRadius':'20px'}} onSubmit={handleClick}>
                <div>
                    <label className="form-label">Username</label>
                    <input type="text" required ref={username} className="form-control"/>
                </div>

                <div>
                    <label className="form-label">Email address</label>
                    <input type="email" required ref={email} className="form-control"/>
                </div>

                <div>
                    <label className="form-label">Password</label>
                    <input type="password" required ref={password} className="form-control"/>
                </div>

                <div>
                    <label className="form-label">Confirm Password</label>
                    <input type="password" required ref={confirm_password} className="form-control"/>
                </div>

                <input type="submit" className="btn btn-primary mt-4" value="Register"></input>
                <br />
                <div className="text-center text-primary fw-bold"><small>If already exist - 
                    <Link to="/login" className="text-danger"> Login</Link> </small></div>
                    {message===''?'':<p className="alert alert-success my-3">{message}</p>}
                </form>
                </div>
            </div>
    </div>
    )
}

export default Register;
