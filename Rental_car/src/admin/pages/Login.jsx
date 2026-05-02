import React, { useState, useContext } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/DB/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthContext } from "@/main";

function Login({ openRegister, closeDialog }) {
    const navigate = useNavigate();
    const { loginAsAdmin } = useContext(AuthContext);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // ── Step 1: Check admin collection first ──────────
            const adminQuery = query(
                collection(db, "admin"),
                where("email", "==", formData.email)
            );
            const adminSnap = await getDocs(adminQuery);

            if (!adminSnap.empty) {
                // Found in admin collection — verify password
                const adminData = adminSnap.docs[0].data();

                if (adminData.password !== formData.password) {
                    toast.error("Invalid email or password");
                    setLoading(false);
                    return;
                }

                // Update React state immediately so navbar re-renders
                const adminPayload = {
                    uid: adminSnap.docs[0].id,
                    email: adminData.email,
                    name: adminData.name,
                    role: "admin",
                };
                loginAsAdmin(adminPayload);

                toast.success(`Welcome, ${adminData.name}!`);
                closeDialog?.();
                navigate("/dashboard");
                return;
            }

            // ── Step 2: Regular user — Firebase Auth ──────────
            const userCred = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            toast.success("Welcome back!");
            closeDialog?.();
            navigate("/browsecars");

        } catch (err) {
            console.error(err);
            const msg =
                err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found"
                    ? "Invalid email or password"
                    : err.code === "auth/too-many-requests"
                    ? "Too many attempts. Try again later."
                    : err.code === "auth/network-request-failed"
                    ? "Network error. Check your connection."
                    : `Login failed (${err.code})`;
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2 className="text-2xl font-semibold mb-2">Login</h2>
            <p className="text-muted-foreground mb-6">Login to your account</p>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="grid gap-2">
                    <Label>Password</Label>
                    <Input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </Button>

                <Button type="button" variant="outline" className="w-full" onClick={openRegister}>
                    Register
                </Button>
            </form>
        </>
    );
}

export default Login;
