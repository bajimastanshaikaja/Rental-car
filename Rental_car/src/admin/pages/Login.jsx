import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

function Login({ openRegister }) {

    const [formData, setFormData] = useState({
        role: "user",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(formData);
    };

    return (
        <>

            <h2 className="text-2xl font-semibold mb-2">
                Login
            </h2>

            <p className="text-muted-foreground mb-6">
                Login as User or Admin
            </p>

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                <div className="grid gap-2">
                    <Label>Account Type</Label>

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full border rounded-md p-3"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>

                </div>

                <div className="grid gap-2">
                    <Label>Email</Label>

                    <Input
                        name="email"
                        type="email"
                        onChange={handleChange}
                    />

                </div>

                <div className="grid gap-2">
                    <Label>Password</Label>

                    <Input
                        name="password"
                        type="password"
                        onChange={handleChange}
                    />

                </div>

                <Button
                    type="submit"
                    className="w-full"
                >
                    Login
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={openRegister}
                >
                    Register
                </Button>

            </form>

        </>
    );
}

export default Login;