import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  return (
    <div style={{display:"grid", placeItems:"center", minHeight:"50vh"}}>
      <div className="asset-card" style={{padding:24}}>
        <h2 style={{marginBottom:12}}>Sign in</h2>
        <button className="btn-primary" onClick={login}>Continue with Google</button>
      </div>
    </div>
  );
}
