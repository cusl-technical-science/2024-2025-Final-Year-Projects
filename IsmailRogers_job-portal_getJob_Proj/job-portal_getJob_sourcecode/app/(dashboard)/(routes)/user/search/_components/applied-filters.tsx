"use client";

import { Button } from " @/components/ui/button";
import { Category } from "@prisma/client";
import {useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface AppliedFiltersProps {
  categories: Category[];
}

export const AppliedFilters = ({ categories }: AppliedFiltersProps) => {
  const searchParams = useSearchParams();
  const [currentParams, setCurrentParams] = useState<Record<string, string>>({});

  // Ensure params are only set on the client side
  useEffect(() => {
    setCurrentParams(Object.fromEntries(searchParams.entries()));
  }, [searchParams]);

  const shiftTimingParams = Object.fromEntries(
    Object.entries(currentParams).filter(([key]) => key === "shiftTiming")
  );

  const workingModesParams = Object.fromEntries(
    Object.entries(currentParams).filter(([key]) => key === "workMode")
  );

  const getCategoryName = (categoryId: string | null) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  if (Object.keys(currentParams).length === 0) return null;

  return (
    <>
      <div className="mt-4 flex items-center gap-4">
        {Object.entries(shiftTimingParams).map(([key, value]) => (
          <React.Fragment key={key}>
            {value.split(",").map((item) => (
              <Button
                variant={"outline"}
                type="button"
                key={item}
                className="flex items-center gap-x-2 text-neutral-500 px-2 py-1 rounded-md bg-purple-50/80 border-purple-200 capitalize cursor-pointer hover:bg-purple-50"
              >
                {item}
              </Button>
            ))}
          </React.Fragment>
        ))}

        {Object.entries(workingModesParams).map(([key, value]) => (
          <React.Fragment key={key}>
            {value.split(",").map((item) => (
              <Button
                variant={"outline"}
                type="button"
                key={item}
                className="flex items-center gap-x-2 text-neutral-500 px-2 py-1 rounded-md bg-purple-50/80 border-purple-200 capitalize cursor-pointer hover:bg-purple-50"
              >
                {item}
              </Button>
            ))}
          </React.Fragment>
        ))}

        {currentParams["categoryId"] && (
          <Button
            variant={"outline"}
            type="button"
            className="flex items-center gap-x-2 text-neutral-500 px-2 py-1 rounded-md bg-purple-50/80 border-purple-200 capitalize cursor-pointer hover:bg-purple-50"
          >
            {getCategoryName(currentParams["categoryId"])}
          </Button>
        )}
      </div>

      {currentParams["title"] && (
        <div className="flex items-center justify-center flex-col my-4">
          <h2 className="text-3xl text-muted-foreground">
            You searched for:{" "}
            <span className="font-bold text-neutral-900 capitalize">
              {currentParams["title"]}
            </span>
          </h2>
        </div>
      )}
    </>
  );
};
