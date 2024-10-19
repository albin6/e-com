import React from "react";
import { Button } from "../ui/ui-components";
import { Card, CardContent } from "../ui/ui-components";

export default function Wishlist() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Wishlist (4)</h2>
        <Button variant="outline">Move All To Bag</Button>
      </div>

      <div className="space-y-4 mb-8">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="flex items-center p-4">
            <img
              src="https://via.placeholder.com/80"
              alt="Nothing Phone"
              width={80}
              height={80}
              className="mr-4"
            />
            <div className="flex-grow">
              <h3 className="font-semibold">
                Nothing Phone (2a) Plus (Grey, 256 GB)
              </h3>
              <p className="text-sm text-gray-600">8 GB RAM | 256 GB ROM</p>
              <p className="text-sm text-gray-600">(10854)</p>
              <p className="font-bold">₹29,999</p>
              <p className="text-sm text-green-600">13% off</p>
            </div>
            <div className="flex flex-col space-y-2">
              <Button variant="destructive" className=" bg-gray-600 text-white">
                Remove
              </Button>
              <Button variant="outline" className="bg-gray-800 text-white">
                Add To Cart
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Just For You</h2>
        <Button variant="link">See All</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <img
                src="https://via.placeholder.com/200"
                alt="Phone Case"
                className="w-full h-48 object-cover mb-2"
              />
              <h3 className="font-semibold">CMF BY NOTHING PHONE 1</h3>
              <p className="text-sm">
                ₹16,599{" "}
                <span className="line-through text-gray-400">₹18,599</span>
              </p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
