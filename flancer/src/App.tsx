import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  Cube3D,
  FileText,
  LayoutDashboard,
  Lightbulb,
  MessageSquare,
} from "lucide-react";
import React from "react";

export default function MainPage() {
  // Navigation menu items
  const navItems = [
    { label: "FIND JOB", href: "#" },
    { label: "HIRE FREELANCER", href: "#" },
    { label: "FORUM", href: "#" },
  ];

  // Why Flancer benefits
  const benefits = [
    {
      title: "Beginner-Friendly",
      description: "Tailored for entry-level freelancers.",
      image: "/image.png",
    },
    {
      title: "Easy Job Matching",
      description: "Connect with clients effortlessly",
      image: "/image-2.png",
    },
    {
      title: "Secure Payments",
      description: "Get paid safely and on time",
      image: "/image-4.png",
    },
    {
      title: "Growth & Community",
      description: "Learn, network, and gain experience.",
      image: "/image-3.png",
    },
  ];

  // Job categories
  const jobCategories = [
    {
      title: "Web Developer",
      icon: (
        <div className="w-[51px] h-[51px] flex items-center justify-center">
          <img src="" alt="Web Developer" />
        </div>
      ),
    },
    { title: "3D Artist", icon: <Cube3D className="w-[55px] h-[55px]" /> },
    {
      title: "UI/UX Designer",
      icon: <LayoutDashboard className="w-[58px] h-[58px]" />,
    },
    { title: "Content Writer", icon: <FileText className="w-12 h-12" /> },
    {
      title: "Digital Marketer",
      icon: <MessageSquare className="w-[54px] h-[54px]" />,
    },
  ];

  // Freelance tips
  const freelanceTips = [
    {
      tip: "Create a Standout Profile",
      icon: <img src="" alt="Profile icon" className="w-11 h-11" />,
    },
    { tip: "Apply Smartly", icon: <Lightbulb className="w-11 h-11" /> },
    {
      tip: "Be Professional",
      icon: (
        <img src="" alt="Professional icon" className="w-[33px] h-[26px]" />
      ),
    },
  ];

  // Forum benefits
  const forumBenefits = [
    {
      benefit: "Discover New Job Opportunities",
      icon: (
        <img
          src=""
          alt="Job opportunities icon"
          className="w-[45px] h-[45px]"
        />
      ),
    },
    {
      benefit: "Boost Your Skills",
      icon: <img src="" alt="Skills icon" className="w-12 h-12" />,
    },
    {
      benefit: "Exclusive Freelance Hacks",
      icon: <Briefcase className="w-12 h-12" />,
    },
  ];

  // Footer links
  const footerLinks = {
    freelancer: ["Freelance Tips & Tricks", "Find Projects", "Create Profiles"],
    clients: ["Post a Job", "Find Freelancers"],
  };

  return (
    <div className="bg-neutral-100 flex flex-row justify-center w-full">
      <div className="bg-neutral-100 w-full max-w-[1440px] relative">
        {/* Navigation Bar */}
        <header className="w-full h-[97px] bg-[#133e87] flex items-center justify-between px-9">
          <div className="flex items-center gap-16">
            <h1 className="font-extrabold text-white text-[64px] tracking-[0]">
              LOGO
            </h1>
            <nav className="flex gap-10">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="font-medium text-white text-2xl tracking-[0]"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
          <Button className="h-14 w-[188px] bg-[#cbdceb] rounded-[50px] text-black hover:bg-[#b9cfe5]">
            <span className="font-bold text-xl">SIGN IN</span>
          </Button>
        </header>

        {/* Hero Section */}
        <section
          className="w-full h-[793px] bg-cover bg-center relative"
          style={{ backgroundImage: "url(/image.svg)" }}
        >
          <div className="absolute top-[268px] left-[68px] max-w-[565px]">
            <h2 className="font-bold text-white text-5xl tracking-[0] leading-normal mb-8">
              Kickstart Your Freelance <br />
              Journey with Flancer!
            </h2>
            <p className="font-medium text-white text-xl tracking-[0] mb-10">
              A platform dedicated to helping beginner freelancers connect with
              clients and grow their careers
            </p>
            <Button className="w-[312px] h-[66px] rounded-[50px] border-[5px] border-solid border-white bg-transparent hover:bg-white/10">
              <span className="font-bold text-white text-xl">
                START FREELANCING!
              </span>
            </Button>
          </div>
        </section>

        {/* Why Flancer Section */}
        <section className="py-16">
          <h2 className="text-center font-extrabold text-[#000000d9] text-[40px] mb-10">
            Why Flancer?
          </h2>

          <div className="grid grid-cols-2 gap-x-16 gap-y-20 px-16">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex flex-col items-center">
                <img
                  src={benefit.image}
                  alt={benefit.title}
                  className="w-[275px] h-[275px] object-cover mb-2"
                />
                <h3 className="font-extrabold text-black text-[40px] mb-1">
                  {benefit.title}
                </h3>
                <p className="font-medium text-black text-2xl text-center">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Job Categories Section */}
        <section className="py-10 px-16">
          <h2 className="font-extrabold text-black text-[32px] text-center mb-4">
            Looking for Work? Start Here!
          </h2>
          <p className="font-medium text-black text-2xl text-center mb-10">
            Find beginner-friendly freelance jobs and start earning today!
          </p>

          <div className="flex flex-wrap justify-center gap-8">
            {jobCategories.map((category, index) => (
              <Card
                key={index}
                className="w-[284px] h-[98px] bg-[#cbdceb] rounded-[50px] border-none flex items-center"
              >
                <CardContent className="flex items-center p-0 pl-8 h-full">
                  {category.icon}
                  <span className="font-medium text-black text-2xl ml-6">
                    {category.title}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Freelance Tips Section */}
        <section className="px-8 py-10">
          <Card className="w-full h-[567px] bg-[#608bc1] rounded-[20px] border-none overflow-hidden flex">
            <CardContent className="flex-1 p-11 pt-10">
              <h2 className="font-black text-white text-[40px] mb-10 max-w-[489px]">
                Start Your Freelance Journey the Right Way!
              </h2>
              <p className="font-medium text-white text-2xl mb-10">
                New to freelancing? Here are some quick tips to get started:
              </p>

              <ul className="space-y-8">
                {freelanceTips.map((tip, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-12 h-12 flex items-center justify-center mr-6">
                      {tip.icon}
                    </div>
                    <span className="font-medium text-white text-2xl">
                      {tip.tip}
                    </span>
                  </li>
                ))}
              </ul>

              <Button className="mt-10 h-14 w-[201px] bg-[#f3f3e0] rounded-[50px] text-black hover:bg-[#e9e9d0]">
                <span className="font-medium text-black text-2xl">
                  Learn More
                </span>
              </Button>
            </CardContent>
            <div className="w-[631px] h-[567px]">
              <img
                src="/image-5.png"
                alt="Freelancer working"
                className="w-full h-full object-cover"
              />
            </div>
          </Card>
        </section>

        {/* Forum Section */}
        <section className="px-8 py-10">
          <Card className="w-full h-[567px] bg-[#608bc1] rounded-[20px] border-none overflow-hidden flex">
            <div className="w-[631px] h-[567px]">
              <img
                src="/image-6.png"
                alt="Freelancers collaborating"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="flex-1 p-11 pt-10 flex flex-col items-end">
              <h2 className="font-black text-white text-[40px] text-right mb-10 max-w-[445px]">
                Stay Ahead with the Flancer Forum!
              </h2>
              <p className="font-medium text-white text-2xl text-right mb-10 max-w-[625px]">
                Freelancing is always evolving—don't get left behind!
              </p>

              <ul className="space-y-8 w-full">
                {forumBenefits.map((item, index) => (
                  <li key={index} className="flex items-center justify-end">
                    <span className="font-medium text-white text-2xl mr-6">
                      {item.benefit}
                    </span>
                    <div className="w-12 h-12 flex items-center justify-center">
                      {item.icon}
                    </div>
                  </li>
                ))}
              </ul>

              <Button className="mt-10 h-14 w-[201px] bg-[#f3f3e0] rounded-[50px] text-black hover:bg-[#e9e9d0]">
                <span className="font-medium text-black text-2xl">
                  Learn More
                </span>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 flex flex-col items-center">
          <h2 className="font-extrabold text-black text-[32px] mb-6">
            Your Freelance Career Starts Here!
          </h2>
          <Button className="h-[50px] w-[216px] bg-[#608bc1] rounded-[20px] hover:bg-[#4c7ab3]">
            <span className="font-bold text-white text-2xl">SIGN UP NOW</span>
          </Button>
        </section>

        {/* Footer */}
        <footer className="w-full h-60 bg-[#133e87]">
          <div className="max-w-[1440px] mx-auto h-full flex items-center px-11">
            <div className="mr-20">
              <h2 className="font-extrabold text-white text-5xl mb-4">LOGO</h2>
            </div>

            <div className="flex gap-16">
              <div>
                <h3 className="font-extrabold text-white text-base mb-4">
                  Freelancer
                </h3>
                <ul className="space-y-2">
                  {footerLinks.freelancer.map((link, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="font-medium text-white text-[13px]"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-extrabold text-white text-base mb-4">
                  Clients
                </h3>
                <ul className="space-y-2">
                  {footerLinks.clients.map((link, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="font-medium text-white text-[13px]"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
