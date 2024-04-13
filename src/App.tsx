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
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import ZeroSumSubarray from "@/questions/waterfall-streams.json";

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
  solution,
}: {
  title: string;
  question: string;
  sampleInput: string;
  sampleOutput: string;
  hints: string[];
  solution: string;
}) {
  const [showSolution, setShowSolution] = React.useState(false);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full max-w-full rounded-lg border"
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
        <div className="flex-col h-full items-center justify-center p-6 overflow-auto">
          <div className="flex items-center justify-start gap-6">
            <div className="font-bold text-4xl">Solution - Javascript</div>
            <Button
              size="sm"
              onClick={() => {
                setShowSolution(!showSolution);
              }}
            >
              {showSolution ? "Hide Solution" : "Show Solution"}
            </Button>
          </div>
          {showSolution && (
            <pre className="mt-8">
              <code
                dangerouslySetInnerHTML={{
                  __html: solution,
                }}
              ></code>
            </pre>
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
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
      />
    </div>
  );
}

export default App;
