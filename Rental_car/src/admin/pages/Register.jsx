import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/DB/FirebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";

function Register({ openLogin }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",

    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        await addDoc(collection(db, "users"), formData);
        // close popup after submit
        setOpen(false);
    };


    return (
        <>

            <h2 className="text-2xl font-semibold mb-2">
                Create Account
            </h2>

            <p className="text-muted-foreground mb-6">
                Register as User
            </p>


            <form className="space-y-5" onSubmit={handleSubmit}>

                <div className="grid gap-2">
                    <Label>Name</Label>
                    <Input onChange={handleChange} name="name" value={formData.name} />
                </div>

                <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input type="email" onChange={handleChange} name="email" value={formData.email} />
                </div>

                <div className="grid gap-2">
                    <Label>Password</Label>
                    <Input type="password" onChange={handleChange} name="password" value={formData.password} />
                </div>

                <Button className="w-full">
                    Create Account
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={openLogin}
                >
                    Already have an account? Login
                </Button>

            </form>

        </>
    );
}

export default Register;