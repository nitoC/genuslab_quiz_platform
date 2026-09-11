"use client";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import Image from "next/image";
import Gradient from "@/components/ui/cards/Gradient";
import Group from "@/assets/icons/Group";
import GradCap from "@/assets/icons/GradCap";
import Trophy from "@/assets/icons/Trophy";
import Play from "@/assets/icons/Play";
import Link from "next/link";

import Flutterwave from "@/assets/images/svg/flutterwave.svg";
import Amazon from "@/assets/images/svg/amazon.svg";
import Palmpay from "@/assets/images/svg/palmpay.svg";
import Genus from "@/assets/images/svg/genus_villa_logo transparent 1.svg";
import Paypal from "@/assets/images/svg/PayPal.svg";
import Header from "@/components/layouts/HomeTopNav";
import Footer from "@/components/layouts/Footer";
import Button from "@/components/ui/buttons/Linear";

const gradientCardData = [
  {
    text: " Start building at Genus lab, we train you in cutting-edge techcode, design, AI, and more and pay you to work on real projects while you’re still in training. Why wait years to start earning? Learn by doing. Earn by building. Launch your tech career now. Learn more",
    heading: "Earn While you learn",
    icon: <GradCap />,
  },
  {
    text: " Tap into local opportunities with a global mission. Our regional teams give you hands-on experience, mentorship, and peer collaboration right where you are. Work on real projects, contribute to community-driven solutions, and build your network—all while advancing your tech career.",
    heading: "join a regional Team",
    icon: <Group />,
  },
  {
    text: " Think you’re smart? Prove it. Take on weekly tech quizzes, climb the leaderboard, and win your share of ₦120 million+ in cash, gadgets, and exclusive opportunities. The more correct answers, the more you earn. It's not just learning—it's winning.",
    heading: "Win ₦120M+ in Prizes",
    icon: <Trophy />,
  },
];

export default function Home() {
  const text = `Unlock Your 
Potential with
<span className="text">Cutting-edge</span> Tech Solutions`;
  return (
    <>
      <Header />
      <section className="hero   bg-cover w-full md:aspect-1440/851">
        <div className="wrapper p-[1rem]  md:flex justify-start items-center h-full md:py-8">
          <div className="intro-container max-w-[600px]  ">
            <div className="intro-text-wrapper flex flex-col gap-[1rem] items-center md:items-start text-center md:text-start  ">
              <h1 className="intro-heading font-Geist text-[#080820] text-clamp md:whitespace-pre font-extrabold leading-15 text-shadow-white text-shadow-sm">
                Unlock Your
                <br />
                Potential with
                <br />
                <span className="text text-blue ">Cutting-edge</span> Tech
                Solutions
              </h1>
              <p className="intro-sub-text text-[1.3rem]">
                Join a vibrant community of learners and professionals. Access
                top-tier courses, explore exciting job opportunities, and
                connect with industry experts.
              </p>
            </div>
            <div className="w-fit py-8 flex-col flex justify-center md:justify-start gap-[16px] m-auto md:m-0">
              <div className="intro-image-wrapper">
                <Image
                  src={"/images/intro-image.png"}
                  width={433}
                  height={221}
                  alt="intro image"
                />
              </div>
              <div className="hidden md:flex flex-col md:flex-row items-stretch gap-[10px] md:justify-center">
                <Button
                  handler={() => console.log("hello world login")}
                  text="Join Quiz"
                  type="link"
                  url="/login"
                  // cat="linear"
                  Icon={<MdOutlineKeyboardDoubleArrowRight color="#3a94ff" />}
                />
                <Button
                  handler={() => console.log("hello world")}
                  text="Watch Live Show"
                  type="link"
                  url="https://www.youtube.com/@Genuslab_technologies"
                  // cat="primary"
                />
              </div>
              <div className="flex flex-col md:hidden items-stretch gap-2.5 md:justify-center">
                <Link
                  href="/login"
                  className=" bg-blue text-white rounded-lg px-7.5 py-[.6rem] cursor-pointer"
                >
                  Join Quiz
                </Link>
                <Link
                  href="https://www.youtube.com/@Genuslab_technologies"
                  className="bg-green text-white  rounded-md px-7.5 py-2.5 cursor-pointer"
                >
                  Watch Live Show
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="divider-wrapper border-b border-b-pink px-[2rem] py-[4rem] max-w-[1049px] m-auto rounded-[20px] relative section-md:-translate-y-[calc(10px+4vw)] min-h-[332px] z-[1] bg-white">
        <div className="divider flex-col md:flex-row flex gap-[1rem] md:gap-0 items-center justify-center ">
          {gradientCardData.map((a, b) => {
            if (b === 1) {
              return (
                <Gradient
                  key={a.text}
                  text={a.text}
                  heading={a.heading}
                  active={true}
                  Icon={a.icon}
                />
              );
            }
            return (
              <Gradient
                key={a.text}
                text={a.text}
                heading={a.heading}
                Icon={a.icon}
              />
            );
          })}
        </div>
      </div>
      <section className=" wrapper py-8 md:py-[6rem] section-container flex flex-col gap-[3rem]">
        <div className="heading">
          <h2
            className="text-center p-[1rem]"
            style={{ fontSize: "clamp(20px,8vw, 40px)" }}
          >
            <span className="text-blue">GenusLab</span> – your gateway to
            future-ready skills.
          </h2>
        </div>
        <div className="">
          <div className="flex-container px-4 ">
            <div className="flex max-w-[350px] m-auto  sm:max-w-full md:m-0 justify-center items-center py-[1rem] section-md:py-0 section-md:items-stretch flex-col section-md:flex-row nav-md:justify-between gap-[1rem] rounded-[2rem] bg-[#F5F9FF]">
              <div className="img-container max-w-[578px] md:min-h-[386px] overflow-hidden rounded-lg ">
                <Image
                  src={"/images/Student Img.png"}
                  alt="flex image"
                  width={578}
                  height={386}
                  layout="responsive"
                />
              </div>
              <div className="section-content items-center flex flex-col gap-[1rem] p-[1rem] sm:p-[3rem]">
                <h2
                  className="text-center"
                  style={{ fontSize: "clamp(20px,8vw, 40px)" }}
                >
                  <span className="text-blue">Genus Lab</span>
                  <span style={{ color: "#0DF280" }}> Academy</span>
                </h2>
                <div className="max-w-[515px]">
                  🚀 Dive into expert-led bootcamps and real-world learning
                  across:
                  <ul className="list-disc p-[1rem]">
                    <li>Coding</li>
                    <li>AI & Machine</li>
                    <li>Learning Crypto & Blockchain</li>
                    <li>Digital Marketing</li>
                  </ul>
                  ⏰ Next Bootcamp Starts Soon – Spots are limited! <br />
                  📚 Browse the Curriculum, read Student Reviews, Join Now to
                  get started.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#F5F9FF]">
        <div className="content-wrapper wrapper flex flex-col py-[4rem] px-4 gap-8 ">
          <div className="wrap flex gap-[1rem] flex-col   section-md:flex-row  justify-center md:justify-between">
            <div className="img-wrapper w-[100%] md:min-w-[510px] bg-[url(/images/studio.png)] bg-[#0077ff88] bg-blend-overlay bg-cover rounded-[30px] bg-top-center section-md:max-w-[605px] aspect-[578/386]">
              <div className="item-container flex flex-col justify-center h-full p-[1rem]">
                <div className="item-text-container max-w-[404px]">
                  <h3 className="text-white text-clamp2">
                    GenusLab Studio – Live & On-Demand
                  </h3>
                  <Link className="text-white underline" href="#">
                    Watch Live
                  </Link>
                </div>
                <div className="icon">
                  <Play width={100} />
                </div>
              </div>
            </div>
            <div className="item-content rounded-[30px] bg-white items-center w-[100%] flex flex-col gap-[1rem] p-[1rem] sm:p-[3rem]">
              <h2
                className="text-center"
                style={{ fontSize: "clamp(20px,8vw, 40px)" }}
              >
                <span className="text-blue">🎥 Studio Events</span>
              </h2>
              <p className="max-w-[515px] p-[1rem]">
                {" "}
                🎙️ Catch us LIVE from the GenusLab Studio <br />
                📼 Watch replays of past tech talks, panels, and showcases{" "}
                <br />
                🏆 Upcoming PAQC Events:
              </p>
            </div>
          </div>
          <div className="wrap-reverse flex gap-[1rem] flex-col-reverse    section-md:flex-row  justify-center md:justify-between">
            <div className="item-content rounded-[30px] bg-white items-center w-[100%] flex flex-col gap-[1rem] p-[1rem] sm:p-[3rem]">
              <h2
                className="text-center"
                style={{ fontSize: "clamp(20px,8vw, 40px)" }}
              >
                <span className="text-blue">🔍 Job Board –</span>
              </h2>
              <p className="max-w-[515px] p-[1rem]">
                {" "}
                💼 Browse jobs by category, location, or skill
                <br />
                🕒 Filter by full-time, remote, internships, and more
                <br />
                📌 Save your favorites and apply directly{" "}
                <Link href={"#"}>Learn More</Link>.
              </p>
            </div>
            <div className="wrap flex gap-[1rem] flex-col section-md:flex-row  justify-center md:justify-between section-md:items-center">
              <div className="img-wrapper w-[100%] md:min-w-[510px] bg-[url(/images/Job.png)] bg-[#0f101188] bg-blend-overlay bg-cover rounded-[30px] bg-top-center section-md:max-w-[605px] aspect-[578/386]">
                <div className="item-container flex flex-col justify-center h-full p-[1rem]">
                  <div className="item-text-container max-w-[404px]">
                    <h3 className="text-white text-clamp2">
                      🔎 Find Your Next Opportunity with GenusLab Jobs
                    </h3>
                    <Link className="text-white underline" href="#">
                      Learn more
                    </Link>
                  </div>
                  {/* <div className="icon">
                    <Play width={100} />
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="wrapper divider ">
        <div className="divider-container m-auto hidden md:flex max-w-200 justify-between px-4 py-8 gap-8">
          <Image width={100} height={100} alt="sponsors logo" src={Genus} />
          <Image
            width={100}
            height={100}
            alt="sponsors logo"
            src={Flutterwave}
          />
          <Image width={100} height={100} alt="sponsors logo" src={Paypal} />
          <Image width={100} height={100} alt="sponsors logo" src={Amazon} />
          <Image width={100} height={100} alt="sponsors logo" src={Palmpay} />
        </div>
      </div>
      <Footer />
    </>
  );
}
