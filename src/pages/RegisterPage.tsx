import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { register } from "@/http/Api"
import { cn } from "@/lib/utils"
import useTokenStore from "@/store"

import { useMutation } from "@tanstack/react-query"
import { LoaderCircle } from "lucide-react"
import { useRef } from "react"

import { Link, useNavigate } from "react-router-dom"

const RegisterPage = () => {
  const setToken = useTokenStore((state) => state.setToken);

  const navigate = useNavigate();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Mutations
  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (response) => {
      console.log("Login successful");
      setToken(response.data.accessToken)
      // redirect to dashboard
      navigate("/dashboard/home");
    },
  });

  const handleRegisterSubmit = () => {
    const email = emailRef.current?.value;
    const name = nameRef.current?.value;
    const password = passwordRef.current?.value;
    console.log("data", { email, password });

    if (!email || !name || !password) {
      return alert("Please enter email and password");
    }
    // use mutation :- for sending data from client to server
    mutation.mutate({ name, email, password });

    // make server call
  };

  return (
    <div className="flex justify-center items-center h-screen">
        <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
          {mutation.isError && <span className="text-red-500 text-sm">{mutation.error.message}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">

            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input ref={nameRef} id="name" placeholder="Max" required />
            </div>
            
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              ref={emailRef}
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input ref={passwordRef} id="password" type="password" />
          </div>
          <Button
              onClick={handleRegisterSubmit}
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending && (
                <LoaderCircle
                  className={cn(mutation.isPending ? "animate-spin" : "")}
                />
              )}
              <span className="ms-2">Create an account</span>
            </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to={'/auth/login'} className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}

export default RegisterPage