import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SignInForm from "../SignInForm";

vi.mock("../useAuth", () => ({
  useAuth: vi.fn(() => ({ isAuthenticated: false, loading: false })),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

global.fetch = vi.fn((url) => {
  if (url.includes("login")) {
    return Promise.resolve({
      status: 200,
      json: () => Promise.resolve({ isAuthenticated: true }),
    });
  }
  return Promise.resolve({
    status: 200,
    json: () => Promise.resolve({ message: "success" }),
  });
});

describe("SignInForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls login function and navigates on successful login", async () => {
    render(
      <MemoryRouter>
        <SignInForm />
      </MemoryRouter>,
    );

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const signInButton = screen.getByRole("button", { name: "Login" });

    await userEvent.type(usernameInput, "testuser");
    await userEvent.type(passwordInput, "mypassword");
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows error message on failed login", async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        status: 401,
        json: () => Promise.reject(new Error("Unauthorized")),
      }),
    );

    render(
      <MemoryRouter>
        <SignInForm />
      </MemoryRouter>,
    );

    await userEvent.type(screen.getByPlaceholderText("Username"), "wronguser");
    await userEvent.type(
      screen.getByPlaceholderText("Password"),
      "wrongpassword",
    );
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(
        screen.getByText("Wrong username or password"),
      ).toBeInTheDocument();
    });
  });

  // it("toggles password visibility", () => {
  //   render(
  //     <MemoryRouter>
  //       <SignInForm />
  //     </MemoryRouter>,
  //   );

  //   const passwordInput = screen.getByPlaceholderText("Password");
  //   const toggleButton = screen.getByRole("button", { name: "Show" });

  //   expect(passwordInput.type).toBe("password");
  //   fireEvent.click(toggleButton);
  //   expect(passwordInput.type).toBe("text");
  //   expect(toggleButton).toHaveTextContent("Hide");
  //   fireEvent.click(toggleButton);
  //   expect(passwordInput.type).toBe("password");
  //   expect(toggleButton).toHaveTextContent("Show");
  // });

  it("opens email modal and allows sending code", async () => {
    render(
      <MemoryRouter>
        <SignInForm />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("Forgot password?"));
    expect(await screen.findByText("Check Email")).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText("Enter your email");
    await userEvent.type(emailInput, "user@example.ac.uk");

    const sendButton = screen.getByRole("button", { name: "Send code" });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("send-email-confirmation-token"),
        expect.objectContaining({ method: "POST" }),
      );
    });
  });

  it("verifies code and enables next step", async () => {
    render(
      <MemoryRouter>
        <SignInForm />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("Forgot password?"));
    const emailInput = screen.getByPlaceholderText("Enter your email");
    await userEvent.type(emailInput, "user@example.ac.uk");
    fireEvent.click(screen.getByRole("button", { name: "Send code" }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("send-email-confirmation-token"),
        expect.anything(),
      );
    });

    const codeInput = screen.getByPlaceholderText("Enter the code here");
    await userEvent.type(codeInput, "123456");
    const verifyButton = screen.getByRole("button", {
      name: "Verify my Email",
    });
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("send-email-confirmation-token"),
        expect.objectContaining({
          method: "POST",
        }),
      );
    });
  });

  it("opens reset password modal after verification and next", async () => {
    render(
      <MemoryRouter>
        <SignInForm />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("Forgot password?"));
    const emailInput = screen.getByPlaceholderText("Enter your email");
    await userEvent.type(emailInput, "user@example.ac.uk");
    fireEvent.click(screen.getByRole("button", { name: "Send code" }));

    const nextButton = screen.getByRole("button", { name: "Next" });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("send-email-confirmation-token"),
        expect.objectContaining({
          method: "POST",
        }),
      );
    });
  });

  it("opens reset password modal after verification and next", async () => {
    render(
      <MemoryRouter>
        <SignInForm />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("Forgot password?"));

    const emailInput = screen.getByPlaceholderText("Enter your email");
    await userEvent.type(emailInput, "user@example.ac.uk");

    const sendButton = screen.getByRole("button", { name: "Send code" });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("send-email-confirmation-token"),
        expect.anything(),
      );
    });

    const nextButton = screen.getByRole("button", { name: "Next" });
    fireEvent.click(nextButton);
  });

  it("disables send button or shows error for invalid email", async () => {
    render(
      <MemoryRouter>
        <SignInForm />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("Forgot password?"));

    const emailInput = screen.getByPlaceholderText("Enter your email");
    await userEvent.type(emailInput, "abc@");

    const sendButton = screen.getByRole("button", { name: "Send code" });
    fireEvent.click(sendButton);

    vi.spyOn(window, "alert").mockImplementation(() => {});
    fireEvent.click(sendButton);
    expect(window.alert).toHaveBeenCalledWith(
      "Email must belong to an educational institution (.ac.uk).",
    );
  });

  it("does not verify if code is empty", async () => {
    render(
      <MemoryRouter>
        <SignInForm />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("Forgot password?"));
    await userEvent.type(
      screen.getByPlaceholderText("Enter your email"),
      "user@example.com",
    );
    fireEvent.click(screen.getByRole("button", { name: "Send code" }));

    const verifyButton = await screen.findByRole("button", {
      name: "Verify my Email",
    });
    fireEvent.click(verifyButton);

    expect(fetch).not.toHaveBeenCalledWith(
      expect.stringContaining("confirm-email"),
      expect.anything(),
    );
  });

  it("shows error message if verification code is incorrect", async () => {
    global.fetch = vi.fn((url) => {
      if (url.includes("confirm-email")) {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: "Invalid code" }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    render(
      <MemoryRouter>
        <SignInForm />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("Forgot password?"));
    const emailInput = screen.getByPlaceholderText("Enter your email");
    await userEvent.type(emailInput, "user@example.ac.uk");
    fireEvent.click(screen.getByRole("button", { name: "Send code" }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    await userEvent.type(
      screen.getByPlaceholderText("Enter the code here"),
      "wrongcode",
    );
    fireEvent.click(screen.getByRole("button", { name: "Verify my Email" }));

    await waitFor(() => {
      expect(screen.getByText("Your code is incorrect.")).toBeInTheDocument();
    });
  });

  it("closes email modal when clicking close button", async () => {
    render(
      <MemoryRouter>
        <SignInForm />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("Forgot password?"));

    const modal = await screen.findByText("Check Email");
    expect(modal).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText("Check Email")).not.toBeInTheDocument();
    });
  });

  it("does not verify if button is disabled", async () => {
    render(
      <MemoryRouter>
        <SignInForm />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("Forgot password?"));

    const verifyButton = screen.getByRole("button", {
      name: "Verify my Email",
    });

    expect(verifyButton).toBeDisabled();
    fireEvent.click(verifyButton);

    expect(fetch).not.toHaveBeenCalledWith(
      expect.stringContaining("confirm-email"),
      expect.anything(),
    );
  });
});
