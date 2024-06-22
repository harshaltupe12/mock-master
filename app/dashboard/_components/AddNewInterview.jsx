"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModel";
import { LoaderCircle } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDailog, setOpenDailog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDescription, setJobDescription] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const {user} =useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(jobDescription, jobExperience, jobPosition);

    const InputPrompt =
      "Job Position:" +jobPosition +", Job Description: " +jobDescription +", Years of Experience:" +jobExperience +", Depends on this information give me " +process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT +" interview question with Answered in Json Format, Give Question and answer as a field in JSON";
    const result = await chatSession.sendMessage(InputPrompt);
    const MockJsonResp = result.response.text().replace("```json", "").replace("```", "");
    console.log(JSON.parse(MockJsonResp));
    setJsonResponse(MockJsonResp)

      if(MockJsonResp){
      const resp = await db.insert(MockInterview).values({
        mockId:uuidv4(),
        jsonMockResp:MockJsonResp,
        jobDesc:jobDescription,
        jobPosition:jobPosition,
        jobExperience:jobExperience,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt:moment().format('DD-MM-yyyy')
      }).returning({mockId:MockInterview.mockId})

      console.log("Inserted ID:", resp)

      if(resp){
        setOpenDailog(false);
        router.push('/dashboard/interview/'+resp[0]?.mockId)
      }
    }
    else{
      console.log("Error")
    }
    setLoading(false);
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDailog(true)}
      >
        <h2 className="text-md text-center">+ Add New</h2>
      </div>

      <Dialog open={openDailog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interview
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div className="">
                  <h2 className="font-bold text-2xl"></h2>
                  <h2>
                    Add Details about your job position/role, Job Description
                    and years of experience{" "}
                  </h2>

                  <div className="mt-7 my-4">
                    <label className="" htmlFor="">
                      Job Role/Job Position
                    </label>
                    <Input
                      placeholder="Ex. Full stack developer"
                      className="outline-none"
                      required
                      onChange={(event) => setJobPosition(event.target.value)}
                    />
                  </div>
                  <div className="my-3">
                    <label className="" htmlFor="">
                      Job Description / Tech Stack (In Short)
                    </label>
                    <Textarea
                      placeholder="Ex. React, Angular, NodeJS, MySql, ExpressJS etc."
                      required
                      onChange={(event) =>
                        setJobDescription(event.target.value)
                      }
                    />
                  </div>
                  <div className="my-4">
                    <label className="" htmlFor="">
                      Years of Experience
                    </label>
                    <Input
                      placeholder="Ex. 5"
                      max="60"
                      type="number"
                      required
                      onChange={(event) => setJobExperience(event.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-5 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDailog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disable={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin" />
                        Generating Response
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
