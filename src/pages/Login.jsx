import { Button, TextInput, Card } from "flowbite-react";

export default function Login() {
  return (
    <div className="h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-96">
        <h1 className="text-2xl font-bold text-center">LMS Login</h1>
        <TextInput id="email" type="email" placeholder="Email" required />
        <TextInput id="password" type="password" placeholder="Password" required />
        <Button gradientDuoTone="purpleToBlue" className="w-full">
          Login
        </Button>
      </Card>
    </div>
  );
}