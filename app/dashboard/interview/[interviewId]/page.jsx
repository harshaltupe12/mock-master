"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnable, setWebCamEnable] = useState(false);

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));
    setInterviewData(result[0]);
  };

  if (!interviewData) {
    return <div>Loading...</div>; // Show a loading state until interviewData is fetched
  }

  return (
    <div className="my-6">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col gap-5 p-5">
          <div className="flex flex-col gap-5 p-5 rounded-lg border">
            <h2 className="text-lg my-1">
              <strong>Job Role / Job Position : </strong>
              {interviewData.jobPosition}
            </h2>
            <h2 className="text-lg my-1">
              <strong>Job Description / Tech Stack : </strong>
              {interviewData.jobDesc}
            </h2>
            <h2 className="text-lg my-1">
              <strong>Years of Experience : </strong>
              {interviewData.jobExperience}
            </h2>
          </div>

          <div className="p-5 border border-yellow-300 rounded-lg bg-yellow-100">
            <h2 className="flex gap-2 items-center text-yellow-500"><Lightbulb/> <strong>Information :</strong></h2>
            <h2 className="mt-3 text-yellow-500">{process.env.NEXT_PUBLIC_INFORMATION}</h2>
          </div>
        </div>

        {/* Camera area */}
        <div className="">
          {webCamEnable ? (
            <Webcam
              onUserMedia={() => setWebCamEnable(true)}
              onUserMediaError={() => setWebCamEnable(false)}
              mirrored={true}
              style={{
                height: 300,
                width: 300,
              }}
            />
          ) : (
            <>
              <WebcamIcon className="w-full h-72 my-7 p-20 bg-secondary rounded-lg border" />
              <Button variant="ghost" onclick={() => setWebCamEnable(true)}>
                Enable Webcam and Microphone
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <Link href={'/dashboard/interview/'+params.interviewId+'/start'}>
        <Button onclick={()=>{setWebCamEnable(true)}}>Start Interview</Button>
        </Link>
      </div>
    </div>
  );
}

export default Interview;
