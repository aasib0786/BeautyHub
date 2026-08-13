import React, { Suspense } from "react";
import ProfilePageContent from "./ProfilePageContent";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading profile...</div>}>
      <ProfilePageContent />
    </Suspense>
  );
};

export default Page;