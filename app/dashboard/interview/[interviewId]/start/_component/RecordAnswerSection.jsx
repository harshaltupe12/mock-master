import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import Webcam from "react-webcam";

function RecordAnswerSection() {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="mt-10 flex flex-col justify-center items-center bg-black rounded-lg p-5">
        <Image
          src={"/camera.png"}
          width={200}
          height={200}
          alt=""
          className="absolute"
        />
        <Webcam
          mirrored={true}
          style={{
            height: 350,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>
      <Button variant="outline" className="my-10">Record Answer</Button>
    </div>
  );
}

export default RecordAnswerSection;
