import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db, auth } from "@/DB/FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function Register({ openLogin, closeDialog }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // create Firebase Auth user
            const userCred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

            // save user profile + role in Firestore (doc id = uid)
            // role is always "user" — admins are created manually via Firebase console
            await setDoc(doc(db, "users", userCred.user.uid), {
                name: formData.name,
                email: formData.email,
                role: "user",
                createdAt: new Date().toISOString(),
            });

            toast.success("Account created! Welcome.");
            closeDialog?.();
            navigate("/browsecars");
        } catch (err) {
            console.error(err);
            if (err.code === "auth/email-already-in-use") {
                toast.error("Email already registered. Please login.");
            } else if (err.code === "auth/weak-password") {
                toast.error("Password must be at least 6 characters.");
            } else if (err.code === "auth/network-request-failed") {
                toast.error("Network error. Check your connection.");
            } else if (err.code === "auth/operation-not-allowed") {
                toast.error("Email/password sign-up is not enabled in Firebase console.");
            } else {
                toast.error(`Registration failed (${err.code})`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2 className="text-2xl font-semibold mb-2">Create Account</h2>
            <p className="text-muted-foreground mb-6">Register as User</p>

            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-2">
                    <Label>Name</Label>
                    <Input onChange={handleChange} name="name" value={formData.name} required />
                </div>

                <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input type="email" onChange={handleChange} name="email" value={formData.email} required />
                </div>

                <div className="grid gap-2">
                    <Label>Password</Label>
                    <Input type="password" onChange={handleChange} name="password" value={formData.password} required />
                </div>

                <Button className="w-full" disabled={loading}>
                    {loading ? "Creating..." : "Create Account"}
                </Button>

                <Button type="button" variant="outline" className="w-full" onClick={openLogin}>
                    Already have an account? Login
                </Button>
            </form>
        </>
    );
}

export default Register;
