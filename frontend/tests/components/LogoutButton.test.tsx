import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../../src/components/LogoutButton";
import { itemNames } from "../../src/configs/local-storage";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("LogoutButton component", () => {
  beforeEach(() => {
    localStorage.clear();
    (useNavigate as jest.Mock).mockClear();
  });

  it("removes items from localStorage and navigates to '/' when clicked", () => {
    const navigateMock = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);

    const removeItemMock = jest.spyOn(
      window.localStorage.__proto__,
      "removeItem"
    );

    const { getByText } = render(<LogoutButton />);

    fireEvent.click(getByText("Logout"));

    expect(removeItemMock).toHaveBeenNthCalledWith(1, itemNames.accessToken);
    expect(removeItemMock).toHaveBeenNthCalledWith(2, itemNames.userEmail);
    expect(navigateMock).toHaveBeenCalledWith("/");
  });
});
