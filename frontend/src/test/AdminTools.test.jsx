import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";
import AdminTool from "../AdminTools";

describe("AdminTools Component", () => {
  test("renders AdminTools with correct headers", () => {
    render(
      <BrowserRouter>
        <AdminTool />
      </BrowserRouter>,
    );

    expect(screen.getByText("Admin Requests")).toBeInTheDocument();
    expect(screen.getByText("Id")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Request Admin")).toBeInTheDocument();
    expect(screen.getByText("Confirmation")).toBeInTheDocument();
  });

  test("clicking Confirm button opens confirmation modal", async () => {
    render(
      <BrowserRouter>
        <AdminTool />
      </BrowserRouter>,
    );

    const confirmButton = screen.getAllByText(/confirm/i)[0];

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText("Confirm Action")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "cancel" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "confirm" }),
      ).toBeInTheDocument();
    });
  });

  test("clicking Deny button opens confirmation modal", async () => {
    render(
      <BrowserRouter>
        <AdminTool />
      </BrowserRouter>,
    );

    const denyButton = screen.getAllByText("Deny")[0];
    fireEvent.click(denyButton);

    await waitFor(() => {
      expect(screen.getByText("Confirm Action")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /cancel/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /confirm/i }),
      ).toBeInTheDocument();
    });
  });

  test("clicking confirm executes action and closes modal", async () => {
    render(
      <BrowserRouter>
        <AdminTool />
      </BrowserRouter>,
    );

    const confirmButton = screen.getAllByText(/confirm/i)[0];

    fireEvent.click(confirmButton);

    const confirmActionButton = screen.getByRole("button", {
      name: /confirm/i,
    });

    fireEvent.click(confirmActionButton);

    await waitFor(() => {
      expect(screen.queryByText("Confirm Action")).not.toBeInTheDocument();
    });
  });

  test("clicking Request Admin text opens full request modal", async () => {
    render(
      <BrowserRouter>
        <AdminTool />
      </BrowserRouter>,
    );

    const requestText = screen.getAllByText(
      /please give me admin permissions/i,
    )[0];
    fireEvent.click(requestText);

    await waitFor(() => {
      expect(screen.getByText("Full Request Text")).toBeInTheDocument();
    });
  });

  test("closing full request modal works", async () => {
    render(
      <BrowserRouter>
        <AdminTool />
      </BrowserRouter>,
    );

    const requestText = screen.getAllByText(
      /please give me admin permissions/i,
    )[0];
    fireEvent.click(requestText);

    const closeButtons = screen.getAllByRole("button", { name: "Close" });
    fireEvent.click(closeButtons[0]);
    await waitFor(() => {
      expect(screen.queryByText("Full Request Text")).not.toBeInTheDocument();
    });
  });
});
