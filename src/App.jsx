import { useState, useEffect } from "react";
import "./App.css";

function App() {

const TEAM_PASSWORD = "Bluetik123";

const [authenticated, setAuthenticated] = useState(false);
const [password, setPassword] = useState("");
const [messages, setMessages] = useState([]);
const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);

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

const sendMessage = async () => {

if (!input) return;

const userMessage = { role: "user", content: input };

setMessages([...messages, userMessage]);
setInput("");
setLoading(true);

try {

const response = await fetch("/api/generate", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
prompt: input
})
});

const data = await response.json();

const aiMessage = {
role: "assistant",
content: data.response || "No response"
};

setMessages(prev => [...prev, aiMessage]);

} catch (error) {

const aiMessage = {
role: "assistant",
content: "AI server not connected."
};

setMessages(prev => [...prev, aiMessage]);

}

setLoading(false);

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

<div className="app-container">

<div className="header">

<h2>Strategy AI</h2>

<button className="logout-btn" onClick={logout}>
Logout
</button>

</div>

<div className="chat-container">

{messages.map((msg,index)=>(
<div key={index} className={`message ${msg.role}`}>
{msg.content}
</div>
))}

{loading && <div className="message assistant">Generating strategy...</div>}

</div>

<div className="input-area">

<input
value={input}
onChange={(e)=>setInput(e.target.value)}
placeholder="Ask for a marketing strategy..."
/>

<button onClick={sendMessage}>
Send
</button>

</div>

</div>

);

}

export default App;
