import { BrowserRouter as Router,Switch,Route} from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import ChangePassword from "./pages/Auth/ChangePassword";
import ResetPasswordEmail from "./pages/Auth/ResetPasswordEmail";
import ResetPassword from "./pages/Auth/ResetPassword";
import RegisterVerify from "./pages/Auth/RegisterVerify";
import Navbar from "./components/Navbar";

function App() {
  return(
    <>
      <Router>
        <Navbar/>
        <Switch>
        <Route path="/register"> <Register/> </Route>

        <Route path="/register-verification"> <RegisterVerify/> </Route>

        <Route path="/login"> <Login/> </Route>

        <Route path="/change-password"> <ChangePassword/> </Route>

        <Route path="/reset-password-email"> <ResetPasswordEmail/> </Route>

        <Route path="/reset-password-link"> <ResetPassword/> </Route>

        <Route exact path="/"> <Home/> </Route>

        </Switch>
      </Router>
    </>
  )
}

export default App;