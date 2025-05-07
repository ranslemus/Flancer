import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Search } from "lucide-react";
import React from "react";

export default function ForumPage(): JSX.Element {
  // Forum post data for mapping
  const forumPosts = [
    {
      id: 1,
      username: "JakeFreelance",
      content:
        "Hey everyone! I'm new to freelancing and looking for my first gig. I have some experience in web development, but I'm not sure where to start. What's the best way to land my first client? Any advice would be greatly appreciated!",
    },
    {
      id: 2,
      username: "JakeFreelance",
      content:
        "Hey everyone! I'm new to freelancing and looking for my first gig. I have some experience in web development, but I'm not sure where to start. What's the best way to land my first client? Any advice would be greatly appreciated!",
    },
    {
      id: 3,
      username: "JakeFreelance",
      content:
        "Hey everyone! I'm new to freelancing and looking for my first gig. I have some experience in web development, but I'm not sure where to start. What's the best way to land my first client? Any advice would be greatly appreciated!",
    },
    {
      id: 4,
      username: "JakeFreelance",
      content:
        "Hey everyone! I'm new to freelancing and looking for my first gig. I have some experience in web development, but I'm not sure where to start. What's the best way to land my first client? Any advice would be greatly appreciated!",
    },
  ];

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden w-full max-w-[1440px] relative">
        {/* Navigation Bar */}
        <header className="w-full h-[97px] bg-[#133e87] flex items-center px-4">
          <div className="[font-family:'Inter-ExtraBold',Helvetica] font-extrabold text-[64px] text-white">
            LOGO
          </div>

          <nav className="flex ml-8 gap-8">
            <div className="[font-family:'Inter-Medium',Helvetica] font-medium text-white text-2xl">
              FIND JOB
            </div>
            <div className="[font-family:'Inter-Medium',Helvetica] font-medium text-white text-2xl">
              HIRE FREELANCER
            </div>
            <div className="[font-family:'Inter-Medium',Helvetica] font-medium text-white text-2xl">
              FORUM
            </div>
          </nav>

          <div className="ml-auto flex items-center gap-4">
            <div className="[font-family:'Inter-Light',Helvetica] font-light text-2xl text-white">
              Username
            </div>
            <Avatar className="w-20 h-20">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Hero Section */}
        <section className="w-full h-[424px] bg-[url(/image-2.png)] bg-cover bg-center flex flex-col items-center justify-center">
          <h1 className="[font-family:'Inter-ExtraBold',Helvetica] font-extrabold text-white text-[40px] mb-6">
            Welcome to Flancer Forum!
          </h1>

          <div className="relative w-[540px]">
            <Input
              className="h-[45px] bg-[#d9d9d9] rounded-[50px] pl-6 pr-12 text-[15px] [font-family:'Inter-Regular',Helvetica]"
              placeholder="Search the Forum"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-[38px] h-[38px]" />
          </div>
        </section>

        {/* Forum Content */}
        <div className="px-10 py-12">
          <div className="flex justify-between mb-10">
            <Button className="h-12 w-[202px] bg-[#608bc1] rounded-[50px] [font-family:'Inter-Bold',Helvetica] font-bold text-[15px]">
              New Discussion
            </Button>

            <ToggleGroup
              type="single"
              defaultValue="top"
              className="flex gap-4"
            >
              <ToggleGroupItem
                value="top"
                className="w-[121px] h-[29px] bg-[#cbdceb] rounded-[20px] [font-family:'Inter-Bold',Helvetica] font-bold text-black text-[15px]"
              >
                Top
              </ToggleGroupItem>
              <ToggleGroupItem
                value="latest"
                className="w-[121px] h-[29px] bg-[#cbdceb] rounded-[20px] [font-family:'Inter-Bold',Helvetica] font-bold text-black text-[15px]"
              >
                Latest
              </ToggleGroupItem>
              <ToggleGroupItem
                value="oldest"
                className="w-[121px] h-[29px] bg-[#cbdceb] rounded-[20px] [font-family:'Inter-Bold',Helvetica] font-bold text-black text-[15px]"
              >
                Oldest
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Forum Posts */}
          <div className="space-y-4 ml-[280px]">
            {forumPosts.map((post) => (
              <Card
                key={post.id}
                className="w-[1053px] h-[90px] bg-[#d9d9d980] rounded-[20px]"
              >
                <CardContent className="p-0 flex items-center h-full">
                  <Avatar className="w-[53px] h-[53px] ml-6 bg-black rounded-[26.5px]">
                    <AvatarFallback>JF</AvatarFallback>
                  </Avatar>
                  <div className="ml-[24px]">
                    <div className="[font-family:'Inter-Bold',Helvetica] font-bold text-black text-[15px]">
                      {post.username}
                    </div>
                    <div className="[font-family:'Inter-Light',Helvetica] font-light text-black text-[15px] w-[906px]">
                      {post.content}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          <div className="flex justify-center mt-6">
            <Button className="h-12 w-[122px] bg-[#608bc1] rounded-[50px] [font-family:'Inter-Bold',Helvetica] font-bold text-[15px]">
              Load More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
