import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AppleIcon, GoogleIcon, MicrosoftIcon } from "lucide-react";
import React from "react";

const SignIn = (): JSX.Element => {
  // Social login options data
  const socialLogins = [
    {
      name: "Google",
      icon: <GoogleIcon className="h-6 w-6" />,
    },
    {
      name: "Microsoft",
      icon: <MicrosoftIcon className="h-6 w-6" />,
    },
    {
      name: "Apple",
      icon: <AppleIcon className="h-6 w-6" />,
    },
  ];

  // Form fields data
  const formFields = [
    {
      label: "Username",
      placeholder: "Enter Your Full Name",
      type: "text",
      required: true,
    },
    {
      label: "Email",
      placeholder: "Enter Your Email Address",
      type: "email",
      required: true,
    },
    {
      label: "Password",
      placeholder: "Enter Password",
      type: "password",
      required: true,
    },
  ];

  return (
    <div className="bg-neutral-100 flex flex-row justify-center w-full">
      <div className="bg-neutral-100 overflow-hidden w-[1440px] h-[1024px] relative">
        {/* Navigation Bar */}
        <header className="absolute w-full h-[97px] top-0 left-0 bg-[#133e87]">
          <div className="absolute top-2.5 left-[9px] font-extrabold text-white text-[64px] tracking-[0] leading-normal">
            LOGO
          </div>
          <nav className="absolute top-[33px] left-[244px] flex space-x-8">
            <div className="font-medium text-white text-2xl tracking-[0] leading-normal">
              FIND JOB
            </div>
            <div className="font-medium text-white text-2xl tracking-[0] leading-normal">
              HIRE FREELANCER
            </div>
            <div className="font-medium text-white text-2xl tracking-[0] leading-normal">
              FORUM
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="absolute w-[1345px] h-[723px] top-[174px] left-[47px] bg-neutral-100 flex">
          {/* Left Section - Social Logins */}
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 pr-12">
            {socialLogins.map((login, index) => (
              <Card
                key={index}
                className="w-[445px] h-[79px] rounded-[20px] border-[1.2px] border-solid border-black cursor-pointer hover:bg-gray-50"
              >
                <CardContent className="flex items-center p-0 h-full">
                  <div className="ml-7 mr-5">{login.icon}</div>
                  <div className="font-normal text-black text-xl">
                    Continue by {login.name}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Separator */}
          <Separator orientation="vertical" className="h-[650px] mx-4" />

          {/* Right Section - Sign In Form */}
          <div className="flex-1 pl-12">
            <div className="mb-12">
              <h1 className="text-[45px] font-extrabold text-black leading-[60px]">
                Hello
              </h1>
              <p className="text-xl text-[#9c9c9c]">Welcome back!</p>
            </div>

            <form className="space-y-6">
              {formFields.map((field, index) => (
                <div key={index} className="space-y-2">
                  <label className="text-[25px] font-normal">
                    {field.label} <span className="text-[#ff0000]">*</span>
                  </label>
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="h-[59px] rounded-[20px] border-2 border-[#b6b6b6] px-8 text-xl"
                    required={field.required}
                  />
                </div>
              ))}

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="remember"
                  className="w-[30px] h-[25px] bg-[#d6d6d6] rounded-[5px]"
                />
                <label
                  htmlFor="remember"
                  className="text-xl font-normal cursor-pointer"
                >
                  Remember Me
                </label>
              </div>

              <Button
                type="submit"
                className="w-[461px] h-[60px] bg-[#0077cc] rounded-[20px] text-[35px] font-extrabold"
              >
                Sign In
              </Button>

              <div className="flex items-center pt-4">
                <p className="text-xl text-[#9c9c9c]">Dont Have an Account?</p>
                <Button
                  variant="link"
                  className="text-xl text-[#0077cc] p-0 h-auto"
                >
                  Sign Up
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SignIn;