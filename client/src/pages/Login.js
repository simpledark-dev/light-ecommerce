import React from "react";

const Login = () => {
    return (
        <div>
            <form>
                <label>
                    <b> Username </b>
                </label>
                <input type="text" placeholder="Enter username" required />
                <label>
                    <b> Password </b>
                </label>
                <input type="password" placeholder="Enter password" required />
                <input type="submit" value="Login" />
            </form>
        </div>
    );
};

export default Login;
