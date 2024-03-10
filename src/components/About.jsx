import React from "react";
import Profile from "../assets/profile.jpg";
import { FaFacebook, FaFacebookF, FaGithub, FaInstagram } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa6";

const About = () => {
  return (
    <div className="flex justify-center items-start min-h-screen">
      <div className="my-10 flex justify-center items-center flex-col w-[95%] md:max-w-xl bg-slate-100 shadow-xl rounded-lg py-10 md:px-10">
        <img
          className="w-32 h-32 md:w-36 md:h-36 border-8 border-slate-100 shadow-xl object-cover rounded-full"
          src={Profile}
          alt="Profile Picture"
        />
        <h2 className="mt-3 text-xl font-serif font-bold">Tashfeen Chohan</h2>
        <span className="text-xs">3rd Year CS Student | Mern Stack Developer</span>
        {/* SOCIAL INFO */}
        <div className="mt-3 flex justify-center items-center gap-3">
          <a
            target="_blank"
            className="hover:scale-125 transition-all duration-300 ease-in-out w-8 h-8 rounded-full bg-white flex justify-center items-center shadow-xl"
            href="https://www.facebook.com/?ref=homescreenpwa"
          >
            <FaFacebookF className="text-[#316FF6]" />
          </a>
          <a
            target="_blank"
            className="hover:scale-125 transition-all duration-300 ease-in-out w-8 h-8 rounded-full bg-white flex justify-center items-center shadow-xl"
            href="https://www.instagram.com/?hl=en"
          >
            <FaInstagram className="text-[#C13584]" />
          </a>
          <a
            target="_blank"
            className="hover:scale-125 transition-all duration-300 ease-in-out w-8 h-8 rounded-full bg-white flex justify-center items-center shadow-xl"
            href="https://www.linkedin.com/feed/"
          >
            <FaLinkedinIn className="text-[#0a66c2]" />
          </a>
          <a
            target="_blank"
            className="hover:scale-125 transition-all duration-300 ease-in-out w-8 h-8 rounded-full bg-white flex justify-center items-center shadow-xl"
            href="https://github.com/Tashfeen-Chohan"
          >
            <FaGithub />
          </a>
        </div>
        <hr className="mt-5 h-[2.5px]  bg-cyan-500 w-[70%]"/>
        {/* INTRODUCTION */}
        <div className="px-3 mt-7 space-y-3">
          <p className="font-serif">
            Hey there! I'm Tashfeen!, a MERN Stack developer and third-year
            student pursuing a Bachelor's degree in Computer Science at GC
            University Lahore. I'm passionate about bringing ideas to life
            through web development!
          </p>
          <p className="font-serif">
            In my journey through the exciting world of technology, I specialize
            in creating dynamic and user-friendly websites using MongoDB,
            Express.js, React.js, and Node.js. From designing intuitive
            interfaces to building robust backend systems, I enjoy every aspect
            of the development process.
          </p>
          <p className="font-serif">
            My studies in Computer Science at GC University Lahore have provided
            me with a solid foundation in programming, algorithms, and software
            engineering principles. I'm constantly applying what I learn in the
            classroom to real-world projects, pushing the boundaries of what's
            possible in the digital realm.
          </p>
          <p className="font-serif">
            Thanks for dropping by, and feel free to check out my work here!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
