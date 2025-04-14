import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="bg-base dark:bg-base-100 flex min-h-screen items-center justify-center px-4">
      <div className="bg-base-100 dark:bg-base-200 w-full max-w-md space-y-4 rounded-2xl p-6 text-center shadow-md">
        <h1 className="text-primary text-2xl font-semibold">
          Page Under Development 🚧
        </h1>
        <p className="text-base-content">
          You can change your password from the{" "}
          <span className="font-medium">Profile</span> section.
        </p>
        <p className="text-muted text-sm">
          Can&apos;t sign in? Contact:{" "}
          <Link
            href="mailto:satendrakm27@gmail.com"
            className="link link-primary break-all"
          >
            satendrakm27@gmail.com
          </Link>
        </p>
      </div>
    </div>
  );
};

export default page;
