import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Register({ openLogin }) {

    return (
        <>

            <h2 className="text-2xl font-semibold mb-2">
                Create Account
            </h2>

            <p className="text-muted-foreground mb-6">
                Register as User or Admin
            </p>


            <form className="space-y-5">

                <div className="grid gap-2">
                    <Label>Name</Label>
                    <Input />
                </div>

                <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input type="email" />
                </div>

                <div className="grid gap-2">
                    <Label>Password</Label>
                    <Input type="password" />
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