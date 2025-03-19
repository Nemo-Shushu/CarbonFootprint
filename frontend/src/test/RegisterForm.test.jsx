import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterForm from "../RegisterForm.jsx"; 
import { MemoryRouter } from "react-router-dom";
import * as React from "react";

vi.mock("../RegisterForm", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    institutions: [
      { name: "Abertay University" },
      { name: "University of Glasgow" },
    ],
    research_fields: [
      { name: "Environmental Science" },
      { name: "Computer Science" },
    ],
  };
});

describe("RegisterForm UI Tests", () => {
  
  beforeEach(() => {
    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );
  });
  

  it("renders all element files", () => {
    expect(screen.getByText("Create an Account")).toBeInTheDocument();
    expect(screen.getByText("Carbon Footprint Calculator")).toBeInTheDocument();
    expect(screen.getByText("Please fill in the details below to register.")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
  });

  it("toggles password visibility", () => {
    const passwordInput = screen.getByPlaceholderText("Password");
    const toggleButton = screen.getAllByText("Show")[0];

    expect(passwordInput.type).toBe("password");
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe("text");
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe("password");
  });

  it("shows modal when clicking Register after filling all fields", async () => {

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@student.gla.ac.uk" },
    });
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), {
      target: { value: "User" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "password123" },
    });

    const dropdowns = screen.getAllByRole("combobox");
    fireEvent.change(dropdowns[0], { target: { value: "University of Glasgow" } });
    fireEvent.change(dropdowns[1], { target: { value: "Environmental Science" } });

    expect(screen.getByPlaceholderText("Email").value).toBe("test@student.gla.ac.uk");
    expect(screen.getByPlaceholderText("Username").value).toBe("testuser");
    expect(screen.getByPlaceholderText("First Name").value).toBe("Test");
    expect(screen.getByPlaceholderText("Last Name").value).toBe("User");
    expect(screen.getByPlaceholderText("Password").value).toBe("password123");
    expect(screen.getByPlaceholderText("Confirm Password").value).toBe("password123");

    fireEvent.click(screen.getByRole("button", { name:/Register/i}));
  });

  it("toggles password visibility when clicking 'Show' button", () => {
    const passwordInput = screen.getByPlaceholderText("Password");
    const ConfirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
    const toggleButton = screen.getAllByText("Show")[0];


    expect(passwordInput.type).toBe("password");
    expect(ConfirmPasswordInput.type).toBe("password");

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe("text");
    expect(ConfirmPasswordInput.type).toBe("text");

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe("password");
    expect(ConfirmPasswordInput.type).toBe("password");


  });

  it("navigates to Sign-in page when clicking 'Sign in'", () => {
    const signInLink = screen.getByRole("link", { name: "Sign in"});
    fireEvent.click(signInLink);
  });

  it("shows modal when clicking Register after filling all fields", async () => {
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@student.gla.ac.uk" },
    });
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), {
      target: { value: "User" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "password123" },
    });
  

    const dropdowns = screen.getAllByRole("combobox");
    console.log("Dropdown 0 options:", dropdowns[0].innerHTML);
    console.log("Dropdown 1 options:", dropdowns[1].innerHTML);

    fireEvent.change(dropdowns[0], { target: { value: dropdowns[0].options[1] } });
    fireEvent.change(dropdowns[1], { target: { value: dropdowns[1].options[1] } });

    await waitFor(() => {
      expect(dropdowns[0].value).toBe("Abertay University");
      expect(dropdowns[1].value).toBe("Environmental Science");
    });

  
    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      expect(screen.getByTestId("verification-modal")).toBeInTheDocument();
    });

  });
  


});

describe("RegisterForm Error Handling Tests", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );
  });


  it("shows error when institution and research field are missing", async () => {
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@student.gla.ac.uk" },
    });
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), {
      target: { value: "User" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      const warningElement = document.querySelector(".warning");
      expect(warningElement).toBeTruthy();
    });
  });


});