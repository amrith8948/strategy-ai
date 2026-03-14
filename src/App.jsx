import { useState, useEffect } from "react";
import "./App.css";

function App() {

const TEAM_PASSWORD = "Bluetik123";

const [authenticated, setAuthenticated] = useState(false);
const [password, setPassword] = useState("");

useEffect(() => {
const auth = localStorage.getItem("team_auth");
if (auth === "true") {
setAuthenticated(true);
}
}, []);

const handleLogin = () => {
if (password === TEAM_PASSWORD) {
localStorage.setItem("team_auth", "true");
setAuthenticated(true);
} else {
alert("Wrong password");
}
};

const logout = () => {
localStorage.removeItem("team_auth");
location.reload();
};

if (!authenticated) {
return (
<div className="login-container">
<div className="login-card">

<h1>Strategy AI</h1>
<p>Team Access</p>

<input
type="password"
placeholder="Enter team password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button onClick={handleLogin}>
Access Dashboard
</button>

</div>
</div>
);
}

return (

<div className="dashboard">

<header className="dashboard-header">

<h2>Strategy AI Dashboard</h2>

<button className="logout-btn" onClick={logout}>
Logout
</button>

</header>

<div className="dashboard-content">

<div className="card">

<h3>Generate Marketing Strategy</h3>

<p>
Enter details about the business and generate a full marketing strategy.
</p>

<button className="primary-btn">
Generate Strategy
</button>

</div>

<div className="card">

<h3>Content Kit Generator</h3>

<p>
Create social media posts, captions, and campaign ideas instantly.
</p>

<button className="primary-btn">
Generate Content Kit
</button>

</div>

<div className="card">

<h3>Campaign Ideas</h3>

<p>
Generate creative campaign ideas tailored for your audience.
</p>

<button className="primary-btn">
Generate Campaign
</button>

</div>

</div>

</div>

);

}

export default App;
