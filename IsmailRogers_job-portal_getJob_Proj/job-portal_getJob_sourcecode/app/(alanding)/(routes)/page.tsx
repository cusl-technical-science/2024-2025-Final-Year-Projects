import Link from "next/link"; // Import Link for navigation
import { getJobs } from " @/actions/get-jobs";
import Box from " @/components/box";
import { db } from " @/lib/db";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { HomescreenCategoriesContainer } from "../_components/home-screen-categories-container";
import { HomeCompaniesList } from "../_components/home-companies-list";
import { RecommendedJobsList } from "../_components/recommended-jobs";
import { Footer } from " @/components/footer";
import MotionHeading from "../_components/MotionHeading";
import IntroM from "../_components/introM";
import TopH from "../_components/top-h";

const testimonials = [
  {
    text: "As a job seeker looking for the best opportunities, GetJob instantly grabbed my attention with its seamless experience and powerful features.",
    imageSrc: "/img/avatar-1.png",
    name: "Janet Turay",
    username: "@janet00",
  },
  {
    text: "Our hiring process has become faster and more efficient since we started using GetJob. Finding the right candidates has never been easier!",
    imageSrc: "/img/avatar-2.png",
    name: "John Samson",
    username: "@jjsamson",
  },
  {
    text: "GetJob has completely transformed how I manage job applications and track progress. It has made the recruitment process so much smoother and more organized!",
    imageSrc: "/img/avatar-3.png",
    name: "Satu Turay",
    username: "@satT",
  },
  {
    text: "I was amazed at how quickly we were able to integrate this job portal into our hiring process. It's seamless and fits perfectly into our workflow!",
    imageSrc: "/img/avatar-4.png",
    name: "Saran Turay",
    username: "@saturay",
  },
  {
    text: "Managing job applications and candidate profiles has never been easier. This job portal helps me keep track of all the steps in the hiring process, ensuring nothing gets overlooked.",
    imageSrc: "/img/avatar-5.png",
    name: "Taylor Kim",
    username: "@taylorkimm",
  },
  {
    text: "The customizability and UI capabilities of this app are top-notch.",
    imageSrc: "/img/avatar-6.png",
    name: "Riley Smith",
    username: "@rileysmith1",
  },
  {
    text: "Adopting this job portal for our hiring process has streamlined candidate management and improved communication between our team and applicants.",
    imageSrc: "/img/avatar-7.png",
    name: "Jordan Patels",
    username: "@jpatelsdesign",
  },
  {
    text: "With GetJob, I can easily manage job applications, track candidate progress, and organize all necessary documents in one place.",
    imageSrc:"/img/avatar-8.png",
    name: "Kelfala",
    username: "@kelf23",
  },
  {
    text: "Its user-friendly interface and robust features support our diverse needs.",
    imageSrc: "/img/avatar-9.png",
    name: "Casey Harper",
    username: "@casey09",
  },
];

const DashboardHomePage = async () => {
  const { userId } = await auth();
  const jobs = await getJobs({});

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  const companies = await db.company.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex-col py-6 px-4 space-y-24 relative">
      {/* Login Button (Only for Unauthenticated Users) */}
      {!userId && (
        <div className="absolute top-4 right-4">
          <Link href="/sign-in " className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">
  Login
</Link>
        </div>
      )}

      <Box className="flex-col justify-center w-full space-y-4 mt-12">
        <TopH />
        <IntroM />
      </Box>

      <Box className="relative overflow-hidden h-64 2xl:h-96 justify-center rounded-lg mt-12">
        <Image
          src="/img/job-portal-banner.jpg"
          alt="Home Banner"
          fill
          className="object-cover w-full h-full"
        />
      </Box>
      <HomescreenCategoriesContainer categories={categories} />
      <HomeCompaniesList companies={companies} />
      <RecommendedJobsList jobs={jobs.splice(0, 6)} userId={userId} />

      <h3 className="text-2xl font-bold text-center flex items-center justify-center gap-2 mb-0">
        <MotionHeading />
      </h3>

      {/* Testimonials Section */}
      <Box className="mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Video Section */}
          <Box className="mt-12 flex justify-center">
            <video
              src="/vid/intro.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="rounded-lg shadow-lg w-full md:w-3/4 lg:w-1/2"
            />
          </Box>

          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-md">
              <Image
                src={testimonial.imageSrc}
                alt={testimonial.name}
                width={50}
                height={50}
                className="rounded-full mb-4"
              />
              <p className="text-gray-700">{testimonial.text}</p>
              <p className="mt-2 font-semibold">{testimonial.name}</p>
              <p className="text-sm text-gray-500">{testimonial.username}</p>
            </div>
          ))}
        </div>
      </Box>

      <Footer />
    </div>
  );
};

export default DashboardHomePage;