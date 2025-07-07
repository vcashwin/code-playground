// @vitest-environment jsdom
// @ts-nocheck
import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

// Radix UI's Select (used by QuestionSelector) relies on ResizeObserver.
// JSDOM doesn't implement it, so we stub it before any tests run.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-ignore
global.ResizeObserver = global.ResizeObserver || ResizeObserverStub;

describe("Question selection flow", () => {
  it("renders a new question when a dropdown item is selected", async () => {
    render(<App />);

    // Initially the default question ("Waterfall Streams") should be visible.
    expect(await screen.findByText(/Waterfall Streams/i)).toBeInTheDocument();

    // Open the question dropdown.
    const combobox = screen.getByRole("combobox");
    await userEvent.click(combobox);

    // Click on another question (e.g. "Two Number Sum").
    const newQuestionItem = await screen.findByText(/Two Number Sum/i);
    await userEvent.click(newQuestionItem);

    // The UI should update to show the new question title.
    expect(await screen.findByText(/Two Number Sum/i)).toBeInTheDocument();
  });
});