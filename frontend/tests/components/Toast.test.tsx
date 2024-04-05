import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import "@types/jest";
import Toast from "../../src/components/Toast";

describe("Toast component", () => {
  it("renders with correct message", () => {
    const message = "Test message";
    const onClick = jest.fn();
    const { getByText } = render(<Toast message={message} onClick={onClick} />);
    expect(getByText(message)).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", () => {
    const message = "Test message";
    const onClick = jest.fn();
    const { getByText } = render(<Toast message={message} onClick={onClick} />);
    fireEvent.click(getByText(message));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
