import "./App.css";
import * as React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Lightbulb } from "lucide-react";
import ZeroSumSubarray from "@/data/questions/waterfall-streams.json";
import { Editor } from "./Editor";
import { Button } from "@/components/ui/button";
import axios from "axios";

const sampleInputRegex = /<h3>Sample Input<\/h3>\n<pre>(.*?)<\/pre>/s;
const sampleOutputRegex = /<h3>Sample Output<\/h3>\n<pre>(.*?)<\/pre>/s;
const copyrightRegex =
  /\/\/ Copyright © 2023 AlgoExpert LLC. All rights reserved.\n\n/;

export function ResizableDemo({
  title,
  question,
  sampleInput,
  sampleOutput,
  hints,
  startingCode,
}: {
  title: string;
  question: string;
  sampleInput: string;
  sampleOutput: string;
  hints: string[];
  solution?: string;
  startingCode: string;
}) {
  const [resizeEditor, setResizeEditor] = React.useState(false);
  const handleSubmission = async () => {
    const languageId = 63; // JavaScript
    const sourceCode = startingCode;
    const options = createSubmissionRequest(languageId, sourceCode);
    try {
      const response = await axios.request(options);
      console.log(response.data.token);
      getSubmissionStatus(response.data.token);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full max-w-full rounded-lg border"
      onLayout={(sizes) => {
        console.log("Layout Changed", sizes);
        setResizeEditor(true);
      }}
    >
      <ResizablePanel defaultSize={50}>
        <div className="flex-col h-full items-center justify-center p-6 overflow-auto">
          <div className="font-bold text-4xl">{title}</div>
          <div
            className=" mt-8"
            dangerouslySetInnerHTML={{
              __html: question,
            }}
          ></div>
          <div
            className=" mt-8"
            dangerouslySetInnerHTML={{
              __html: sampleInput,
            }}
          ></div>
          <div
            className=" mt-8"
            dangerouslySetInnerHTML={{
              __html: sampleOutput,
            }}
          ></div>
          <Separator className="my-4" />
          <div className="text-2xl font-bold mb-2">Hints</div>
          {hints && (
            <Accordion type="single" collapsible>
              {hints.map((hint, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-center">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      <span>{`Hint ${index + 1}`}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: hint,
                      }}
                    ></div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="grid grid-rows-10 h-full p-6 overflow-auto">
          <div className="flex items-center justify-start gap-6 mb-8">
            <div className="font-bold text-4xl">Your Solution</div>
          </div>
          <div className="row-span-8">
            <Editor
              startingCode={startingCode}
              resizeEditor={resizeEditor}
              setResizeEditor={setResizeEditor}
            />
          </div>
          <Button className="mt-8" onClick={handleSubmission}>
            Submit Code
          </Button>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

async function getSubmissionStatus(token: string) {
  const options = {
    method: "GET",
    url: `${import.meta.env.VITE_RAPID_API_URL}/${token}`,
    params: {
      base64_encoded: "true",
      fields: "*",
    },
    headers: {
      "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,
      "X-RapidAPI-Host": import.meta.env.VITE_RAPID_API_HOST,
    },
  };
  try {
    const response = await axios.request(options);
    if (response.data.status.id === 3) {
      console.log("Accepted");
    } else if (response.data.status.id === 1 || response.data.status.id === 2) {
      setTimeout(() => getSubmissionStatus(token), 1500);
    } else {
      console.log(response.data.status.description);
    }
  } catch (error) {
    console.error(error);
  }
}

function createSubmissionRequest(languageId: number, sourceCode: string) {
  const options = {
    method: "POST",
    url: import.meta.env.VITE_RAPID_API_URL,
    params: {
      base64_encoded: "true",
      fields: "*",
    },
    headers: {
      "content-type": "application/json",
      "Content-Type": "application/json",
      "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,
      "X-RapidAPI-Host": import.meta.env.VITE_RAPID_API_HOST,
    },
    data: {
      language_id: languageId,
      source_code: btoa(sourceCode),
      stdin: "",
    },
  };
  return options;
}

function App() {
  const { prompt, hints, name, resources } = ZeroSumSubarray;
  const sampleInputMatch = prompt.match(sampleInputRegex) ?? [];
  const sampleOutputMatch = prompt.match(sampleOutputRegex) ?? [];
  const promptWithoutSamples = prompt
    .replace(sampleInputRegex, "")
    .replace(sampleOutputRegex, "");
  return (
    <div className="h-full w-full p-8">
      <ResizableDemo
        title={name}
        question={promptWithoutSamples}
        sampleInput={sampleInputMatch[0] ?? ""}
        sampleOutput={sampleOutputMatch[0] ?? ""}
        hints={hints}
        solution={resources.javascript.solutions[0].replace(copyrightRegex, "")}
        startingCode={resources.javascript.startingCode}
      />
    </div>
  );
}

export default App;
