"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const Page = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div>
      <main className="bg-base-200 flex min-h-[34rem] flex-col items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <h1 className="text-primary mb-4 text-5xl font-bold">
            Welcome to ShelfShare
          </h1>
          <p className="text-base-content mb-6 text-lg">
            Discover, lend, and borrow books with your community. ShelfShare
            makes peer-to-peer book exchange easy and fun.
          </p>
          <div className="flex justify-center">
            {isAuthenticated ? (
              <Link href="/feed" className="btn btn-primary">
                Browse
              </Link>
            ) : (
              <Link href="/signup" className="btn btn-primary">
                Get Started
              </Link>
            )}
          </div>
        </div>
      </main>
      <footer className="footer sm:footer-horizontal bg-base text-base-content p-10">
        <aside>
          <h1 className="footer-title">ShelfShare</h1>
          <p>
            Made by -<span className="font-bold"> Satendra Kumar</span>
            <br />A wannabe software developer and a book lover.
          </p>
        </aside>
        <nav>
          <h6 className="footer-title">Social</h6>
          <div className="grid grid-flow-col gap-4">
            <a href="https://www.linkedin.com/in/satendrakm/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="24"
                height="24"
                viewBox="0 0 50 50"
                className="fill-current"
              >
                <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"></path>
              </svg>
            </a>
            <a href="https://github.com/SatendraKm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C8.7,21.4,9,21.2,9,20.8v-1.6c0,0-0.4,0.1-0.9,0.1 c-1.4,0-2-1.2-2.1-1.9c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1 c0.4,0,0.7-0.1,0.9-0.2c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6c0-0.4,0-0.9,0.2-1.3 C7.2,6.1,7.4,6,7.5,6c0,0,0.1,0,0.1,0C8.1,6.1,9.1,6.4,10,7.3C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3c0.9-0.9,2-1.2,2.5-1.3 c0,0,0.1,0,0.1,0c0.2,0,0.3,0.1,0.4,0.3C17,6.7,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4c0.7,0.8,1.2,1.8,1.2,3c0,2.2-1.7,3.5-4,4 c0.6,0.5,1,1.4,1,2.3v2.6c0,0.3,0.3,0.6,0.7,0.5c3.7-1.5,6.3-5.1,6.3-9.3C22,6.1,16.9,1.4,10.9,2.1z"></path>
              </svg>
            </a>
            <a href="mailto:satendrakm27@gmail.com">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="24"
                height="24"
                viewBox="0 0 128 128"
                className="fill-current"
              >
                <path d="M123.25 24.192c0-.018 0-.034-.005-.052s-.007-.063-.009-.094a1.734 1.734 0 0 0-.083-.408c-.006-.018 0-.037-.011-.055s-.01-.015-.013-.023a1.734 1.734 0 0 0-.227-.407c-.021-.028-.043-.053-.066-.08a1.755 1.755 0 0 0-.31-.294c-.012-.009-.022-.02-.034-.028a1.744 1.744 0 0 0-.414-.2c-.034-.012-.068-.022-.1-.032a1.733 1.733 0 0 0-.474-.073H6.5a1.733 1.733 0 0 0-.474.073c-.035.01-.068.02-.1.032a1.744 1.744 0 0 0-.414.2c-.012.008-.022.019-.034.028a1.755 1.755 0 0 0-.31.294c-.022.027-.045.052-.066.08a1.734 1.734 0 0 0-.227.407c0 .008-.01.015-.013.023s-.005.037-.011.055a1.734 1.734 0 0 0-.083.408c0 .032-.009.063-.009.094s-.005.034-.005.052v79.615c0 .023.006.045.007.068a1.737 1.737 0 0 0 .019.188c.008.051.015.1.027.152a1.74 1.74 0 0 0 .056.179c.017.047.033.094.054.139a1.729 1.729 0 0 0 .093.172c.024.04.048.081.075.119a1.743 1.743 0 0 0 .125.152c.033.036.066.072.1.106.021.019.037.042.059.061s.036.017.052.03a1.736 1.736 0 0 0 .452.263c.035.014.071.022.107.033a1.732 1.732 0 0 0 .488.085c.012 0 .023.006.035.006H121.501c.012 0 .023-.006.034-.006a1.732 1.732 0 0 0 .489-.085c.035-.011.07-.019.1-.033a1.736 1.736 0 0 0 .453-.263c.016-.013.036-.017.052-.03s.038-.042.059-.061c.036-.034.069-.069.1-.106a1.743 1.743 0 0 0 .125-.152c.027-.038.051-.078.075-.119a1.729 1.729 0 0 0 .093-.172c.021-.045.037-.092.054-.139a1.74 1.74 0 0 0 .056-.179c.012-.05.019-.1.027-.152a1.737 1.737 0 0 0 .019-.188c0-.023.007-.045.007-.068zM45.8 60.316l17.058 14.677a1.751 1.751 0 0 0 2.283 0L82.2 60.316l35.512 41.741H10.289zM8.25 99.052V28.007l34.9 30.026zm76.6-41.019 34.9-30.026v71.045zm31.931-32.091L81.276 56.493c-.006.005-.014.008-.02.014l-.019.02L64 71.358 46.763 56.527l-.019-.02-.02-.014-35.507-30.551z" />
              </svg>
            </a>
          </div>
        </nav>
      </footer>
    </div>
  );
};

export default Page;
