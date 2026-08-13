import React, { Suspense } from "react";
import SearchPageContent from "./SearchPageContent";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <SearchPageContent />
    </Suspense>
  );
};

export default Page;
