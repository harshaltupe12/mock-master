"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { WebcamIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState();
  const [webCamEnable, setWebCamEnable] = useState(true);

  useEffect(() => {
    GetInterviewDetails();
  });

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));
    setInterviewData([0]);
  };

  return (
    <div className="my-6 flex justify-center flex-col items-center">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>
      <div className="">
        {webCamEnable ? 
          <Webcam
            onUserMedia={() => setWebCamEnable(true)}
            onUserMediaError={() => setWebCamEnable(false)}
            mirrored={true}
            style={{
              height: 300,
              width: 300,
            }}
          />
         : 
          <>
            <WebcamIcon className="w-full h-72 my-7 p-20 bg-secondary rounded-lg border" />
            <Button onclick={() => setWebCamEnable(true)}>
              Enable Webcam and Microphone
            </Button>
          </>
        }
      </div>
    </div>
  );
}

export default Interview;
