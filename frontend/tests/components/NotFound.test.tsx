import React from "react";
import { render, act, waitFor, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import NotFoundHandler from "../../src/components/NotFound";
import { useNavigate } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("NotFoundHandler component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders correctly", () => {
    const { getByText } = render(<NotFoundHandler />);
    expect(getByText("There's nothing in here.")).toBeInTheDocument();
    expect(
      getByText("Redirecting back to home page in...")
    ).toBeInTheDocument();
    expect(getByText("5 second(s)")).toBeInTheDocument();
  });

  it("redirects to the home page after countdown", async () => {
    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    render(<NotFoundHandler />);

    // Fast-forward time by 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Wait for navigation to occur
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/home");
    });
  });
});
