import { useRef ,useState} from 'react';
import { useSelector} from 'react-redux';
import apiInstance from '../../http';

function ChangePassword() {
    const old_password = useRef();
    const password = useRef();
    const confirm_password = useRef();

    const [message, setmessage] = useState('');

    const {user} = useSelector((state) => state.auth);
    
    const handleClick = async(e)=>{
        e.preventDefault();
        const userData = {
            old_password:old_password.current.value,
            new_password:password.current.value,
            confirm_new_password:confirm_password.current.value
        }
        try {
            const res = await apiInstance.post(`auth/change-password/${user._id}`,userData);
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
                <h3 >Change Password</h3>
                <hr />
                
                <form className="shadow p-5" style={{'borderRadius':'20px'}} onSubmit={handleClick}>
                
                <div>
                    <label className="form-label">Old Password</label>
                    <input type="password" required ref={old_password} className="form-control"/>
                </div>


                <div>
                    <label className="form-label">New Password</label>
                    <input type="password" required ref={password} className="form-control"/>
                </div>

                <div>
                    <label className="form-label">Confirm New Password</label>
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

export default ChangePassword;
